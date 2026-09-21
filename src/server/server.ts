/**
 * ShramSetu Backend API Server
 *
 * Exposes the Government Verification REST API:
 *   POST /verification/request
 *   GET  /verification/worker/:workerId
 *   POST /verification/admin/verify/:workerId
 *   POST /verification/admin/reject/:workerId
 */

import express from 'express';
import { verificationRouter } from '../services/verification/verificationRouter';
import { governmentVerificationApiRouter } from '../services/verification/governmentVerificationRouter';
import { GovernmentProviderFactory } from '../services/verification/providers/providerFactory';

export const createServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());

  // CORS for local development & prototypes
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-role, x-user-id');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    const isConfigured = GovernmentProviderFactory.isAnyProviderConfigured();
    res.json({
      status: 'ok',
      service: 'ShramSetu Verification Service',
      version: '2.0.0-real-integration-ready',
      activeProvider: process.env.GOVERNMENT_PROVIDER || 'CLC',
      officialApiConfigured: isConfigured,
      connectionStatus: isConfigured ? 'CONNECTED' : 'NOT_CONFIGURED',
      notice: isConfigured
        ? 'Official government verification provider gateway connected.'
        : 'Government verification service is not currently connected (no live API credentials configured).',
    });
  });

  // Mount Real Government Data Integration API Router
  app.use('/api/government-verification', governmentVerificationApiRouter);

  // Mount 3-Tier Verification Router
  app.use('/verification', verificationRouter);

  // Global 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'NotFound',
      message: `Cannot ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    });
  });

  return app;
};

// Start server if executed directly via CLI
if (typeof process !== 'undefined' && process.env.START_SERVER === 'true') {
  const port = process.env.PORT || 4000;
  const app = createServer();
  app.listen(port, () => {
    console.log(`[ShramSetu] Government Verification API Server listening on port ${port}`);
    console.log(`[ShramSetu] Prototype Mock Provider Active (Safe simulated responses)`);
  });
}
