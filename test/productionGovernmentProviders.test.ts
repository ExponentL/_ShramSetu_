import { describe, it, expect } from 'bun:test';
import { GovernmentProviderFactory } from '../src/services/verification/providers/providerFactory';
import { CLCProvider } from '../src/services/verification/providers/CLCProvider';
import { EShramProvider } from '../src/services/verification/providers/EShramProvider';
import { StateLabourProvider } from '../src/services/verification/providers/StateLabourProvider';
import { OtherAuthorizedProvider } from '../src/services/verification/providers/OtherAuthorizedProvider';
import { VerificationCache } from '../src/services/verification/utils/verificationCache';
import { executeWithRetry } from '../src/services/verification/utils/retryHandler';
import { GovernmentVerificationService } from '../src/services/verification/governmentVerificationService';
import { sanitizeGovernmentPayload } from '../src/services/verification/utils/verificationSecurity';
import type { GovernmentProviderConfig, NormalizedGovernmentResponse, AuthContext } from '../src/services/verification/types';

describe('Production-Ready Government Integration Provider System', () => {
  describe('Provider Configuration (GovernmentProviderConfig)', () => {
    it('all providers initialize with enabled: false by default', () => {
      const configs: GovernmentProviderConfig[] = GovernmentProviderFactory.getAllProviderConfigs();
      expect(configs.length).toBe(4);

      for (const config of configs) {
        expect(config.enabled).toBe(false);
        expect(config.id).toBeDefined();
        expect(config.name).toBeDefined();
        expect(config.providerCode).toBeDefined();
        expect(config.authenticationType).toBeDefined();
        expect(config.createdAt).toBeDefined();
        expect(config.updatedAt).toBeDefined();
      }
    });

    it('creates CLC provider configuration with providerCode: CLC and enabled: false', () => {
      const provider = new CLCProvider();
      const config = provider.getConfig();

      expect(config.providerCode).toBe('CLC');
      expect(config.name).toBe('Chief Labour Commissioner (Central)');
      expect(config.enabled).toBe(false);
      expect(provider.isEnabled()).toBe(false);
      expect(provider.isConfigured()).toBe(false);
    });

    it('creates e-Shram provider configuration with providerCode: ESHRAM and enabled: false', () => {
      const provider = new EShramProvider();
      const config = provider.getConfig();

      expect(config.providerCode).toBe('ESHRAM');
      expect(config.name).toBe('e-Shram National Database');
      expect(config.enabled).toBe(false);
      expect(provider.isEnabled()).toBe(false);
      expect(provider.isConfigured()).toBe(false);
    });

    it('creates State Labour Department provider with providerCode: STATE_LABOUR and enabled: false', () => {
      const provider = new StateLabourProvider();
      const config = provider.getConfig();

      expect(config.providerCode).toBe('STATE_LABOUR');
      expect(config.name).toBe('State Labour Department');
      expect(config.enabled).toBe(false);
      expect(provider.isEnabled()).toBe(false);
      expect(provider.isConfigured()).toBe(false);
    });

    it('creates Other Authorized Government Provider with providerCode: OTHER_AUTHORIZED and enabled: false', () => {
      const provider = new OtherAuthorizedProvider();
      const config = provider.getConfig();

      expect(config.providerCode).toBe('OTHER_AUTHORIZED');
      expect(config.name).toBe('Other Authorized Government Provider');
      expect(config.enabled).toBe(false);
      expect(provider.isEnabled()).toBe(false);
      expect(provider.isConfigured()).toBe(false);
    });

    it('provider activates ONLY when legitimate credentials and enabled: true are explicitly configured', () => {
      const activeProvider = new CLCProvider({
        baseUrl: 'https://clc.gov.in/api/v1',
        apiKey: 'legitimate_official_token_2026',
        enabled: true,
      });

      expect(activeProvider.isEnabled()).toBe(true);
      expect(activeProvider.isConfigured()).toBe(true);
    });
  });

  describe('Standard Provider Interface Implementation', () => {
    const providers = [
      new CLCProvider(),
      new EShramProvider(),
      new StateLabourProvider(),
      new OtherAuthorizedProvider(),
    ];

    it('every provider implements verifyWorker(), getWorkerDetails(), and checkStatus()', () => {
      for (const provider of providers) {
        expect(typeof provider.verifyWorker).toBe('function');
        expect(typeof provider.getWorkerDetails).toBe('function');
        expect(typeof provider.checkStatus).toBe('function');
        expect(typeof provider.isConfigured).toBe('function');
        expect(typeof provider.isEnabled).toBe('function');
        expect(typeof provider.getConfig).toBe('function');
      }
    });

    it('all providers return the identical normalized response contract', async () => {
      for (const provider of providers) {
        const res: NormalizedGovernmentResponse = await provider.verifyWorker(
          'w-100',
          'GOV-REF-12345'
        );

        // Required normalized fields
        expect(res).toHaveProperty('status');
        expect(res).toHaveProperty('provider');
        expect(res).toHaveProperty('externalReference');
        expect(res).toHaveProperty('lastCheckedAt');
        expect(res.status).toBe('NOT_CONFIGURED');
      }
    });
  });

  describe('Strict Failure State Semantics (Technical Failures !== NOT_VERIFIED)', () => {
    it('returns NOT_CONFIGURED when provider is unavailable or not enabled', async () => {
      const provider = new CLCProvider();
      const res = await provider.verifyWorker('w-100', 'REF-TEST');

      expect(res.status).toBe('NOT_CONFIGURED');
      expect(res.status).not.toBe('NOT_VERIFIED');
      expect(res.message).toBe('Government verification service is not currently connected.');
    });

    it('returns AUTHENTICATION_ERROR when credentials are rejected (HTTP 401/403) without failing worker', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ error: 'Unauthorized credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });

      // Override global fetch temporarily
      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch as any;

      try {
        const configuredProvider = new CLCProvider({
          baseUrl: 'https://official.api.gov.in',
          apiKey: 'expired_key',
          enabled: true,
        });

        const res = await configuredProvider.verifyWorker('w-100', 'REF-TEST');

        expect(res.status).toBe('AUTHENTICATION_ERROR');
        // Critical: A credential error MUST NOT mean the worker is not verified
        expect(res.status).not.toBe('NOT_VERIFIED');
        expect(res.errorCode).toBe('GOV_AUTH_FAILED');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('returns SERVICE_UNAVAILABLE when API cannot be reached or times out without failing worker', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ error: 'Gateway timeout' }), {
          status: 504,
          headers: { 'Content-Type': 'application/json' },
        });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch as any;

      try {
        const configuredProvider = new EShramProvider({
          baseUrl: 'https://eshram.gov.in/api',
          apiKey: 'valid_key',
          enabled: true,
        });

        const res = await configuredProvider.verifyWorker('w-100', 'ESHRAM-REF-99');

        expect(res.status).toBe('SERVICE_UNAVAILABLE');
        // Critical: API unavailable != NOT_VERIFIED
        expect(res.status).not.toBe('NOT_VERIFIED');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('returns NOT_VERIFIED only when government registry explicitly returns 404 or record not found', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ error: 'Worker not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch as any;

      try {
        const configuredProvider = new StateLabourProvider({
          baseUrl: 'https://labour.state.gov.in/api',
          apiKey: 'valid_key',
          enabled: true,
        });

        const res = await configuredProvider.verifyWorker('w-100', 'INVALID-REF-999');

        expect(res.status).toBe('NOT_VERIFIED');
        expect(res.errorCode).toBe('BOCW_RECORD_NOT_FOUND');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('returns VERIFIED when government registry confirms registration', async () => {
      const mockFetch = async () =>
        new Response(
          JSON.stringify({
            status: 'VERIFIED',
            registrationNumber: 'BOCW-DELHI-2024-9182',
            workerName: 'Rajesh Kumar',
            skillTrade: 'Electrician',
            enrolmentDate: '2024-03-15',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch as any;

      try {
        const configuredProvider = new StateLabourProvider({
          baseUrl: 'https://labour.state.gov.in/api',
          apiKey: 'valid_key',
          enabled: true,
        });

        const res = await configuredProvider.verifyWorker('w-100', 'BOCW-DELHI-2024-9182');

        expect(res.status).toBe('VERIFIED');
        expect(res.workerName).toBe('Rajesh Kumar');
        expect(res.workerCategory).toBe('Electrician');
        expect(res.externalReference).toBe('BOCW-DELHI-2024-9182');
        expect(res.registrationDate).toBe('2024-03-15');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe('Verification Caching & Controlled Manual Rechecks', () => {
    it('caches VERIFIED results and returns cached entry on subsequent queries', () => {
      const cache = new VerificationCache(60000); // 1 minute TTL
      const sampleResponse: NormalizedGovernmentResponse = {
        status: 'VERIFIED',
        provider: 'CLC',
        externalReference: 'CLC-REG-2026-TEST',
        workerName: 'Test Worker',
        lastCheckedAt: new Date().toISOString(),
      };

      cache.set('CLC', 'CLC-REG-2026-TEST', sampleResponse);

      const cached = cache.get('CLC', 'CLC-REG-2026-TEST');
      expect(cached).not.toBeNull();
      expect(cached?.status).toBe('VERIFIED');
      expect(cached?.workerName).toBe('Test Worker');

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.size).toBe(1);
    });

    it('does NOT cache transient technical failures (SERVICE_UNAVAILABLE or AUTHENTICATION_ERROR)', () => {
      const cache = new VerificationCache();
      const transientResponse: NormalizedGovernmentResponse = {
        status: 'SERVICE_UNAVAILABLE',
        provider: 'CLC',
        externalReference: 'REF-TEMP-FAIL',
        lastCheckedAt: new Date().toISOString(),
      };

      cache.set('CLC', 'REF-TEMP-FAIL', transientResponse);

      const cached = cache.get('CLC', 'REF-TEMP-FAIL');
      expect(cached).toBeNull();
      expect(cache.getStats().size).toBe(0);
    });

    it('invalidates cache when controlled manual recheck (forceRecheck) is executed', async () => {
      const cache = new VerificationCache();
      cache.set('CLC', 'CLC-FORCE-RECHECK', {
        status: 'VERIFIED',
        provider: 'CLC',
        externalReference: 'CLC-FORCE-RECHECK',
        workerName: 'Cached Worker',
        lastCheckedAt: '2026-09-20T00:00:00.000Z',
      });

      expect(cache.get('CLC', 'CLC-FORCE-RECHECK')).not.toBeNull();

      const service = new GovernmentVerificationService(cache);
      const auth: AuthContext = { userId: 'admin-1', role: 'admin' };

      // Query with forceRecheck: true
      const result = await service.verifyGovernmentReference(auth, {
        workerId: 'w-100',
        governmentReference: 'CLC-FORCE-RECHECK',
        provider: 'CLC',
        forceRecheck: true,
      });

      // Because unconfigured in test, returns NOT_CONFIGURED and invalidates the previous cache
      expect(result.status).toBe('NOT_CONFIGURED');
      expect(cache.get('CLC', 'CLC-FORCE-RECHECK')).toBeNull();
    });
  });

  describe('Retry Handling with Exponential Backoff', () => {
    it('retries transient failures up to maxRetries', async () => {
      let attempts = 0;
      const failingFn = async (attempt: number) => {
        attempts++;
        if (attempt < 3) {
          const err: any = new Error('503 Service Unavailable');
          err.isTransient = true;
          throw err;
        }
        return 'SUCCESS_AFTER_RETRIES';
      };

      const result = await executeWithRetry(
        failingFn,
        (err) => err.isTransient === true,
        { maxRetries: 3, initialDelayMs: 10, maxDelayMs: 50 }
      );

      expect(result).toBe('SUCCESS_AFTER_RETRIES');
      expect(attempts).toBe(3);
    });

    it('does NOT retry non-transient errors (e.g. 401 Unauthorized)', async () => {
      let attempts = 0;
      const nonTransientFn = async () => {
        attempts++;
        const err: any = new Error('401 Unauthorized');
        err.isTransient = false;
        throw err;
      };

      try {
        await executeWithRetry(
          nonTransientFn,
          (err) => err.isTransient === true,
          { maxRetries: 3, initialDelayMs: 10 }
        );
      } catch (err: any) {
        expect(err.message).toBe('401 Unauthorized');
      }

      expect(attempts).toBe(1); // Aborted immediately on first failure
    });
  });

  describe('Customer Privacy & Data Minimization', () => {
    it('strictly strips sensitive PII and API keys from external responses', () => {
      const payload = {
        name: 'Harpreet Singh',
        aadhaarNumber: '1234-5678-9012',
        uidaiToken: 'token_xyz',
        bankAccount: '1122334455',
        ifscCode: 'HDFC000123',
        password: 'secret_login',
        apiKey: 'official_live_key',
        clientSecret: 'secret_999',
        trade: 'Plumber',
      };

      const sanitized = sanitizeGovernmentPayload(payload);

      expect(sanitized).toHaveProperty('name', 'Harpreet Singh');
      expect(sanitized).toHaveProperty('trade', 'Plumber');
      expect(sanitized).not.toHaveProperty('aadhaarNumber');
      expect(sanitized).not.toHaveProperty('uidaiToken');
      expect(sanitized).not.toHaveProperty('bankAccount');
      expect(sanitized).not.toHaveProperty('ifscCode');
      expect(sanitized).not.toHaveProperty('password');
      expect(sanitized).not.toHaveProperty('apiKey');
      expect(sanitized).not.toHaveProperty('clientSecret');
    });
  });
});

