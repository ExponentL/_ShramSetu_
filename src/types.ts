export type UserRole = 'customer' | 'worker' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'pa';

export type ServiceCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Carpentry'
  | 'Painting'
  | 'Cleaning'
  | 'Gardening'
  | 'Driving'
  | 'Domestic Help'
  | 'Technician'
  | 'Other';

export type BookingStatus =
  | 'Requested'
  | 'Accepted'
  | 'Worker On The Way'
  | 'Arrived'
  | 'Diagnosing'
  | 'Diagnosis Completed'
  | 'Work Started'
  | 'Work Completed'
  | 'Payment Completed'
  | 'Cancelled'
  | 'Disputed';

export interface DiagnosedProblem {
  id: string;
  trade: ServiceCategory;
  title: string;
  description: string;
  standardTariff: number;
  complexity: 'Standard' | 'Moderate' | 'Major';
  icon?: string;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Resolved'
  | 'Rejected'
  | 'Escalated';

export type ComplaintCategory =
  | 'Worker behavior'
  | 'Poor service'
  | 'Late arrival'
  | 'Payment issue'
  | 'Incorrect charges'
  | 'Safety concern'
  | 'Service quality'
  | 'Customer behavior'
  | 'Unsafe working conditions'
  | 'Incorrect booking information'
  | 'Harassment/abuse'
  | 'Cancellation issue'
  | 'Other';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  zone: string;
  city: string;
}

export interface CooperativeSociety {
  id: string;
  name: string;
  registrationNumber: string;
  federationId: string;
  city: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  totalWorkers: number;
  welfareFundBalance: number;
}

export type VerificationAuthority =
  | 'CLC'
  | 'STATE_LABOUR_DEPARTMENT'
  | 'COOPERATIVE_FEDERATION'
  | 'COOPERATIVE_SOCIETY'
  | 'SKILL_CERTIFICATION_AUTHORITY'
  | 'OTHER_AUTHORIZED_AUTHORITY';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'NOT_VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'REQUIRES_REVIEW'
  | 'NOT_CONFIGURED'
  | 'AUTHENTICATION_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'FAILED';

export type VerificationType =
  | 'WORKER_REGISTRATION'
  | 'COOPERATIVE_MEMBERSHIP'
  | 'SKILL_CERTIFICATION'
  | 'LABOUR_REGISTRATION'
  | 'IDENTITY_VERIFICATION'
  | 'OTHER';

export interface GovernmentVerification {
  id: string;
  workerId: string;
  authority: VerificationAuthority;
  verificationReference: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  verifiedAt: string | null;
  lastCheckedAt: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;

  // Real Government Data Integration Extensions
  provider?: string;
  externalReference?: string;
  verificationStatus?: VerificationStatus;
  verifiedName?: string | null;
  verifiedWorkerCategory?: string | null;
  verifiedRegistrationDate?: string | null;
  rawResponseHash?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
}

export interface VerificationAuditLog {
  id: string;
  timestamp: string;
  formattedDate: string;
  action: string;
  tier: 'GOVERNMENT' | 'COOPERATIVE' | 'SHRAMSETU';
  status: VerificationStatus;
  workerId: string;
  workerName?: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  societyId?: string;
  notes?: string;
}

export interface SafeVerificationResponse {
  status: VerificationStatus;
  authority: string;
  verificationReference: string;
  verificationType: string;
  verifiedAt: string | null;
}

export interface WorkerCertification {
  id: string;
  title: string;
  issuingAuthority: string;
  issueYear: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  certificateUrl?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  photoUrl: string;
  phone: string;
  email: string;
  address: string;
  serviceArea: string;
  cooperativeId: string;
  cooperativeName: string;
  skills: ServiceCategory[];
  primaryTrade: ServiceCategory;
  experienceYears: number;
  certifications: WorkerCertification[];
  languages: string[];
  isVerified: boolean;
  isAvailable: boolean;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  hourlyRate: number;
  baseCharge: number;
  currentWorkload: number; // For fair work distribution (jobs assigned this week)
  currentLocation?: LocationCoordinates;
  joinedDate: string;
  aadharVerified: boolean;
  policeVerificationStatus: 'verified' | 'pending' | 'in_process';
  // Three-tier Verification Layer Extensions
  cooperativeVerificationStatus: VerificationStatus;
  cooperativeVerifiedAt?: string | null;
  cooperativeVerifiedBy?: string | null;
  shramsetuVerificationStatus: VerificationStatus;
  shramsetuVerifiedAt?: string | null;
  shramsetuVerifiedBy?: string | null;
  governmentVerifications?: GovernmentVerification[];
}

export interface ReviewItem {
  id: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  serviceCategory: ServiceCategory;
  cooperativeResponse?: string;
}

export interface PaymentDetails {
  id: string;
  bookingId: string;
  amount: number;
  method: 'UPI' | 'Card' | 'NetBanking' | 'CashAtService';
  status: 'Pending' | 'Completed' | 'Refunded' | 'Failed';
  upiId?: string;
  cardLast4?: string;
  bankName?: string;
  transactionRef: string;
  paidAt: string;
  workerPayout: number; // 88-90% directly to worker
  cooperativeWelfareLevy: number; // 7-10% to insurance/welfare
  administrativeGST: number; // 3-5%
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  workerPhone: string;
  cooperativeId: string;
  cooperativeName: string;
  serviceCategory: ServiceCategory;
  serviceDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  isEmergency: boolean;
  customerLocation: LocationCoordinates;
  workerCurrentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
    speedKmH: number;
  };
  distanceKm: number;
  estimatedArrivalMinutes: number;
  status: BookingStatus;
  estimatedPrice: number;
  baseFeePaid?: number;
  diagnosedProblems?: DiagnosedProblem[];
  finalLaborFee?: number;
  finalBalancePaid?: number;
  finalPrice?: number;
  payment?: PaymentDetails;
  review?: ReviewItem;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  bookingId?: string;
  filedByRole: 'customer' | 'worker';
  complainantId: string;
  complainantName: string;
  complainantPhone: string;
  againstId?: string;
  againstName?: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  submissionDate: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  attachments?: string[];
  cooperativeId: string;
}

export interface WelfareScheme {
  id: string;
  title: string;
  category: 'Insurance' | 'Health' | 'Pension' | 'Education' | 'Tool Subsidy' | 'Safety';
  description: string;
  coverageAmount: string;
  eligibility: string;
  status: 'Active' | 'Under Review' | 'Disbursed';
  enrolledWorkersCount: number;
}

export interface WorkerInsuranceRecord {
  id: string;
  workerId: string;
  policyName: string;
  policyNumber: string;
  coverageType: string;
  validTill: string;
  sumInsured: number;
  claimHistory: {
    date: string;
    amount: number;
    reason: string;
    status: 'Approved' | 'In Process';
  }[];
}

export interface DemandForecast {
  id: string;
  zone: string;
  serviceCategory: ServiceCategory;
  currentWeeklyDemand: number;
  predictedWeeklyDemand: number;
  growthPercentage: number;
  confidenceScore: number;
  recommendedWorkerCount: number;
  currentAvailableWorkers: number;
  status: 'Pending Review' | 'Approved' | 'Applied';
  insightSummary: string;
  reasons: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'booking' | 'gps' | 'payment' | 'complaint' | 'verification' | 'emergency';
  linkBookingId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  societyId?: string;
  societyName?: string;
  city: string;
  avatarUrl?: string;
  memberId?: string;
  trade?: ServiceCategory;
  adminType?: 'cooperative_admin' | 'platform_admin';
}
