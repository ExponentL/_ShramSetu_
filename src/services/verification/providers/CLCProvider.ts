import {
  GovernmentVerificationProvider,
  GovernmentProviderConfig,
  NormalizedGovernmentResponse,
  GovernmentWorkerDetails,
  AuthContext,
} from '../types';
import {
  computeRawResponseHash,
  isValidGovernmentApiUrl,
  sanitizeGovernmentPayload,
} from '../utils/verificationSecurity';
import { executeWithRetry } from '../utils/retryHandler';

/**
 * CLCProvider
 *
 * Official Government Integration Adapter for the Chief Labour Commissioner (Central)
 * registry system.
 *
 * CRITICAL COMPLIANCE RULES:
 * - Does NOT scrape CLC.gov.in.
 * - Does NOT fabricate live government verification.
 * - Only active when officially authorized credentials and base URL are configured.
 * - Returns NOT_CONFIGURED when no live official API credentials are provided.
 * - Never confuses technical failures (SERVICE_UNAVAILABLE, AUTHENTICATION_ERROR) with NOT_VERIFIED.
 * - Never stores or returns Aadhaar numbers or unpermitted sensitive identifiers.
 */
export class CLCProvider implements GovernmentVerificationProvider {
  public readonly providerName = 'CLC';
  public readonly providerCode = 'CLC';
  private config: GovernmentProviderConfig;

  constructor(customConfig?: Partial<GovernmentProviderConfig>) {
    const rawBaseUrl = customConfig?.baseUrl ?? process.env.GOVERNMENT_API_BASE_URL ?? '';
    const hasBaseUrl = Boolean(rawBaseUrl && isValidGovernmentApiUrl(rawBaseUrl));
    const apiKey = customConfig?.apiKey ?? process.env.GOVERNMENT_API_KEY;
    const clientId = customConfig?.clientId ?? process.env.GOVERNMENT_CLIENT_ID ?? process.env.GOVERNMENT_API_CLIENT_ID;
    const clientSecret = customConfig?.clientSecret ?? process.env.GOVERNMENT_CLIENT_SECRET ?? process.env.GOVERNMENT_API_CLIENT_SECRET;
    const hasAuth = Boolean(apiKey || (clientId && clientSecret));
    const isExplicitlyEnabled = customConfig?.enabled ?? false;

    this.config = {
      id: customConfig?.id ?? 'gov-provider-clc',
      name: customConfig?.name ?? 'Chief Labour Commissioner (Central)',
      providerCode: 'CLC',
      baseUrl: rawBaseUrl,
      enabled: isExplicitlyEnabled && hasBaseUrl && hasAuth,
      authenticationType: customConfig?.authenticationType ?? (apiKey ? 'API_KEY' : 'OAUTH2'),
      createdAt: customConfig?.createdAt ?? '2026-09-21T00:00:00.000Z',
      updatedAt: customConfig?.updatedAt ?? '2026-09-21T00:00:00.000Z',
      apiKey,
      clientId,
      clientSecret,
      timeoutMs: customConfig?.timeoutMs ?? (Number(process.env.GOVERNMENT_API_TIMEOUT_MS) || 10000),
    };
  }

  public getConfig(): GovernmentProviderConfig {
    return { ...this.config };
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public isConfigured(): boolean {
    const hasBaseUrl = Boolean(this.config.baseUrl && isValidGovernmentApiUrl(this.config.baseUrl));
    const hasAuth = Boolean(this.config.apiKey || (this.config.clientId && this.config.clientSecret));
    return hasBaseUrl && hasAuth;
  }

  public async verifyWorker(
    workerId: string,
    governmentReference: string,
    context?: AuthContext
  ): Promise<NormalizedGovernmentResponse> {
    const nowIso = new Date().toISOString();

    // 1. If not enabled or not configured, return NOT_CONFIGURED
    if (!this.isConfigured() || !this.isEnabled()) {
      return {
        status: 'NOT_CONFIGURED',
        provider: this.providerName,
        externalReference: governmentReference,
        verificationReference: governmentReference,
        message: 'Government verification service is not currently connected.',
        errorMessage: 'Official government verification gateway credentials not configured or provider disabled.',
        lastCheckedAt: nowIso,
      };
    }

    const endpoint = `${this.config.baseUrl.replace(/\/+$/, '')}/worker/verify`;

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ShramSetu-Official-Verification-Agent/2.0',
        };

        if (this.config.apiKey) {
          headers['X-API-Key'] = this.config.apiKey;
        }
        if (this.config.clientId && this.config.clientSecret) {
          headers['X-Client-ID'] = this.config.clientId;
          headers['X-Client-Secret'] = this.config.clientSecret;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            workerReference: governmentReference,
            organization: 'ShramSetu Cooperative Network',
            inquiryReason: 'WORKER_ONBOARDING_VERIFICATION',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        return response;
      } catch (err) {
        clearTimeout(timeout);
        throw err;
      }
    };

