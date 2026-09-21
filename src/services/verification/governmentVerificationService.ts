import {
  AuthContext,
  GovernmentVerificationVerifyRequest,
  NormalizedGovernmentResponse,
} from './types';
import { GovernmentProviderFactory } from './providers/providerFactory';
import { INITIAL_WORKERS, INITIAL_GOVERNMENT_VERIFICATIONS } from '../../data/mockData';
import { GovernmentVerification, WorkerProfile } from '../../types';
import { VerificationCache, defaultVerificationCache } from './utils/verificationCache';

export interface VerificationAuditLogEntry {
  provider: string;
  requestTimestamp: string;
  responseStatus: string;
  verificationResult: string;
  externalReference?: string;
  errorCode?: string;
  errorMessage?: string;
  cached?: boolean;
}

/**
 * Rate Limiter for Government Verification Requests
 * Enforces security limits to protect government endpoints from abuse.
 */
class VerificationRateLimiter {
  private requestHistory = new Map<string, number[]>();
  private readonly maxRequests = 5;
  private readonly windowMs = 10 * 60 * 1000; // 10 minutes

  public checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
    const now = Date.now();
    const timestamps = (this.requestHistory.get(key) || []).filter(
      (ts) => now - ts < this.windowMs
    );

    if (timestamps.length >= this.maxRequests) {
      const oldest = timestamps[0];
      const retryAfterMs = this.windowMs - (now - oldest);
      return { allowed: false, retryAfterMs };
    }

    timestamps.push(now);
    this.requestHistory.set(key, timestamps);
    return { allowed: true };
  }

  public reset(): void {
    this.requestHistory.clear();
  }
}

/**
 * GovernmentVerificationService
 *
 * Implements the Production-Ready 9-Step Verification Architecture:
 * 1. Authenticate user/admin
 * 2. Validate the worker
 * 3. Validate the reference
 * 4. Check cache for existing verified result (unless forceRecheck requested)
 * 5. Select the configured government provider
 * 6. Call the official API (with backoff retry on transient errors)
 * 7. Validate response and normalize permitted fields
 * 8. Save verification status (strictly distinguishing technical failures from unverified)
 * 9. Return safe normalized information to the frontend
 */
export class GovernmentVerificationService {
  private workers: WorkerProfile[] = [...INITIAL_WORKERS];
  private governmentVerifications: GovernmentVerification[] = [...INITIAL_GOVERNMENT_VERIFICATIONS];
  private rateLimiter = new VerificationRateLimiter();
  private cache: VerificationCache;
  private auditLogs: VerificationAuditLogEntry[] = [];

  constructor(customCache?: VerificationCache) {
    this.cache = customCache || defaultVerificationCache;
  }

  /**
   * Primary Verification Pipeline
   */
  public async verifyGovernmentReference(
    auth: AuthContext,
    payload: GovernmentVerificationVerifyRequest
  ): Promise<NormalizedGovernmentResponse> {
    const nowIso = new Date().toISOString();

    // 1. Authenticate the user/admin
    if (!auth || !auth.userId) {
      throw new Error('Authentication required: user or admin credentials must be provided.');
    }

    // Role check: Only workers (for self-verification) or administrators can verify
    if (auth.role !== 'admin' && auth.role !== 'worker') {
      throw new Error('Forbidden: Only authorized administrators or workers may submit verification requests.');
    }

    // Workers can only verify themselves
    if (auth.role === 'worker' && auth.userId !== payload.workerId) {
      throw new Error('Forbidden: Workers can only submit government verification for their own profile.');
    }

    // 2. Validate the worker
    const worker = this.workers.find((w) => w.id === payload.workerId);
    if (!worker) {
      throw new Error(`Worker with ID '${payload.workerId}' does not exist.`);
    }

    // 3. Validate the reference
    const ref = payload.governmentReference?.trim();
    if (!ref || ref.length < 3) {
      throw new Error('Invalid reference: Government registration reference cannot be empty.');
    }

    // Security: Rate-limit verification requests
    const rateKey = `${auth.userId}:${payload.workerId}`;
    const rateCheck = this.rateLimiter.checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      const retrySec = Math.ceil((rateCheck.retryAfterMs || 1000) / 1000);
      throw new Error(`Rate limit exceeded. Please wait ${retrySec} seconds before submitting another verification request.`);
    }

    const providerCode = GovernmentProviderFactory.normalizeProviderCode(payload.provider);

    // 4. Cache Check: Return cached response if present and manual recheck not forced
    if (!payload.forceRecheck) {
      const cachedResult = this.cache.get(providerCode, ref);
      if (cachedResult) {
        this.logAudit({
          provider: providerCode,
          requestTimestamp: nowIso,
          responseStatus: cachedResult.status,
          verificationResult: 'CACHE_HIT',
          cached: true,
        });
        return cachedResult;
      }
    } else {
      // Invalidate existing cache entry on forced recheck
      this.cache.invalidate(providerCode, ref);
    }

    // 5. Select the configured government provider
    const provider = GovernmentProviderFactory.getProvider(providerCode);

