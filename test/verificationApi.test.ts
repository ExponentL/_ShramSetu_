/**
 * Verification API Comprehensive Test Suite
 *
 * Covers:
 * 1. Architecture layer decoupling (Service -> Provider -> Mock)
 * 2. Government Verification APIs (POST /request, GET /worker/:id, POST /admin/verify/:id, POST /admin/reject/:id)
 * 3. Cooperative Verification APIs (POST /cooperative/:id/verify, POST /cooperative/:id/reject, GET /cooperative/:id)
 * 4. Cooperative Admin Scoping (Admins can ONLY verify workers belonging to their cooperative)
 * 5. ShramSetu Platform Verification APIs (POST /shramsetu/:id/verify, POST /shramsetu/:id/reject, GET /shramsetu/:id)
 * 6. ShramSetu Platform Admin Scoping (Cooperative admins cannot verify platform tier)
 * 7. Verification Audit Logging (Format: "20 Sep 2026 Cooperative Verification → VERIFIED")
 * 8. Complete 3-Tier Independence (Each layer remains completely decoupled)
 * 9. Worker ID validation (Invalid IDs rejected with 404)
 * 10. Sensitive data protection (Zero exposure of Aadhaar, passwords, private documents)
 */

import { createServer } from '../src/server/server';
import { defaultVerificationService } from '../src/services/verification/verificationService';
import { defaultVerificationProvider } from '../src/services/verification/verificationProvider';

