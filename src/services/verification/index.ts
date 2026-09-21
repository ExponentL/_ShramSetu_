/**
 * Modular Government Verification Subsystem Index
 *
 * Architecture:
 *   Worker Profile
 *       ↓
 *   Verification Service
 *       ↓
 *   Verification Provider
 *       ↓
 *   Mock Government Provider (Future: Official Authorized Government API)
 */

export * from './types';
export * from './mockGovernmentProvider';
export * from './verificationProvider';
export * from './verificationService';
export * from './verificationRouter';

