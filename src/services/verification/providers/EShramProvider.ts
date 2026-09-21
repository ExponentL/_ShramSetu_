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
 * EShramProvider
 *
 * Official Government Integration Adapter for the Ministry of Labour & Employment's
 * e-Shram Portal worker verification framework.
 *
 * COMPLIANCE & PRIVACY:
 * - Never stores or returns Aadhaar numbers or biometrics.
 * - Only active when official API base URL and authorized credentials are provided.
 * - Returns NOT_CONFIGURED when unconfigured or disabled.
 * - Isolates technical errors (SERVICE_UNAVAILABLE, AUTHENTICATION_ERROR) from NOT_VERIFIED.
 */
export class EShramProvider implements GovernmentVerificationProvider {
  public readonly providerName = 'E_SHRAM';
  public readonly providerCode = 'ESHRAM';
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
      id: customConfig?.id ?? 'gov-provider-eshram',
      name: customConfig?.name ?? 'e-Shram National Database',
      providerCode: 'ESHRAM',
      baseUrl: rawBaseUrl,
      enabled: isExplicitlyEnabled && hasBaseUrl && hasAuth,
      authenticationType: customConfig?.authenticationType ?? (clientId ? 'OAUTH2' : 'API_KEY'),
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

    const endpoint = `${this.config.baseUrl.replace(/\/+$/, '')}/eshram/verify`;

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ShramSetu-EShram-Integration/2.0',
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
            uarnOrRefNumber: governmentReference,
            verificationScope: 'OCCUPATIONAL_CATEGORY_AND_STATUS',
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

      if (response.status === 401 || response.status === 403) {
        return {
          status: 'AUTHENTICATION_ERROR',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'ESHRAM_AUTH_FAILED',
          errorMessage: 'Official e-Shram gateway credentials unauthorized.',
          lastCheckedAt: nowIso,
        };
      }

      if (response.status === 404) {
        return {
          status: 'NOT_VERIFIED',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'ESHRAM_RECORD_NOT_FOUND',
          errorMessage: 'Worker reference does not match any registered unorganized worker record.',
          lastCheckedAt: nowIso,
        };
      }

      if (response.status >= 500) {
        return {
          status: 'SERVICE_UNAVAILABLE',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: `SERVER_ERROR_${response.status}`,
          errorMessage: `e-Shram gateway temporarily unavailable (HTTP ${response.status}).`,
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
          errorMessage: `e-Shram gateway responded with HTTP status ${response.status}`,
          lastCheckedAt: nowIso,
        };
      }

      const rawJson = await response.json();

      const permittedPayload = sanitizeGovernmentPayload(rawJson);
      const rawResponseHash = computeRawResponseHash(permittedPayload);

      const isVerified =
        permittedPayload.status === 'VERIFIED' ||
        permittedPayload.verificationStatus === 'ACTIVE' ||
        permittedPayload.valid === true;

      return {
        status: isVerified ? 'VERIFIED' : 'NOT_VERIFIED',
        provider: this.providerName,
        externalReference: permittedPayload.uarn || permittedPayload.referenceNumber || governmentReference,
        verificationReference: permittedPayload.uarn || permittedPayload.referenceNumber || governmentReference,
        workerName: permittedPayload.workerName || permittedPayload.fullName,
        workerCategory: permittedPayload.primaryOccupation || permittedPayload.workerCategory,
        registrationDate: permittedPayload.issueDate || permittedPayload.registrationDate,
        verifiedRegistrationDate: permittedPayload.issueDate || permittedPayload.registrationDate,
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
          ? 'e-Shram gateway connection timed out.'
          : 'Failed to establish connection to e-Shram gateway.',
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
      workerName: result.workerName || 'Registered e-Shram Worker',
      workerCategory: result.workerCategory || 'Skilled Labour',
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
