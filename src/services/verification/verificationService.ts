/**
 * Verification Service Layer
 *
 * Implements 3 separate, independent verification layers:
 *   1. Government Verification (CLC / State Labour Dept / Skill Authority)
 *   2. Cooperative Verification (Cooperative Society Board Audit)
 *   3. ShramSetu Verification (Platform Safety & KYC Compliance)
 *
 * Enforces:
 * - Independent status per tier (never combined into one monolithic status)
 * - Worker ID validation
 * - Cooperative admin scoping: Cooperative admins can ONLY verify workers belonging to their cooperative
 * - Platform admin scoping: Platform admins verify platform onboarding credentials
 * - Comprehensive audit logging for every verification action:
 *     Example:
 *       20 Sep 2026
 *       Cooperative Verification → VERIFIED
 *       21 Sep 2026
 *       ShramSetu Verification → VERIFIED
 * - Zero exposure of Aadhaar, raw ID numbers, passwords, or private docs
 */

import {
  AuthContext,
  SafeVerificationResponse,
  CooperativeVerificationResponse,
  ShramSetuVerificationResponse,
  VerificationAuditEntry,
  VerificationRequestPayload,
  AdminVerificationActionPayload,
  VerificationSimulationState,
} from './types';
import { VerificationProvider, defaultVerificationProvider } from './verificationProvider';
import { INITIAL_WORKERS } from '../../data/mockData';
import { WorkerProfile } from '../../types';

export class VerificationServiceError extends Error {
  public readonly code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_ERROR';
  public readonly statusCode: number;

  constructor(
    message: string,
    code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_ERROR',
    statusCode: number
  ) {
    super(message);
    this.name = 'VerificationServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Format audit dates strictly according to required specification:
 * e.g., "20 Sep 2026", "21 Sep 2026"
 */
export const formatAuditDate = (d: Date = new Date()): string => {
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export class VerificationService {
  private readonly providerManager: VerificationProvider;
  private readonly workerProfiles: Map<string, WorkerProfile> = new Map();
  private readonly auditLogs: VerificationAuditEntry[] = [];

  constructor(providerManager: VerificationProvider = defaultVerificationProvider) {
    this.providerManager = providerManager;

    // Initialize in-memory worker profiles
    for (const w of INITIAL_WORKERS) {
      this.workerProfiles.set(w.id, { ...w });
    }

    // Seed pre-existing audit logs demonstrating the requested format
    this.auditLogs.push(
      {
        id: 'audit-demo-01',
        timestamp: '2026-09-20T10:30:00Z',
        formattedDate: '20 Sep 2026',
        action: 'Cooperative Verification → VERIFIED',
        tier: 'COOPERATIVE',
        status: 'VERIFIED',
        workerId: 'w-101',
        workerName: 'Vikramaditya Verma',
        actorId: 'usr-coop-admin-delhi',
        actorName: 'DLACS Executive Board (DL/COOP/2018/491-A)',
        actorRole: 'admin',
        societyId: 'coop-delhi-central',
        notes: 'Cooperative membership and trade certification audited.',
      },
      {
        id: 'audit-demo-02',
        timestamp: '2026-09-21T09:15:00Z',
        formattedDate: '21 Sep 2026',
        action: 'ShramSetu Verification → VERIFIED',
        tier: 'SHRAMSETU',
        status: 'VERIFIED',
        workerId: 'w-101',
        workerName: 'Vikramaditya Verma',
        actorId: 'usr-platform-safety',
        actorName: 'ShramSetu Trust & Safety Automated Engine',
        actorRole: 'admin',
        notes: 'Platform KYC photo matching and safety protocol cleared.',
      }
    );
  }

  /**
   * Helper: Retrieve or validate a worker profile.
   */
  public getWorkerProfile(workerId: string): WorkerProfile {
    this.validateWorkerId(workerId);
    let worker = this.workerProfiles.get(workerId);
    if (!worker) {
      const initial = INITIAL_WORKERS.find((w) => w.id === workerId);
      if (initial) {
        worker = { ...initial };
        this.workerProfiles.set(workerId, worker);
      } else {
        throw new VerificationServiceError(
          `Worker with ID '${workerId}' was not found in the cooperative registry.`,
          'NOT_FOUND',
          404
        );
      }
    }
    return worker;
  }

  /**
   * Validate worker ID
   */
  public validateWorkerId(workerId: string): void {
    if (!workerId || typeof workerId !== 'string' || workerId.trim() === '') {
      throw new VerificationServiceError(
        'Worker ID is required and must be a non-empty string.',
        'BAD_REQUEST',
        400
      );
    }

    const cleanId = workerId.trim();
    const workerExists =
      this.workerProfiles.has(cleanId) ||
      INITIAL_WORKERS.some((w) => w.id === cleanId || w.userId === cleanId);

    if (!workerExists) {
      throw new VerificationServiceError(
        `Worker with ID '${cleanId}' was not found in the cooperative registry.`,
        'NOT_FOUND',
        404
      );
    }
  }

  private sanitizeGovernmentResponse(response: SafeVerificationResponse): SafeVerificationResponse {
    return {
      status: response.status,
      authority: response.authority,
      verificationReference: response.verificationReference,
      verificationType: response.verificationType,
      verifiedAt: response.verifiedAt,
    };
  }

  // =========================================================================
  // 1. GOVERNMENT VERIFICATION LAYER
  // =========================================================================

  public async requestVerification(
    auth: AuthContext,
    payload: VerificationRequestPayload
  ): Promise<SafeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role === 'customer') {
      throw new VerificationServiceError('Customers are not authorized to submit worker verification requests.', 'FORBIDDEN', 403);
    }

    const targetWorkerId = payload.workerId || auth.userId;
    this.validateWorkerId(targetWorkerId);

    const result = await this.providerManager.requestVerification(targetWorkerId, payload);
    return this.sanitizeGovernmentResponse(result);
  }

  public async getWorkerVerification(
    auth: AuthContext,
    workerId: string
  ): Promise<SafeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    this.validateWorkerId(workerId);

    const record = await this.providerManager.fetchWorkerVerification(workerId);
    if (!record) {
      throw new VerificationServiceError(`No verification record found for worker '${workerId}'.`, 'NOT_FOUND', 404);
    }
    return this.sanitizeGovernmentResponse(record);
  }

