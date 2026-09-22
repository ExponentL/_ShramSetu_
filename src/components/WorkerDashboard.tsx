import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorkerProfile, Booking, WelfareScheme, ServiceCategory } from '../types';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { getWorkerVerificationSummary } from '../services/verificationService';
import { INITIAL_WORKERS } from '../data/mockData';
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
  Calendar,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Check,
  Home,
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
    verifyGovernmentOfficial,
    reviews,
    t,
    language,
  } = useApp();

  // Active simulated worker: matches logged-in user or defaults to Rajesh Kumar (w-100)
  const currentWorker =
    workers.find((w) => w.id === currentUser?.id || w.name.toLowerCase() === currentUser?.name?.toLowerCase()) ||
    workers.find((w) => w.id === 'w-100') ||
    workers[0] ||
    INITIAL_WORKERS[0];

  const currentGovRec = governmentVerifications.find((gv) => gv.workerId === currentWorker?.id);
  const workerSummary = currentWorker ? getWorkerVerificationSummary(currentWorker, governmentVerifications) : null;

  // Synchronized sub-tab state: 'home' (main dashboard) | 'jobs' | 'schedule' | 'earnings' | 'profile' | 'welfare'
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'schedule' | 'earnings' | 'profile' | 'welfare'>('home');
  const [jobFilter, setJobFilter] = useState<'all' | 'active' | 'today' | 'upcoming' | 'completed'>('all');
  const [welfareClaimSuccess, setWelfareClaimSuccess] = useState<string | null>(null);
  const [verificationRequestMsg, setVerificationRequestMsg] = useState<string | null>(null);
  const [isRequestingVerif, setIsRequestingVerif] = useState(false);
  const [govRefInput, setGovRefInput] = useState(
    currentGovRec?.externalReference || currentGovRec?.verificationReference || 'CLC-HR-BHD-100'
  );
  const [govProviderInput, setGovProviderInput] = useState<'CLC' | 'E_SHRAM'>(
    (currentGovRec?.provider as any) || 'CLC'
  );
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('');

  useEffect(() => {
    if (currentTab === 'worker_welfare') {
      setActiveTab('welfare');
    } else if (currentTab === 'worker_jobs') {
      setActiveTab('jobs');
    } else if (currentTab === 'worker_schedule') {
      setActiveTab('schedule');
    } else if (currentTab === 'worker_earnings') {
      setActiveTab('earnings');
    } else if (currentTab === 'worker_profile') {
      setActiveTab('profile');
    } else if (currentTab === 'worker_dashboard' || currentTab === 'home') {
      setActiveTab('home');
    }
  }, [currentTab]);

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

  // Bookings assigned to current worker
  const myBookings = bookings.filter((b) => b.workerId === currentWorker.id);

  // Active Job: finding in-progress booking
  const activeJob = myBookings.find(
    (b) =>
      b.status === 'Requested' ||
      b.status === 'Accepted' ||
      b.status === 'Worker On The Way' ||
      b.status === 'Arrived' ||
      b.status === 'Diagnosing' ||
      b.status === 'Diagnosis Completed' ||
      b.status === 'Work Started'
  ) || myBookings.find((b) => b.status === 'Work Completed' && b.id === 'bk-1001');

  // Today's jobs (scheduled for today or active)
  const todayJobs = myBookings.filter(
    (b) => b.scheduledDate === '2026-09-22' || b.id === 'bk-1001' || b.id === 'bk-1002'
  );

  // Upcoming schedule jobs (future days)
  const upcomingJobs = myBookings.filter(
    (b) => (b.scheduledDate > '2026-09-22' || b.id === 'bk-1003') && b.status !== 'Work Completed' && b.status !== 'Payment Completed'
  );

  // Completed jobs for earnings ledger
  const completedJobs = myBookings.filter(
    (b) => b.status === 'Work Completed' || b.status === 'Payment Completed'
  );

  // Payout calculation (strictly job-based: 90% direct payout, 8% cooperative welfare cess, 2% admin GST)
  const totalSettledEarnings = completedJobs.reduce((acc, curr) => {
    return acc + (curr.payment?.workerPayout || Math.round(curr.estimatedPrice * 0.9));
  }, 1035);

  const totalWelfareCess = completedJobs.reduce((acc, curr) => {
    return acc + (curr.payment?.cooperativeWelfareLevy || Math.round(curr.estimatedPrice * 0.08));
  }, 92);

  // Reviews for this worker
  const workerReviews = reviews.filter((r) => r.workerId === currentWorker.id);

  // Greeting determination
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 w-full max-w-full">
      {/* ========================================================================= */}
      {/* WORKER IDENTITY BAR & DUTY AVAILABILITY                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2DFD8] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <TradeBadgeAvatar
              trade={currentWorker.primaryTrade}
              name={currentWorker.name}
              photoUrl={currentWorker.photoUrl}
              size="lg"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                currentWorker.isAvailable ? 'bg-[#167A5B]' : 'bg-slate-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {currentWorker.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#167A5B]" />
                ✓ Verified Worker
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1.5 flex-wrap">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentWorker.cooperativeName}</span>
              <span className="text-slate-300">•</span>
              <span>Reg #HR/BHD/2017/188-B</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5 flex-wrap">
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {currentWorker.primaryTrade}
              </span>
              <span>•</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {currentWorker.rating}
                <span className="font-normal text-slate-500">
                  ({currentWorker.reviewCount} verified reviews)
                </span>
              </span>
              <span>•</span>
              <span className="text-slate-500 font-medium">
                {currentWorker.completedJobsCount} lifetime jobs completed
              </span>
            </div>
          </div>
        </div>

        {/* Availability Toggle: ● ON DUTY */}
        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Availability:</span>
            <button
              id="worker-availability-toggle"
              type="button"
              onClick={() => toggleWorkerAvailability(currentWorker.id)}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs border ${
                currentWorker.isAvailable
                  ? 'bg-[#167A5B] text-white border-[#13664c]'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentWorker.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{currentWorker.isAvailable ? '● ON DUTY' : 'Off Duty'}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Fair cooperative rotation queue active
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SUB-NAV TABS                                                      */}
      {/* ========================================================================= */}
      <div className="flex border-b border-[#E2DFD8] bg-white rounded-2xl px-3 pt-2 text-xs font-semibold gap-1 sm:gap-2 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            setCurrentTab('worker_dashboard');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'home'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Dashboard (Home)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('jobs');
            setCurrentTab('worker_jobs');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Jobs</span>
          {todayJobs.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#17324D] text-white text-[10px] font-bold flex items-center justify-center">
              {todayJobs.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('schedule');
            setCurrentTab('worker_schedule');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'schedule'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('earnings');
            setCurrentTab('worker_earnings');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'earnings'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            setCurrentTab('worker_profile');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Skills &amp; Verification</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('welfare');
            setCurrentTab('worker_welfare');
          }}
          className={`pb-3 px-3 sm:px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'welfare'
              ? 'border-[#17324D] text-[#17324D] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Welfare</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW: MAIN DASHBOARD (EXACT REQUIRED ORDER)                               */}
      {/* 1. Active Job                                                            */}
      {/* 2. Today's Jobs                                                          */}
      {/* 3. Upcoming Schedule                                                     */}
      {/* 4. Earnings                                                              */}
      {/* 5. Welfare / Cooperative Updates                                         */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Good morning, {currentWorker.name.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Ready for today's assignments • {currentWorker.cooperativeName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 bg-white border border-[#E2DFD8] px-3 py-1.5 rounded-xl font-medium shadow-2xs">
                📅 {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 1. ACTIVE JOB (MAIN FOCUS)                                            */}
          {/* ===================================================================== */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#167A5B] animate-ping" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  1. Active Job (Main Focus)
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Job ID: {activeJob ? activeJob.bookingNumber : 'None'}
              </span>
            </div>

            {activeJob ? (
              <div className="bg-white rounded-3xl border-2 border-[#167A5B] p-5 sm:p-7 shadow-md space-y-5">
                {/* Active Job Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                        {activeJob.serviceCategory}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {(activeJob.serviceDescription || '').split(' and ')[0] || activeJob.serviceCategory}
                      </h3>
                      {activeJob.isEmergency && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase">
                          Emergency SOS
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      Job ID: <strong className="text-slate-900">{activeJob.bookingNumber}</strong>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Current status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      activeJob.status === 'Work Completed'
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : activeJob.status === 'Work Started'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : activeJob.status === 'Worker On The Way'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : activeJob.status === 'Arrived'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {activeJob.status === 'Accepted'
                        ? 'Job Confirmed (Ready to travel)'
                        : activeJob.status === 'Worker On The Way'
                        ? 'En Route to Location (Live GPS Active)'
                        : activeJob.status === 'Arrived'
                        ? 'Arrived on Site'
                        : activeJob.status === 'Work Started'
                        ? 'Work in Progress'
                        : activeJob.status === 'Work Completed'
                        ? 'Job Completed'
                        : activeJob.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Service Location */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>Service Location:</span>
                    </div>
                    <p className="text-slate-900 font-semibold text-sm leading-snug">
                      {activeJob.customerLocation?.address || 'Service Location on File'}
                    </p>
                    <p className="text-slate-500">
                      Zone: {activeJob.customerLocation?.zone || 'Central'}, {activeJob.customerLocation?.city || 'NCR'}
                      {activeJob.distanceKm ? ` (${activeJob.distanceKm} km away)` : ''}
                    </p>
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500">Customer: </span>
                        <strong className="text-slate-900">{activeJob.customerName}</strong>
                      </div>
                      <a
                        href={`tel:${activeJob.customerPhone}`}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 flex items-center gap-1 text-[11px]"
                      >
                        <Phone className="w-3 h-3 text-[#167A5B]" />
                        <span>{activeJob.customerPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Requirements & Appointment */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div>
                      <span className="font-bold text-slate-900">Task Requirements:</span>
                      <p className="text-slate-700 italic mt-0.5 leading-relaxed">
                        "{activeJob.serviceDescription}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Appointment time:
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {activeJob.scheduledTime} (Today)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Fixed Job Payout:</span>
                      <div className="text-right">
                        <span className="font-black text-[#167A5B] text-sm">
                          ₹{Math.round(activeJob.estimatedPrice * 0.9)} Net Credit
                        </span>
                        <div className="text-[10px] text-slate-400">
                          (₹{activeJob.estimatedPrice} job charge − 8% co-op cess)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =============================================================== */}
                {/* SEQUENTIAL PROGRESSION BUTTONS                                  */}
                {/* Accept Job → Start Travel → Mark Arrived → Start Job → Complete Job */}
                {/* =============================================================== */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Step 1: Accept Job */}
                  {activeJob.status === 'Requested' && (
                    <button
                      id="worker-accept-job-btn"
                      type="button"
                      onClick={() => updateBookingStatus(activeJob.id, 'Accepted')}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all btn-tactile"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Job</span>
                    </button>
                  )}

                  {/* Step 2: Start Travel */}
                  {activeJob.status === 'Accepted' && (
                    <button
                      id="worker-start-trip-btn"
                      type="button"
                      onClick={() => startWorkerTrip(activeJob.id)}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all btn-tactile"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Travel</span>
                    </button>
                  )}

                  {/* Step 3: Mark Arrived & Live GPS */}
                  {activeJob.status === 'Worker On The Way' && (
                    <>
                      <button
                        id="worker-arrived-btn"
                        type="button"
                        onClick={() => updateBookingStatus(activeJob.id, 'Arrived')}
                        className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all btn-tactile"
                      >
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Mark Arrived</span>
                      </button>

                      {/* GPS works only for active/relevant job */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTrackingBookingId(activeJob.id);
                          setCurrentTab('tracking');
                        }}
                        className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Open live telemetry route map for this job"
                      >
                        <Navigation className="w-4 h-4 text-[#167A5B]" />
                        <span>Live GPS Route Map</span>
                      </button>
                    </>
                  )}

                  {/* Step 4: Start Job & Problem Diagnosis */}
                  {(activeJob.status === 'Arrived' || activeJob.status === 'Diagnosing' || activeJob.status === 'Diagnosis Completed') && (
                    <>
                      <button
                        id="worker-begin-work-btn"
                        type="button"
                        onClick={() => updateBookingStatus(activeJob.id, 'Work Started')}
                        className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all btn-tactile"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Job</span>
                      </button>

                      <button
                        id="worker-report-diagnosis-btn"
                        type="button"
                        onClick={() => {
                          setDiagnosisTargetBooking(activeJob);
                          setIsDiagnosisModalOpen(true);
                        }}
                        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>On-site Diagnosis Check</span>
                      </button>
                    </>
                  )}

                  {/* Step 5: Complete Job */}
                  {activeJob.status === 'Work Started' && (
                    <button
                      id="worker-complete-work-btn"
                      type="button"
                      onClick={() => updateBookingStatus(activeJob.id, 'Work Completed')}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all btn-tactile"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Job</span>
                    </button>
                  )}

                  {/* Completed State */}
                  {activeJob.status === 'Work Completed' && (
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#167A5B] font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Job Completed Successfully! Payout Dispatched.
                      </span>
                      <button
                        type="button"
                        onClick={() => setInvoiceTargetBooking(activeJob)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-blue-700" />
                        <span>View Payout Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(activeJob.id, 'Accepted')}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        title="Replay progression demo"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-test Progression</span>
                      </button>
                    </div>
                  )}

                  {/* Unsafe Working Condition Complaint */}
                  <button
                    type="button"
                    onClick={() => setIsComplaintModalOpen(true)}
                    className="ml-auto text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                  >
                    Report Unsafe Working Conditions
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-[#E2DFD8] shadow-2xs">
                <CheckCircle2 className="w-12 h-12 text-[#167A5B] mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-900">All current jobs completed</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You are ON DUTY. Next cooperative job dispatch will appear here automatically.
                </p>
              </div>
            )}
          </section>

          {/* ===================================================================== */}
          {/* 2. TODAY'S JOBS                                                       */}
          {/* ===================================================================== */}
          <section className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#17324D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  2. Today's Jobs
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {todayJobs.length} jobs scheduled today
              </span>
            </div>

            <div className="space-y-3">
              {todayJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    job.id === activeJob?.id
                      ? 'border-[#167A5B] bg-[#FAF8F5]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {job.scheduledTime}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {job.serviceCategory}: {(job.serviceDescription || '').split(' and ')[0] || job.serviceCategory}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({job.bookingNumber})
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.customerLocation?.address || 'Service address'}</span>
                        <span className="text-slate-300">•</span>
                        <span>{job.customerName || 'Customer'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <div className="font-black text-[#167A5B] text-sm">
                          +₹{Math.round(job.estimatedPrice * 0.9)} Net
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                          job.status === 'Work Completed' || job.status === 'Payment Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================== */}
          {/* 3. UPCOMING SCHEDULE                                                  */}
          {/* ===================================================================== */}
          <section className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#17324D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  3. Upcoming Schedule
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Confirmed for next 7 days
              </span>
            </div>

            <div className="space-y-3">
              {upcomingJobs.length > 0 ? (
                upcomingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {job.scheduledDate} • {job.scheduledTime}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {job.serviceCategory}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          Cooperative Confirmed
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">"{job.serviceDescription}"</p>
                      <div className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.customerLocation?.address || 'Service address'} ({job.customerLocation?.zone || ''})</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-[#167A5B] text-sm">
                        +₹{Math.round(job.estimatedPrice * 0.9)} Net
                      </div>
                      <div className="text-[10px] text-slate-400">Fixed Job Payout</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  No upcoming advance bookings scheduled for later this week.
                </div>
              )}
            </div>
          </section>

          {/* ===================================================================== */}
          {/* 4. EARNINGS                                                           */}
          {/* ===================================================================== */}
          <section className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#167A5B]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  4. Earnings &amp; Payout Ledger
                </h2>
              </div>
              <span className="text-xs font-bold text-[#167A5B] bg-[#EDF7F2] px-3 py-1 rounded-full border border-[#C6E7D8]">
                Linked: State Bank of India (**4819)
              </span>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Net Direct Remuneration
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₹{totalSettledEarnings.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#167A5B] font-semibold mt-0.5">
                  100% direct bank credit (90% job value)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Cooperative Welfare Cess (8%)
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₹{totalWelfareCess.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Contributed to health &amp; pension pool
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Accident Insurance Coverage
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  ₹5,00,000 Sum Assured
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Master Policy NLCF-HR-2024
                </div>
              </div>
            </div>

            {/* Recent Completed Jobs */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recent Job Payouts
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {completedJobs.map((b) => {
                  const gross = b.estimatedPrice;
                  const net = Math.round(gross * 0.9);
                  const cess = Math.round(gross * 0.08);
                  return (
                    <div key={b.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">
                          {b.bookingNumber} • {b.serviceCategory}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {b.customerName} ({b.scheduledDate}) • Gross: ₹{gross} | 8% Co-op Cess: ₹{cess}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="font-black text-[#167A5B] text-sm">+₹{net}</div>
                        <span className="text-[10px] text-slate-400">Direct Bank Transfer Settled</span>
                        <button
                          type="button"
                          onClick={() => setInvoiceTargetBooking(b)}
                          className="mt-1 px-2.5 py-0.5 text-[10px] font-bold text-blue-900 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Receipt className="w-3 h-3 text-blue-700" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* 5. WELFARE / COOPERATIVE UPDATES                                      */}
          {/* ===================================================================== */}
          <section className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#167A5B]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  5. Welfare &amp; Cooperative Updates
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {currentWorker.cooperativeName}
              </span>
            </div>

            {welfareClaimSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#167A5B] shrink-0" />
                  {welfareClaimSuccess}
                </span>
                <button
                  type="button"
                  onClick={() => setWelfareClaimSuccess(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2 py-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Welfare Scheme 1: Accident Insurance */}
              <div className="p-4 rounded-2xl bg-[#EDF7F2]/60 border border-[#C6E7D8] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#167A5B] text-white uppercase">
                      Active Coverage
                    </span>
                    <span className="text-xs font-black text-[#167A5B]">₹5,00,000</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">
                    Group Life &amp; Disability Insurance
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Under National Labour Cooperatives Federation of India master policy NLCF-HR-2024. Complete on-site injury and hospitalization coverage.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#C6E7D8]/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Policy active</span>
                  <span className="text-[#167A5B] font-bold">110 Members Enrolled</span>
                </div>
              </div>

              {/* Welfare Scheme 2: Equipment & Tool Subsidy */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                      Equipment Grant
                    </span>
                    <span className="text-xs font-black text-slate-900">Up to ₹3,500</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">
                    Professional Artisan Tool Subsidy
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Reimbursement grant for insulated screwdrivers, multimeter, safety shoes, and ISI trade safety gear.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Fund reserve: ₹16,50,000</span>
                  <button
                    type="button"
                    onClick={() => {
                      applyWelfareScheme('welfare-03', currentWorker.id);
                      setWelfareClaimSuccess('Tool subsidy claim registered! Cooperative Secretary S. K. Sharma will verify the receipt.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#167A5B] hover:bg-[#13664c] text-white font-bold cursor-pointer transition-colors"
                  >
                    Submit Welfare Claim
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* REVIEWS RECEIVED (AUTHENTIC HUMAN RATINGS)                            */}
          {/* ===================================================================== */}
          <section className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Reviews Received
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <span>★ {currentWorker.rating}</span>
                <span className="text-slate-400">({currentWorker.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workerReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <div className="flex items-center text-amber-500">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>Verified Booking • {rev.serviceCategory}</span>
                    <span>{rev.createdAt.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================== */}
          {/* COOPERATIVE SUPPORT & HELPLINE                                        */}
          {/* ===================================================================== */}
          <div className="bg-[#17324D] rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Cooperative Help &amp; Support Hotline
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bahadurgarh Labour Cooperative Society • General Secretary S. K. Sharma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:18004192667"
                className="px-4 py-2 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Toll-Free: 1800-419-2667</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: MY JOBS (ALL / ACTIVE / TODAY / SCHEDULED / COMPLETED)              */}
      {/* ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Jobs &amp; Dispatch History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage active assignments, today's jobs, and completed service receipts
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              {(['all', 'active', 'today', 'upcoming', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setJobFilter(f)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    jobFilter === f ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myBookings
              .filter((b) => {
                if (jobFilter === 'active') return b.status !== 'Work Completed' && b.status !== 'Payment Completed';
                if (jobFilter === 'today') return b.scheduledDate === '2026-09-22';
                if (jobFilter === 'upcoming') return b.scheduledDate > '2026-09-22';
                if (jobFilter === 'completed') return b.status === 'Work Completed' || b.status === 'Payment Completed';
                return true;
              })
              .map((b) => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {b.bookingNumber} • {b.serviceCategory}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        b.status === 'Work Completed' || b.status === 'Payment Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-600">"{b.serviceDescription}"</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{b.customerLocation?.address || 'Service address'} ({b.customerName || 'Customer'}, {b.customerPhone || ''})</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                    <div className="font-black text-[#167A5B] text-sm">
                      +₹{Math.round(b.estimatedPrice * 0.9)} Net
                    </div>
                    <div className="text-[10px] text-slate-400">{b.scheduledDate} • {b.scheduledTime}</div>
                    {(b.status === 'Work Completed' || b.status === 'Payment Completed') && (
                      <button
                        type="button"
                        onClick={() => setInvoiceTargetBooking(b)}
                        className="mt-1 px-2.5 py-0.5 text-[10px] font-bold text-blue-900 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Receipt className="w-3 h-3 text-blue-700" />
                        <span>Invoice Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: SCHEDULE                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Weekly Assignment Schedule</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organized timeline of confirmed appointments and cooperative dispatches
            </p>
          </div>

          <div className="space-y-4">
            {myBookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#17324D] text-white font-bold text-[11px]">
                      {b.scheduledDate}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{b.scheduledTime}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-800">{b.serviceCategory}</span>
                  </div>
                  <p className="text-slate-600 mt-1">"{b.serviceDescription}"</p>
                  <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{b.customerLocation?.address || 'Service address'} ({b.customerName || 'Customer'})</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-[#167A5B] text-sm">
                    +₹{Math.round(b.estimatedPrice * 0.9)} Net
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: EARNINGS LEDGER                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Direct Remuneration &amp; Welfare Payout Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct client transfer under MSCS Act regulations (strictly job-based, zero middleman cuts)
              </p>
            </div>
            <span className="text-xs font-bold text-[#167A5B] bg-[#EDF7F2] px-3 py-1 rounded-full border border-[#C6E7D8]">
              Linked: State Bank of India (**4819)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Gross Job Payouts</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{totalSettledEarnings.toLocaleString()}</div>
              <div className="text-[10px] text-[#167A5B] font-semibold mt-0.5">Credited to linked bank account</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Cooperative Welfare Cess (8%)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{totalWelfareCess.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Medical, accident &amp; retirement pool</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Next Payout Cycle</div>
              <div className="text-sm font-bold text-slate-900 mt-1">Daily Direct UPI / NEFT</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Instant settlement upon customer completion</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Payout History</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {completedJobs.map((b) => {
                const amount = b.estimatedPrice;
                const payout = Math.round(amount * 0.9);
                const cess = Math.round(amount * 0.08);
                return (
                  <div key={b.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {b.bookingNumber} — {b.serviceCategory}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Total Charge: ₹{amount} | Welfare Cess (8%): ₹{cess} | GST (2%): ₹{amount - payout - cess}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-sm font-black text-[#167A5B]">+₹{payout}</div>
                      <div className="text-[10px] text-slate-400">Settled to bank via UPI</div>
                      <button
                        type="button"
                        onClick={() => setInvoiceTargetBooking(b)}
                        className="mt-1 px-2 py-0.5 text-[10px] font-medium text-blue-800 hover:bg-blue-50 border border-blue-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Receipt className="w-3 h-3 text-blue-700" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: SKILLS & CERTIFICATIONS & 3-TIER VERIFICATION                       */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-6">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Skills &amp; 3-Tier Verification Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Independent multi-tier verification gates and artisan certification credentials
            </p>
          </div>

          {/* Three-Tier Decoupled Verification System */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#167A5B]" />
                <span>3-Tier Independent Verification Status</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Decoupled Gates
              </span>
            </div>

            {verificationRequestMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#167A5B] shrink-0" />
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
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Gov Official Tier
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
                              setVerificationRequestMsg(`Official verification confirmed via ${res.provider}!`);
                            } else if (res.status === 'NOT_CONFIGURED') {
                              setVerificationRequestMsg('Government verification service is currently unavailable.');
                            } else if (res.status === 'AUTHENTICATION_ERROR') {
                              setVerificationRequestMsg('Official gateway configuration issue (technical disruption).');
                            } else if (res.status === 'SERVICE_UNAVAILABLE') {
                              setVerificationRequestMsg('Government verification gateway temporarily unreachable. Please retry.');
                            } else {
                              setVerificationRequestMsg(res.errorMessage || 'Government verification could not be confirmed.');
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
                        {isRequestingVerif ? 'Contacting Official Gateway...' : 'Request Official Verification'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tier 2: Cooperative */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Co-op Society Tier
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      workerSummary?.layer2Cooperative?.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {workerSummary?.layer2Cooperative?.status || 'PENDING'}
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
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Platform Tier
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      workerSummary?.layer3ShramSetu?.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {workerSummary?.layer3ShramSetu?.status || 'PENDING'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    KYC &amp; Safety Protocol
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Credentials &amp; Certifications
            </h4>
            {(currentWorker?.certifications || []).map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{cert.title}</div>
                  <div className="text-slate-500 text-[11px]">
                    {cert.issuingAuthority} • Year {cert.issueYear}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Credential
                </span>
              </div>
            ))}
          </div>

          {/* Registered Trade Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Registered Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {(currentWorker?.skills || []).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[#17324D] text-white"
                >
                  {t.categories[s as ServiceCategory] || s}
                </span>
              ))}
            </div>
          </div>

          {/* Add Skill Form */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Add New Trade Skill
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedCategory && currentWorker) {
                  addWorkerSkill(currentWorker.id, selectedCategory);
                  setSelectedCategory('');
                }
              }}
              className="flex items-center gap-2 max-w-md"
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17324D] bg-white cursor-pointer"
              >
                <option value="">Select a service trade...</option>
                {availableCategories
                  .filter((cat) => !((currentWorker?.skills || []).includes(cat)))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {t.categories[cat] || cat}
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                disabled={!selectedCategory}
                className="px-4 py-2 bg-[#17324D] hover:bg-[#112437] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: WELFARE SCHEMES                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'welfare' && (
        <div className="bg-white rounded-3xl border border-[#E2DFD8] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Cooperative Social Security &amp; Welfare Schemes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-state cooperative welfare reserves funded by the mandatory 8% levy on every completed booking
            </p>
          </div>

          {welfareClaimSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#167A5B] shrink-0" />
                {welfareClaimSuccess}
              </span>
              <button
                type="button"
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
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                      {scheme.category}
                    </span>
                    <span className="text-xs font-black text-[#167A5B]">
                      {scheme.coverageAmount}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">{scheme.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{scheme.description}</p>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Eligibility: {scheme.eligibility}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {scheme.enrolledWorkersCount} enrolled members
                  </span>
                  <button
                    id={`apply-welfare-${scheme.id}`}
                    type="button"
                    onClick={() => {
                      applyWelfareScheme(scheme.id, currentWorker.id);
                      setWelfareClaimSuccess(
                        `Welfare application registered for "${scheme.title}"! The Cooperative Welfare Secretary will contact you with disbursement details.`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#167A5B] hover:bg-[#13664c] text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Submit Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
