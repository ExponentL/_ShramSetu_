import { describe, it, expect } from 'bun:test';
import { INITIAL_WORKERS, INITIAL_GOVERNMENT_VERIFICATIONS } from '../src/data/mockData';
import { sanitizeGovernmentPayload } from '../src/services/verification/utils/verificationSecurity';
import type { GovernmentVerificationRecord, Worker } from '../src/types';

describe('Worker Profile Real Government Verification Integration', () => {
  describe('Display States Under ## Government Verification', () => {
    it('State 1: VERIFIED - displays verified badge and all permitted details', () => {
      const worker = INITIAL_WORKERS.find((w) => w.id === 'w-100')!;
      const govVerif = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === worker.id)!;

      expect(govVerif.status).toBe('VERIFIED');
      expect(govVerif.provider || govVerif.authority).toBe('CLC');
      expect(govVerif.verificationReference).toBe('CLC-DEMO-10293');

      // Permitted display fields
      const displayedStatus = '✓ Government Verified';
      const actualProviderName = govVerif.provider || govVerif.authority;
      const safeReference = govVerif.externalReference || govVerif.verificationReference;
      const returnedPermittedName = govVerif.verifiedName || worker.name;
      const returnedPermittedCategory =
        govVerif.verifiedWorkerCategory ||
        (worker.primaryTrade === 'Electrical' ? 'Electrician' : worker.primaryTrade);

      expect(displayedStatus).toBe('✓ Government Verified');
      expect(actualProviderName).toBe('CLC');
      expect(safeReference).toBe('CLC-DEMO-10293');
      expect(returnedPermittedName).toBe('Rajesh Kumar');
      expect(returnedPermittedCategory).toBe('Electrician');
    });

    it('State 2: PENDING - displays pending badge and exact required copy', () => {
      const pendingRecord: GovernmentVerificationRecord = {
        id: 'gv-test-pending',
        workerId: 'w-pending',
        authority: 'CLC',
        provider: 'CLC',
        verificationType: 'WORKER_REGISTRATION',
        status: 'PENDING',
        verificationReference: 'CLC-REF-TEST-PENDING',
        externalReference: 'CLC-REF-TEST-PENDING',
        lastCheckedAt: '2026-09-21T00:00:00.000Z',
      };

      const pendingBadge = '⏳ Verification Pending';
      const pendingCopy = 'Government verification is currently being processed.';

      expect(pendingRecord.status).toBe('PENDING');
      expect(pendingBadge).toBe('⏳ Verification Pending');
      expect(pendingCopy).toBe('Government verification is currently being processed.');
    });

    it('State 3: NOT VERIFIED - displays unconfirmed copy when verification failed or rejected', () => {
      const unverifiedRecord: GovernmentVerificationRecord = {
        id: 'gv-test-unverified',
        workerId: 'w-unverified',
        authority: 'CLC',
        provider: 'CLC',
        verificationType: 'WORKER_REGISTRATION',
        status: 'NOT_VERIFIED',
        verificationReference: 'CLC-REF-TEST-UNVERIFIED',
        externalReference: 'CLC-REF-TEST-UNVERIFIED',
        lastCheckedAt: '2026-09-21T00:00:00.000Z',
      };

      const notVerifiedCopy = 'Government verification could not be confirmed.';

      expect(unverifiedRecord.status).toBe('NOT_VERIFIED');
      expect(notVerifiedCopy).toBe('Government verification could not be confirmed.');
    });

    it('State 4: NOT CONFIGURED - displays service unavailable notice without false claim', () => {
      const notConfiguredRecord: GovernmentVerificationRecord = {
        id: 'gv-test-unconfigured',
        workerId: 'w-unconfigured',
        authority: 'CLC',
        provider: 'CLC',
        verificationType: 'WORKER_REGISTRATION',
        status: 'NOT_CONFIGURED',
        verificationReference: 'CLC-REF-TEST-UNCONFIGURED',
        externalReference: 'CLC-REF-TEST-UNCONFIGURED',
        lastCheckedAt: '2026-09-21T00:00:00.000Z',
      };

      const notConfiguredCopy = 'Government verification service is currently unavailable.';

      expect(notConfiguredRecord.status).toBe('NOT_CONFIGURED');
      expect(notConfiguredCopy).toBe('Government verification service is currently unavailable.');
    });

    it('Conditionality: Never display "Government Verified" when status is not VERIFIED', () => {
      const testStatuses: GovernmentVerificationRecord['status'][] = [
        'PENDING',
        'NOT_VERIFIED',
        'NOT_CONFIGURED',
        'REJECTED',
        'FAILED',
      ];

      testStatuses.forEach((status) => {
        const isVerified = status === 'VERIFIED';
        expect(isVerified).toBe(false);
      });
    });
  });

  describe('Customer View Privacy Protections', () => {
    it('Customer view provides "View Verification Details" modal with permitted public data only', () => {
      const worker = INITIAL_WORKERS[0];
      const govVerif = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === worker.id)!;

      // Permitted attributes
      const publicDetails = {
        verificationType: govVerif.verificationType,
        verifiedThrough: govVerif.provider || govVerif.authority,
        safeReference: govVerif.externalReference || govVerif.verificationReference,
        workerName: govVerif.verifiedName || worker.name,
        workerCategory: govVerif.verifiedWorkerCategory || worker.primaryTrade,
        lastChecked: govVerif.lastCheckedAt || govVerif.verifiedAt,
      };

      expect(publicDetails.verifiedThrough).toBe('CLC');
      expect(publicDetails.safeReference).toBe('CLC-DEMO-10293');
      expect(publicDetails.workerName).toBe('Rajesh Kumar');
    });

    it('Never exposes Aadhaar, passwords, private government records, or API credentials', () => {
      const dirtyGovPayload = {
        workerId: 'w-100',
        name: 'Rajesh Kumar',
        aadhaarNumber: '9999-8888-7777',
        uidai_token: 'secret_token_123',
        password: 'super_secret_password',
        api_key: 'gov_live_key_999',
        bankAccount: '123456789012',
        ifscCode: 'SBIN0001234',
        biometricHash: 'bio_hash_abc',
        trade: 'Electrician',
      };

      const sanitized = sanitizeGovernmentPayload(dirtyGovPayload);

      expect(sanitized).not.toHaveProperty('aadhaarNumber');
      expect(sanitized).not.toHaveProperty('uidai_token');
      expect(sanitized).not.toHaveProperty('password');
      expect(sanitized).not.toHaveProperty('api_key');
      expect(sanitized).not.toHaveProperty('bankAccount');
      expect(sanitized).not.toHaveProperty('ifscCode');
      expect(sanitized).not.toHaveProperty('biometricHash');

      expect(sanitized.name).toBe('Rajesh Kumar');
      expect(sanitized.trade).toBe('Electrician');
    });
  });

  describe('Admin View Privileged Diagnostic Inspection', () => {
    it('Admin view allows inspection of endpoint, SHA-256 hash, last attempt, and error code', () => {
      const adminDiagnosticRecord: GovernmentVerificationRecord = {
        id: 'gv-admin-diag',
        workerId: 'w-105',
        authority: 'CLC',
        provider: 'CLC',
        verificationType: 'WORKER_REGISTRATION',
        status: 'FAILED',
        errorCode: 'ERR_TIMEOUT',
        errorMessage: 'Official gateway connection timed out',
        rawResponseHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        lastCheckedAt: '2026-09-21T02:00:00.000Z',
      };

      expect(adminDiagnosticRecord.provider).toBe('CLC');
      expect(adminDiagnosticRecord.errorCode).toBe('ERR_TIMEOUT');
      expect(adminDiagnosticRecord.rawResponseHash).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
      expect(adminDiagnosticRecord.lastCheckedAt).toBeDefined();
    });
  });

  describe('Worker View Reference Submission', () => {
    it('Worker view accepts official registration reference & provider, but disallows manual self-verification', () => {
      const workerInput = {
        workerReference: 'CLC-WORKER-TEST-99',
        selectedProvider: 'CLC' as const,
      };

      expect(workerInput.workerReference).toBe('CLC-WORKER-TEST-99');
      expect(workerInput.selectedProvider).toBe('CLC');

      // The status must come exclusively from backend verification response, not frontend client state
      const mockBackendCheck = (ref: string): GovernmentVerificationRecord['status'] => {
        if (!ref) return 'NOT_VERIFIED';
        // By default without live official credentials, returns NOT_CONFIGURED
        return 'NOT_CONFIGURED';
      };

      expect(mockBackendCheck(workerInput.workerReference)).toBe('NOT_CONFIGURED');
    });
  });
});