    try {
      const response = await executeWithRetry(
        makeRequest,
        (err) => err.name === 'AbortError' || err.message?.includes('fetch failed') || err.message?.includes('ECONNREFUSED'),
        { maxRetries: 2, initialDelayMs: 300 }
      );

      // 401 / 403: Credentials invalid or expired -> AUTHENTICATION_ERROR
      if (response.status === 401 || response.status === 403) {
        return {
          status: 'AUTHENTICATION_ERROR',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'GOV_AUTH_FAILED',
          errorMessage: 'Official government verification gateway credentials rejected or expired.',
          lastCheckedAt: nowIso,
        };
      }

      // 404: Official registry found no such record -> NOT_VERIFIED
      if (response.status === 404) {
        return {
          status: 'NOT_VERIFIED',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'RECORD_NOT_FOUND',
          errorMessage: 'No matching worker registration found in the official CLC registry.',
          lastCheckedAt: nowIso,
        };
      }

      // 5xx or server errors: Server down / bad gateway -> SERVICE_UNAVAILABLE
      if (response.status >= 500) {
        return {
          status: 'SERVICE_UNAVAILABLE',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: `SERVER_ERROR_${response.status}`,
          errorMessage: `Official government gateway is temporarily unavailable (HTTP ${response.status}).`,
          lastCheckedAt: nowIso,
        };
      }

      if (!response.ok) {
        return {
          status: 'SERVICE_UNAVAILABLE',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: `HTTP_${response.status}`,
          errorMessage: `Official government API responded with status ${response.status}`,
          lastCheckedAt: nowIso,
        };
      }

      const rawJson = await response.json();

      // Normalize permitted fields ONLY & compute hash
      const permittedPayload = sanitizeGovernmentPayload(rawJson);
      const rawResponseHash = computeRawResponseHash(permittedPayload);

      const isVerified =
        permittedPayload.status === 'VERIFIED' ||
        permittedPayload.registrationStatus === 'ACTIVE' ||
        permittedPayload.isValid === true;

      return {
        status: isVerified ? 'VERIFIED' : 'NOT_VERIFIED',
        provider: this.providerName,
        externalReference: permittedPayload.registrationNumber || governmentReference,
        verificationReference: permittedPayload.registrationNumber || governmentReference,
        workerName: permittedPayload.workerName || permittedPayload.fullName,
        workerCategory: permittedPayload.trade || permittedPayload.workerCategory,
        registrationDate: permittedPayload.registrationDate,
        verifiedRegistrationDate: permittedPayload.registrationDate,
        lastCheckedAt: nowIso,
        rawResponseHash,
      };
    } catch (err: any) {
      const isAbort = err.name === 'AbortError';
      return {
        status: 'SERVICE_UNAVAILABLE',
        provider: this.providerName,
        externalReference: governmentReference,
        verificationReference: governmentReference,
        errorCode: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
        errorMessage: isAbort
          ? 'Official government verification gateway timed out.'
          : 'Failed to reach official government verification service.',
        lastCheckedAt: nowIso,
      };
    }
  }

  public async getWorkerDetails(
    workerId: string,
    governmentReference: string
  ): Promise<NormalizedGovernmentResponse | GovernmentWorkerDetails | null> {
    if (!this.isConfigured() || !this.isEnabled()) {
      return null;
    }
    const result = await this.verifyWorker(workerId, governmentReference);
    if (result.status !== 'VERIFIED') {
      return null;
    }
    return {
      workerName: result.workerName || 'Official Registered Worker',
      workerCategory: result.workerCategory || 'General Skilled Trade',
      registrationDate: result.registrationDate,
      verificationReference: result.externalReference || governmentReference,
      authority: this.providerName,
      lastCheckedAt: result.lastCheckedAt,
    };
  }

  public async checkStatus(
    workerId: string,
    externalReference: string
  ): Promise<NormalizedGovernmentResponse> {
    return this.verifyWorker(workerId, externalReference);
  }
}
