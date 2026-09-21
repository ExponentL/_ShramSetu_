/**
 * Express Router for 3-Tier Verification Endpoints
 *
 * Implements:
 *   1. Government Verification:
 *      POST /verification/request
 *      GET  /verification/worker/:workerId
 *      POST /verification/admin/verify/:workerId
 *      POST /verification/admin/reject/:workerId
 *
 *   2. Cooperative Verification:
 *      POST /verification/cooperative/:workerId/verify
 *      POST /verification/cooperative/:workerId/reject
 *      GET  /verification/cooperative/:workerId
 *
 *   3. ShramSetu Platform Verification:
 *      POST /verification/shramsetu/:workerId/verify
 *      POST /verification/shramsetu/:workerId/reject
 *      GET  /verification/shramsetu/:workerId
 *
 *   4. Verification Audit Trail:
 *      GET  /verification/audit/:workerId
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthContext, ServiceUserRole, AdminPrivilegeType } from './types';
import { defaultVerificationService, VerificationServiceError } from './verificationService';

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

/**
 * Authentication Middleware
 * Extracts authentication context, role, and cooperative scoping.
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  let userId: string | undefined;
  let role: ServiceUserRole | undefined;
  let name: string | undefined;
  let societyId: string | undefined;
  let societyName: string | undefined;
  let adminType: AdminPrivilegeType | undefined;

  // 1. Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    try {
      if (token.startsWith('{')) {
        const parsed = JSON.parse(token);
        userId = parsed.userId || parsed.id;
        role = parsed.role;
        name = parsed.name;
        societyId = parsed.societyId;
        societyName = parsed.societyName;
        adminType = parsed.adminType;
      } else if (token.toLowerCase().includes('coop-admin')) {
        userId = 'usr-coop-admin-delhi';
        role = 'admin';
        name = 'DLACS Cooperative Registrar';
        societyId = 'coop-delhi-central';
        societyName = 'Delhi Labourers & Artisans Cooperative Society';
        adminType = 'cooperative_admin';
      } else if (token.toLowerCase().includes('admin')) {
        userId = 'usr-admin-01';
        role = 'admin';
        name = 'System Administrator';
        adminType = 'platform_admin';
      } else if (token.toLowerCase().includes('worker')) {
        userId = 'w-101';
        role = 'worker';
        name = 'Worker';
      } else if (token.toLowerCase().includes('customer')) {
        userId = 'usr-cust-01';
        role = 'customer';
        name = 'Customer';
      }
    } catch {
      // Fall through to headers
    }
  }

  // 2. Custom headers
  if (!role && req.headers['x-user-role']) {
    const rawRole = String(req.headers['x-user-role']).toLowerCase();
    if (rawRole === 'admin' || rawRole === 'worker' || rawRole === 'customer') {
      role = rawRole as ServiceUserRole;
    }
  }

  if (!userId && req.headers['x-user-id']) {
    userId = String(req.headers['x-user-id']);
  }
  if (!name && req.headers['x-user-name']) {
    name = String(req.headers['x-user-name']);
  }
  if (!societyId && req.headers['x-society-id']) {
    societyId = String(req.headers['x-society-id']);
  }
  if (!societyName && req.headers['x-society-name']) {
    societyName = String(req.headers['x-society-name']);
  }
  if (!adminType && req.headers['x-admin-type']) {
    const rawAdmin = String(req.headers['x-admin-type']).toLowerCase();
    if (rawAdmin === 'cooperative_admin' || rawAdmin === 'platform_admin') {
      adminType = rawAdmin as AdminPrivilegeType;
    }
  }

  // 3. Request body / query fallback
  if (!role && req.body && req.body.role) {
    const rawRole = String(req.body.role).toLowerCase();
    if (rawRole === 'admin' || rawRole === 'worker' || rawRole === 'customer') {
      role = rawRole as ServiceUserRole;
    }
  }
  if (!userId && req.body && (req.body.userId || req.body.currentUserId)) {
    userId = String(req.body.userId || req.body.currentUserId);
  }
  if (!societyId && req.body && (req.body.societyId || req.body.cooperativeId)) {
    societyId = String(req.body.societyId || req.body.cooperativeId);
  }
  if (!societyName && req.body && req.body.societyName) {
    societyName = String(req.body.societyName);
  }
  if (!adminType && req.body && req.body.adminType) {
    adminType = req.body.adminType;
  }

  if (!role && req.query && req.query.role) {
    const rawRole = String(req.query.role).toLowerCase();
    if (rawRole === 'admin' || rawRole === 'worker' || rawRole === 'customer') {
      role = rawRole as ServiceUserRole;
    }
  }
  if (!userId && req.query && req.query.userId) {
    userId = String(req.query.userId);
  }
  if (!societyId && req.query && (req.query.societyId || req.query.cooperativeId)) {
    societyId = String(req.query.societyId || req.query.cooperativeId);
  }

  // Construct auth context
  if (role && userId) {
    req.auth = {
      userId,
      role,
      name: name || (role === 'admin' ? 'Administrator' : role === 'worker' ? 'Craftsman' : 'Citizen'),
      societyId,
      societyName,
      adminType,
    };
  } else if (role) {
    req.auth = {
      userId: `usr-${role}-default`,
      role,
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      societyId,
      societyName,
      adminType,
    };
  }

  next();
};

export const requireRole = (allowedRoles: ServiceUserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth || !req.auth.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication credentials are required to access this endpoint.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Role '${req.auth.role}' is not authorized. Required: ${allowedRoles.join(' or ')}.`,
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
};

export const verificationRouter = Router();
verificationRouter.use(authenticate);

// =========================================================================
// 1. GOVERNMENT VERIFICATION ROUTES
// =========================================================================

verificationRouter.post(
  '/request',
  requireRole(['worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId, tradeCategory, referenceHint } = req.body || {};
      const targetWorkerId = workerId || auth.userId;
      const result = await defaultVerificationService.requestVerification(auth, {
        workerId: targetWorkerId,
        tradeCategory,
        referenceHint,
      });
      res.status(201).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

verificationRouter.get(
  '/worker/:workerId',
  requireRole(['customer', 'worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const result = await defaultVerificationService.getWorkerVerification(auth, workerId);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

verificationRouter.post(
  '/admin/verify/:workerId',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes, authority, verificationType } = req.body || {};
      const result = await defaultVerificationService.adminVerifyWorker(auth, workerId, {
        notes,
        authority,
        verificationType,
      });
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

verificationRouter.post(
  '/admin/reject/:workerId',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes, authority, verificationType } = req.body || {};
      const result = await defaultVerificationService.adminRejectWorker(auth, workerId, {
        notes,
        authority,
        verificationType,
      });
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

// =========================================================================
// 2. COOPERATIVE VERIFICATION ROUTES
// =========================================================================

/**
 * POST /verification/cooperative/:workerId/verify
 * Authorized: Cooperative Admin for workers in their cooperative.
 */
