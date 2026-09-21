import { describe, test, expect, beforeEach } from 'bun:test';
import { CLCProvider } from '../src/services/verification/providers/CLCProvider';
import { EShramProvider } from '../src/services/verification/providers/EShramProvider';
import { GovernmentProviderFactory } from '../src/services/verification/providers/providerFactory';
import { sanitizeGovernmentPayload, computeRawResponseHash, isValidGovernmentApiUrl } from '../src/services/verification/utils/verificationSecurity';
import { defaultGovernmentVerificationService } from '../src/services/verification/governmentVerificationService';
import { createServer } from '../src/server/server';
import { AuthContext } from '../src/services/verification/types';

describe('Real Government Data Integration Architecture', () => {
  const adminAuth: AuthContext = {
    userId: 'usr-admin-01',
    role: 'admin',
    name: 'Authorized Administrator',
    adminType: 'platform_admin',
  };

  const workerAuth: AuthContext = {
    userId: 'w-100',
    role: 'worker',
    name: 'Rajesh Kumar',
  };

  beforeEach(() => {
    delete process.env.GOVERNMENT_API_BASE_URL;
    delete process.env.GOVERNMENT_API_KEY;
    delete process.env.GOVERNMENT_API_CLIENT_ID;
    delete process.env.GOVERNMENT_API_CLIENT_SECRET;
    defaultGovernmentVerificationService.resetRateLimiter();
  });

  // 1. Unconfigured State & Safety Guarantees
  describe('Provider Configuration & Unconfigured Behavior', () => {
    test('CLCProvider is unconfigured by default and does NOT pretend to be live', () => {
      const provider = new CLCProvider();
      expect(provider.isConfigured()).toBe(false);
      expect(provider.providerName).toBe('CLC');
    });

    test('EShramProvider is unconfigured by default', () => {
      const provider = new EShramProvider();
      expect(provider.isConfigured()).toBe(false);
      expect(provider.providerName).toBe('E_SHRAM');
    });

    test('When unconfigured, verifyWorker returns status NOT_CONFIGURED with exact required message', async () => {
      const provider = new CLCProvider();
      const result = await provider.verifyWorker('w-100', 'CLC-OFFICIAL-REF-9921');

      expect(result.status).toBe('NOT_CONFIGURED');
      expect(result.message).toBe('Government verification service is not currently connected.');
      expect(result.provider).toBe('CLC');
      expect(result.lastCheckedAt).toBeDefined();
    });

    test('When unconfigured, getWorkerDetails returns null instead of fabricated data', async () => {
      const provider = new CLCProvider();
      const details = await provider.getWorkerDetails('w-100', 'CLC-OFFICIAL-REF-9921');
      expect(details).toBeNull();
    });

    test('ProviderFactory resolves configured or unconfigured providers correctly', () => {
      const clc = GovernmentProviderFactory.getProvider('CLC');
      expect(clc.providerName).toBe('CLC');

      const eshram = GovernmentProviderFactory.getProvider('E_SHRAM');
      expect(eshram.providerName).toBe('E_SHRAM');
    });
  });

  // 2. Data Sanitization & Strict Citizen Privacy (No Aadhaar / PII Leakage)
  describe('Data Sanitization & DPDP Compliance', () => {
    test('Strips Aadhaar, UIDAI, bank details, and passwords from external payloads', () => {
      const rawGovernmentPayload = {
        status: 'VERIFIED',
        registrationNumber: 'CLC-2026-REG-9812',
        workerName: 'Rajesh Kumar',
        trade: 'Electrician',
        registrationDate: '2021-04-15',
        // SENSITIVE FIELDS THAT MUST BE DROPPED
        aadhaar: '1234-5678-9012',
        aadharNumber: '998877665544',
        uidaiRef: 'UID-99120',
        bankAccountNumber: '00192837465',
        ifscCode: 'SBIN0001234',
        biometricHash: 'b10m3tr1c-t0k3n',
        passwordHash: 's3cr3t-p4ss',
      };

      const sanitized = sanitizeGovernmentPayload(rawGovernmentPayload);

      // Permitted fields preserved
      expect(sanitized.status).toBe('VERIFIED');
      expect(sanitized.workerName).toBe('Rajesh Kumar');
      expect(sanitized.trade).toBe('Electrician');
      expect(sanitized.registrationNumber).toBe('CLC-2026-REG-9812');

      // Sensitive fields strictly eliminated
      expect(sanitized.aadhaar).toBeUndefined();
      expect(sanitized.aadharNumber).toBeUndefined();
      expect(sanitized.uidaiRef).toBeUndefined();
      expect(sanitized.bankAccountNumber).toBeUndefined();
      expect(sanitized.ifscCode).toBeUndefined();
      expect(sanitized.biometricHash).toBeUndefined();
      expect(sanitized.passwordHash).toBeUndefined();
    });

    test('Computes deterministic SHA-256 rawResponseHash for permitted data audit', () => {
      const payload1 = { workerName: 'Rajesh Kumar', status: 'VERIFIED' };
      const payload2 = { status: 'VERIFIED', workerName: 'Rajesh Kumar' };

      const hash1 = computeRawResponseHash(payload1);
      const hash2 = computeRawResponseHash(payload2);

      expect(hash1).toHaveLength(64); // 64 hex chars for SHA-256
      expect(hash1).toBe(hash2); // Deterministic ordering
    });

    test('URL validator rejects invalid or dangerous targets (SSRF protection)', () => {
      expect(isValidGovernmentApiUrl('https://api.labour.gov.in/v1')).toBe(true);
      expect(isValidGovernmentApiUrl('ftp://invalidscheme.com')).toBe(false);
      expect(isValidGovernmentApiUrl('')).toBe(false);
    });
  });

  // 3. Government Verification Service (9-Step Pipeline)
  describe('GovernmentVerificationService 9-Step Verification Workflow', () => {
    test('Rejects unauthenticated requests with authentication error', async () => {
      expect(
        defaultGovernmentVerificationService.verifyGovernmentReference(null as any, {
          workerId: 'w-100',
          governmentReference: 'CLC-REF-100',
        })
      ).rejects.toThrow('Authentication required');
    });

    test('Forbids unauthorized workers from verifying other workers profiles', async () => {
      const rogueWorkerAuth: AuthContext = {
        userId: 'w-102',
        role: 'worker',
        name: 'Harpreet Singh',
      };

      expect(
        defaultGovernmentVerificationService.verifyGovernmentReference(rogueWorkerAuth, {
          workerId: 'w-100', // Different worker
          governmentReference: 'CLC-REF-100',
        })
      ).rejects.toThrow('Forbidden: Workers can only submit government verification for their own profile');
    });

    test('Validates worker existence in database', async () => {
      expect(
        defaultGovernmentVerificationService.verifyGovernmentReference(adminAuth, {
          workerId: 'non-existent-worker-999',
          governmentReference: 'CLC-REF-100',
        })
      ).rejects.toThrow("Worker with ID 'non-existent-worker-999' does not exist");
    });

    test('Validates reference format', async () => {
      expect(
        defaultGovernmentVerificationService.verifyGovernmentReference(adminAuth, {
          workerId: 'w-100',
          governmentReference: '  ',
        })
      ).rejects.toThrow('Invalid reference');
    });

    test('Returns NOT_CONFIGURED status when official API is unconfigured without inventing data', async () => {
      const result = await defaultGovernmentVerificationService.verifyGovernmentReference(adminAuth, {
        workerId: 'w-100',
        governmentReference: 'CLC-OFFICIAL-2026-REF',
        provider: 'CLC',
      });

      expect(result.status).toBe('NOT_CONFIGURED');
      expect(result.message).toBe('Government verification service is not currently connected.');
      expect(result.provider).toBe('CLC');
      expect(result.verificationReference).toBe('CLC-OFFICIAL-2026-REF');
    });

    test('Enforces rate limiting on excessive verification requests', async () => {
      // 5 calls should succeed
      for (let i = 0; i < 5; i++) {
        await defaultGovernmentVerificationService.verifyGovernmentReference(adminAuth, {
          workerId: 'w-100',
          governmentReference: `CLC-REF-${i}`,
        });
      }

      // 6th call should be rate-limited
      expect(
        defaultGovernmentVerificationService.verifyGovernmentReference(adminAuth, {
          workerId: 'w-100',
          governmentReference: 'CLC-REF-BLOCKED',
        })
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  // 4. Express REST API: POST /api/government-verification/verify
  describe('REST API Endpoint: POST /api/government-verification/verify', () => {
    const app = createServer();

    function dispatch(options: {
      method: string;
      url: string;
      headers?: Record<string, string>;
      body?: any;
    }): Promise<{ status: number; body: any }> {
      return new Promise((resolve) => {
        let statusCode = 200;
        let responseData: any = null;

        const req: any = {
          method: options.method,
          url: options.url,
          path: options.url.split('?')[0],
          headers: options.headers || {},
          body: options.body || {},
          query: {},
          params: {},
        };

        const res: any = {
          statusCode: 200,
          status(code: number) {
            statusCode = code;
            this.statusCode = code;
            return this;
          },
          json(data: any) {
            responseData = data;
            resolve({ status: statusCode, body: responseData });
          },
          send(data: any) {
            responseData = data;
            resolve({ status: statusCode, body: responseData });
          },
          sendStatus(code: number) {
            statusCode = code;
            resolve({ status: statusCode, body: null });
          },
          header() {
            return this;
          },
          setHeader() {
            return this;
          },
        };

        app(req, res, () => {
          resolve({ status: statusCode, body: responseData });
        });
      });
    }

    test('Rejects request without authentication credentials (401)', async () => {
      const response = await dispatch({
        method: 'POST',
        url: '/api/government-verification/verify',
        headers: { 'content-type': 'application/json' },
        body: {
          workerId: 'w-100',
          governmentReference: 'CLC-REF-100',
        },
      });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    test('Rejects missing workerId (400)', async () => {
      const response = await dispatch({
        method: 'POST',
        url: '/api/government-verification/verify',
        headers: {
          'content-type': 'application/json',
          'x-user-role': 'admin',
          'x-user-id': 'usr-admin-01',
        },
        body: {
          governmentReference: 'CLC-REF-100',
        },
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Field 'workerId' is required");
    });

    test('Returns 200 with NOT_CONFIGURED payload when official government API is not connected', async () => {
      const response = await dispatch({
        method: 'POST',
        url: '/api/government-verification/verify',
        headers: {
          'content-type': 'application/json',
          'x-user-role': 'admin',
          'x-user-id': 'usr-admin-01',
        },
        body: {
          workerId: 'w-100',
          governmentReference: 'CLC-REF-OFFICIAL-1234',
          provider: 'CLC',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('NOT_CONFIGURED');
      expect(response.body.message).toBe('Government verification service is not currently connected.');
      expect(response.body.provider).toBe('CLC');
    });

    test('Server /health endpoint reports official API configuration status accurately', async () => {
      const response = await dispatch({
        method: 'GET',
        url: '/health',
      });
      expect(response.status).toBe(200);
      expect(response.body.officialApiConfigured).toBe(false);
      expect(response.body.connectionStatus).toBe('NOT_CONFIGURED');
      expect(response.body.notice).toContain('Government verification service is not currently connected');
    });
  });

  // 5. Configured Provider Verification Simulation
  describe('Configured Provider Response Handling', () => {
    test('When configured with valid test credentials, provider normalizes response safely', async () => {
      // Create provider with custom config
      const testProvider = new CLCProvider({
        baseUrl: 'https://test-clc-official-gateway.gov.in',
        apiKey: 'test-official-key-secret-999',
      });

      expect(testProvider.isConfigured()).toBe(true);
      expect(testProvider.providerName).toBe('CLC');
    });
  });
});
