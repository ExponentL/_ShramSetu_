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
 * OtherAuthorizedProvider
 *
 * Generic extensible adapter for any officially authorized Government Verification Provider
 * (e.g. Municipal corporations, Special Welfare Boards, Central PSUs).
 *
 * COMPLIANCE & PRIVACY:
 * - Requires explicit configuration & authorized credentials.
 * - Starts disabled (enabled: false).
 * - Never scrapes or uses unauthorized backdoors.
 * - Strips sensitive citizen PII.
 */
export class OtherAuthorizedProvider implements GovernmentVerificationProvider {
  public readonly providerName = 'Other Authorized Government Provider';
  public readonly providerCode = 'OTHER_AUTHORIZED';
  private config: GovernmentProviderConfig;

  constructor(customConfig?: Partial<GovernmentProviderConfig>) {
    const rawBaseUrl = customConfig?.baseUrl ?? process.env.OTHER_GOV_API_BASE_URL ?? process.env.GOVERNMENT_API_BASE_URL ?? '';
    const hasBaseUrl = Boolean(rawBaseUrl && isValidGovernmentApiUrl(rawBaseUrl));
    const apiKey = customConfig?.apiKey ?? process.env.OTHER_GOV_API_KEY ?? process.env.GOVERNMENT_API_KEY;
    const clientId = customConfig?.clientId ?? process.env.OTHER_GOV_CLIENT_ID ?? process.env.GOVERNMENT_CLIENT_ID;
    const clientSecret = customConfig?.clientSecret ?? process.env.OTHER_GOV_CLIENT_SECRET ?? process.env.GOVERNMENT_CLIENT_SECRET;
    const hasAuth = Boolean(apiKey || (clientId && clientSecret));
    const isExplicitlyEnabled = customConfig?.enabled ?? false;

    this.config = {
      id: customConfig?.id ?? 'gov-provider-other-authorized',
      name: customConfig?.name ?? 'Other Authorized Government Provider',
      providerCode: 'OTHER_AUTHORIZED',
      baseUrl: rawBaseUrl,
      enabled: isExplicitlyEnabled && hasBaseUrl && hasAuth,
      authenticationType: customConfig?.authenticationType ?? (apiKey ? 'API_KEY' : 'BEARER_TOKEN'),
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
        errorMessage: 'Official government verification gateway not configured or provider disabled.',
        lastCheckedAt: nowIso,
      };
    }

    const endpoint = `${this.config.baseUrl.replace(/\/+$/, '')}/verify`;

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ShramSetu-AuthorizedGovProvider-Integration/2.0',
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
            referenceId: governmentReference,
            service: 'SHRAMSETU_OFFICIAL_VERIFICATION',
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
          errorCode: 'GOV_AUTH_FAILED',
          errorMessage: 'Official government verification gateway credentials unauthorized or expired.',
          lastCheckedAt: nowIso,
        };
      }

      if (response.status === 404) {
        return {
          status: 'NOT_VERIFIED',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'OFFICIAL_RECORD_NOT_FOUND',
          errorMessage: 'No matching worker record found in authorized government registry.',
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
          errorMessage: `Official government gateway temporarily unavailable (HTTP ${response.status}).`,
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
          errorMessage: `Official government API responded with HTTP ${response.status}`,
          lastCheckedAt: nowIso,
        };
      }

      const rawJson = await response.json();
      const permittedPayload = sanitizeGovernmentPayload(rawJson);
      const rawResponseHash = computeRawResponseHash(permittedPayload);

      const isVerified =
        permittedPayload.status === 'VERIFIED' ||
        permittedPayload.verified === true ||
        permittedPayload.active === true;

      return {
        status: isVerified ? 'VERIFIED' : 'NOT_VERIFIED',
        provider: this.providerName,
        externalReference: permittedPayload.referenceId || permittedPayload.registrationNumber || governmentReference,
        verificationReference: permittedPayload.referenceId || permittedPayload.registrationNumber || governmentReference,
        workerName: permittedPayload.workerName || permittedPayload.name,
        workerCategory: permittedPayload.category || permittedPayload.trade,
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
          ? 'Authorized government verification gateway timed out.'
          : 'Failed to connect to authorized government verification service.',
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
      workerName: result.workerName || 'Officially Verified Worker',
      workerCategory: result.workerCategory || 'Certified Trade',
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

