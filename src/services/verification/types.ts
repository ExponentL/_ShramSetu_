/**
 * ShramSetu Verification Architecture Types
 *
 * Enforces the 3 distinct, independent verification layers:
 *   1. Government / Official Verification
 *   2. Cooperative Verification
 *   3. ShramSetu Platform Verification
 */

import { VerificationStatus, VerificationType, VerificationAuthority } from '../../types';

export type VerificationSimulationState = VerificationStatus;

export type ServiceUserRole = 'customer' | 'worker' | 'admin';

export type AdminPrivilegeType = 'cooperative_admin' | 'platform_admin';

export interface AuthContext {
  userId: string;
  role: ServiceUserRole;
  name?: string;
  societyId?: string;
  societyName?: string;
  adminType?: AdminPrivilegeType;
}

/**
 * Safe public-facing verification response for Government Tier.
 * Strictly guarantees NO EXPOSURE of Aadhaar, raw ID numbers, passwords, or private docs.
 */
export interface SafeVerificationResponse {
  status: VerificationSimulationState;
  authority: string;
  verificationReference: string;
  verificationType: string;
  verifiedAt: string | null;
}

/**
 * Cooperative Verification Response
 * Represents Layer 2: Cooperative membership & trade inspection audit.
 */
export interface CooperativeVerificationResponse {
  status: VerificationSimulationState;
  tier: 'COOPERATIVE';
  workerId: string;
  cooperativeId: string;
  cooperativeName: string;
  cooperativeVerificationStatus: VerificationSimulationState;
  cooperativeVerifiedAt: string | null;
  cooperativeVerifiedBy: string | null;
  auditLog?: {
    date: string;
    action: string;
  };
}

/**
 * ShramSetu Platform Verification Response
 * Represents Layer 3: Platform safety handshake, KYC photo match & protocol compliance.
 */
export interface ShramSetuVerificationResponse {
  status: VerificationSimulationState;
  tier: 'SHRAMSETU';
  workerId: string;
  shramsetuVerificationStatus: VerificationSimulationState;
  shramsetuVerifiedAt: string | null;
  shramsetuVerifiedBy: string | null;
  auditLog?: {
    date: string;
    action: string;
  };
}

export interface VerificationAuditEntry {
  id: string;
  timestamp: string;
  formattedDate: string; // e.g. "20 Sep 2026"
  action: string; // e.g. "Cooperative Verification → VERIFIED"
  tier: 'GOVERNMENT' | 'COOPERATIVE' | 'SHRAMSETU';
  status: VerificationSimulationState;
  workerId: string;
  workerName?: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  societyId?: string;
  notes?: string;
}

export interface VerificationRequestPayload {
  workerId: string;
  tradeCategory?: string;
  referenceHint?: string;
}

export interface AdminVerificationActionPayload {
  notes?: string;
  authority?: string;
  verificationType?: string;
}

export interface ServiceErrorResponse {
  error: string;
  message: string;
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_ERROR';
  statusCode: number;
}

/**
 * Verification Provider Interface (Legacy / Mock compatibility)
 */
export interface IGovernmentVerificationProvider {
  readonly providerId: string;
  readonly providerName: string;
  readonly isPrototype: boolean;

  requestVerification(
    workerId: string,
    payload?: VerificationRequestPayload
  ): Promise<SafeVerificationResponse>;

  fetchWorkerVerification(workerId: string): Promise<SafeVerificationResponse | null>;

  overrideStatus(
    workerId: string,
    status: VerificationSimulationState,
    adminNotes?: string
  ): Promise<SafeVerificationResponse>;
}

/**
 * ============================================================================
 * REAL GOVERNMENT DATA INTEGRATION ARCHITECTURE
 * ============================================================================
 * Abstraction layer for official government verification providers (CLC, e-Shram).
 * Requires authorized configuration via environment variables.
 * Never stores or exposes Aadhaar or sensitive PII.
 */

export type RealGovernmentProviderType =
  | 'CLC'
  | 'ESHRAM'
  | 'E_SHRAM'
  | 'STATE_LABOUR'
  | 'OTHER_AUTHORIZED'
  | 'NONE';

export type GovernmentAuthenticationType =
  | 'API_KEY'
  | 'OAUTH2'
  | 'MUTUAL_TLS'
  | 'HMAC'
  | 'BEARER_TOKEN'
  | 'NONE';

/**
 * GovernmentProviderConfig
 * Standardized configuration entity for each official government integration provider.
 * Providers remain disabled until legitimate API credentials and configuration are supplied.
 */
export interface GovernmentProviderConfig {
  id: string;
  name: string;
  providerCode: string; // 'CLC', 'ESHRAM', 'STATE_LABOUR', 'OTHER_AUTHORIZED'
  baseUrl: string;
  enabled: boolean;
  authenticationType: GovernmentAuthenticationType | string;
  createdAt: string;
  updatedAt: string;
  // Optional credential references loaded from secure env
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  timeoutMs?: number;
}

export type GovernmentVerificationState =
  | 'VERIFIED'
  | 'NOT_VERIFIED'
  | 'NOT_CONFIGURED'
  | 'AUTHENTICATION_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'PENDING'
  | 'FAILED'
  | 'REJECTED';

/**
 * Normalized Government Verification Response
 * Consistent contract across all official providers.
 */
export interface NormalizedGovernmentResponse {
  status: GovernmentVerificationState;
  provider: string;
  externalReference: string;
  workerName?: string;
  workerCategory?: string;
  registrationDate?: string;
  lastCheckedAt: string;
  // Additional diagnostic and compatibility metadata
  verificationReference?: string; // alias for externalReference
  verifiedRegistrationDate?: string; // alias for registrationDate
  rawResponseHash?: string;
  errorCode?: string;
  errorMessage?: string;
  message?: string;
}

// Alias for backwards compatibility with existing codebase
export type GovernmentVerificationResult = NormalizedGovernmentResponse;

export interface GovernmentWorkerDetails {
  workerName: string;
  workerCategory: string;
  registrationDate?: string;
  verificationReference: string;
  authority: string;
  lastCheckedAt: string;
}

export interface GovernmentVerificationVerifyRequest {
  workerId: string;
  governmentReference: string;
  provider?: string;
  forceRecheck?: boolean;
}

/**
 * GovernmentVerificationProvider
 * Every provider must implement verifyWorker(), getWorkerDetails(), and checkStatus()
 */
export interface GovernmentVerificationProvider {
  readonly providerName: string;
  readonly providerCode: string;
  getConfig(): GovernmentProviderConfig;
  isConfigured(): boolean;
  isEnabled(): boolean;
  verifyWorker(
    workerId: string,
    governmentReference: string,
    context?: AuthContext
  ): Promise<NormalizedGovernmentResponse>;
  getWorkerDetails(
    workerId: string,
    governmentReference: string
  ): Promise<NormalizedGovernmentResponse | GovernmentWorkerDetails | null>;
  checkStatus(
    workerId: string,
    externalReference: string
  ): Promise<NormalizedGovernmentResponse>;
}


