import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  Bell,
  Globe,
  User,
  AlertTriangle,
  Menu,
  X,
  Calendar,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Home,
  Wrench,
  Navigation,
  Map,
  TrendingUp,
} from 'lucide-react';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { INITIAL_WORKERS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentRole,
    currentUser,
    logout,
    language,
    setLanguage,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    notifications,
    bookings,
    setIsEmergencyModalOpen,
    setIsComplaintModalOpen,
    setBookingTargetWorker,
    workers,
    toggleWorkerAvailability,
  } = useApp();

  const currentWorker =
    workers.find((w) => w.id === currentUser?.id || w.name.toLowerCase() === currentUser?.name?.toLowerCase()) ||
    workers.find((w) => w.id === 'w-100') ||
    workers[0] ||
    INITIAL_WORKERS[0];

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'Work Completed' && b.status !== 'Cancelled'
  ).length;

  const navigateTo = (tab: string, elementId?: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  };

  const availableLocations = [
    'Bahadurgarh, Haryana',
    'West Delhi NCR',
    'Rohini & North Delhi',
    'Gurugram Central',
    'Mohali & Chandigarh',
  ];

  const [showNotice, setShowNotice] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    if (nextVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <>
      {/* 2. DISMISSIBLE PUBLIC SERVICE NOTICE STRIP */}
      {showNotice && (
        <div className="bg-[#EDF7F2] border-b border-[#C6E7D8] text-[#167A5B] text-xs px-4 py-2 relative transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-[#167A5B] text-white shrink-0">
                Notice
              </span>
              <p className="text-[12px] font-medium text-slate-800 leading-snug">
                ShramSetu operates on a verified worker-cooperative model. 100% of standard artisan service remuneration is paid directly to verified trade professionals under MSCS Act regulations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="text-slate-500 hover:text-slate-900 text-sm font-bold p-1 rounded hover:bg-black/5 cursor-pointer shrink-0"
              title="Dismiss announcement"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN INSTITUTIONAL NAVBAR */}
      <header
        className={`sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2DFD8] transition-all duration-300 ${
          isScrolled ? 'h-16 shadow-md' : 'h-20 shadow-xs'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {currentRole === 'worker' ? (
            /* ========================================================================= */
            /* WORKER HEADER: ShramSetu logo → Worker name → Verification → Availability → Notifications → Profile */
            /* ========================================================================= */
            <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
              {/* Left: ShramSetu logo → Worker name → Verification */}
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                <button
                  id="brand-logo-btn"
                  onClick={() => setCurrentTab('worker_dashboard')}
                  className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
                >
                  <div
                    className={`rounded-xl bg-[#17324D] text-white flex items-center justify-center font-black tracking-tight border border-[#224466] shadow-2xs transition-all duration-300 ${
                      isScrolled ? 'w-8 h-8 text-xs' : 'w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm'
                    }`}
                  >
                    SS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-black tracking-tight text-[#17324D] leading-none transition-all duration-300 ${
                          isScrolled ? 'text-base sm:text-lg' : 'text-base sm:text-lg 2xl:text-xl'
                        }`}
                      >
                        ShramSetu
                      </span>
                      <span className="text-[11px] font-bold text-[#C25E00] tracking-wide">
                        श्रमसेतु
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-tight mt-0.5 whitespace-nowrap hidden sm:block">
                      Workforce Portal
                    </span>
                  </div>
                </button>

                <div className="h-7 w-px bg-[#E2DFD8] hidden sm:block" />

                {/* Worker Identity: Rajesh Kumar • Electrician • ✓ Verified Worker */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {currentWorker.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium hidden md:inline">
                        • {currentWorker.primaryTrade}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium truncate hidden lg:block">
                      {currentWorker.cooperativeName}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#167A5B]" />
                    <span>✓ Verified Worker</span>
                  </span>
                </div>
              </div>

              {/* Right: Availability Toggle → Notifications → Profile */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {/* Availability Toggle: ● ON DUTY */}
                <button
                  id="worker-availability-toggle"
                  onClick={() => toggleWorkerAvailability(currentWorker.id)}
                  className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
                    currentWorker.isAvailable
                      ? 'bg-[#167A5B] text-white border-[#13664c]'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                  title="Toggle Duty Status"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentWorker.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>{currentWorker.isAvailable ? '● ON DUTY' : 'Off Duty'}</span>
                </button>

                {/* Notifications */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="min-h-[40px] min-w-[40px] p-2 rounded-lg border border-[#E2DFD8] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer relative shrink-0 bg-white shadow-2xs flex items-center justify-center"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B42318]" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E2DFD8] p-3 z-50 text-xs space-y-2">
                      <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span>Workforce Alerts</span>
                        <button
                          type="button"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      {notifications.slice(0, 3).map((n) => (
                        <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="font-bold text-slate-800">{n.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Worker Profile Dropdown */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    id="nav-worker-profile-btn"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="min-h-[40px] flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-[#E2DFD8] hover:bg-slate-100 transition-colors cursor-pointer shrink-0 bg-white shadow-2xs"
                    title="Worker Account"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#17324D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentWorker.name.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap hidden lg:inline">
                      {currentWorker.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#E2DFD8] p-2 z-50 text-xs space-y-1">
                      <div className="p-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900">{currentWorker.name}</div>
                        <div className="text-[11px] text-slate-500">{currentWorker.primaryTrade} • ID: {currentWorker.id}</div>
                        <div className="text-[10px] font-semibold text-[#167A5B] mt-0.5">
                          {currentWorker.cooperativeName}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setCurrentTab('worker_dashboard');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                      >
                        <Home className="w-3.5 h-3.5 text-slate-500" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setCurrentTab('worker_jobs');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Jobs</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setCurrentTab('worker_schedule');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Schedule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setCurrentTab('worker_earnings');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                        <span>Earnings Ledger</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setCurrentTab('worker_profile');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Skills &amp; Verification</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsComplaintModalOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-amber-50 text-amber-900 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Report Unsafe Conditions</span>
                      </button>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-rose-50 text-[#B42318] font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* CUSTOMER HEADER                                                           */
            /* ========================================================================= */
            <div className="flex items-center justify-between h-full gap-2 sm:gap-3 xl:gap-4">
              {/* Left: Brand Logo & Tagline */}
              <div className="flex items-center gap-2 sm:gap-3 xl:gap-5 min-w-0">
                <button
                  id="brand-logo-btn"
                  onClick={() => navigateTo('explore')}
                  className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
                >
                  <div
                    className={`rounded-xl bg-[#17324D] text-white flex items-center justify-center font-black tracking-tight border border-[#224466] shadow-2xs transition-all duration-300 ${
                      isScrolled ? 'w-8 h-8 text-xs' : 'w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm'
                    }`}
                  >
                    SS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-black tracking-tight text-[#17324D] leading-none transition-all duration-300 ${
                          isScrolled ? 'text-base sm:text-lg' : 'text-base sm:text-lg 2xl:text-xl'
                        }`}
                      >
                        ShramSetu
                      </span>
                      <span className="text-[11px] font-bold text-[#C25E00] tracking-wide">
                        श्रमसेतु
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden 2xl:block whitespace-nowrap">
                      Trusted Skills. Right at Your Doorstep.
                    </span>
                  </div>
                </button>

                {/* Navigation Links: Services, Find Workers, Live Map, My Bookings, How It Works */}
                <nav className="hidden xl:flex items-center gap-3 2xl:gap-5 text-xs 2xl:text-sm font-semibold text-slate-700 whitespace-nowrap">
                  <button
                    onClick={() => navigateTo('explore', 'explore-services-section')}
                    className={`hover:text-[#17324D] transition-colors cursor-pointer py-1 ${
                      currentTab === 'explore' ? 'text-[#17324D] font-bold border-b-2 border-[#17324D]' : ''
                    }`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => navigateTo('explore', 'workers-directory-section')}
                    className="hover:text-[#17324D] transition-colors cursor-pointer py-1"
                  >
                    Find Workers
                  </button>
                  <button
                    id="nav-live-tracking"
                    onClick={() => setCurrentTab('tracking')}
                    className={`hover:text-[#17324D] transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                      currentTab === 'tracking' || currentTab === 'gps_tracking' ? 'text-[#17324D] font-bold border-b-2 border-[#17324D]' : ''
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#167A5B]" />
                    <span>Live Map</span>
                  </button>
                  <button
                    onClick={() => navigateTo('explore', 'bookings-section')}
                    className="hover:text-[#17324D] transition-colors cursor-pointer py-1 flex items-center gap-1.5"
                  >
                    <span>My Bookings</span>
                    {activeBookingsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#17324D] text-white text-[9px] font-bold flex items-center justify-center">
                        {activeBookingsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigateTo('explore', 'how-it-works-section')}
                    className="hover:text-[#17324D] transition-colors cursor-pointer py-1 hidden 2xl:block"
                  >
                    How It Works
                  </button>
                </nav>
              </div>

              {/* Right: Desktop Controls (xl:flex) vs Mobile Compact Controls (xl:hidden) */}
              {/* Desktop Full Navigation Actions */}
              <div className="hidden xl:flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Location Selector */}
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2DFD8] hover:border-slate-400 text-xs font-semibold text-slate-800 transition-colors cursor-pointer bg-white shrink-0 shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#167A5B] shrink-0" />
                  <span className="truncate max-w-[80px] xl:max-w-[105px] 2xl:max-w-[130px]">{selectedCity || 'Bahadurgarh, Haryana'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Language Switcher */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'pa' : 'en';
                      setLanguage(nextLang);
                    }}
                    className="px-2 py-1.5 rounded-lg border border-[#E2DFD8] hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1 uppercase shrink-0 bg-white"
                    title="Change language"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{language}</span>
                  </button>
                </div>

                {/* Notifications */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-1.5 sm:p-2 rounded-lg border border-[#E2DFD8] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer relative shrink-0 bg-white shadow-2xs"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B42318]" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E2DFD8] p-3 z-50 text-xs space-y-2">
                      <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span>Notifications</span>
                        <span className="text-[10px] text-slate-400 font-normal">Recent alerts</span>
                      </div>
                      {notifications.slice(0, 3).map((n) => (
                        <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="font-bold text-slate-800">{n.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Profile Dropdown */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    id="nav-profile-btn"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-[#E2DFD8] hover:bg-slate-100 transition-colors cursor-pointer shrink-0 bg-white shadow-2xs"
                    title="Customer account options"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#17324D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser?.name ? currentUser.name.slice(0, 1).toUpperCase() : 'C'}
                    </div>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap hidden 2xl:inline">
                      {currentUser?.name || 'Customer'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2DFD8] p-2 z-50 text-xs space-y-1">
                      <div className="p-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900">{currentUser?.name || 'User'}</div>
                        <div className="text-[11px] text-slate-500">{currentUser?.phone || ''}</div>
                        <div className="text-[10px] font-semibold text-[#167A5B] mt-0.5 uppercase">
                          {currentRole}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigateTo('explore', 'bookings-section');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer"
                      >
                        My Bookings
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-rose-50 text-[#B42318] font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Secondary: Emergency / SOS Button */}
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA] text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs btn-tactile"
                  title="Emergency electrician, water leak or plumbing assistance"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
                  <span className="hidden 2xl:inline">Emergency / SOS</span>
                  <span className="2xl:hidden">SOS</span>
                </button>

                {/* Primary: Book a Service Button */}
                <button
                  type="button"
                  onClick={() => navigateTo('explore', 'workers-directory-section')}
                  className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-[#17324D] hover:bg-[#112538] text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs border border-[#224466] btn-tactile"
                >
                  <span>Book a Service</span>
                </button>
              </div>

              {/* Mobile Compact Header Right Actions: Location, Notification, Menu/Profile */}
              <div className="flex xl:hidden items-center gap-1.5 shrink-0">
                {/* Mobile Location Selector Button */}
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="min-h-[44px] min-w-[44px] px-2 py-1.5 rounded-xl border border-[#E2DFD8] hover:border-slate-400 bg-white text-xs font-bold text-slate-800 flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Change location"
                  aria-label="Change location"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#167A5B] shrink-0" />
                  <span className="max-w-[72px] sm:max-w-[110px] truncate text-[11px] font-semibold">
                    {selectedCity ? selectedCity.split(',')[0] : 'Bahadurgarh'}
                  </span>
                </button>

                {/* Mobile Notification Button */}
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-xl border border-[#E2DFD8] bg-white hover:bg-slate-100 text-slate-700 relative flex items-center justify-center shadow-2xs cursor-pointer"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B42318]" />
                  )}
                </button>

                {/* Mobile Profile / Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="min-h-[44px] min-w-[44px] p-1.5 rounded-xl border border-[#E2DFD8] bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  title="Menu and Profile"
                  aria-label="Menu and Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#17324D] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser?.name ? currentUser.name.slice(0, 1).toUpperCase() : 'C'}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Compact Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E2DFD8] bg-white px-4 py-4 space-y-3 shadow-xl">
            {currentRole === 'worker' ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{currentWorker.name}</div>
                    <div className="text-xs text-slate-500">{currentWorker.primaryTrade} • ID: {currentWorker.id}</div>
                    <div className="text-[10px] font-bold text-[#167A5B] mt-0.5">{currentWorker.cooperativeName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                    ✓ Verified Worker
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('worker_dashboard');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-bold text-slate-800 flex items-center gap-2"
                  >
                    <Home className="w-4 h-4 text-[#17324D]" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('worker_jobs');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-bold text-slate-800 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-[#17324D]" />
                    <span>My Jobs</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('worker_schedule');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-bold text-slate-800 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#17324D]" />
                    <span>Schedule</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('worker_earnings');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-bold text-slate-800 flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-[#17324D]" />
                    <span>Earnings</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsComplaintModalOpen(true);
                  }}
                  className="w-full min-h-[44px] p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs font-bold text-amber-900 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Report Unsafe Conditions / Raise Issue</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full min-h-[44px] py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-[#B42318] font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* Customer Drawer */
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{currentUser?.name || 'Customer'}</div>
                    <div className="text-xs text-slate-500">{currentUser?.phone || '+91 98180 99887'}</div>
                    <div className="text-[10px] font-bold text-[#167A5B] uppercase mt-0.5">{currentRole}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'pa' : 'en';
                      setLanguage(nextLang);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 uppercase bg-white flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('explore', 'bookings-section');
                    }}
                    className="min-h-[44px] p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#17324D]" />
                    <span>My Bookings ({activeBookingsCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsEmergencyModalOpen(true);
                    }}
                    className="min-h-[44px] p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-left text-xs font-bold text-[#B42318] flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#B42318]" />
                    <span>Emergency SOS</span>
                  </button>
                </div>

                <button
                  id="mobile-nav-live-tracking"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentTab('tracking');
                  }}
                  className="w-full min-h-[44px] p-2.5 rounded-xl bg-[#EDF7F2] border border-[#C6E7D8] text-left text-xs font-bold text-[#167A5B] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#167A5B]" />
                    <span>Live Map &amp; GPS Telemetry</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#167A5B]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full min-h-[44px] py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-[#B42318] font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Notification Popover */}
        {notifDropdownOpen && (
          <div className="xl:hidden border-t border-[#E2DFD8] bg-white p-3 space-y-2 shadow-lg">
            <div className="font-bold text-slate-900 text-xs pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Notifications</span>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(false)}
                className="text-[11px] text-slate-400 font-bold"
              >
                Close
              </button>
            </div>
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="font-bold text-slate-800">{n.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar */}
      {currentRole === 'worker' ? (
        /* WORKER MOBILE BOTTOM NAV: Home | Jobs | Schedule | Earnings | Profile */
        <nav
          aria-label="Worker Mobile Navigation"
          className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E2DFD8] px-2 py-1 flex items-center justify-around shadow-lg safe-area-inset-bottom"
        >
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('worker_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'worker_dashboard' || currentTab === 'home'
                ? 'text-[#17324D] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Home</span>
          </button>

          {/* 2. Jobs */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('worker_jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'worker_jobs' ? 'text-[#17324D] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Jobs</span>
          </button>

          {/* 3. Schedule */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('worker_schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'worker_schedule' ? 'text-[#17324D] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Schedule</span>
          </button>

          {/* 4. Earnings */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('worker_earnings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'worker_earnings' ? 'text-[#17324D] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Earnings</span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('worker_profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'worker_profile' ? 'text-[#17324D] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Profile</span>
          </button>
        </nav>
      ) : (
        /* CUSTOMER MOBILE BOTTOM NAV: Home, Services, Bookings, Live Map, Profile */
        <nav
          aria-label="Mobile Navigation"
          className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E2DFD8] px-2 py-1 flex items-center justify-around shadow-lg safe-area-inset-bottom"
        >
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'explore' ? 'text-[#17324D] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Home</span>
          </button>

          {/* 2. Services */}
          <button
            type="button"
            onClick={() => navigateTo('explore', 'explore-services-section')}
            className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-[#17324D] transition-colors cursor-pointer"
          >
            <Wrench className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Services</span>
          </button>

          {/* 3. Bookings */}
          <button
            type="button"
            onClick={() => navigateTo('explore', 'bookings-section')}
            className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-[#17324D] transition-colors cursor-pointer relative"
          >
            <div className="relative">
              <Calendar className="w-5 h-5 shrink-0" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#167A5B]" />
              )}
            </div>
            <span className="text-[11px] leading-tight">Bookings</span>
          </button>

          {/* 4. Live Map */}
          <button
            type="button"
            onClick={() => setCurrentTab('tracking')}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'tracking' || currentTab === 'gps_tracking'
                ? 'text-[#167A5B] font-bold'
                : 'text-slate-500 hover:text-[#167A5B]'
            }`}
          >
            <Navigation className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Live Map</span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-[#17324D] transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[11px] leading-tight">Profile</span>
          </button>
        </nav>
      )}

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-neutral-900">Select Service Location</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Choose your locality to view nearby verified professionals and active labour cooperatives.
            </p>
            <div className="space-y-2">
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSelectedCity(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCity === loc
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <span>{loc}</span>
                  {selectedCity === loc && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
