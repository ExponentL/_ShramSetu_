/**
 * ShramSetu Worker Verification Architecture & Services
 *
 * Implements a 3-tier decoupled verification system:
 *   1. Government / Official Verification (CLC, State Labour Dept, Skill Authority)
 *   2. Cooperative Verification (Co-op Society & Federation KYC)
 *   3. ShramSetu Platform Verification (Safety protocol & platform onboarding)
 *
 * CLC COMPLIANCE NOTICE:
 *   The CLC adapter below is an architectural prototype stub.
 *   It does NOT scrape clc.gov.in, does NOT claim a live CLC production API,
 *   and does NOT fabricate real citizen credentials. It demonstrates the pluggable
 *   adapter pattern ready to connect to an authorized government gateway when officially granted.
 */

import {
  GovernmentVerification,
  VerificationAuthority,
  VerificationStatus,
  VerificationType,
  WorkerProfile,
} from '../types';

export interface VerificationRequest {
  workerId: string;
  referenceNumber: string;
  verificationType: VerificationType;
}

export interface VerificationResult {
  authority: VerificationAuthority;
  status: VerificationStatus;
  verifiedAt: string | null;
  verificationReference: string;
  source: string;
  notes: string;
  isDemo: boolean;
}

export interface IVerificationAuthorityAdapter {
  authority: VerificationAuthority;
  displayName: string;
  verify(request: VerificationRequest): Promise<VerificationResult>;
  checkHealth(): Promise<{ isOnline: boolean; gatewayType: 'PROTOTYPE_SIMULATED' | 'OFFICIAL_GATEWAY' }>;
}

/**
 * Adapter 1: Chief Labour Commissioner (Central) / CLC Adapter
 * Prototype simulated verification adapter.
 */
export class CLCVerificationAdapter implements IVerificationAuthorityAdapter {
  public authority: VerificationAuthority = 'CLC';
  public displayName = 'Chief Labour Commissioner (Central) / CLC';

  async verify(request: VerificationRequest): Promise<VerificationResult> {
    const maskedRef = maskIdentityReference(request.referenceNumber);
    return {
      authority: this.authority,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      verificationReference: maskedRef,
      source: 'DEMO_PROTOTYPE_GATEWAY_CLC',
      notes: '[DEMO/PROTOTYPE DATA] Simulated verification via CLC worker registry adapter. Authorized API endpoint ready for deployment.',
      isDemo: true,
    };
  }

  async checkHealth() {
    return {
      isOnline: true,
      gatewayType: 'PROTOTYPE_SIMULATED' as const,
    };
  }
}

/**
 * Adapter 2: State Labour Department Adapter
 */
export class StateLabourDepartmentAdapter implements IVerificationAuthorityAdapter {
  public authority: VerificationAuthority = 'STATE_LABOUR_DEPARTMENT';
  public displayName = 'State Labour Department Directorate';

  async verify(request: VerificationRequest): Promise<VerificationResult> {
    const maskedRef = maskIdentityReference(request.referenceNumber);
    return {
      authority: this.authority,
      status: 'PENDING',
      verifiedAt: null,
      verificationReference: maskedRef,
      source: 'DEMO_PROTOTYPE_GATEWAY_STATE',
      notes: '[DEMO/PROTOTYPE DATA] State labour registry queue pending physical trade verification review.',
      isDemo: true,
    };
  }

  async checkHealth() {
    return {
      isOnline: true,
      gatewayType: 'PROTOTYPE_SIMULATED' as const,
    };
  }
}

/**
 * Adapter 3: National Vocational & Skill Certification Authority Adapter
 */
export class SkillCertificationAuthorityAdapter implements IVerificationAuthorityAdapter {
  public authority: VerificationAuthority = 'SKILL_CERTIFICATION_AUTHORITY';
  public displayName = 'National Skill Development / ITI Certification Board';

  async verify(request: VerificationRequest): Promise<VerificationResult> {
    const maskedRef = maskIdentityReference(request.referenceNumber);
    return {
      authority: this.authority,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      verificationReference: maskedRef,
      source: 'DEMO_PROTOTYPE_GATEWAY_SKILL',
      notes: '[DEMO/PROTOTYPE DATA] Verified against vocational trade testing database (NCVT Level 4).',
      isDemo: true,
    };
  }

  async checkHealth() {
    return {
      isOnline: true,
      gatewayType: 'PROTOTYPE_SIMULATED' as const,
    };
  }
}

/**
 * Authority Adapter Factory / Registry
 */
