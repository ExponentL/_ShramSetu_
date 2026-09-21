import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorkerProfile, Booking, WelfareScheme, ServiceCategory } from '../types';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { getWorkerVerificationSummary } from '../services/verificationService';
import {
  Briefcase,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  HeartHandshake,
  DollarSign,
  Star,
  Award,
  AlertTriangle,
  Play,
  Phone,
  Power,
  TrendingUp,
  FileText,
  Building2,
  Wrench,
  Sparkles,
  Receipt,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    workers,
    governmentVerifications,
    bookings,
    updateBookingStatus,
    startWorkerTrip,
    toggleWorkerAvailability,
    welfareSchemes,
    applyWelfareScheme,
    setIsComplaintModalOpen,
    setActiveTrackingBookingId,
    setIsDiagnosisModalOpen,
    setDiagnosisTargetBooking,
    setInvoiceTargetBooking,
    addWorkerSkill,
    requestGovernmentVerification,
    verifyGovernmentOfficial,
    t,
    language,
  } = useApp();

  // Active simulated worker: matches logged-in user or defaults to Vikramaditya Verma (w-101)
  const currentWorker =
    workers.find((w) => w.id === currentUser?.id || w.name.toLowerCase() === currentUser?.name.toLowerCase()) ||
    workers.find((w) => w.id === 'w-101') ||
    workers[0];

  const currentGovRec = governmentVerifications.find((gv) => gv.workerId === currentWorker.id);
  const workerSummary = getWorkerVerificationSummary(currentWorker, governmentVerifications);

  const [activeTab, setActiveTab] = useState<'jobs' | 'welfare' | 'earnings' | 'profile'>('jobs');
  const [welfareClaimSuccess, setWelfareClaimSuccess] = useState<string | null>(null);
  const [verificationRequestMsg, setVerificationRequestMsg] = useState<string | null>(null);
  const [isRequestingVerif, setIsRequestingVerif] = useState(false);
  const [govRefInput, setGovRefInput] = useState(
    currentGovRec?.externalReference || currentGovRec?.verificationReference || ''
  );
  const [govProviderInput, setGovProviderInput] = useState<'CLC' | 'E_SHRAM'>(
    (currentGovRec?.provider as any) || 'CLC'
  );

  useEffect(() => {
    if (currentTab === 'worker_welfare') {
      setActiveTab('welfare');
    } else if (currentTab === 'worker_dashboard') {
      setActiveTab('jobs');
    }
  }, [currentTab]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('');

  const availableCategories: ServiceCategory[] = [
    'Electrical',
    'Plumbing',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Gardening',
    'Driving',
    'Domestic Help',
    'Technician',
    'Other',
  ];

  // Filter bookings assigned to this worker
  const myBookings = bookings.filter((b) => b.workerId === currentWorker.id);
  const activeJob = myBookings.find(
    (b) =>
      b.status === 'Accepted' ||
      b.status === 'Worker On The Way' ||
      b.status === 'Arrived' ||
      b.status === 'Work Started'
  );

  // Earnings calculations
  const completedJobs = myBookings.filter(
    (b) => b.status === 'Work Completed' || b.status === 'Payment Completed'
  );
  const totalEarnings = completedJobs.reduce((acc, curr) => {
    return acc + (curr.payment?.workerPayout || Math.round(curr.estimatedPrice * 0.9));
  }, 14850);

  const welfareContributed = Math.round(totalEarnings * 0.08);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Worker Top Profile Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <TradeBadgeAvatar
              trade={currentWorker.primaryTrade}
              name={currentWorker.name}
              size="lg"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                currentWorker.isOnline ? 'bg-emerald-500' : 'bg-neutral-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-neutral-900">{t.workerDashboard.panelTitle}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                {t.workerDashboard.verifiedMember}
              </span>
            </div>

            <div className="text-xs text-neutral-500 mt-1 font-medium">
              {currentWorker.cooperativeName} (Reg #491-A)
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-600 mt-1.5 flex-wrap">
              <span className="font-bold text-neutral-900">
                {t.workerDashboard.primaryTrade}: {t.categories[currentWorker.primaryTrade as ServiceCategory] || currentWorker.primaryTrade}
              </span>
              <span>•</span>
              <span className="font-bold text-neutral-900">
                ★ {currentWorker.rating} <span className="font-normal text-neutral-500">({currentWorker.reviewCount} {language === 'hi' ? 'समीक्षाएं' : 'reviews'})</span>
              </span>
              <span>•</span>
              <span className="text-neutral-500">{currentWorker.completedJobsCount} {t.workerDashboard.lifetimeJobs}</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle & Status */}
        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-600">{t.workerDashboard.dutyAvailability}</span>
            <button
              id="worker-availability-toggle"
              onClick={() => toggleWorkerAvailability(currentWorker.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentWorker.isAvailable
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentWorker.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                }`}
              />
              {currentWorker.isAvailable ? t.workerDashboard.onDuty : t.workerDashboard.offDuty}
            </button>
          </div>
          <span className="text-[11px] text-neutral-500">
            {t.workerDashboard.queueRank}
          </span>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-neutral-500">{t.workerDashboard.netEarnings}</div>
          <div className="text-xl font-black text-neutral-900 mt-1">₹{totalEarnings.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-medium">{t.workerDashboard.directBankCredit}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-neutral-500">{t.workerDashboard.welfarePool}</div>
          <div className="text-xl font-black text-neutral-900 mt-1">₹{welfareContributed.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-500">{t.workerDashboard.medicalPensionCess}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-neutral-500">{t.workerDashboard.accidentInsurance}</div>
          <div className="text-sm font-bold text-neutral-900 mt-1">
            ₹5,00,000 {t.workerDashboard.insuranceCover}
          </div>
          <div className="text-[10px] text-neutral-500">{t.workerDashboard.insurancePolicy}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-neutral-500">{t.workerDashboard.assignedJobs}</div>
          <div className="text-xl font-black text-neutral-900 mt-1">{currentWorker.currentWorkload} {t.directory.jobsSuffix}</div>
          <div className="text-[10px] text-neutral-500 font-medium">{t.workerDashboard.balancedQuota}</div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-neutral-200 bg-white rounded-t-2xl px-4 pt-2 text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'jobs'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>{t.workerDashboard.tabJobs}</span>
          {activeJob && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1 inline-block" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('welfare')}
          className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'welfare'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>{t.workerDashboard.tabWelfare}</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'earnings'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>{t.workerDashboard.tabEarnings}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>{t.workerDashboard.tabProfile}</span>
        </button>
      </div>

      {/* Tab 1: Active Jobs & GPS Trip Management (Section 7) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {activeJob ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-bold text-base text-slate-900">
                    {t.workerDashboard.activeJobTitle}: {t.categories[activeJob.serviceCategory as ServiceCategory] || activeJob.serviceCategory} ({activeJob.bookingNumber})
                  </h3>
                  {activeJob.isEmergency && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                      {t.workerDashboard.emergencySosTag}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {t.workerDashboard.currentStatus}: {t.bookingStatuses[activeJob.status] || activeJob.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {t.workerDashboard.customerLoc}:
                  </div>
                  <p className="text-slate-800 font-medium">{activeJob.customerLocation.address}</p>
                  <p className="text-slate-500">{t.workerDashboard.zone}: {activeJob.customerLocation.zone}</p>
                  <div className="text-blue-900 font-semibold pt-1">
                    {t.workerDashboard.customerLabel}: {activeJob.customerName} ({activeJob.customerPhone})
                  </div>
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">{t.workerDashboard.taskReq}:</div>
                  <p className="text-slate-700 italic">"{activeJob.serviceDescription}"</p>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500">{t.workerDashboard.scheduledTime}:</span>
                    <span className="font-bold text-slate-900">{activeJob.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.workerDashboard.expectedPayout}:</span>
                    <span className="font-bold text-emerald-700">₹{Math.round(activeJob.estimatedPrice * 0.9)} (90%)</span>
                  </div>
                </div>
              </div>

              {/* Worker Live GPS Control Actions (Section 7) */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {activeJob.status === 'Accepted' && (
                  <button
                    id="worker-start-trip-btn"
                    onClick={() => startWorkerTrip(activeJob.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    {t.workerDashboard.startTripBtn}
                  </button>
                )}

                {activeJob.status === 'Worker On The Way' && (
                  <>
                    <button
                      id="worker-arrived-btn"
                      onClick={() => updateBookingStatus(activeJob.id, 'Arrived')}
                      className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {t.workerDashboard.confirmArrivalBtn}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTrackingBookingId(activeJob.id);
                        setCurrentTab('tracking');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      {t.workerDashboard.openMapBtn}
                    </button>
                  </>
                )}

                {(activeJob.status === 'Arrived' || activeJob.status === 'Diagnosing' || activeJob.status === 'Diagnosis Completed') && (
                  <>
                    <button
                      id="worker-report-diagnosis-btn"
                      onClick={() => {
                        setDiagnosisTargetBooking(activeJob);
                        setIsDiagnosisModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4" />
                      {t.workerDashboard.diagnoseMcqBtn}
                    </button>
                    <button
                      id="worker-begin-work-btn"
                      onClick={() => updateBookingStatus(activeJob.id, 'Work Started')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      {t.workerDashboard.proceedWorkBtn}
                    </button>
                  </>
                )}

                {activeJob.status === 'Work Started' && (
                  <button
                    id="worker-complete-work-btn"
                    onClick={() => updateBookingStatus(activeJob.id, 'Work Completed')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.workerDashboard.finishWorkBtn}
                  </button>
                )}

                <button
                  onClick={() => setIsComplaintModalOpen(true)}
                  className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold underline cursor-pointer"
                >
                  {t.workerDashboard.reportUnsafeBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-slate-900">{t.workerDashboard.allJobsDone}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.workerDashboard.allJobsDoneSub}
              </p>
            </div>
          )}

          {/* Past Completed Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.workerDashboard.jobHistoryTitle}
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {myBookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">
                      {b.bookingNumber} • {t.categories[b.serviceCategory as ServiceCategory] || b.serviceCategory}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {t.workerDashboard.customerLabel}: {b.customerName} ({b.scheduledDate})
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="font-bold text-emerald-700">
                      +₹{Math.round(b.estimatedPrice * 0.9)}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t.bookingStatuses[b.status] || b.status}
                    </span>
                    {(b.status === 'Work Completed' || b.status === 'Payment Completed') && (
                      <button
                        onClick={() => setInvoiceTargetBooking(b)}
                        className="mt-1 px-2 py-0.5 text-[10px] font-medium text-blue-800 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Receipt className="w-3 h-3 text-blue-700" />
                        {t.workerDashboard.invoiceBtn}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Welfare & Insurance Schemes (Section 13) */}
      {activeTab === 'welfare' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <HeartHandshake className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-emerald-900">{t.workerDashboard.socialSecurityTitle}</h3>
              <p className="mt-0.5 leading-relaxed">
                {t.workerDashboard.socialSecurityDesc}
              </p>
            </div>
          </div>

          {welfareClaimSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                {welfareClaimSuccess}
              </span>
              <button
                onClick={() => setWelfareClaimSuccess(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfareSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                      {scheme.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {scheme.coverageAmount}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">{scheme.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{scheme.description}</p>
                  <div className="text-[11px] text-slate-500 mt-2">
                    {t.workerDashboard.eligibility}: {scheme.eligibility}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {scheme.enrolledWorkersCount} {t.workerDashboard.enrolledMembers}
                  </span>
                  <button
                    id={`apply-welfare-${scheme.id}`}
                    onClick={() => {
                      applyWelfareScheme(scheme.id, currentWorker.id);
                      setWelfareClaimSuccess(
                        language === 'hi'
                          ? `"${scheme.title}" के लिए दावा पंजीकृत! सहकारी कल्याण सचिव आपसे संपर्क करेंगे।`
                          : language === 'pa'
                          ? `"${scheme.title}" ਲਈ ਦਾਅਵਾ ਦਰਜ ਕੀਤਾ ਗਿਆ! ਸਹਿਕਾਰੀ ਸਕੱਤਰ ਸੰਪਰਕ ਕਰਨਗੇ।`
                          : `Welfare application registered for "${scheme.title}"! The Cooperative Welfare Secretary will contact you with disbursement details.`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    {t.workerDashboard.submitClaim}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Earnings & Payout Ledger (Section 12) */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.workerDashboard.payoutLedgerTitle}</h3>
              <p className="text-xs text-slate-500">
                {t.workerDashboard.payoutLedgerDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t.workerDashboard.linkedAccount}
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {completedJobs.map((b) => {
              const amount = b.estimatedPrice;
              const payout = Math.round(amount * 0.9);
              const cess = Math.round(amount * 0.08);
              return (
                <div key={b.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">
                      {b.bookingNumber} — {t.categories[b.serviceCategory as ServiceCategory] || b.serviceCategory}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {t.workerDashboard.totalCharge}: ₹{amount} | {t.workerDashboard.welfareCessRow} (8%): ₹{cess}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-sm font-bold text-emerald-700">+₹{payout}</div>
                    <div className="text-[10px] text-slate-400">{t.workerDashboard.settledBank}</div>
                    <button
                      onClick={() => setInvoiceTargetBooking(b)}
                      className="mt-1 px-2 py-0.5 text-[10px] font-medium text-blue-800 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Receipt className="w-3 h-3 text-blue-700" />
                      {t.workerDashboard.invoiceBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Skills & Certifications Management (Section 4 & 5) */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.workerDashboard.skillsTitle}</h3>
            <p className="text-xs text-slate-500">
              {t.workerDashboard.skillsDesc}
            </p>
          </div>

          {/* Three-Tier Decoupled Verification System */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {language === 'hi' ? '3-स्तरीय स्वतंत्र सत्यापन स्थिति' : '3-Tier Independent Verification Status'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {language === 'hi' ? 'अलग-अलग स्तर' : 'Decoupled Gates'}
              </span>
            </div>

            {verificationRequestMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {verificationRequestMsg}
                </span>
                <button
                  type="button"
                  onClick={() => setVerificationRequestMsg(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Tier 1: Government */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {language === 'hi' ? 'सरकारी स्तर' : 'Gov Official Tier'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentGovRec?.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentGovRec?.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : currentGovRec?.status === 'NOT_CONFIGURED'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentGovRec?.status === 'VERIFIED'
                        ? '✓ VERIFIED'
                        : currentGovRec?.status === 'NOT_CONFIGURED'
                        ? 'UNAVAILABLE'
                        : currentGovRec?.status || 'PENDING'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {currentGovRec?.provider || currentGovRec?.authority || 'CLC'} Official Registry
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Ref: {currentGovRec?.externalReference || currentGovRec?.verificationReference || 'Pending submission'}
                  </div>
                  {currentGovRec?.lastCheckedAt && (
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Checked: {new Date(currentGovRec.lastCheckedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-100">
                  {currentGovRec?.status === 'NOT_CONFIGURED' && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 leading-tight">
                      Government verification service is currently unavailable.
                    </div>
                  )}

                  {currentGovRec?.status !== 'VERIFIED' && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={govRefInput}
                          onChange={(e) => setGovRefInput(e.target.value)}
                          placeholder="CLC / e-Shram Reference"
                          className="flex-1 px-2 py-1 text-[10px] border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-900"
                        />
                        <select
                          value={govProviderInput}
                          onChange={(e) => setGovProviderInput(e.target.value as any)}
                          className="px-1.5 py-1 text-[10px] border border-slate-300 rounded bg-white"
                        >
                          <option value="CLC">CLC</option>
                          <option value="ESHRAM">e-Shram</option>
                          <option value="STATE_LABOUR">State Labour</option>
                          <option value="OTHER_AUTHORIZED">Other Authorized</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        disabled={isRequestingVerif || !govRefInput.trim()}
                        onClick={async () => {
                          setIsRequestingVerif(true);
                          try {
                            const res = await verifyGovernmentOfficial(
                              currentWorker.id,
                              govRefInput.trim(),
                              govProviderInput
                            );
                            if (res.status === 'VERIFIED') {
                              setVerificationRequestMsg(
                                language === 'hi'
                                  ? `सरकारी सत्यापन सफल (${res.provider})`
                                  : `Official verification confirmed via ${res.provider}!`
                              );
                            } else if (res.status === 'NOT_CONFIGURED') {
                              setVerificationRequestMsg(
                                language === 'hi'
                                  ? 'सरकारी सत्यापन सेवा वर्तमान में अनुपलब्ध है।'
                                  : 'Government verification service is currently unavailable.'
                              );
                            } else if (res.status === 'AUTHENTICATION_ERROR') {
                              setVerificationRequestMsg(
                                'Official gateway configuration issue (technical disruption).'
                              );
                            } else if (res.status === 'SERVICE_UNAVAILABLE') {
                              setVerificationRequestMsg(
                                'Government verification gateway temporarily unreachable. Please retry.'
                              );
                            } else {
                              setVerificationRequestMsg(
                                res.errorMessage || 'Government verification could not be confirmed.'
                              );
                            }
                            setTimeout(() => setVerificationRequestMsg(null), 6000);
                          } catch (err: any) {
                            setVerificationRequestMsg(err.message || 'Request failed');
                            setTimeout(() => setVerificationRequestMsg(null), 6000);
                          } finally {
                            setIsRequestingVerif(false);
                          }
                        }}
                        className="w-full py-1 text-[10px] font-bold text-white bg-blue-900 hover:bg-blue-950 rounded cursor-pointer transition-colors text-center disabled:opacity-50"
                      >
                        {isRequestingVerif
                          ? 'Contacting Official Gateway...'
                          : language === 'hi'
                          ? 'सत्यापन अनुरोध भेजें'
                          : 'Request Official Verification'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tier 2: Cooperative */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {language === 'hi' ? 'सहकारी स्तर' : 'Co-op Society Tier'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      workerSummary.layer2Cooperative.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {workerSummary.layer2Cooperative.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {currentWorker.cooperativeName}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1">
                  Verified by: {currentWorker.cooperativeVerifiedBy || 'Society Board'}
                </div>
              </div>

              {/* Tier 3: ShramSetu Platform */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {language === 'hi' ? 'मंच स्तर' : 'Platform Tier'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      workerSummary.layer3ShramSetu.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {workerSummary.layer3ShramSetu.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    KYC & Safety Protocol
                  </div>
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentWorker.shramsetuVerifiedAt ? `Activated: ${currentWorker.shramsetuVerifiedAt.slice(0, 10)}` : 'Onboarding queue'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Certifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.workerDashboard.activeCredentials}
            </h4>
            {currentWorker.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{cert.title}</div>
                  <div className="text-slate-500 text-[11px]">
                    {cert.issuingAuthority} • {language === 'hi' ? 'वर्ष' : language === 'pa' ? 'ਸਾਲ' : 'Year'} {cert.issueYear}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.workerDashboard.verifiedByAdmin}
                </span>
              </div>
            ))}
          </div>

          {/* Skills List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t.workerDashboard.registeredSkills}
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentWorker.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-900 text-white"
                >
                  {t.categories[s as ServiceCategory] || s}
                </span>
              ))}
            </div>
          </div>

          {/* Add Skill Form */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t.workerDashboard.addSkillTitle}
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedCategory) {
                  addWorkerSkill(currentWorker.id, selectedCategory);
                  setSelectedCategory('');
                }
              }}
              className="flex items-center gap-2 max-w-md"
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white cursor-pointer"
              >
                <option value="">{t.workerDashboard.addSkillPlaceholder}</option>
                {availableCategories
                  .filter((cat) => !currentWorker.skills.includes(cat))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {t.categories[cat] || cat}
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                disabled={!selectedCategory}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t.workerDashboard.addSkillBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
