import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  DemandForecast,
  DiagnosedProblem,
  LanguageCode,
  NotificationItem,
  PaymentDetails,
  ReviewItem,
  ServiceCategory,
  UserRole,
  WelfareScheme,
  WorkerProfile,
  AuditLog,
  AuthUser,
  GovernmentVerification,
  SafeVerificationResponse,
  VerificationAuditLog,
} from '../types';
import {
  defaultVerificationService,
  formatAuditDate,
} from '../services/verification/verificationService';
import {
  CooperativeVerificationResponse,
  ShramSetuVerificationResponse,
  VerificationAuditEntry,
  GovernmentVerificationResult,
} from '../services/verification/types';
import { defaultGovernmentVerificationService } from '../services/verification/governmentVerificationService';
import {
  INITIAL_BOOKINGS,
  INITIAL_COOPERATIVES,
  INITIAL_DEMAND_FORECASTS,
  INITIAL_REVIEWS,
  INITIAL_WELFARE_SCHEMES,
  INITIAL_WORKERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_GOVERNMENT_VERIFICATIONS,
} from '../data/mockData';
import { translations } from '../i18n/translations';

interface AppContextType {
  // Role & i18n
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof translations['en'];

  // Location & Filters
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: ServiceCategory | 'ALL';
  setSelectedCategory: (cat: ServiceCategory | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  workers: WorkerProfile[];
  governmentVerifications: GovernmentVerification[];
  bookings: Booking[];
  reviews: ReviewItem[];
  complaints: Complaint[];
  welfareSchemes: WelfareScheme[];
  demandForecasts: DemandForecast[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];

  // Actions - Booking & GPS
  createBooking: (newBooking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus, notes?: string) => void;
  startWorkerTrip: (bookingId: string) => void;
  updateLiveLocation: (bookingId: string, lat: number, lng: number, speedKmH: number) => void;
  completePayment: (bookingId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking', upiId?: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string) => void;

  // Actions - Worker Management & Verification (3-Tier Decoupled)
  verifyWorker: (workerId: string, approve: boolean) => void;
  getWorkerVerifications: (workerId: string) => GovernmentVerification[];
  updateGovernmentVerification: (id: string, updates: Partial<GovernmentVerification>) => void;
  requestGovernmentVerification: (workerId: string) => Promise<SafeVerificationResponse>;
  verifyGovernmentOfficial: (
    workerId: string,
    governmentReference: string,
    provider?: string,
    forceRecheck?: boolean
  ) => Promise<GovernmentVerificationResult>;
  adminVerifyGovernment: (workerId: string, notes?: string) => Promise<SafeVerificationResponse>;
  adminRejectGovernment: (workerId: string, notes?: string) => Promise<SafeVerificationResponse>;
  verifyCooperativeWorker: (workerId: string, notes?: string) => Promise<CooperativeVerificationResponse>;
  rejectCooperativeWorker: (workerId: string, notes?: string) => Promise<CooperativeVerificationResponse>;
  getCooperativeVerification: (workerId: string) => Promise<CooperativeVerificationResponse>;
  verifyPlatformWorker: (workerId: string, notes?: string) => Promise<ShramSetuVerificationResponse>;
  rejectPlatformWorker: (workerId: string, notes?: string) => Promise<ShramSetuVerificationResponse>;
  getPlatformVerification: (workerId: string) => Promise<ShramSetuVerificationResponse>;
  getVerificationAuditLogs: (workerId?: string) => VerificationAuditEntry[];
  registerWorker: (worker: Omit<WorkerProfile, 'id' | 'isVerified' | 'rating' | 'reviewCount' | 'completedJobsCount' | 'joinedDate'>) => void;
  toggleWorkerAvailability: (workerId: string) => void;
  addWorkerSkill: (workerId: string, skill: ServiceCategory) => void;

  // Actions - Complaints
  submitComplaint: (complaint: {
    bookingId?: string;
    filedByRole: 'customer' | 'worker';
    category: ComplaintCategory;
    description: string;
    attachments?: string[];
  }) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, resolutionNotes?: string) => void;

  // Actions - AI Forecasts
  approveForecast: (forecastId: string) => void;

  // Actions - Welfare
  applyWelfareScheme: (schemeId: string, workerId: string) => void;

  // Modals & Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  registerUser: (user: Omit<AuthUser, 'id'>) => AuthUser;
  selectedWorkerForProfile: WorkerProfile | null;
  setSelectedWorkerForProfile: (worker: WorkerProfile | null) => void;
  bookingTargetWorker: WorkerProfile | null;
  setBookingTargetWorker: (worker: WorkerProfile | null) => void;
  activeTrackingBookingId: string | null;
  setActiveTrackingBookingId: (id: string | null) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isComplaintModalOpen: boolean;
  setIsComplaintModalOpen: (open: boolean) => void;
  reviewTargetBooking: Booking | null;
  setReviewTargetBooking: (booking: Booking | null) => void;
  invoiceTargetBooking: Booking | null;
  setInvoiceTargetBooking: (booking: Booking | null) => void;
  isDiagnosisModalOpen: boolean;
  setIsDiagnosisModalOpen: (open: boolean) => void;
  diagnosisTargetBooking: Booking | null;
  setDiagnosisTargetBooking: (booking: Booking | null) => void;
  finalizeDiagnosisAndPayment: (
    bookingId: string,
    selectedProblems: DiagnosedProblem[],
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'CashAtService',
    upiId?: string
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null' || saved.trim() === '') {
      return fallback;
    }
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? (parsed as T) : fallback;
  } catch (err) {
    console.warn(`[ShramSetu] Failed to parse localStorage key "${key}", falling back to default:`, err);
    return fallback;
  }
}

function safeSetStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[ShramSetu] Failed to set localStorage key "${key}":`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state (null on fresh start to show login/register screen)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return safeGetStorage<AuthUser | null>('shramsetu_current_user', null);
  });

  const [currentTab, setCurrentTab] = useState<string>('home');

  // Persistent local states with fallbacks
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'customer';
  });
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [selectedCity, setSelectedCity] = useState<string>('All Locations');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('coop_workers');
      if (!saved || saved === 'undefined' || saved === 'null') return INITIAL_WORKERS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_WORKERS;
      const existingIds = new Set(parsed.map((w) => w?.id).filter(Boolean));
      const missingInitial = INITIAL_WORKERS.filter((iw) => !existingIds.has(iw.id));
      const fullList = [...missingInitial, ...parsed];
      return fullList.map((w) => {
        const initial = INITIAL_WORKERS.find((iw) => iw.id === w?.id);
        return {
          ...w,
          skills: Array.isArray(w?.skills) ? w.skills : (initial?.skills || []),
          certifications: Array.isArray(w?.certifications) ? w.certifications : (initial?.certifications || []),
          cooperativeVerificationStatus: w?.cooperativeVerificationStatus || initial?.cooperativeVerificationStatus || 'PENDING',
          cooperativeVerifiedAt: w?.cooperativeVerifiedAt !== undefined ? w.cooperativeVerifiedAt : initial?.cooperativeVerifiedAt,
          cooperativeVerifiedBy: w?.cooperativeVerifiedBy !== undefined ? w.cooperativeVerifiedBy : initial?.cooperativeVerifiedBy,
          shramsetuVerificationStatus: w?.shramsetuVerificationStatus || initial?.shramsetuVerificationStatus || 'PENDING',
          shramsetuVerifiedAt: w?.shramsetuVerifiedAt !== undefined ? w.shramsetuVerifiedAt : initial?.shramsetuVerifiedAt,
          shramsetuVerifiedBy: w?.shramsetuVerifiedBy !== undefined ? w.shramsetuVerifiedBy : initial?.shramsetuVerifiedBy,
        };
      });
    } catch (err) {
      console.warn('[ShramSetu] Failed to parse coop_workers, resetting to INITIAL_WORKERS:', err);
      return INITIAL_WORKERS;
    }
  });

  const [governmentVerifications, setGovernmentVerifications] = useState<GovernmentVerification[]>(() => {
    try {
      const saved = localStorage.getItem('coop_gov_verifications');
      if (!saved || saved === 'undefined' || saved === 'null') return INITIAL_GOVERNMENT_VERIFICATIONS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_GOVERNMENT_VERIFICATIONS;
      const existingIds = new Set(parsed.map((gv) => gv?.id).filter(Boolean));
      const missingInitial = INITIAL_GOVERNMENT_VERIFICATIONS.filter((igv) => !existingIds.has(igv.id));
      return [...missingInitial, ...parsed];
    } catch (err) {
      console.warn('[ShramSetu] Failed to parse coop_gov_verifications, resetting to default:', err);
      return INITIAL_GOVERNMENT_VERIFICATIONS;
    }
  });

  useEffect(() => {
    safeSetStorage('coop_gov_verifications', governmentVerifications);
  }, [governmentVerifications]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const loaded = safeGetStorage<Booking[]>('coop_bookings', INITIAL_BOOKINGS);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const loaded = safeGetStorage<ReviewItem[]>('coop_reviews', INITIAL_REVIEWS);
    return Array.isArray(loaded) ? loaded : INITIAL_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const loaded = safeGetStorage<Complaint[]>('coop_complaints', INITIAL_COMPLAINTS);
    return Array.isArray(loaded) ? loaded : INITIAL_COMPLAINTS;
  });

  const [welfareSchemes, setWelfareSchemes] = useState<WelfareScheme[]>(() => {
    const loaded = safeGetStorage<WelfareScheme[]>('coop_welfare', INITIAL_WELFARE_SCHEMES);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : INITIAL_WELFARE_SCHEMES;
  });

  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>(() => {
    const loaded = safeGetStorage<DemandForecast[]>('coop_forecasts', INITIAL_DEMAND_FORECASTS);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : INITIAL_DEMAND_FORECASTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<WorkerProfile | null>(null);
  const [bookingTargetWorker, setBookingTargetWorker] = useState<WorkerProfile | null>(null);
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState<string | null>('bk-901'); // Auto-loads active tracking demo!
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState<boolean>(false);
  const [reviewTargetBooking, setReviewTargetBooking] = useState<Booking | null>(null);
  const [invoiceTargetBooking, setInvoiceTargetBooking] = useState<Booking | null>(null);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState<boolean>(false);
  const [diagnosisTargetBooking, setDiagnosisTargetBooking] = useState<Booking | null>(null);

  // Sync to local storage safely
  useEffect(() => {
    safeSetStorage('coop_workers', workers);
  }, [workers]);

  useEffect(() => {
    safeSetStorage('coop_bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    safeSetStorage('coop_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    safeSetStorage('coop_complaints', complaints);
  }, [complaints]);

  // Current translation strings
  const t = translations[language];

  // Helper for audit logs
  const logAudit = (action: string, targetResource: string, status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: currentUser?.name || (currentRole === 'worker' ? 'Cooperative Worker' : 'Citizen Customer'),
      actorRole: currentRole,
      action,
      targetResource,
      ipAddress: '103.24.188.10',
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Helper for notifications
  const pushNotification = (title: string, message: string, type: NotificationItem['type'], role: UserRole, linkBookingId?: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: `user-${role}`,
      role,
      title,
      message,
      timestamp: 'Just now',
      isRead: false,
      type,
      linkBookingId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 1. Create Booking
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking => {
    const newId = `bk-${Date.now()}`;
    const bookingNum = `CSM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullBooking: Booking = {
      ...bookingData,
      id: newId,
      bookingNumber: bookingNum,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [fullBooking, ...prev]);

    // Update worker's current workload (Fair Work Allocation)
    setWorkers((prev) =>
      prev.map((w) => (w.id === bookingData.workerId ? { ...w, currentWorkload: w.currentWorkload + 1 } : w))
    );

    logAudit('CREATE_BOOKING', `Booking: ${bookingNum}`);
    pushNotification('Booking Confirmed', `Booking ${bookingNum} confirmed for ${bookingData.serviceCategory}.`, 'booking', 'customer', newId);
    pushNotification('New Job Assigned', `You have received a new booking ${bookingNum} (${bookingData.serviceCategory}).`, 'booking', 'worker', newId);

    return fullBooking;
  };

  // 2. Update Booking Status
  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus, notes?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        const updated: Booking = {
          ...b,
          status: newStatus,
          notes: notes || b.notes,
        };

        if (newStatus === 'Work Completed') {
          updated.completedAt = new Date().toISOString();
          updated.finalPrice = b.estimatedPrice;
        }

        return updated;
      })
    );

    logAudit(`UPDATE_BOOKING_STATUS_${newStatus}`, `Booking: ${bookingId}`);

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      if (newStatus === 'Worker On The Way') {
        pushNotification('Worker On The Way', `${booking.workerName} is traveling to your location. Live GPS tracking active.`, 'gps', 'customer', bookingId);
      } else if (newStatus === 'Arrived') {
        pushNotification('Worker Arrived', `${booking.workerName} has arrived at your address. On-site diagnosis starting.`, 'booking', 'customer', bookingId);
        pushNotification('Arrival Confirmed', `You have arrived at customer premises for booking ${booking.bookingNumber}. Please verify PIN or start diagnosis.`, 'booking', 'worker', bookingId);
      } else if (newStatus === 'Diagnosing') {
        pushNotification('Diagnosis in Progress', `${booking.workerName} is inspecting your issue on-site. They will explain the diagnosis to you shortly.`, 'booking', 'customer', bookingId);
      } else if (newStatus === 'Diagnosis Completed') {
        pushNotification('Diagnosis Reported', `${booking.workerName} diagnosed the issue. Please complete the MCQ problem selection on the portal to finalize the bill.`, 'booking', 'customer', bookingId);
      } else if (newStatus === 'Work Completed') {
        pushNotification('Service Completed', `Work completed for ${booking.bookingNumber}. Please complete payment and review.`, 'booking', 'customer', bookingId);
      }
    }
  };

  // 3. Start Trip with Live GPS
  const startWorkerTrip = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const worker = workers.find((w) => w.id === booking.workerId);
    const startLat = worker?.currentLocation?.lat || 28.7041;
    const startLng = worker?.currentLocation?.lng || 77.1025;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Worker On The Way',
              workerCurrentLocation: {
                lat: startLat,
                lng: startLng,
                updatedAt: 'Live (GPS Tracking On)',
                speedKmH: 26,
              },
            }
          : b
      )
    );

    setActiveTrackingBookingId(bookingId);
    logAudit('START_LIVE_GPS_TRIP', `Booking: ${bookingId}`);
    pushNotification('Trip Started & GPS Live', `Trip started for Booking ${booking.bookingNumber}. Customer can now track your live route.`, 'gps', 'worker', bookingId);
    pushNotification('Worker Dispatched', `${booking.workerName} started traveling. Approximate arrival: ${booking.estimatedArrivalMinutes} mins.`, 'gps', 'customer', bookingId);
  };

  // 4. Update Live GPS Location
  const updateLiveLocation = (bookingId: string, lat: number, lng: number, speedKmH: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          workerCurrentLocation: {
            lat,
            lng,
            updatedAt: 'Live',
            speedKmH,
          },
        };
      })
    );
  };

  // 5. Complete Digital Payment (UPI / Card / NetBanking)
  const completePayment = (bookingId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking', upiId?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const total = booking.finalPrice || booking.estimatedPrice;
    const workerPayout = Math.round(total * 0.9); // 90% direct to worker
    const welfareLevy = Math.round(total * 0.08); // 8% to co-op insurance and welfare
    const gst = total - workerPayout - welfareLevy; // 2% admin

    const paymentRecord: PaymentDetails = {
      id: `pay-${Date.now()}`,
      bookingId,
      amount: total,
      method: paymentMethod,
      status: 'Completed',
      upiId: upiId || 'customer@upi',
      transactionRef: `NPCI/${Date.now().toString().slice(-8)}`,
      paidAt: new Date().toISOString(),
      workerPayout,
      cooperativeWelfareLevy: welfareLevy,
      administrativeGST: gst,
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Payment Completed',
              payment: paymentRecord,
            }
          : b
      )
    );

    // Update worker completed jobs & earnings
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === booking.workerId
          ? {
              ...w,
              completedJobsCount: w.completedJobsCount + 1,
            }
          : w
      )
    );

    logAudit('PAYMENT_SETTLED', `Amount: ₹${total}, Booking: ${booking.bookingNumber}`);
    pushNotification('Payment Settled', `Payment of ₹${total} received via ${paymentMethod}. Invoice generated.`, 'payment', 'customer', bookingId);
    pushNotification('Earnings Transferred', `₹${workerPayout} direct payout credited to your cooperative linked account.`, 'payment', 'worker', bookingId);
  };

  // 5.5 Finalize Diagnosis & Settle Balance Payment
  const finalizeDiagnosisAndPayment = (
    bookingId: string,
    selectedProblems: DiagnosedProblem[],
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'CashAtService',
    upiId?: string
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const laborSubtotal = selectedProblems.reduce((sum, p) => sum + p.standardTariff, 0);
    const welfareFee = Math.round(laborSubtotal * 0.08); // 8% cooperative welfare pool
    const gst = Math.round(laborSubtotal * 0.02); // 2% statutory/platform GST
    const fullJobTotal = laborSubtotal + welfareFee + gst;

    const baseFee = booking.baseFeePaid || 249;
    const balancePayable = Math.max(0, fullJobTotal - baseFee);
    const workerPayout = Math.round(laborSubtotal * 0.9);

    const paymentRecord: PaymentDetails = {
      id: `pay-settle-${Date.now()}`,
      bookingId,
      amount: balancePayable,
      method: paymentMethod,
      status: 'Completed',
      upiId: upiId || (paymentMethod === 'UPI' ? 'customer.verified@upi' : undefined),
      transactionRef: `COOP-SETTLE-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: new Date().toISOString(),
      workerPayout,
      cooperativeWelfareLevy: welfareFee,
      administrativeGST: gst,
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Work Started',
              diagnosedProblems: selectedProblems,
              finalLaborFee: laborSubtotal,
              finalBalancePaid: balancePayable,
              finalPrice: fullJobTotal,
              payment: paymentRecord,
              notes: `Confirmed Issue: ${selectedProblems.map((p) => p.title).join('; ')}. Balance ₹${balancePayable} paid via ${paymentMethod}.`,
            }
          : b
      )
    );

    setIsDiagnosisModalOpen(false);
    setDiagnosisTargetBooking(null);

    logAudit('DIAGNOSIS_FINALIZED_PAYMENT', `Booking: ${booking.bookingNumber}, Labor: ₹${laborSubtotal}, Net Paid: ₹${balancePayable}`);
    pushNotification(
      'Diagnosis Confirmed & Bill Finalized',
      `Diagnosed issue confirmed. Net balance of ₹${balancePayable} paid. Craftsman ${booking.workerName} is executing the repair.`,
      'payment',
      'customer',
      bookingId
    );
    pushNotification(
      'Customer Confirmed Fault & Paid Balance',
      `Customer selected diagnosed fault (${selectedProblems.length} items) and cleared ₹${balancePayable}. Please proceed with work.`,
      'payment',
      'worker',
      bookingId
    );
  };

  // 6. Submit Review & Rating
  const submitReview = (bookingId: string, rating: number, comment: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      bookingId,
      workerId: booking.workerId,
      workerName: booking.workerName,
      customerId: booking.customerId,
      customerName: booking.customerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      serviceCategory: booking.serviceCategory,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate worker rating
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== booking.workerId) return w;
        const newTotalReviews = w.reviewCount + 1;
        const newRating = Number(((w.rating * w.reviewCount + rating) / newTotalReviews).toFixed(1));
        return {
          ...w,
          rating: newRating,
          reviewCount: newTotalReviews,
        };
      })
    );

    // Update booking review
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, review: newRev } : b))
    );

    logAudit('SUBMIT_REVIEW', `Worker: ${booking.workerName}, Rating: ${rating}★`);
    pushNotification('New Review Received', `${booking.customerName} gave you ${rating}★: "${comment.slice(0, 50)}..."`, 'booking', 'worker', bookingId);
  };

  // 7. Verify Worker (3-Tier Aware)
  const verifyWorker = (workerId: string, approve: boolean) => {
    const timestamp = new Date().toISOString();
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              isVerified: approve,
              policeVerificationStatus: approve ? 'verified' : 'pending',
              cooperativeVerificationStatus: approve ? 'VERIFIED' : 'NOT_VERIFIED',
              cooperativeVerifiedAt: approve ? timestamp : null,
              cooperativeVerifiedBy: approve ? 'Cooperative Verification Board' : null,
              shramsetuVerificationStatus: approve ? 'VERIFIED' : 'PENDING',
              shramsetuVerifiedAt: approve ? timestamp : null,
              shramsetuVerifiedBy: approve ? 'ShramSetu Trust & Safety Automated Engine' : null,
              certifications: w.certifications.map((c) => ({
                ...c,
                verificationStatus: approve ? 'verified' : 'rejected',
              })),
            }
          : w
      )
    );

    const worker = workers.find((w) => w.id === workerId);
    logAudit(approve ? 'APPROVE_WORKER_VERIFICATION' : 'REJECT_WORKER_VERIFICATION', `Worker: ${worker?.name || workerId}`);
    pushNotification(
      approve ? 'Cooperative Verification Approved' : 'Verification Update',
      approve
        ? 'Your worker credentials have been verified by the Cooperative Board. You are now publicly bookable.'
        : 'Additional documentation required for your cooperative trade verification.',
      'verification',
      'worker'
    );
  };

  const getWorkerVerifications = (workerId: string): GovernmentVerification[] => {
    return governmentVerifications.filter((gv) => gv.workerId === workerId);
  };

  const updateGovernmentVerification = (id: string, updates: Partial<GovernmentVerification>) => {
    setGovernmentVerifications((prev) =>
      prev.map((gv) => (gv.id === id ? { ...gv, ...updates, updatedAt: new Date().toISOString() } : gv))
    );
  };

  const requestGovernmentVerification = async (workerId: string): Promise<SafeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || workerId,
      role: (currentUser?.role || currentRole || 'worker') as 'worker' | 'admin',
    };
    const response = await defaultVerificationService.requestVerification(auth, { workerId });

    setGovernmentVerifications((prev) => {
      const idx = prev.findIndex((gv) => gv.workerId === workerId);
      const updatedRecord: GovernmentVerification = {
        id: idx >= 0 ? prev[idx].id : `gv-${workerId}`,
        workerId,
        authority: (response.authority as any) || 'CLC',
        verificationReference: response.verificationReference,
        verificationType: (response.verificationType as any) || 'WORKER_REGISTRATION',
        status: response.status,
        verifiedAt: response.verifiedAt,
        lastCheckedAt: new Date().toISOString(),
        source: 'DEMO_PROTOTYPE_GATEWAY_CLC',
        notes: '[DEMO/PROTOTYPE DATA] Simulated verification request processed by MockGovernmentProvider.',
        createdAt: idx >= 0 ? prev[idx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });

    logAudit('REQUEST_GOVERNMENT_VERIFICATION', `Worker: ${workerId}, Status: ${response.status}`);
    pushNotification(
      'Government Verification Submitted',
      `Verification request initiated (Ref: ${response.verificationReference}). Authority: ${response.authority}.`,
      'verification',
      'worker'
    );
    return response;
  };

  const verifyGovernmentOfficial = async (
    workerId: string,
    governmentReference: string,
    provider?: string,
    forceRecheck?: boolean
  ): Promise<GovernmentVerificationResult> => {
    const auth = {
      userId: currentUser?.id || workerId,
      role: (currentUser?.role || currentRole || 'worker') as 'worker' | 'admin',
    };

    const result = await defaultGovernmentVerificationService.verifyGovernmentReference(auth, {
      workerId,
      governmentReference,
      provider: provider || 'CLC',
      forceRecheck,
    });

    setGovernmentVerifications((prev) => {
      const idx = prev.findIndex((gv) => gv.workerId === workerId);
      const updatedRecord: GovernmentVerification = {
        id: idx >= 0 ? prev[idx].id : `gv-${workerId}`,
        workerId,
        authority: (result.provider as any) || 'CLC',
        verificationReference: result.verificationReference || governmentReference,
        verificationType: 'WORKER_REGISTRATION',
        status: result.status,
        verifiedAt: result.status === 'VERIFIED' ? result.lastCheckedAt : null,
        lastCheckedAt: result.lastCheckedAt,
        source: `OFFICIAL_${result.provider}_GATEWAY`,
        notes: result.message || `Verified via ${result.provider}`,
        createdAt: idx >= 0 ? prev[idx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: result.provider,
        externalReference: result.verificationReference || governmentReference,
        verificationStatus: result.status,
        verifiedName: result.workerName || null,
        verifiedWorkerCategory: result.workerCategory || null,
        verifiedRegistrationDate: result.verifiedRegistrationDate || null,
        rawResponseHash: result.rawResponseHash || null,
        errorCode: result.errorCode || null,
        errorMessage: result.errorMessage || null,
      };

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });

    logAudit('OFFICIAL_GOV_VERIFICATION_CHECK', `Worker: ${workerId}, Status: ${result.status}, Provider: ${result.provider}`);
    return result;
  };

  const adminVerifyGovernment = async (workerId: string, notes?: string): Promise<SafeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
    };
    const response = await defaultVerificationService.adminVerifyWorker(auth, workerId, { notes });

    setGovernmentVerifications((prev) => {
      const idx = prev.findIndex((gv) => gv.workerId === workerId);
      const updatedRecord: GovernmentVerification = {
        id: idx >= 0 ? prev[idx].id : `gv-${workerId}`,
        workerId,
        authority: (response.authority as any) || 'CLC',
        verificationReference: response.verificationReference,
        verificationType: (response.verificationType as any) || 'WORKER_REGISTRATION',
        status: 'VERIFIED',
        verifiedAt: response.verifiedAt || new Date().toISOString().slice(0, 10),
        lastCheckedAt: new Date().toISOString(),
        source: 'DEMO_PROTOTYPE_GATEWAY_CLC',
        notes: notes || '[DEMO/PROTOTYPE DATA] Manually verified by authorized cooperative administrator.',
        createdAt: idx >= 0 ? prev[idx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });

    logAudit('ADMIN_VERIFY_GOVERNMENT', `Worker: ${workerId}, Authority: ${response.authority}`);
    return response;
  };

  const adminRejectGovernment = async (workerId: string, notes?: string): Promise<SafeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
    };
    const response = await defaultVerificationService.adminRejectWorker(auth, workerId, { notes });

    setGovernmentVerifications((prev) => {
      const idx = prev.findIndex((gv) => gv.workerId === workerId);
      const updatedRecord: GovernmentVerification = {
        id: idx >= 0 ? prev[idx].id : `gv-${workerId}`,
        workerId,
        authority: (response.authority as any) || 'CLC',
        verificationReference: response.verificationReference,
        verificationType: (response.verificationType as any) || 'WORKER_REGISTRATION',
        status: 'NOT_VERIFIED',
        verifiedAt: null,
        lastCheckedAt: new Date().toISOString(),
        source: 'DEMO_PROTOTYPE_GATEWAY_CLC',
        notes: notes || '[DEMO/PROTOTYPE DATA] Rejected during administrative verification audit.',
        createdAt: idx >= 0 ? prev[idx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });

    logAudit('ADMIN_REJECT_GOVERNMENT', `Worker: ${workerId}`);
    return response;
  };

  const verifyCooperativeWorker = async (workerId: string, notes?: string): Promise<CooperativeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
      name: currentUser?.name || 'Cooperative Administrator',
      societyId: currentUser?.societyId,
      societyName: currentUser?.societyName,
      adminType: currentUser?.adminType || 'cooperative_admin',
    };
    const response = await defaultVerificationService.verifyCooperativeWorker(auth, workerId, notes);

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              cooperativeVerificationStatus: 'VERIFIED',
              cooperativeVerifiedAt: response.cooperativeVerifiedAt,
              cooperativeVerifiedBy: response.cooperativeVerifiedBy,
            }
          : w
      )
    );

    logAudit('COOPERATIVE_VERIFICATION_VERIFIED', `Worker: ${workerId}, By: ${response.cooperativeVerifiedBy}`);
    pushNotification(
      'Cooperative Verification Approved',
      `Your cooperative credentials have been verified by ${response.cooperativeVerifiedBy}.`,
      'verification',
      'worker'
    );
    return response;
  };

  const rejectCooperativeWorker = async (workerId: string, notes?: string): Promise<CooperativeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
      name: currentUser?.name || 'Cooperative Administrator',
      societyId: currentUser?.societyId,
      societyName: currentUser?.societyName,
      adminType: currentUser?.adminType || 'cooperative_admin',
    };
    const response = await defaultVerificationService.rejectCooperativeWorker(auth, workerId, notes);

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              cooperativeVerificationStatus: 'REJECTED',
              cooperativeVerifiedAt: response.cooperativeVerifiedAt,
              cooperativeVerifiedBy: response.cooperativeVerifiedBy,
            }
          : w
      )
    );

    logAudit('COOPERATIVE_VERIFICATION_REJECTED', `Worker: ${workerId}`);
    return response;
  };

  const getCooperativeVerification = async (workerId: string): Promise<CooperativeVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-default',
      role: (currentUser?.role || currentRole || 'customer') as any,
    };
    return defaultVerificationService.getCooperativeVerification(auth, workerId);
  };

  const verifyPlatformWorker = async (workerId: string, notes?: string): Promise<ShramSetuVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
      name: currentUser?.name || 'ShramSetu Safety Council',
      adminType: 'platform_admin' as const,
    };
    const response = await defaultVerificationService.verifyPlatformWorker(auth, workerId, notes);

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              shramsetuVerificationStatus: 'VERIFIED',
              shramsetuVerifiedAt: response.shramsetuVerifiedAt,
              shramsetuVerifiedBy: response.shramsetuVerifiedBy,
            }
          : w
      )
    );

    logAudit('SHRAMSETU_VERIFICATION_VERIFIED', `Worker: ${workerId}, By: ${response.shramsetuVerifiedBy}`);
    pushNotification(
      'ShramSetu Verification Approved',
      `Your platform onboarding verification has been approved.`,
      'verification',
      'worker'
    );
    return response;
  };

  const rejectPlatformWorker = async (workerId: string, notes?: string): Promise<ShramSetuVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-admin-01',
      role: 'admin' as const,
      name: currentUser?.name || 'ShramSetu Safety Council',
      adminType: 'platform_admin' as const,
    };
    const response = await defaultVerificationService.rejectPlatformWorker(auth, workerId, notes);

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              shramsetuVerificationStatus: 'REJECTED',
              shramsetuVerifiedAt: response.shramsetuVerifiedAt,
              shramsetuVerifiedBy: response.shramsetuVerifiedBy,
            }
          : w
      )
    );

    logAudit('SHRAMSETU_VERIFICATION_REJECTED', `Worker: ${workerId}`);
    return response;
  };

  const getPlatformVerification = async (workerId: string): Promise<ShramSetuVerificationResponse> => {
    const auth = {
      userId: currentUser?.id || 'usr-default',
      role: (currentUser?.role || currentRole || 'customer') as any,
    };
    return defaultVerificationService.getPlatformVerification(auth, workerId);
  };

  const getVerificationAuditLogs = (workerId?: string): VerificationAuditEntry[] => {
    return defaultVerificationService.getVerificationAuditLogs(workerId);
  };

  // 8. Register Worker
  const registerWorker = (newWorkerData: Omit<WorkerProfile, 'id' | 'isVerified' | 'rating' | 'reviewCount' | 'completedJobsCount' | 'joinedDate'>) => {
    const newWorker: WorkerProfile = {
      ...newWorkerData,
      id: `w-${Date.now()}`,
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setWorkers((prev) => [newWorker, ...prev]);
    logAudit('WORKER_REGISTRATION', `Worker: ${newWorker.name} (${newWorker.primaryTrade})`);
    pushNotification('Worker Registration Submitted', `Your registration for ${newWorker.primaryTrade} trade verification is under review.`, 'verification', 'worker');
  };

  // 9. Toggle Worker Availability
  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, isAvailable: !w.isAvailable, isOnline: !w.isOnline } : w))
    );
  };

  const addWorkerSkill = (workerId: string, skill: ServiceCategory) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        if (w.skills.includes(skill)) return w;
        return {
          ...w,
          skills: [...w.skills, skill],
        };
      })
    );
    logAudit('ADD_WORKER_SKILL', `Worker ${workerId}: added skill ${skill}`);
  };

  // 10. Submit Complaint
  const submitComplaint = (data: {
    bookingId?: string;
    filedByRole: 'customer' | 'worker';
    category: ComplaintCategory;
    description: string;
    attachments?: string[];
  }) => {
    const newId = `cmp-${Date.now()}`;
    const compNum = `GRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const booking = bookings.find((b) => b.id === data.bookingId);

    const newComplaint: Complaint = {
      id: newId,
      complaintNumber: compNum,
      bookingId: data.bookingId,
      filedByRole: data.filedByRole,
      complainantId: currentUser?.id || (data.filedByRole === 'customer' ? 'cust-current' : 'worker-current'),
      complainantName: currentUser?.name || (data.filedByRole === 'customer' ? 'Citizen Customer' : 'Cooperative Worker'),
      complainantPhone: currentUser?.phone || '+91 98180 99887',
      againstId: booking ? (data.filedByRole === 'customer' ? booking.workerId : booking.customerId) : undefined,
      againstName: booking ? (data.filedByRole === 'customer' ? booking.workerName : booking.customerName) : undefined,
      category: data.category,
      description: data.description,
      status: 'Submitted',
      submissionDate: new Date().toISOString().slice(0, 10),
      attachments: data.attachments || [],
      cooperativeId: booking?.cooperativeId || 'coop-delhi-central',
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    logAudit('SUBMIT_GRIEVANCE', `Complaint: ${compNum} (${data.category})`);
    pushNotification('Grievance Logged', `Grievance ${compNum} received. Cooperative Dispute Resolution Committee will review within 24 hours.`, 'complaint', data.filedByRole);
  };

  // 11. Update Complaint Status
  const updateComplaintStatus = (complaintId: string, status: ComplaintStatus, resolutionNotes?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              resolutionNotes: resolutionNotes || c.resolutionNotes,
              resolvedAt: status === 'Resolved' ? new Date().toISOString().slice(0, 10) : c.resolvedAt,
            }
          : c
      )
    );
    logAudit(`COMPLAINT_STATUS_${status}`, `Complaint: ${complaintId}`);
  };

  // 12. Approve AI Forecast
  const approveForecast = (forecastId: string) => {
    setDemandForecasts((prev) =>
      prev.map((df) => (df.id === forecastId ? { ...df, status: 'Approved' } : df))
    );
    logAudit('APPROVE_AI_DEMAND_ALLOCATION', `Forecast: ${forecastId}`);
  };

  // 13. Apply for Welfare Scheme
  const applyWelfareScheme = (schemeId: string, workerId: string) => {
    setWelfareSchemes((prev) =>
      prev.map((ws) => (ws.id === schemeId ? { ...ws, enrolledWorkersCount: ws.enrolledWorkersCount + 1 } : ws))
    );
    logAudit('APPLY_WELFARE_SCHEME', `Worker: ${workerId}, Scheme: ${schemeId}`);
    pushNotification('Welfare Application Received', 'Your claim under the Cooperative Welfare Fund is under expedited review.', 'booking', 'worker');
  };

  // 14. Authentication
  const login = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    safeSetStorage('shramsetu_current_user', user);
    logAudit(`USER_LOGIN_${user.role.toUpperCase()}`, `User: ${user.name} (${user.phone})`);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('shramsetu_current_user');
    } catch (_) {}
    logAudit('USER_LOGOUT', 'User logged out');
  };

  const registerUser = (newUser: Omit<AuthUser, 'id'>): AuthUser => {
    const createdUser: AuthUser = {
      ...newUser,
      id: `usr-${Date.now()}`,
    };
    login(createdUser);
    return createdUser;
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        registerUser,
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        t,
        selectedCity,
        setSelectedCity,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        workers,
        governmentVerifications,
        getWorkerVerifications,
        updateGovernmentVerification,
        requestGovernmentVerification,
        verifyGovernmentOfficial,
        adminVerifyGovernment,
        adminRejectGovernment,
        verifyCooperativeWorker,
        rejectCooperativeWorker,
        getCooperativeVerification,
        verifyPlatformWorker,
        rejectPlatformWorker,
        getPlatformVerification,
        getVerificationAuditLogs,
        bookings,
        reviews,
        complaints,
        welfareSchemes,
        demandForecasts,
        notifications,
        auditLogs,
        createBooking,
        updateBookingStatus,
        startWorkerTrip,
        updateLiveLocation,
        completePayment,
        submitReview,
        verifyWorker,
        registerWorker,
        toggleWorkerAvailability,
        addWorkerSkill,
        submitComplaint,
        updateComplaintStatus,
        approveForecast,
        applyWelfareScheme,
        selectedWorkerForProfile,
        setSelectedWorkerForProfile,
        bookingTargetWorker,
        setBookingTargetWorker,
        activeTrackingBookingId,
        setActiveTrackingBookingId,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        reviewTargetBooking,
        setReviewTargetBooking,
        invoiceTargetBooking,
        setInvoiceTargetBooking,
        isDiagnosisModalOpen,
        setIsDiagnosisModalOpen,
        diagnosisTargetBooking,
        setDiagnosisTargetBooking,
        finalizeDiagnosisAndPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
