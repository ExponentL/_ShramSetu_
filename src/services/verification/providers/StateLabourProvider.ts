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
 * StateLabourProvider
 *
 * Official Government Integration Adapter for State Labour Departments &
 * State Building and Other Construction Workers (BOCW) Welfare Boards.
 *
 * COMPLIANCE & PRIVACY:
 * - Never scrapes state portals.
 * - Only queries officially authorized state integration APIs via HTTPS.
 * - Starts disabled (enabled: false) until valid credentials and endpoints are supplied.
 * - Strictly distinguishes technical failure states from worker non-verification.
 * - Strips all sensitive Aadhaar/biometric/banking fields.
 */
export class StateLabourProvider implements GovernmentVerificationProvider {
  public readonly providerName = 'State Labour Department';
  public readonly providerCode = 'STATE_LABOUR';
  private config: GovernmentProviderConfig;

  constructor(customConfig?: Partial<GovernmentProviderConfig>) {
    const rawBaseUrl = customConfig?.baseUrl ?? process.env.STATE_LABOUR_API_BASE_URL ?? process.env.GOVERNMENT_API_BASE_URL ?? '';
    const hasBaseUrl = Boolean(rawBaseUrl && isValidGovernmentApiUrl(rawBaseUrl));
    const apiKey = customConfig?.apiKey ?? process.env.STATE_LABOUR_API_KEY ?? process.env.GOVERNMENT_API_KEY;
    const clientId = customConfig?.clientId ?? process.env.STATE_LABOUR_CLIENT_ID ?? process.env.GOVERNMENT_CLIENT_ID;
    const clientSecret = customConfig?.clientSecret ?? process.env.STATE_LABOUR_CLIENT_SECRET ?? process.env.GOVERNMENT_CLIENT_SECRET;
    const hasAuth = Boolean(apiKey || (clientId && clientSecret));
    const isExplicitlyEnabled = customConfig?.enabled ?? false;

    this.config = {
      id: customConfig?.id ?? 'gov-provider-state-labour',
      name: customConfig?.name ?? 'State Labour Department',
      providerCode: 'STATE_LABOUR',
      baseUrl: rawBaseUrl,
      enabled: isExplicitlyEnabled && hasBaseUrl && hasAuth,
      authenticationType: customConfig?.authenticationType ?? (apiKey ? 'API_KEY' : 'MUTUAL_TLS'),
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
        errorMessage: 'State Labour Department official gateway not configured or provider disabled.',
        lastCheckedAt: nowIso,
      };
    }

    const endpoint = `${this.config.baseUrl.replace(/\/+$/, '')}/bocw/verify`;

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ShramSetu-StateLabour-Integration/2.0',
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
            registrationNumber: governmentReference,
            querySource: 'SHRAMSETU_COOPERATIVE_VERIFICATION',
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
          errorCode: 'STATE_LABOUR_AUTH_FAILED',
          errorMessage: 'State Labour Department gateway credentials unauthorized or expired.',
          lastCheckedAt: nowIso,
        };
      }

      if (response.status === 404) {
        return {
          status: 'NOT_VERIFIED',
          provider: this.providerName,
          externalReference: governmentReference,
          verificationReference: governmentReference,
          errorCode: 'BOCW_RECORD_NOT_FOUND',
          errorMessage: 'No matching worker registration found in State Labour Board records.',
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
          errorMessage: `State Labour Department server temporarily unavailable (HTTP ${response.status}).`,
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
          errorMessage: `State Labour Department API responded with status ${response.status}`,
          lastCheckedAt: nowIso,
        };
      }

      const rawJson = await response.json();
      const permittedPayload = sanitizeGovernmentPayload(rawJson);
      const rawResponseHash = computeRawResponseHash(permittedPayload);

      const isVerified =
        permittedPayload.status === 'VERIFIED' ||
        permittedPayload.membershipStatus === 'ACTIVE' ||
        permittedPayload.isValid === true;

      return {
        status: isVerified ? 'VERIFIED' : 'NOT_VERIFIED',
        provider: this.providerName,
        externalReference: permittedPayload.bocwId || permittedPayload.registrationNumber || governmentReference,
        verificationReference: permittedPayload.bocwId || permittedPayload.registrationNumber || governmentReference,
        workerName: permittedPayload.workerName || permittedPayload.beneficiaryName,
        workerCategory: permittedPayload.skillTrade || permittedPayload.workerCategory,
        registrationDate: permittedPayload.enrolmentDate || permittedPayload.registrationDate,
        verifiedRegistrationDate: permittedPayload.enrolmentDate || permittedPayload.registrationDate,
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
          ? 'State Labour Department gateway timed out.'
          : 'Failed to reach State Labour Department verification service.',
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
      workerName: result.workerName || 'State Labour Registered Worker',
      workerCategory: result.workerCategory || 'BOCW Skilled Beneficiary',
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