async function runTests() {
  console.log('--- Starting 3-Tier Verification Subsystem Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Architecture Layer Abstraction
  assert(
    defaultVerificationProvider.getActiveProvider().isPrototype === true,
    'VerificationProvider has MockGovernmentProvider active by default'
  );

  // 2. Government Tier: GET /verification/worker/:workerId
  const authCustomer = { userId: 'usr-cust-01', role: 'customer' as const };
  const w101Record = await defaultVerificationService.getWorkerVerification(authCustomer, 'w-101');
  assert(w101Record.status === 'VERIFIED', 'w-101 government verification status is VERIFIED');
  assert(w101Record.authority === 'CLC', 'w-101 authority is CLC');
  assert(w101Record.verificationReference === 'CLC-DEMO-10293', 'w-101 reference is CLC-DEMO-10293');
  assert(w101Record.verificationType === 'WORKER_REGISTRATION', 'w-101 type is WORKER_REGISTRATION');
  assert(Boolean(w101Record.verifiedAt), 'w-101 has verifiedAt timestamp');

  // Verify zero exposure of sensitive fields
  const rawRecordKeys = Object.keys(w101Record);
  assert(!rawRecordKeys.includes('aadhar'), 'Response does NOT expose aadhar');
  assert(!rawRecordKeys.includes('password'), 'Response does NOT expose password');
  assert(!rawRecordKeys.includes('documents'), 'Response does NOT expose private documents');

  // 3. Government Tier: Worker Request & Customer Block
  const authWorker = { userId: 'w-102', role: 'worker' as const };
  const reqResult = await defaultVerificationService.requestVerification(authWorker, {
    workerId: 'w-102',
    tradeCategory: 'Electrical',
  });
  assert(Boolean(reqResult.verificationReference), 'Worker request generates verificationReference');

  let customerBlocked = false;
  try {
    await defaultVerificationService.requestVerification(authCustomer, { workerId: 'w-102' });
  } catch (err: any) {
    if (err.code === 'FORBIDDEN' && err.statusCode === 403) {
      customerBlocked = true;
    }
  }
  assert(customerBlocked, 'Customer is forbidden from requesting worker verification (403)');

  // 4. Cooperative Tier: GET /verification/cooperative/:workerId
  const coopRecord = await defaultVerificationService.getCooperativeVerification(authCustomer, 'w-101');
  assert(coopRecord.tier === 'COOPERATIVE', 'Cooperative tier tag verified');
  assert(coopRecord.cooperativeId === 'coop-delhi-central', 'w-101 belongs to DLACS (coop-delhi-central)');
  assert(Boolean(coopRecord.cooperativeVerificationStatus), 'cooperativeVerificationStatus present');

  // 5. Cooperative Tier: Authorized Cooperative Admin can verify worker of their cooperative
  const authDelhiCoopAdmin = {
    userId: 'usr-admin-delhi',
    role: 'admin' as const,
    name: 'DLACS Cooperative Registrar',
    societyId: 'coop-delhi-central',
    societyName: 'Delhi Labourers & Artisans Cooperative Society',
    adminType: 'cooperative_admin' as const,
  };

  const coopVerifyResult = await defaultVerificationService.verifyCooperativeWorker(
    authDelhiCoopAdmin,
    'w-101',
    'Audited DLACS membership register'
  );
  assert(coopVerifyResult.status === 'VERIFIED', 'Cooperative admin verified worker in same cooperative');
  assert(coopVerifyResult.cooperativeVerificationStatus === 'VERIFIED', 'Status is VERIFIED');
  assert(Boolean(coopVerifyResult.cooperativeVerifiedAt), 'VerifiedAt timestamp recorded');
  assert(coopVerifyResult.auditLog?.action === 'Cooperative Verification → VERIFIED', 'Audit action recorded');

  // 6. Cooperative Tier: Scoping Enforcement - Cooperative Admin CANNOT verify worker of ANOTHER cooperative
  // w-102 belongs to 'coop-punjab-shramik' (Mohali), so Delhi admin must be rejected
  let crossCoopBlocked = false;
  try {
    await defaultVerificationService.verifyCooperativeWorker(
      authDelhiCoopAdmin,
      'w-102',
      'Unauthorized cross-society attempt'
    );
  } catch (err: any) {
    if (err.code === 'FORBIDDEN' && err.statusCode === 403) {
      crossCoopBlocked = true;
    }
  }
  assert(crossCoopBlocked, 'Cooperative Admin blocked from verifying worker in another cooperative (403)');

  // 7. Cooperative Tier: Authorized Punjab Admin CAN verify w-102
  const authPunjabCoopAdmin = {
    userId: 'usr-admin-punjab',
    role: 'admin' as const,
    name: 'Punjab Shramik Sabha Registrar',
    societyId: 'coop-punjab-shramik',
    societyName: 'Punjab Shramik Sahakari Sabha, Mohali',
    adminType: 'cooperative_admin' as const,
  };
  const punjabVerifyResult = await defaultVerificationService.verifyCooperativeWorker(
    authPunjabCoopAdmin,
    'w-102',
    'Mohali council trade audit passed'
  );
  assert(punjabVerifyResult.status === 'VERIFIED', 'Punjab admin verified Mohali worker w-102');

  // 8. Cooperative Tier: Cooperative Admin can REJECT worker
  const punjabRejectResult = await defaultVerificationService.rejectCooperativeWorker(
    authPunjabCoopAdmin,
    'w-102',
    'Trade certification documentation expired'
  );
  assert(punjabRejectResult.status === 'REJECTED', 'Cooperative admin can reject worker');
  assert(punjabRejectResult.cooperativeVerificationStatus === 'REJECTED', 'cooperativeVerificationStatus is REJECTED');

  // 9. ShramSetu Platform Tier: GET /verification/shramsetu/:workerId
  const platformRecord = await defaultVerificationService.getPlatformVerification(authCustomer, 'w-101');
  assert(platformRecord.tier === 'SHRAMSETU', 'ShramSetu tier tag verified');
  assert(Boolean(platformRecord.shramsetuVerificationStatus), 'shramsetuVerificationStatus present');

  // 10. ShramSetu Platform Tier: Cooperative Admin CANNOT verify platform tier
  let coopAdminPlatformBlocked = false;
  try {
    await defaultVerificationService.verifyPlatformWorker(
      authDelhiCoopAdmin,
      'w-101',
      'Unauthorized platform attempt by coop admin'
    );
  } catch (err: any) {
    if (err.code === 'FORBIDDEN' && err.statusCode === 403) {
      coopAdminPlatformBlocked = true;
    }
  }
  assert(coopAdminPlatformBlocked, 'Cooperative admin blocked from platform verification (403)');

  // 11. ShramSetu Platform Tier: Platform Super Admin CAN verify worker
  const authPlatformAdmin = {
    userId: 'usr-platform-admin',
    role: 'admin' as const,
    name: 'ShramSetu Safety Council',
    adminType: 'platform_admin' as const,
  };
  const platformVerifyResult = await defaultVerificationService.verifyPlatformWorker(
    authPlatformAdmin,
    'w-101',
    'Biometric photo match and safety protocol cleared'
  );
  assert(platformVerifyResult.status === 'VERIFIED', 'Platform admin verified worker w-101');
  assert(platformVerifyResult.shramsetuVerificationStatus === 'VERIFIED', 'shramsetuVerificationStatus is VERIFIED');
  assert(platformVerifyResult.auditLog?.action === 'ShramSetu Verification → VERIFIED', 'Platform audit action recorded');

  // 12. ShramSetu Platform Tier: Platform Admin CAN reject worker
  const platformRejectResult = await defaultVerificationService.rejectPlatformWorker(
    authPlatformAdmin,
    'w-104',
    'Incomplete safety protocol training'
  );
  assert(platformRejectResult.status === 'REJECTED', 'Platform admin can reject worker');
  assert(platformRejectResult.shramsetuVerificationStatus === 'REJECTED', 'shramsetuVerificationStatus is REJECTED');

  // 13. Test 3-Tier Complete Independence
  // Updating Cooperative status does NOT change Government or Platform status
  const worker101SummaryCoop = await defaultVerificationService.getCooperativeVerification(authCustomer, 'w-101');
  const worker101SummaryPlatform = await defaultVerificationService.getPlatformVerification(authCustomer, 'w-101');
  const worker101SummaryGov = await defaultVerificationService.getWorkerVerification(authCustomer, 'w-101');

  assert(worker101SummaryGov.status === 'VERIFIED', 'Gov tier status remains independent');
  assert(worker101SummaryCoop.status === 'VERIFIED', 'Coop tier status remains independent');
  assert(worker101SummaryPlatform.status === 'VERIFIED', 'Platform tier status remains independent');

  // 14. Verification Audit Log Query & Format Check
  const auditLogs = defaultVerificationService.getVerificationAuditLogs('w-101');
  assert(auditLogs.length > 0, 'Audit logs exist for worker w-101');
  const hasCoopAudit = auditLogs.some((a) => a.action === 'Cooperative Verification → VERIFIED');
  const hasPlatformAudit = auditLogs.some((a) => a.action === 'ShramSetu Verification → VERIFIED');
  assert(hasCoopAudit, 'Audit log contains: Cooperative Verification → VERIFIED');
  assert(hasPlatformAudit, 'Audit log contains: ShramSetu Verification → VERIFIED');
  assert(Boolean(auditLogs[0].formattedDate), 'Audit log contains formatted date (e.g. 20 Sep 2026)');

  // 15. Invalid workerId rejection
  let invalidIdBlocked = false;
  try {
    await defaultVerificationService.getCooperativeVerification(authCustomer, 'w-nonexistent-worker-999');
  } catch (err: any) {
    if (err.code === 'NOT_FOUND' && err.statusCode === 404) {
      invalidIdBlocked = true;
    }
  }
  assert(invalidIdBlocked, 'Invalid worker ID is rejected with NOT_FOUND (404)');

  // =========================================================================
  // In-process Express Router Dispatch Tests
  // =========================================================================
  const app = createServer();

  function dispatch(options: {
    method: 'GET' | 'POST';
    url: string;
    headers?: Record<string, string>;
    body?: any;
  }): Promise<{ status: number; body: any }> {
    return new Promise((resolve) => {
      let statusCode = 200;
      let responseData: any = null;

      const [path, queryString] = options.url.split('?');
      const query: Record<string, string> = {};
      if (queryString) {
        new URLSearchParams(queryString).forEach((val, key) => {
          query[key] = val;
        });
      }

      const req: any = {
        method: options.method,
        url: options.url,
        path,
        headers: {
          'content-type': 'application/json',
          ...(options.headers || {}),
        },
        body: options.body || {},
        query,
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

  // HTTP: GET /verification/cooperative/w-101
  const httpCoopGet = await dispatch({
    method: 'GET',
    url: '/verification/cooperative/w-101',
    headers: { 'x-user-role': 'customer', 'x-user-id': 'usr-cust-01' },
  });
  assert(httpCoopGet.status === 200, 'HTTP GET /verification/cooperative/w-101 returns 200');
  assert(httpCoopGet.body.tier === 'COOPERATIVE', 'HTTP GET returns tier COOPERATIVE');

  // HTTP: POST /verification/cooperative/w-101/verify with Delhi Coop Admin -> 200
  const httpCoopVerify = await dispatch({
    method: 'POST',
    url: '/verification/cooperative/w-101/verify',
    headers: {
      'x-user-role': 'admin',
      'x-user-id': 'usr-admin-delhi',
      'x-society-id': 'coop-delhi-central',
      'x-admin-type': 'cooperative_admin',
    },
    body: { notes: 'HTTP API cooperative verification' },
  });
  assert(httpCoopVerify.status === 200, 'HTTP POST /verification/cooperative/w-101/verify returns 200');
  assert(httpCoopVerify.body.cooperativeVerificationStatus === 'VERIFIED', 'HTTP POST verify sets status VERIFIED');

  // HTTP: POST /verification/cooperative/w-102/verify with Delhi Admin (Mismatched society) -> 403
  const httpCoopCrossForbidden = await dispatch({
    method: 'POST',
    url: '/verification/cooperative/w-102/verify',
    headers: {
      'x-user-role': 'admin',
      'x-user-id': 'usr-admin-delhi',
      'x-society-id': 'coop-delhi-central',
      'x-admin-type': 'cooperative_admin',
    },
  });
  assert(httpCoopCrossForbidden.status === 403, 'HTTP POST cross-cooperative verify returns 403 Forbidden');

  // HTTP: POST /verification/cooperative/w-101/reject with Delhi Admin -> 200
  const httpCoopReject = await dispatch({
    method: 'POST',
    url: '/verification/cooperative/w-101/reject',
    headers: {
      'x-user-role': 'admin',
      'x-user-id': 'usr-admin-delhi',
      'x-society-id': 'coop-delhi-central',
    },
  });
  assert(httpCoopReject.status === 200, 'HTTP POST /verification/cooperative/w-101/reject returns 200');
  assert(httpCoopReject.body.cooperativeVerificationStatus === 'REJECTED', 'HTTP POST reject sets status REJECTED');

  // HTTP: GET /verification/shramsetu/w-101
  const httpPlatformGet = await dispatch({
    method: 'GET',
    url: '/verification/shramsetu/w-101',
    headers: { 'x-user-role': 'customer', 'x-user-id': 'usr-cust-01' },
  });
  assert(httpPlatformGet.status === 200, 'HTTP GET /verification/shramsetu/w-101 returns 200');
  assert(httpPlatformGet.body.tier === 'SHRAMSETU', 'HTTP GET returns tier SHRAMSETU');

  // HTTP: POST /verification/shramsetu/w-101/verify with Platform Admin -> 200
  const httpPlatformVerify = await dispatch({
    method: 'POST',
    url: '/verification/shramsetu/w-101/verify',
    headers: {
      'x-user-role': 'admin',
      'x-user-id': 'usr-platform-admin',
      'x-admin-type': 'platform_admin',
    },
  });
  assert(httpPlatformVerify.status === 200, 'HTTP POST /verification/shramsetu/w-101/verify returns 200');
  assert(httpPlatformVerify.body.shramsetuVerificationStatus === 'VERIFIED', 'HTTP POST platform verify sets status VERIFIED');

  // HTTP: POST /verification/shramsetu/w-101/reject with Platform Admin -> 200
  const httpPlatformReject = await dispatch({
    method: 'POST',
    url: '/verification/shramsetu/w-101/reject',
    headers: {
      'x-user-role': 'admin',
      'x-user-id': 'usr-platform-admin',
      'x-admin-type': 'platform_admin',
    },
  });
  assert(httpPlatformReject.status === 200, 'HTTP POST /verification/shramsetu/w-101/reject returns 200');
  assert(httpPlatformReject.body.shramsetuVerificationStatus === 'REJECTED', 'HTTP POST platform reject sets status REJECTED');

  // HTTP: GET /verification/audit/w-101
  const httpAuditGet = await dispatch({
    method: 'GET',
    url: '/verification/audit/w-101',
    headers: { 'x-user-role': 'customer', 'x-user-id': 'usr-cust-01' },
  });
  assert(httpAuditGet.status === 200, 'HTTP GET /verification/audit/w-101 returns 200');
  assert(httpAuditGet.body.auditLogs.length > 0, 'HTTP GET audit logs returned');

  console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