  public async adminVerifyWorker(
    auth: AuthContext,
    workerId: string,
    payload?: AdminVerificationActionPayload
  ): Promise<SafeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError('Access denied: Only authorized administrators can manually verify worker credentials.', 'FORBIDDEN', 403);
    }
    this.validateWorkerId(workerId);

    const updated = await this.providerManager.overrideStatus(
      workerId,
      'VERIFIED',
      payload?.notes || 'Manual administrative verification audit passed.'
    );

    // Audit log
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      formattedDate: formatAuditDate(),
      action: 'Government Verification → VERIFIED',
      tier: 'GOVERNMENT',
      status: 'VERIFIED',
      workerId,
      actorId: auth.userId,
      actorName: auth.name || 'System Administrator',
      actorRole: auth.role,
      notes: payload?.notes || 'Manual government verification audit approved.',
    });

    return this.sanitizeGovernmentResponse(updated);
  }

  public async adminRejectWorker(
    auth: AuthContext,
    workerId: string,
    payload?: AdminVerificationActionPayload
  ): Promise<SafeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError('Access denied: Only authorized administrators can manually reject worker credentials.', 'FORBIDDEN', 403);
    }
    this.validateWorkerId(workerId);

    const updated = await this.providerManager.overrideStatus(
      workerId,
      'NOT_VERIFIED',
      payload?.notes || 'Administrative verification audit rejected.'
    );

    // Audit log
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      formattedDate: formatAuditDate(),
      action: 'Government Verification → REJECTED',
      tier: 'GOVERNMENT',
      status: 'NOT_VERIFIED',
      workerId,
      actorId: auth.userId,
      actorName: auth.name || 'System Administrator',
      actorRole: auth.role,
      notes: payload?.notes || 'Government verification rejected during administrative audit.',
    });

    return this.sanitizeGovernmentResponse(updated);
  }

  // =========================================================================
  // 2. COOPERATIVE VERIFICATION LAYER
  // =========================================================================

  /**
   * View Cooperative Verification status for a worker.
   * Customers, Workers, and Admins can view.
   */
  public async getCooperativeVerification(
    auth: AuthContext,
    workerId: string
  ): Promise<CooperativeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    const worker = this.getWorkerProfile(workerId);
    const latestAudit = this.auditLogs.find(
      (a) => a.workerId === workerId && a.tier === 'COOPERATIVE'
    );

    return {
      status: worker.cooperativeVerificationStatus || 'PENDING',
      tier: 'COOPERATIVE',
      workerId: worker.id,
      cooperativeId: worker.cooperativeId,
      cooperativeName: worker.cooperativeName,
      cooperativeVerificationStatus: worker.cooperativeVerificationStatus || 'PENDING',
      cooperativeVerifiedAt: worker.cooperativeVerifiedAt || null,
      cooperativeVerifiedBy: worker.cooperativeVerifiedBy || null,
      auditLog: latestAudit
        ? {
            date: latestAudit.formattedDate,
            action: latestAudit.action,
          }
        : undefined,
    };
  }

  /**
   * Cooperative Admin verifies worker belonging to their cooperative.
   * Rule: Only authorized cooperative administrators can verify workers belonging to their cooperative.
   */
  public async verifyCooperativeWorker(
    auth: AuthContext,
    workerId: string,
    notes?: string
  ): Promise<CooperativeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError(
        'Access denied: Only authorized cooperative administrators can verify cooperative credentials.',
        'FORBIDDEN',
        403
      );
    }

    const worker = this.getWorkerProfile(workerId);

    // Enforce cooperative boundary
    if (auth.societyId && worker.cooperativeId && auth.societyId !== worker.cooperativeId) {
      throw new VerificationServiceError(
        `Access denied: Cooperative administrators can only verify workers belonging to their cooperative (Administrator society: '${auth.societyId}', Worker society: '${worker.cooperativeId}').`,
        'FORBIDDEN',
        403
      );
    }

    const now = new Date().toISOString();
    const verifierName = auth.name || (auth.societyName ? `${auth.societyName} Registrar` : 'Cooperative Society Board');

    worker.cooperativeVerificationStatus = 'VERIFIED';
    worker.cooperativeVerifiedAt = now;
    worker.cooperativeVerifiedBy = verifierName;
    this.workerProfiles.set(workerId, worker);

    // Audit logging
    const formattedDate = formatAuditDate();
    const actionText = 'Cooperative Verification → VERIFIED';
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      formattedDate,
      action: actionText,
      tier: 'COOPERATIVE',
      status: 'VERIFIED',
      workerId,
      workerName: worker.name,
      actorId: auth.userId,
      actorName: verifierName,
      actorRole: auth.role,
      societyId: worker.cooperativeId,
      notes: notes || 'Cooperative trade credentials and active membership approved.',
    });

    return {
      status: 'VERIFIED',
      tier: 'COOPERATIVE',
      workerId: worker.id,
      cooperativeId: worker.cooperativeId,
      cooperativeName: worker.cooperativeName,
      cooperativeVerificationStatus: 'VERIFIED',
      cooperativeVerifiedAt: now,
      cooperativeVerifiedBy: verifierName,
      auditLog: {
        date: formattedDate,
        action: actionText,
      },
    };
  }

  /**
   * Cooperative Admin rejects worker belonging to their cooperative.
   * Rule: Only authorized cooperative administrators can reject workers belonging to their cooperative.
   */
  public async rejectCooperativeWorker(
    auth: AuthContext,
    workerId: string,
    notes?: string
  ): Promise<CooperativeVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError(
        'Access denied: Only authorized cooperative administrators can reject cooperative credentials.',
        'FORBIDDEN',
        403
      );
    }

    const worker = this.getWorkerProfile(workerId);

    // Enforce cooperative boundary
    if (auth.societyId && worker.cooperativeId && auth.societyId !== worker.cooperativeId) {
      throw new VerificationServiceError(
        `Access denied: Cooperative administrators can only verify workers belonging to their cooperative (Administrator society: '${auth.societyId}', Worker society: '${worker.cooperativeId}').`,
        'FORBIDDEN',
        403
      );
    }

    const now = new Date().toISOString();
    const verifierName = auth.name || (auth.societyName ? `${auth.societyName} Registrar` : 'Cooperative Society Board');

    worker.cooperativeVerificationStatus = 'REJECTED';
    worker.cooperativeVerifiedAt = now;
    worker.cooperativeVerifiedBy = verifierName;
    this.workerProfiles.set(workerId, worker);

    // Audit logging
    const formattedDate = formatAuditDate();
    const actionText = 'Cooperative Verification → REJECTED';
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      formattedDate,
      action: actionText,
      tier: 'COOPERATIVE',
      status: 'REJECTED',
      workerId,
      workerName: worker.name,
      actorId: auth.userId,
      actorName: verifierName,
      actorRole: auth.role,
      societyId: worker.cooperativeId,
      notes: notes || 'Cooperative verification rejected during board review.',
    });

    return {
      status: 'REJECTED',
      tier: 'COOPERATIVE',
      workerId: worker.id,
      cooperativeId: worker.cooperativeId,
      cooperativeName: worker.cooperativeName,
      cooperativeVerificationStatus: 'REJECTED',
      cooperativeVerifiedAt: now,
      cooperativeVerifiedBy: verifierName,
      auditLog: {
        date: formattedDate,
        action: actionText,
      },
    };
  }

  // =========================================================================
  // 3. SHRAMSETU PLATFORM VERIFICATION LAYER
  // =========================================================================

  /**
   * View ShramSetu Platform Verification status for a worker.
   * Customers, Workers, and Admins can view.
   */
  public async getPlatformVerification(
    auth: AuthContext,
    workerId: string
  ): Promise<ShramSetuVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    const worker = this.getWorkerProfile(workerId);
    const latestAudit = this.auditLogs.find(
      (a) => a.workerId === workerId && a.tier === 'SHRAMSETU'
    );

    return {
      status: worker.shramsetuVerificationStatus || 'PENDING',
      tier: 'SHRAMSETU',
      workerId: worker.id,
      shramsetuVerificationStatus: worker.shramsetuVerificationStatus || 'PENDING',
      shramsetuVerifiedAt: worker.shramsetuVerifiedAt || null,
      shramsetuVerifiedBy: worker.shramsetuVerifiedBy || null,
      auditLog: latestAudit
        ? {
            date: latestAudit.formattedDate,
            action: latestAudit.action,
          }
        : undefined,
    };
  }

  /**
   * Platform Administrator verifies worker.
   */
  public async verifyPlatformWorker(
    auth: AuthContext,
    workerId: string,
    notes?: string
  ): Promise<ShramSetuVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError(
        'Access denied: Only platform administrators can verify platform credentials.',
        'FORBIDDEN',
        403
      );
    }
    if (auth.adminType === 'cooperative_admin') {
      throw new VerificationServiceError(
        'Access denied: Platform verification requires platform administrator privileges.',
        'FORBIDDEN',
        403
      );
    }

    const worker = this.getWorkerProfile(workerId);
    const now = new Date().toISOString();
    const verifierName = auth.name || 'ShramSetu Trust & Safety Automated Engine';

    worker.shramsetuVerificationStatus = 'VERIFIED';
    worker.shramsetuVerifiedAt = now;
    worker.shramsetuVerifiedBy = verifierName;
    this.workerProfiles.set(workerId, worker);

    // Audit logging
    const formattedDate = formatAuditDate();
    const actionText = 'ShramSetu Verification → VERIFIED';
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      formattedDate,
      action: actionText,
      tier: 'SHRAMSETU',
      status: 'VERIFIED',
      workerId,
      workerName: worker.name,
      actorId: auth.userId,
      actorName: verifierName,
      actorRole: auth.role,
      notes: notes || 'Platform onboarding KYC, photo match and safety checklist verified.',
    });

    return {
      status: 'VERIFIED',
      tier: 'SHRAMSETU',
      workerId: worker.id,
      shramsetuVerificationStatus: 'VERIFIED',
      shramsetuVerifiedAt: now,
      shramsetuVerifiedBy: verifierName,
      auditLog: {
        date: formattedDate,
        action: actionText,
      },
    };
  }

  /**
   * Platform Administrator rejects worker.
   */
  public async rejectPlatformWorker(
    auth: AuthContext,
    workerId: string,
    notes?: string
  ): Promise<ShramSetuVerificationResponse> {
    if (!auth || !auth.userId) {
      throw new VerificationServiceError('Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (auth.role !== 'admin') {
      throw new VerificationServiceError(
        'Access denied: Only platform administrators can reject platform credentials.',
        'FORBIDDEN',
        403
      );
    }
    if (auth.adminType === 'cooperative_admin') {
      throw new VerificationServiceError(
        'Access denied: Platform verification requires platform administrator privileges.',
        'FORBIDDEN',
        403
      );
    }

    const worker = this.getWorkerProfile(workerId);
    const now = new Date().toISOString();
    const verifierName = auth.name || 'ShramSetu Trust & Safety Automated Engine';

    worker.shramsetuVerificationStatus = 'REJECTED';
    worker.shramsetuVerifiedAt = now;
    worker.shramsetuVerifiedBy = verifierName;
    this.workerProfiles.set(workerId, worker);

    // Audit logging
    const formattedDate = formatAuditDate();
    const actionText = 'ShramSetu Verification → REJECTED';
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      formattedDate,
      action: actionText,
      tier: 'SHRAMSETU',
      status: 'REJECTED',
      workerId,
      workerName: worker.name,
      actorId: auth.userId,
      actorName: verifierName,
      actorRole: auth.role,
      notes: notes || 'Platform onboarding checklist failed safety verification.',
    });

    return {
      status: 'REJECTED',
      tier: 'SHRAMSETU',
      workerId: worker.id,
      shramsetuVerificationStatus: 'REJECTED',
      shramsetuVerifiedAt: now,
      shramsetuVerifiedBy: verifierName,
      auditLog: {
        date: formattedDate,
        action: actionText,
      },
    };
  }

  // =========================================================================
  // AUDIT LOG QUERIES
  // =========================================================================

  public getVerificationAuditLogs(workerId?: string): VerificationAuditEntry[] {
    if (workerId) {
      return this.auditLogs.filter((a) => a.workerId === workerId);
    }
    return [...this.auditLogs];
  }
}

// Global default service singleton
export const defaultVerificationService = new VerificationService();
