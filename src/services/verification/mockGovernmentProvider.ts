/**
 * Mock Government Verification Provider
 *
 * PROTOTYPE NOTICE:
 * This provider implements a simulated provider for hackathon demonstrations.
 * It does NOT claim to connect to a live CLC.gov.in production API.
 * It does NOT scrape CLC.gov.in or any external government registry.
 * It returns strictly mock/demo verification data without exposing citizen PII.
 *
 * It is engineered to be seamlessly replaced by OfficialAuthorizedGovernmentProvider
 * once an officially sanctioned API gateway agreement and credentials are provided.
 */

import {
  IGovernmentVerificationProvider,
  SafeVerificationResponse,
  VerificationSimulationState,
  VerificationRequestPayload,
} from './types';

/**
 * In-memory simulated state store for the mock provider.
 * Pre-seeded with simulated workers matching the prototype test cases.
 */
const mockVerificationDatabase: Map<string, SafeVerificationResponse> = new Map([
  [
    'w-100',
    {
      status: 'VERIFIED',
      authority: 'CLC',
      verificationReference: 'CLC-DEMO-10293',
      verificationType: 'WORKER_REGISTRATION',
      verifiedAt: '2026-09-21',
    },
  ],
  [
    'w-101',
    {
      status: 'VERIFIED',
      authority: 'CLC',
      verificationReference: 'CLC-DEMO-10293',
      verificationType: 'WORKER_REGISTRATION',
      verifiedAt: '2026-09-21',
    },
  ],
  [
    'w-102',
    {
      status: 'PENDING',
      authority: 'STATE_LABOUR_DEPARTMENT',
      verificationReference: 'STATE-DEMO-84920',
      verificationType: 'LABOUR_REGISTRATION',
      verifiedAt: null,
    },
  ],
  [
    'w-103',
    {
      status: 'NOT_VERIFIED',
      authority: 'STATE_LABOUR_DEPARTMENT',
      verificationReference: 'STATE-DEMO-39102',
      verificationType: 'LABOUR_REGISTRATION',
      verifiedAt: null,
    },
  ],
  [
    'w-104',
    {
      status: 'REQUIRES_REVIEW',
      authority: 'SKILL_CERTIFICATION_AUTHORITY',
      verificationReference: 'NCVT-DEMO-55192',
      verificationType: 'SKILL_CERTIFICATION',
      verifiedAt: null,
    },
  ],
]);

export class MockGovernmentProvider implements IGovernmentVerificationProvider {
  public readonly providerId = 'provider-mock-clc-v1';
  public readonly providerName = 'Mock Government Verification Provider (Prototype Sandbox)';
  public readonly isPrototype = true;

  /**
   * Simulate a verification request from a worker.
   * Alternates or assigns a state based on worker profile or simulation rules.
   */
  async requestVerification(
    workerId: string,
    payload?: VerificationRequestPayload
  ): Promise<SafeVerificationResponse> {
    const existing = mockVerificationDatabase.get(workerId);
    if (existing && existing.status === 'VERIFIED') {
      return existing;
    }

    // Generate simulated reference
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const mockRecord: SafeVerificationResponse = {
      status: 'PENDING',
      authority: 'CLC',
      verificationReference: `CLC-DEMO-${randomSuffix}`,
      verificationType: 'WORKER_REGISTRATION',
      verifiedAt: null,
    };

    mockVerificationDatabase.set(workerId, mockRecord);
    return mockRecord;
  }

  /**
   * Fetch current verification record for a worker.
   */
  async fetchWorkerVerification(workerId: string): Promise<SafeVerificationResponse | null> {
    const record = mockVerificationDatabase.get(workerId);
    if (!record) {
      // Default initial state for unseeded valid workers
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const defaultRecord: SafeVerificationResponse = {
        status: 'PENDING',
        authority: 'CLC',
        verificationReference: `CLC-DEMO-${randomSuffix}`,
        verificationType: 'WORKER_REGISTRATION',
        verifiedAt: null,
      };
      mockVerificationDatabase.set(workerId, defaultRecord);
      return defaultRecord;
    }
    return record;
  }

  /**
   * Admin-authorized manual status override.
   * Simulates PENDING, VERIFIED, NOT_VERIFIED, REQUIRES_REVIEW.
   */
  async overrideStatus(
    workerId: string,
    status: VerificationSimulationState,
    adminNotes?: string
  ): Promise<SafeVerificationResponse> {
    const existing = mockVerificationDatabase.get(workerId);
    const today = new Date().toISOString().slice(0, 10);

    const updatedRecord: SafeVerificationResponse = {
      status,
      authority: existing?.authority || 'CLC',
      verificationReference: existing?.verificationReference || `CLC-DEMO-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationType: existing?.verificationType || 'WORKER_REGISTRATION',
      verifiedAt: status === 'VERIFIED' ? today : null,
    };

    mockVerificationDatabase.set(workerId, updatedRecord);
    return updatedRecord;
  }
}

/**
 * Future Architecture Template:
 * Official Authorized Government API Provider
 *
 * Implements the same IGovernmentVerificationProvider interface.
 * When official MOUs and API keys are issued, this provider handles:
 * - Mutual TLS (mTLS) handshake
 * - Official OAuth 2.0 / Bharat Data Exchange bearer authentication
 * - XML/JSON digital signature verification
 * - Zero PII leakage architecture
 */
export class OfficialAuthorizedGovernmentProvider implements IGovernmentVerificationProvider {
  public readonly providerId = 'provider-official-clc-gateway';
  public readonly providerName = 'Official Central / State Labour Ministry Gateway (Production)';
  public readonly isPrototype = false;

  private readonly apiEndpoint: string;
  private readonly apiKey?: string;

  constructor(endpoint = 'https://api.labour.gov.in/v1/auth-worker', apiKey?: string) {
    this.apiEndpoint = endpoint;
    this.apiKey = apiKey;
  }

  async requestVerification(workerId: string, payload?: VerificationRequestPayload): Promise<SafeVerificationResponse> {
    throw new Error(
      'Official production gateway credentials not yet configured. Use MockGovernmentProvider during prototype phase.'
    );
  }

  async fetchWorkerVerification(workerId: string): Promise<SafeVerificationResponse | null> {
    throw new Error(
      'Official production gateway credentials not yet configured. Use MockGovernmentProvider during prototype phase.'
    );
  }

  async overrideStatus(
    workerId: string,
    status: VerificationSimulationState,
    adminNotes?: string
  ): Promise<SafeVerificationResponse> {
    throw new Error(
      'Official production gateway overrides require administrative audit clearance.'
    );
  }
}

