import { describe, test, expect } from 'bun:test';
import {
  INITIAL_WORKERS,
  INITIAL_COOPERATIVES,
  INITIAL_GOVERNMENT_VERIFICATIONS,
} from '../src/data/mockData';
import { getWorkerVerificationSummary } from '../src/services/verificationService';

describe('Worker Profile Verification Integration Tests', () => {
  test('Rajesh Kumar (w-100) profile exists with exact requested attributes', () => {
    const worker = INITIAL_WORKERS.find((w) => w.id === 'w-100');
    expect(worker).toBeDefined();
    expect(worker?.name).toBe('Rajesh Kumar');
    expect(worker?.rating).toBe(4.8);
    expect(worker?.reviewCount).toBe(36);
    expect(worker?.completedJobsCount).toBe(47);
    expect(worker?.primaryTrade).toBe('Electrical');
    expect(worker?.cooperativeName).toBe('Bahadurgarh Labour Cooperative Society');
  });

  test('Bahadurgarh Labour Cooperative Society exists in cooperatives list', () => {
    const coop = INITIAL_COOPERATIVES.find(
      (c) => c.name === 'Bahadurgarh Labour Cooperative Society'
    );
    expect(coop).toBeDefined();
    expect(coop?.id).toBe('coop-bahadurgarh-society');
  });

  test('Rajesh Kumar has verified status across all 3 tiers', () => {
    const worker = INITIAL_WORKERS.find((w) => w.id === 'w-100')!;
    const govRecord = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === 'w-100');

    // Layer 1: Government
    expect(govRecord).toBeDefined();
    expect(govRecord?.status).toBe('VERIFIED');
    expect(govRecord?.authority).toBe('CLC');
    expect(govRecord?.verificationReference).toBe('CLC-DEMO-10293');
    expect(govRecord?.verificationType).toBe('WORKER_REGISTRATION');

    // Layer 2: Cooperative
    expect(worker.cooperativeVerificationStatus).toBe('VERIFIED');

    // Layer 3: ShramSetu
    expect(worker.shramsetuVerificationStatus).toBe('VERIFIED');
  });

  test('Badge conditionality: Only display badge when corresponding status is VERIFIED', () => {
    const worker100 = INITIAL_WORKERS.find((w) => w.id === 'w-100')!;
    const gov100 = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === 'w-100');

    const isGovVerified100 = gov100?.status === 'VERIFIED';
    const isCoopVerified100 = worker100.cooperativeVerificationStatus === 'VERIFIED';
    const isPlatformVerified100 = worker100.shramsetuVerificationStatus === 'VERIFIED';

    expect(isGovVerified100).toBe(true);
    expect(isCoopVerified100).toBe(true);
    expect(isPlatformVerified100).toBe(true);

    // Worker 102 (Pending Government)
    const worker102 = INITIAL_WORKERS.find((w) => w.id === 'w-102')!;
    const gov102 = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === 'w-102');
    const isGovVerified102 = gov102?.status === 'VERIFIED';

    // Must NOT display government badge
    expect(isGovVerified102).toBe(false);
  });

  test('Customer view data does not expose Aadhaar, passwords or private citizen PII', () => {
    const govRecord = INITIAL_GOVERNMENT_VERIFICATIONS.find((gv) => gv.workerId === 'w-100')!;

    // Non-sensitive reference is safe
    expect(govRecord.verificationReference).toBe('CLC-DEMO-10293');

    // Ensure raw citizen Aadhaar or private passwords are never part of the verification object
    const keys = Object.keys(govRecord);
    expect(keys.includes('aadhar')).toBe(false);
    expect(keys.includes('aadhaar')).toBe(false);
    expect(keys.includes('password')).toBe(false);
    expect(keys.includes('privateDocument')).toBe(false);
  });

  test('Three-tier verification summary remains decoupled and independent', () => {
    const worker = INITIAL_WORKERS.find((w) => w.id === 'w-100')!;
    const summary = getWorkerVerificationSummary(worker, INITIAL_GOVERNMENT_VERIFICATIONS);

    expect(summary.layer1Government?.status).toBe('VERIFIED');
    expect(summary.layer1Government?.authority).toBe('CLC');
    expect(summary.layer2Cooperative.status).toBe('VERIFIED');
    expect(summary.layer2Cooperative.societyName).toBe('Bahadurgarh Labour Cooperative Society');
    expect(summary.layer3ShramSetu.status).toBe('VERIFIED');

    // No composite trust score (score/100) is generated
    expect((summary as any).trustScore).toBeUndefined();
    expect((summary as any).compositeScore).toBeUndefined();
  });
});

