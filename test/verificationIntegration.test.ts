import { describe, test, expect } from 'bun:test';
import { INITIAL_WORKERS, INITIAL_GOVERNMENT_VERIFICATIONS, INITIAL_BOOKINGS, INITIAL_COMPLAINTS } from '../src/data/mockData';
import { WorkerProfile, GovernmentVerification } from '../src/types';

describe('3-Tier Verification Integration into Discovery and Booking', () => {
  const workers = INITIAL_WORKERS;
  const govVerifications = INITIAL_GOVERNMENT_VERIFICATIONS;

  // 1. Worker Search & Filter Logic
  describe('Worker Search & Verification Filters', () => {
    test('Filter by Government Verified selects only workers with status VERIFIED in DB', () => {
      const govVerifiedIds = new Set(
        govVerifications.filter((gv) => gv.status === 'VERIFIED').map((gv) => gv.workerId)
      );

      const filtered = workers.filter((w) => {
        const govRec = govVerifications.find((gv) => gv.workerId === w.id);
        return govRec?.status === 'VERIFIED';
      });

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((w) => {
        expect(govVerifiedIds.has(w.id)).toBe(true);
      });

      // Harpreet Singh (w-102) has PENDING government verification, so he must NOT be in gov-only filter
      expect(filtered.some((w) => w.id === 'w-102')).toBe(false);
    });

    test('Filter by Cooperative Verified selects only workers with cooperativeVerificationStatus === VERIFIED', () => {
      const filtered = workers.filter((w) => w.cooperativeVerificationStatus === 'VERIFIED');
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((w) => {
        expect(w.cooperativeVerificationStatus).toBe('VERIFIED');
      });
      // Both Rajesh Kumar (w-100) and Harpreet Singh (w-102) belong to cooperatives and are verified
      expect(filtered.some((w) => w.id === 'w-100')).toBe(true);
      expect(filtered.some((w) => w.id === 'w-102')).toBe(true);
    });

    test('Filter by ShramSetu Verified selects only workers with shramsetuVerificationStatus === VERIFIED', () => {
      const filtered = workers.filter((w) => w.shramsetuVerificationStatus === 'VERIFIED');
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((w) => {
        expect(w.shramsetuVerificationStatus).toBe('VERIFIED');
      });
    });

    test('Combined filter requires all selected verification layers to be VERIFIED', () => {
      const filteredAllThree = workers.filter((w) => {
        const govRec = govVerifications.find((gv) => gv.workerId === w.id);
        const govMatch = govRec?.status === 'VERIFIED';
        const coopMatch = w.cooperativeVerificationStatus === 'VERIFIED';
        const platformMatch = w.shramsetuVerificationStatus === 'VERIFIED';
        return govMatch && coopMatch && platformMatch;
      });

      expect(filteredAllThree.length).toBeGreaterThan(0);
      // Rajesh Kumar (w-100) has all 3 tiers verified
      expect(filteredAllThree.some((w) => w.id === 'w-100')).toBe(true);
      // Harpreet Singh (w-102) has Gov Pending, so must not match all 3
      expect(filteredAllThree.some((w) => w.id === 'w-102')).toBe(false);
    });
  });

  // 2. Worker Card Badges & Display
  describe('Worker Card Badges Conditionality', () => {
    test('Rajesh Kumar (w-100) displays all 3 verified badges', () => {
      const rajesh = workers.find((w) => w.id === 'w-100')!;
      const govRec = govVerifications.find((gv) => gv.workerId === rajesh.id);

      const isGovVerified = govRec?.status === 'VERIFIED';
      const isCoopVerified = rajesh.cooperativeVerificationStatus === 'VERIFIED';
      const isPlatformVerified = rajesh.shramsetuVerificationStatus === 'VERIFIED';

      expect(isGovVerified).toBe(true);
      expect(isCoopVerified).toBe(true);
      expect(isPlatformVerified).toBe(true);
      expect(rajesh.name).toBe('Rajesh Kumar');
      expect(rajesh.primaryTrade).toBe('Electrical');
      expect(rajesh.rating).toBe(4.8);
      expect(rajesh.completedJobsCount).toBe(47);
    });

    test('Harpreet Singh (w-102) displays Cooperative and ShramSetu badges, but NOT Government Verified badge', () => {
      const harpreet = workers.find((w) => w.id === 'w-102')!;
      const govRec = govVerifications.find((gv) => gv.workerId === harpreet.id);

      const isGovVerified = govRec?.status === 'VERIFIED';
      const isCoopVerified = harpreet.cooperativeVerificationStatus === 'VERIFIED';
      const isPlatformVerified = harpreet.shramsetuVerificationStatus === 'VERIFIED';

      expect(isGovVerified).toBe(false); // Status is PENDING
      expect(govRec?.status).toBe('PENDING');
      expect(isCoopVerified).toBe(true);
      expect(isPlatformVerified).toBe(true);
    });
  });

  // 3. Booking Modal Verification Details
  describe('Booking Modal Verification Section', () => {
    test('Maps statuses truthfully without falsely showing Verified', () => {
      const formatStatus = (status?: string) => {
        if (status === 'VERIFIED') return '✓ Verified';
        if (status === 'PENDING') return 'Pending';
        if (status === 'REJECTED') return 'Rejected';
        if (status === 'REQUIRES_REVIEW') return 'Under Review';
        return status || 'Pending';
      };

      // Case 1: Rajesh Kumar (All verified)
      const rajesh = workers.find((w) => w.id === 'w-100')!;
      const govRajesh = govVerifications.find((gv) => gv.workerId === rajesh.id);
      expect(formatStatus(govRajesh?.status)).toBe('✓ Verified');
      expect(formatStatus(rajesh.cooperativeVerificationStatus)).toBe('✓ Verified');
      expect(formatStatus(rajesh.shramsetuVerificationStatus)).toBe('✓ Verified');

      // Case 2: Harpreet Singh (Gov Pending, others verified)
      const harpreet = workers.find((w) => w.id === 'w-102')!;
      const govHarpreet = govVerifications.find((gv) => gv.workerId === harpreet.id);
      expect(formatStatus(govHarpreet?.status)).toBe('Pending');
      expect(formatStatus(harpreet.cooperativeVerificationStatus)).toBe('✓ Verified');
      expect(formatStatus(harpreet.shramsetuVerificationStatus)).toBe('✓ Verified');

      // Crucial Safety invariant: Never falsely display "Verified" for non-verified record
      expect(formatStatus(govHarpreet?.status)).not.toBe('✓ Verified');
    });
  });

  // 4. GPS Live Tracking & Complaint Verification Context
  describe('GPS Tracking & Complaint Context', () => {
    test('Active booking has worker association with verified status info', () => {
      const booking = INITIAL_BOOKINGS[0];
      const assignedWorker = workers.find((w) => w.id === booking.workerId);
      expect(assignedWorker).toBeDefined();
      expect(assignedWorker?.name).toBe(booking.workerName);
    });

    test('Complaints have worker verification status accessible for administrative context', () => {
      const complaintWithWorker = INITIAL_COMPLAINTS.find(
        (c) => workers.some((w) => w.id === c.againstId || w.id === c.complainantId)
      );
      expect(complaintWithWorker).toBeDefined();

      const worker = workers.find(
        (w) => w.id === complaintWithWorker?.againstId || w.id === complaintWithWorker?.complainantId
      );
      expect(worker).toBeDefined();

      const govRec = govVerifications.find((gv) => gv.workerId === worker?.id);
      expect(worker?.cooperativeVerificationStatus).toBeDefined();
      expect(worker?.shramsetuVerificationStatus).toBeDefined();
    });
  });

  // 5. AI Assistant Verification Query Response
  describe('AI Assistant Verification Answers', () => {
    function simulateBotVerificationAnswer(targetWorker: WorkerProfile, govRecord?: GovernmentVerification) {
      const govStatus = govRecord ? govRecord.status : 'NOT_VERIFIED';
      const coopStatus = targetWorker.cooperativeVerificationStatus || 'PENDING';
      const platformStatus = targetWorker.shramsetuVerificationStatus || 'PENDING';

      const verifiedLayers: string[] = [];
      if (govStatus === 'VERIFIED') verifiedLayers.push('Government Verification');
      if (coopStatus === 'VERIFIED') verifiedLayers.push('Cooperative Verification');
      if (platformStatus === 'VERIFIED') verifiedLayers.push('ShramSetu Verification');

      let responseText = '';
      if (verifiedLayers.length === 3) {
        responseText = `This worker has Government Verification, Cooperative Verification, and ShramSetu Verification. All three verification tiers are active and verified.`;
      } else if (verifiedLayers.length > 0) {
        responseText = `This worker has ${verifiedLayers.join(' and ')}.`;
        if (govStatus === 'PENDING') {
          responseText += ' Government verification is currently pending.';
        } else if (govStatus === 'REJECTED') {
          responseText += ' Government verification was rejected.';
        } else if (govStatus === 'NOT_VERIFIED') {
          responseText += ' Government verification is currently not verified.';
        }
      } else {
        responseText = `This worker currently has no verified layers.`;
      }

      return responseText;
    }

    test('Simulated query for Harpreet Singh (w-102) matches required format', () => {
      const harpreet = workers.find((w) => w.id === 'w-102')!;
      const govRec = govVerifications.find((gv) => gv.workerId === harpreet.id);

      const answer = simulateBotVerificationAnswer(harpreet, govRec);
      expect(answer).toBe('This worker has Cooperative Verification and ShramSetu Verification. Government verification is currently pending.');
    });

    test('Simulated query for Rajesh Kumar (w-100) confirms all three tiers', () => {
      const rajesh = workers.find((w) => w.id === 'w-100')!;
      const govRec = govVerifications.find((gv) => gv.workerId === rajesh.id);

      const answer = simulateBotVerificationAnswer(rajesh, govRec);
      expect(answer).toContain('This worker has Government Verification, Cooperative Verification, and ShramSetu Verification');
    });
  });
});
