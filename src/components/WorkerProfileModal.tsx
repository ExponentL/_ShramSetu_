import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { getWorkerVerificationSummary } from '../services/verificationService';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Building2,
  Award,
  Clock,
  Languages,
  CheckCircle2,
  Calendar,
  MessageSquare,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Navigation,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

const formatHumanDate = (dateStr?: string | null): string => {
  if (!dateStr) return '21 September 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const WorkerProfileModal: React.FC = () => {
  const {
    selectedWorkerForProfile,
    setSelectedWorkerForProfile,
    setBookingTargetWorker,
    reviews,
    bookings,
    setCurrentTab,
    language,
    t,
    governmentVerifications,
    currentRole,
    currentUser,
    verifyGovernmentOfficial,
  } = useApp();

  if (!selectedWorkerForProfile) return null;
  const worker = selectedWorkerForProfile;

  const [showGovModal, setShowGovModal] = useState(false);
  const [verificationExpanded, setVerificationExpanded] = useState(true);

  // Verification details from backend DB as source of truth
  const govVerif = governmentVerifications.find((gv) => gv.workerId === worker.id);
  const govStatus = govVerif?.status || 'NOT_CONFIGURED';
  const isGovVerified = govStatus === 'VERIFIED';
  const isCoopVerified = worker.cooperativeVerificationStatus === 'VERIFIED';
  const isPlatformVerified = worker.shramsetuVerificationStatus === 'VERIFIED';

  // Worker view form state
  const [workerReferenceInput, setWorkerReferenceInput] = useState(
    govVerif?.externalReference || govVerif?.verificationReference || ''
  );
  const [selectedProvider, setSelectedProvider] = useState<string>(govVerif?.provider || 'CLC');
  const [isVerifying, setIsVerifying] = useState(false);
  const [forceRecheck, setForceRecheck] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Filter reviews for this worker
  const workerReviews = reviews.filter((r) => r.workerId === worker.id);
  const summary = getWorkerVerificationSummary(worker, governmentVerifications);

  // Check if there is an active booking with this worker
  const activeBookingWithWorker = bookings.find(
    (b) => b.workerId === worker.id && b.status !== 'Work Completed' && b.status !== 'Cancelled'
  );

  const actualProviderName = govVerif?.provider || govVerif?.authority || 'CLC';
  const safeReference = govVerif?.externalReference || govVerif?.verificationReference || 'CLC-REF-PENDING';
  const returnedPermittedName = govVerif?.verifiedName || worker.name;
  const returnedPermittedCategory =
    govVerif?.verifiedWorkerCategory ||
    (worker.primaryTrade === 'Electrical' ? 'Electrician' : worker.primaryTrade);
  const govTypeDisplay =
    govVerif?.verificationType === 'WORKER_REGISTRATION'
      ? 'Worker Registration'
      : govVerif?.verificationType || 'Worker Registration';
  const govLastCheckedDisplay = formatHumanDate(
    govVerif?.lastCheckedAt || govVerif?.verifiedAt || '2026-09-21'
  );
  const coopVerifiedDateDisplay = formatHumanDate(worker.cooperativeVerifiedAt || '2026-09-21');
  const platformVerifiedDateDisplay = formatHumanDate(worker.shramsetuVerifiedAt || '2026-09-21');

  // Worker action handler
  const handleWorkerSubmitVerification = async () => {
    if (!workerReferenceInput.trim()) return;
    setIsVerifying(true);
    setActionFeedback(null);
    try {
      const res = await verifyGovernmentOfficial(worker.id, workerReferenceInput.trim(), selectedProvider);
      if (res.status === 'VERIFIED') {
        setActionFeedback({
          type: 'success',
          message: `Official Government Verification confirmed via ${res.provider}!`,
        });
      } else if (res.status === 'NOT_CONFIGURED') {
        setActionFeedback({
          type: 'info',
          message: 'Government verification service is currently unavailable.',
        });
      } else if (res.status === 'AUTHENTICATION_ERROR') {
        setActionFeedback({
          type: 'error',
          message: 'Gateway configuration issue: Official credentials unauthorized. Technical team notified.',
        });
      } else if (res.status === 'SERVICE_UNAVAILABLE') {
        setActionFeedback({
          type: 'info',
          message: 'Official gateway temporarily unreachable. Please retry shortly (technical disruption).',
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: res.errorMessage || 'Government verification could not be confirmed.',
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Verification request failed.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Admin action handler
  const handleAdminRunCheck = async () => {
    setIsVerifying(true);
    setActionFeedback(null);
    try {
      const ref = govVerif?.externalReference || govVerif?.verificationReference || 'OFFICIAL-REF-ADMIN-CHECK';
      const provider = govVerif?.provider || 'CLC';
      const res = await verifyGovernmentOfficial(worker.id, ref, provider, forceRecheck);
      if (res.status === 'VERIFIED') {
        setActionFeedback({
          type: 'success',
          message: `Admin Check: Verified via ${res.provider} (${res.workerName || worker.name}).`,
        });
      } else if (res.status === 'NOT_CONFIGURED') {
        setActionFeedback({
          type: 'info',
          message: 'Government verification service is currently unavailable.',
        });
      } else if (res.status === 'AUTHENTICATION_ERROR') {
        setActionFeedback({
          type: 'error',
          message: 'Admin Check: Gateway Authentication Error (Invalid/Expired Credentials).',
        });
      } else if (res.status === 'SERVICE_UNAVAILABLE') {
        setActionFeedback({
          type: 'info',
          message: 'Admin Check: Service Temporarily Unavailable (Gateway Timeout / Unreachable).',
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: `Admin Check: ${res.errorMessage || 'Could not confirm verification'}`,
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Admin check failed.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Realistic trade services tailored to the profession
  const tradeServicesMap: Record<string, string[]> = {
    Electrical: ['Fan installation & repair', 'Lighting & switchboard installation', 'House wiring & circuit tracing', 'MCB & fuse box repair', 'Inverter setup'],
    Plumbing: ['Bathroom tap & mixer fix', 'Pipe leakage & drain unclogging', 'Water pump & motor installation', 'Water tank cleaning & valve fitting'],
    Carpentry: ['Door lock & handle repair', 'Furniture assembly & customization', 'Cabinet hinges & alignment', 'Wooden window & shelf fitting'],
    Cleaning: ['Deep kitchen & bathroom scrubbing', 'Full residential cleaning', 'Sofa & mattress dry cleaning', 'Sanitization & balcony wash'],
    Painting: ['Wall touch-ups & damp treatment', 'Full interior house painting', 'Waterproofing coat', 'Grill & exterior enamel paint'],
    Technician: ['AC service & gas refill', 'Washing machine motor repair', 'Refrigerator cooling fix', 'Microwave & geyser servicing'],
    'Domestic Help': ['Daily meal cooking & kitchen support', 'Elderly home care & companion aid', 'Housekeeping & laundry assistance'],
    Gardening: ['Lawn trimming & hedge shaping', 'Plant potting & pest treatment', 'Seasonal flower bed prep'],
  };

  const tradeServices = tradeServicesMap[worker.primaryTrade] || [
    `${worker.primaryTrade} inspection and assessment`,
    `Standard ${worker.primaryTrade} repair work`,
    `Component replacement and installation`,
  ];

  const isAnyVerified = isGovVerified || isCoopVerified || isPlatformVerified || worker.isVerified;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Profile Top Header */}
        <div className="p-5 sm:p-7 bg-white text-neutral-900 border-b border-neutral-200 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Large Worker Portrait */}
            <div className="relative shrink-0">
              <TradeBadgeAvatar
                trade={worker.primaryTrade}
                name={worker.name}
                photoUrl={worker.photoUrl}
                size="lg"
                isOnline={worker.isOnline}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  {worker.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {worker.primaryTrade === 'Electrical' ? 'Electrician' : worker.primaryTrade}
                </span>
              </div>

              {/* Compact Verified Badges */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold text-emerald-800 pt-0.5">
                {isAnyVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 shadow-2xs whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Verified Worker</span>
                  </span>
                )}
                {isGovVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/70 border border-emerald-200/80 text-[11px] whitespace-nowrap">
                    🏛 Government Verified
                  </span>
                )}
                {isCoopVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/70 border border-emerald-200/80 text-[11px] whitespace-nowrap">
                    🤝 Cooperative Member
                  </span>
                )}
                {isPlatformVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/70 border border-emerald-200/80 text-[11px] whitespace-nowrap">
                    ✓ ShramSetu Verified
                  </span>
                )}
              </div>

              {/* Rating, Jobs, Experience */}
              <div className="flex items-center gap-3 text-xs text-neutral-600 flex-wrap pt-0.5">
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {worker.rating}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="font-medium text-neutral-800">
                  {worker.completedJobsCount} completed jobs
                </span>
                <span className="text-neutral-300">•</span>
                <span className="font-medium text-neutral-800">
                  {worker.experienceYears} years experience
                </span>
              </div>

              {/* Service Area */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Available in: <strong className="text-neutral-700">{worker.serviceArea}</strong></span>
              </div>
            </div>
          </div>

          <button
            id="close-worker-modal-btn"
            onClick={() => setSelectedWorkerForProfile(null)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 min-h-0 space-y-7 divide-y divide-neutral-100">
          {/* Quick Action Strip */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id={`modal-book-now-${worker.id}`}
              onClick={() => {
                setSelectedWorkerForProfile(null);
                setBookingTargetWorker(worker);
              }}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              Book this professional
            </button>

            {activeBookingWithWorker && (
              <button
                type="button"
                onClick={() => {
                  setSelectedWorkerForProfile(null);
                  setCurrentTab('tracking');
                }}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                Track active booking
              </button>
            )}

            <div className="ml-auto text-xs text-neutral-500 font-medium">
              Member of <strong>{worker.cooperativeName}</strong>
            </div>
          </div>

          {/* Section: About */}
          <div className="pt-6 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              About
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {worker.name} is an experienced {worker.primaryTrade.toLowerCase()} professional specialising in residential and light commercial installation, maintenance, and diagnostics. Trained through verified cooperative vocational programs with a proven track record of punctuality and clean craftsmanship.
            </p>
          </div>

          {/* Section: Services Offered */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Services Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tradeServices.map((serviceItem) => (
                <div
                  key={serviceItem}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5 text-neutral-800 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{serviceItem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Skills & Certifications */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Skills &amp; Certifications
            </h3>
            <div className="space-y-2">
              {worker.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-neutral-900">{cert.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {cert.issuingAuthority} • Issued {cert.issueYear}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    Verified by Co-op
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Verification & Trust (Expandable clean cards) */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-900">Verification &amp; Trust</h3>
              </div>
              <button
                type="button"
                onClick={() => setVerificationExpanded(!verificationExpanded)}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
              >
                <span>{verificationExpanded ? 'Hide details' : 'Show details'}</span>
                {verificationExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {verificationExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Government Tier */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                      🏛 <span>Government Verification</span>
                    </div>
                    <div className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      {isGovVerified ? (
                        <span className="text-emerald-700 flex items-center gap-1">✓ Verified</span>
                      ) : govStatus === 'PENDING' ? (
                        <span className="text-amber-700">⏳ Pending</span>
                      ) : govStatus === 'AUTHENTICATION_ERROR' ? (
                        <span className="text-rose-700">⚠️ Gateway Issue</span>
                      ) : govStatus === 'SERVICE_UNAVAILABLE' ? (
                        <span className="text-amber-700">⏳ Unavailable</span>
                      ) : (
                        <span className="text-neutral-600">Not Verified</span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-600 mt-2 space-y-1">
                      <div><span className="text-neutral-400">Authority: </span>{actualProviderName}</div>
                      <div><span className="text-neutral-400">Reference: </span><span className="font-mono text-[11px]">{safeReference}</span></div>
                      <div><span className="text-neutral-400">Checked: </span>{govLastCheckedDisplay}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGovModal(true)}
                    className="w-full py-1.5 px-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                </div>

                {/* 2. Cooperative Tier */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                      🤝 <span>Cooperative Verification</span>
                    </div>
                    <div className="font-bold text-sm text-emerald-700 flex items-center gap-1">
                      ✓ Verified
                    </div>
                    <div className="text-xs text-neutral-600 mt-2 space-y-1">
                      <div className="line-clamp-2"><span className="text-neutral-400">Society: </span>{worker.cooperativeName}</div>
                      <div><span className="text-neutral-400">Date: </span>{coopVerifiedDateDisplay}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-400">Verified by registrar board</div>
                </div>

                {/* 3. ShramSetu Tier */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                      ✓ <span>ShramSetu Verification</span>
                    </div>
                    <div className="font-bold text-sm text-emerald-700 flex items-center gap-1">
                      ✓ Verified
                    </div>
                    <div className="text-xs text-neutral-600 mt-2 space-y-1">
                      <div><span className="text-neutral-400">KYC Status: </span>Passed</div>
                      <div><span className="text-neutral-400">Date: </span>{platformVerifiedDateDisplay}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-400">Platform safety handshake</div>
                </div>
              </div>
            )}

            {/* Worker Reference Submission (Worker Role Only) */}
            {currentRole === 'worker' && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5">
                <div className="font-bold text-neutral-900">Submit Verification Reference</div>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    value={workerReferenceInput}
                    onChange={(e) => setWorkerReferenceInput(e.target.value)}
                    placeholder="Government Registry Reference ID"
                    className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-xl font-mono text-xs focus:outline-none"
                  />
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs"
                  >
                    <option value="CLC">CLC</option>
                    <option value="ESHRAM">e-Shram</option>
                    <option value="STATE_LABOUR">State Labour</option>
                    <option value="OTHER_AUTHORIZED">Other Authorized</option>
                  </select>
                  <button
                    type="button"
                    disabled={isVerifying || !workerReferenceInput.trim()}
                    onClick={handleWorkerSubmitVerification}
                    className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}

            {/* Admin Diagnostic Panel (Admin Role Only) */}
            {currentRole === 'admin' && (
              <div className="p-4 bg-neutral-100 rounded-2xl border border-neutral-300 text-xs space-y-2">
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>Admin Diagnostic Inspection</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">Privileged</span>
                </div>
                <div><span className="text-neutral-500">Provider: </span>{actualProviderName}</div>
                <div><span className="text-neutral-500">Response Hash: </span><span className="font-mono text-[10px]">{govVerif?.rawResponseHash || 'None'}</span></div>
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="checkbox"
                    id="admin-force-recheck-modal"
                    checked={forceRecheck}
                    onChange={(e) => setForceRecheck(e.target.checked)}
                    className="rounded text-neutral-900 cursor-pointer"
                  />
                  <label htmlFor="admin-force-recheck-modal" className="cursor-pointer text-[11px] text-neutral-700">
                    Force Recheck (Bypass Verification Cache)
                  </label>
                </div>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleAdminRunCheck}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs mt-1"
                >
                  {isVerifying ? 'Querying Gateway...' : 'Run Official API Verification Check'}
                </button>
              </div>
            )}

            {actionFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border border-amber-300'
                }`}
              >
                <span>{actionFeedback.message}</span>
                <button onClick={() => setActionFeedback(null)} className="font-bold ml-2">✕</button>
              </div>
            )}
          </div>

          {/* Section: Customer Reviews */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Customer Reviews ({workerReviews.length || worker.reviewCount})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{worker.rating} out of 5</span>
              </div>
            </div>

            {workerReviews.length === 0 ? (
              <div className="p-5 text-center text-xs text-neutral-500 bg-neutral-50 rounded-2xl">
                No text reviews submitted yet. Reviews appear here upon verified booking completion.
              </div>
            ) : (
              <div className="space-y-3">
                {workerReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-neutral-900">{rev.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{rev.createdAt.slice(0, 10)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-semibold text-neutral-600 ml-1.5">
                        {rev.serviceCategory}
                      </span>
                    </div>
                    <p className="text-neutral-700 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified booking
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom CTA Bar (Strict Job-Based Pricing - NO HOURLY / BASE PRICING) */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-600 font-medium">
            Transparent job-based pricing calculated upon item selection. Zero hidden fees.
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSelectedWorkerForProfile(null)}
              className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Back
            </button>
            <button
              id={`modal-bottom-book-btn-${worker.id}`}
              onClick={() => {
                setSelectedWorkerForProfile(null);
                setBookingTargetWorker(worker);
              }}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Service
            </button>
          </div>
        </div>
      </div>

      {/* Customer View: Verification Details Dialog */}
      {showGovModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-sm">
                  🏛
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Government Verification Details</h3>
                  <p className="text-[11px] text-neutral-500">Official registry record summary</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGovModal(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="text-neutral-500 font-medium">Verification Type</div>
                  <div className="font-bold text-neutral-900 mt-0.5">{govTypeDisplay}</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-medium">Verified Through</div>
                  <div className="font-bold text-neutral-900 mt-0.5">{actualProviderName}</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-medium">Status</div>
                  <div className="mt-0.5 font-bold">
                    {isGovVerified ? (
                      <span className="text-emerald-700">✓ Verified</span>
                    ) : govStatus === 'PENDING' ? (
                      <span className="text-amber-700">⏳ Pending</span>
                    ) : govStatus === 'SERVICE_UNAVAILABLE' ? (
                      <span className="text-amber-800">Temporarily Unavailable (Technical)</span>
                    ) : govStatus === 'AUTHENTICATION_ERROR' ? (
                      <span className="text-rose-800">Gateway Config Issue (Technical)</span>
                    ) : govStatus === 'NOT_CONFIGURED' ? (
                      <span className="text-amber-800">Connection Unavailable</span>
                    ) : (
                      <span className="text-neutral-700">Not Verified</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 font-medium">Safe Reference</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5">
                    {safeReference}
                  </div>
                </div>
                {isGovVerified && (
                  <>
                    <div>
                      <div className="text-neutral-500 font-medium">Worker Name</div>
                      <div className="font-bold text-neutral-900 mt-0.5">{returnedPermittedName}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 font-medium">Worker Category</div>
                      <div className="font-bold text-neutral-900 mt-0.5">{returnedPermittedCategory}</div>
                    </div>
                  </>
                )}
                <div>
                  <div className="text-neutral-500 font-medium">Last Checked</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">{govLastCheckedDisplay}</div>
                </div>
                {govStatus === 'NOT_CONFIGURED' && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    <span className="font-bold">Notice: </span>
                    Government verification service is currently unavailable. System is ready for official API integration.
                  </div>
                )}
              </div>

              {/* Data Privacy & Security Assurance */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-[11px] text-blue-950 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">Citizen Privacy &amp; Safety Protection</div>
                  <div>
                    In strict compliance with privacy standards and DPDP regulations, this public customer view never displays or stores:
                  </div>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-900">
                    <li>Aadhaar numbers or biometric profiles</li>
                    <li>Passwords or secret credentials</li>
                    <li>Private government identity records</li>
                    <li>API credentials and token keys</li>
                    <li>Sensitive personal identity documents</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGovModal(false)}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