verificationRouter.post(
  '/cooperative/:workerId/verify',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes } = req.body || {};
      const result = await defaultVerificationService.verifyCooperativeWorker(auth, workerId, notes);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

/**
 * POST /verification/cooperative/:workerId/reject
 * Authorized: Cooperative Admin for workers in their cooperative.
 */
verificationRouter.post(
  '/cooperative/:workerId/reject',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes } = req.body || {};
      const result = await defaultVerificationService.rejectCooperativeWorker(auth, workerId, notes);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

/**
 * GET /verification/cooperative/:workerId
 * Authorized: customer, worker, admin.
 */
verificationRouter.get(
  '/cooperative/:workerId',
  requireRole(['customer', 'worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const result = await defaultVerificationService.getCooperativeVerification(auth, workerId);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

// =========================================================================
// 3. SHRAMSETU PLATFORM VERIFICATION ROUTES
// =========================================================================

/**
 * POST /verification/shramsetu/:workerId/verify
 * Authorized: Platform Admin.
 */
verificationRouter.post(
  '/shramsetu/:workerId/verify',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes } = req.body || {};
      const result = await defaultVerificationService.verifyPlatformWorker(auth, workerId, notes);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

/**
 * POST /verification/shramsetu/:workerId/reject
 * Authorized: Platform Admin.
 */
verificationRouter.post(
  '/shramsetu/:workerId/reject',
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const { notes } = req.body || {};
      const result = await defaultVerificationService.rejectPlatformWorker(auth, workerId, notes);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

/**
 * GET /verification/shramsetu/:workerId
 * Authorized: customer, worker, admin.
 */
verificationRouter.get(
  '/shramsetu/:workerId',
  requireRole(['customer', 'worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId } = req.params;
      const result = await defaultVerificationService.getPlatformVerification(auth, workerId);
      res.status(200).json(result);
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

// =========================================================================
// 4. VERIFICATION AUDIT TRAIL ROUTE
// =========================================================================

verificationRouter.get(
  '/audit/:workerId',
  requireRole(['customer', 'worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { workerId } = req.params;
      defaultVerificationService.validateWorkerId(workerId);
      const logs = defaultVerificationService.getVerificationAuditLogs(workerId);
      res.status(200).json({ workerId, auditLogs: logs });
    } catch (err: any) {
      handleServiceError(err, res);
    }
  }
);

function handleServiceError(err: any, res: Response): void {
  if (err instanceof VerificationServiceError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      code: err.code,
    });
    return;
  }
  res.status(500).json({
    error: 'InternalServerError',
    message: err?.message || 'An unexpected error occurred processing the verification request.',
    code: 'INTERNAL_ERROR',
  });
}