export const getVerificationAdapter = (authority: VerificationAuthority): IVerificationAuthorityAdapter => {
  switch (authority) {
    case 'CLC':
      return new CLCVerificationAdapter();
    case 'STATE_LABOUR_DEPARTMENT':
      return new StateLabourDepartmentAdapter();
    case 'SKILL_CERTIFICATION_AUTHORITY':
    case 'COOPERATIVE_FEDERATION':
    case 'COOPERATIVE_SOCIETY':
    case 'OTHER_AUTHORIZED_AUTHORITY':
    default:
      return new SkillCertificationAuthorityAdapter();
  }
};

/**
 * Utility: Mask sensitive identity or government references so raw PII is never exposed
 */
export const maskIdentityReference = (ref: string): string => {
  if (!ref) return 'DEMO-REF-***';
  if (ref.includes('***')) return ref; // Already masked
  const parts = ref.split('-');
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    parts[parts.length - 1] = `***${last.slice(-3)}`;
    return parts.join('-');
  }
  return `***${ref.slice(-4)}`;
};

export interface WorkerThreeTierSummary {
  workerId: string;
  workerName: string;
  overallStatus: 'TIER_3_COMPLETE' | 'TIER_2_COMPLETE' | 'IN_PROGRESS';
  layer1Government: {
    status: VerificationStatus;
    authority: VerificationAuthority;
    authorityName: string;
    reference: string;
    verifiedAt: string | null;
    isDemo: boolean;
    notes: string;
  } | null;
  layer2Cooperative: {
    status: VerificationStatus;
    societyName: string;
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
  layer3ShramSetu: {
    status: VerificationStatus;
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
}

/**
 * Aggregate the 3 distinct verification layers for a worker
 */
export const getWorkerVerificationSummary = (
  worker: WorkerProfile,
  allGovernmentVerifications: GovernmentVerification[]
): WorkerThreeTierSummary => {
  const govVerif = allGovernmentVerifications.find((gv) => gv.workerId === worker.id) || null;

  const authorityNames: Record<VerificationAuthority, string> = {
    CLC: 'Chief Labour Commissioner (Central)',
    STATE_LABOUR_DEPARTMENT: 'State Labour Department',
    COOPERATIVE_FEDERATION: 'National Cooperative Federation',
    COOPERATIVE_SOCIETY: 'Primary Cooperative Society',
    SKILL_CERTIFICATION_AUTHORITY: 'National Vocational Council (NCVT)',
    OTHER_AUTHORIZED_AUTHORITY: 'Authorized Verification Authority',
  };

  const govStatus: VerificationStatus = govVerif ? govVerif.status : 'NOT_VERIFIED';
  const coopStatus = worker.cooperativeVerificationStatus || 'PENDING';
  const platformStatus = worker.shramsetuVerificationStatus || 'PENDING';

  let overallStatus: 'TIER_3_COMPLETE' | 'TIER_2_COMPLETE' | 'IN_PROGRESS' = 'IN_PROGRESS';
  if (govStatus === 'VERIFIED' && coopStatus === 'VERIFIED' && platformStatus === 'VERIFIED') {
    overallStatus = 'TIER_3_COMPLETE';
  } else if (coopStatus === 'VERIFIED' && platformStatus === 'VERIFIED') {
    overallStatus = 'TIER_2_COMPLETE';
  }

  return {
    workerId: worker.id,
    workerName: worker.name,
    overallStatus,
    layer1Government: govVerif
      ? {
          status: govVerif.status,
          authority: govVerif.authority,
          authorityName: authorityNames[govVerif.authority] || govVerif.authority,
          reference: maskIdentityReference(govVerif.verificationReference),
          verifiedAt: govVerif.verifiedAt,
          isDemo: govVerif.source.includes('DEMO'),
          notes: govVerif.notes,
        }
      : null,
    layer2Cooperative: {
      status: coopStatus,
      societyName: worker.cooperativeName,
      verifiedAt: worker.cooperativeVerifiedAt || null,
      verifiedBy: worker.cooperativeVerifiedBy || null,
    },
    layer3ShramSetu: {
      status: platformStatus,
      verifiedAt: worker.shramsetuVerifiedAt || null,
      verifiedBy: worker.shramsetuVerifiedBy || null,
    },
  };
};

export {
  VerificationService,
  defaultVerificationService,
  VerificationServiceError,
  formatAuditDate,
} from './verification/verificationService';
export {
  VerificationProvider,
  defaultVerificationProvider,
} from './verification/verificationProvider';
export {
  MockGovernmentProvider,
  OfficialAuthorizedGovernmentProvider,
} from './verification/mockGovernmentProvider';
export * from './verification/types';