    // 6. If provider is disabled or not configured, return NOT_CONFIGURED
    if (!provider.isConfigured() || !provider.isEnabled()) {
      const unconfiguredResult: NormalizedGovernmentResponse = {
        status: 'NOT_CONFIGURED',
        provider: provider.providerName,
        externalReference: ref,
        verificationReference: ref,
        message: 'Government verification service is not currently connected.',
        errorMessage: 'Official government verification gateway credentials not configured or provider disabled.',
        lastCheckedAt: nowIso,
      };

      this.upsertVerificationRecord({
        workerId: worker.id,
        provider: provider.providerName,
        externalReference: ref,
        verificationStatus: 'NOT_CONFIGURED',
        status: 'NOT_CONFIGURED',
        lastCheckedAt: nowIso,
        notes: 'Government verification service is not currently connected.',
      });

      this.logAudit({
        provider: provider.providerName,
        requestTimestamp: nowIso,
        responseStatus: 'NOT_CONFIGURED',
        verificationResult: 'Government verification connection unavailable',
      });

      return unconfiguredResult;
    }

    // 7. Call the official API (handles retries internally)
    const providerResult = await provider.verifyWorker(worker.id, ref, auth);

    // 8. Cache valid deterministic responses
    if (providerResult.status === 'VERIFIED' || providerResult.status === 'NOT_VERIFIED') {
      this.cache.set(providerCode, ref, providerResult);
    }

    // 9. Save verification status
    this.upsertVerificationRecord({
      workerId: worker.id,
      provider: providerResult.provider,
      externalReference: providerResult.externalReference || ref,
      verificationStatus: providerResult.status,
      status: providerResult.status,
      verifiedName: providerResult.workerName || null,
      verifiedWorkerCategory: providerResult.workerCategory || null,
      verifiedRegistrationDate: providerResult.registrationDate || null,
      lastCheckedAt: providerResult.lastCheckedAt || nowIso,
      rawResponseHash: providerResult.rawResponseHash || null,
      errorCode: providerResult.errorCode || null,
      errorMessage: providerResult.errorMessage || null,
      notes: providerResult.message || `Verification checked via official ${provider.providerName} gateway.`,
      verifiedAt: providerResult.status === 'VERIFIED' ? nowIso : null,
    });

    // Safe Audit Log
    this.logAudit({
      provider: providerResult.provider,
      requestTimestamp: nowIso,
      responseStatus: providerResult.status,
      verificationResult: providerResult.status === 'VERIFIED' ? 'SUCCESS' : providerResult.status,
      externalReference: ref,
      errorCode: providerResult.errorCode,
      errorMessage: providerResult.errorMessage,
      cached: false,
    });

    return providerResult;
  }

  /**
   * Internal DB upsert
   */
  private upsertVerificationRecord(
    record: Partial<GovernmentVerification> & { workerId: string }
  ): GovernmentVerification {
    const existingIndex = this.governmentVerifications.findIndex(
      (gv) => gv.workerId === record.workerId
    );

    const now = new Date().toISOString();
    const fullRecord: GovernmentVerification = {
      id: existingIndex >= 0 ? this.governmentVerifications[existingIndex].id : `gv-${Date.now()}`,
      workerId: record.workerId,
      authority: (record.provider || 'CLC') as any,
      verificationReference: record.externalReference || 'UNKNOWN',
      verificationType: 'WORKER_REGISTRATION',
      status: record.status || record.verificationStatus || 'NOT_CONFIGURED',
      verifiedAt: record.verifiedAt || null,
      lastCheckedAt: record.lastCheckedAt || now,
      source: `OFFICIAL_${record.provider || 'CLC'}_GATEWAY`,
      notes: record.notes || '',
      createdAt: existingIndex >= 0 ? this.governmentVerifications[existingIndex].createdAt : now,
      updatedAt: now,
      provider: record.provider,
      externalReference: record.externalReference,
      verificationStatus: record.verificationStatus || record.status,
      verifiedName: record.verifiedName,
      verifiedWorkerCategory: record.verifiedWorkerCategory,
      verifiedRegistrationDate: record.verifiedRegistrationDate,
      rawResponseHash: record.rawResponseHash,
      errorCode: record.errorCode,
      errorMessage: record.errorMessage,
    };

    if (existingIndex >= 0) {
      this.governmentVerifications[existingIndex] = fullRecord;
    } else {
      this.governmentVerifications.push(fullRecord);
    }

    return fullRecord;
  }

  /**
   * Audit Logging (Protects sensitive identifiers)
   */
  private logAudit(entry: VerificationAuditLogEntry): void {
    this.auditLogs.push(entry);
    console.log(
      `[GovVerificationService] Provider: ${entry.provider} | Time: ${entry.requestTimestamp} | Status: ${entry.responseStatus} | Result: ${entry.verificationResult}${entry.errorCode ? ` | Err: ${entry.errorCode}` : ''}${entry.cached ? ' (Cached)' : ''}`
    );
  }

  public getVerificationRecords(workerId?: string): GovernmentVerification[] {
    if (workerId) {
      return this.governmentVerifications.filter((gv) => gv.workerId === workerId);
    }
    return [...this.governmentVerifications];
  }

  public getAuditLogs(): VerificationAuditLogEntry[] {
    return [...this.auditLogs];
  }

  public resetRateLimiter(): void {
    this.rateLimiter.reset();
  }

  public getCache(): VerificationCache {
    return this.cache;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const defaultGovernmentVerificationService = new GovernmentVerificationService();
