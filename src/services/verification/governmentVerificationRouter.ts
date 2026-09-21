import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from './verificationRouter';
import { defaultGovernmentVerificationService } from './governmentVerificationService';

export const governmentVerificationApiRouter = Router();

// Middleware: Authenticate incoming requests
governmentVerificationApiRouter.use(authenticate);

/**
 * POST /api/government-verification/verify
 *
 * Required Request Body:
 * {
 *   "workerId": "...",
 *   "governmentReference": "...",
 *   "provider": "CLC"
 * }
 */
governmentVerificationApiRouter.post(
  '/verify',
  requireRole(['worker', 'admin']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const auth = req.auth!;
      const { workerId, governmentReference, provider } = req.body || {};

      if (!workerId) {
        res.status(400).json({
          error: 'BadRequest',
          message: "Field 'workerId' is required.",
          code: 'BAD_REQUEST',
        });
        return;
      }

      if (!governmentReference) {
        res.status(400).json({
          error: 'BadRequest',
          message: "Field 'governmentReference' is required.",
          code: 'BAD_REQUEST',
        });
        return;
      }

      const result = await defaultGovernmentVerificationService.verifyGovernmentReference(
        auth,
        {
          workerId,
          governmentReference,
          provider: provider || 'CLC',
        }
      );

      // If official API is not configured, return NOT_CONFIGURED status payload
      if (result.status === 'NOT_CONFIGURED') {
        res.status(200).json({
          status: 'NOT_CONFIGURED',
          message: result.message || 'Government verification service is not currently connected.',
          provider: result.provider,
          lastCheckedAt: result.lastCheckedAt,
        });
        return;
      }

      // Return safe verified payload
      res.status(200).json({
        status: result.status,
        provider: result.provider,
        verificationReference: result.verificationReference,
        workerName: result.workerName,
        workerCategory: result.workerCategory,
        lastCheckedAt: result.lastCheckedAt,
        ...(result.rawResponseHash ? { rawResponseHash: result.rawResponseHash } : {}),
      });
    } catch (err: any) {
      const msg = err.message || 'An error occurred during verification';
      if (msg.includes('Authentication required') || msg.includes('Unauthorized')) {
        res.status(401).json({ error: 'Unauthorized', message: msg, code: 'UNAUTHORIZED' });
      } else if (msg.includes('Forbidden') || msg.includes('Access denied')) {
        res.status(403).json({ error: 'Forbidden', message: msg, code: 'FORBIDDEN' });
      } else if (msg.includes('does not exist') || msg.includes('not found')) {
        res.status(404).json({ error: 'NotFound', message: msg, code: 'NOT_FOUND' });
      } else if (msg.includes('Rate limit exceeded')) {
        res.status(429).json({ error: 'TooManyRequests', message: msg, code: 'RATE_LIMIT_EXCEEDED' });
      } else {
        res.status(400).json({ error: 'BadRequest', message: msg, code: 'BAD_REQUEST' });
      }
    }
  }
);

