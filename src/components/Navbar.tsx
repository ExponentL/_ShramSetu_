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
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Home,
  Wrench,
  Navigation,
  Map,
} from 'lucide-react';

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
  } = useApp();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

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
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E7EC] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Left: Brand Logo & Institutional Subtitle */}
            <div className="flex items-center gap-2 sm:gap-4 xl:gap-8 min-w-0">
              <button
                id="brand-logo-btn"
                onClick={() => navigateTo(currentRole === 'customer' ? 'explore' : 'worker_dashboard')}
                className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#17324D] text-white flex items-center justify-center font-black text-xs sm:text-sm tracking-tight shadow-xs transition-transform group-hover:scale-105 border border-[#224466] shrink-0">
                  SS
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-base sm:text-lg font-black tracking-tight text-[#17324D] leading-none">
                      ShramSetu
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                      श्रमसेतु
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 hidden 2xl:block whitespace-nowrap">
                    A Cooperative Labour Federation Initiative
                  </span>
                </div>
              </button>

              {/* Navigation Links (Desktop) */}
              <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs xl:text-sm font-medium text-slate-700 whitespace-nowrap">
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
                  onClick={() => navigateTo('explore', 'how-it-works-section')}
                  className="hover:text-[#17324D] transition-colors cursor-pointer py-1 hidden 2xl:inline-block"
                >
                  How It Works
                </button>
                <button
                  onClick={() => navigateTo('explore', 'bookings-section')}
                  className="hover:text-[#17324D] transition-colors cursor-pointer py-1 flex items-center gap-1.5"
                >
                  My Bookings
                  {activeBookingsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#17324D] text-white text-[10px] font-bold flex items-center justify-center">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Right: Location, Emergency, Notifications, Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Location Selector (Available on wide screens or via hero/mobile) */}
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D0D5DD] hover:border-slate-400 text-xs font-medium text-slate-800 transition-colors cursor-pointer bg-[#F7F8F6] shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold truncate max-w-[120px]">{selectedCity || 'Bahadurgarh, Haryana'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Emergency Service Button (Restrained Dark Red #B42318) */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA] text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Emergency electrician, water leak or plumbing assistance"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
                <span className="hidden 2xl:inline">Emergency SOS</span>
                <span className="2xl:hidden">SOS</span>
              </button>

              {/* Language Switcher */}
              <div className="relative hidden sm:block shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'pa' : 'en';
                    setLanguage(nextLang);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-[#D0D5DD] hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1 uppercase shrink-0"
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
                  className="p-1.5 sm:p-2 rounded-lg border border-[#D0D5DD] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer relative shrink-0"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B42318]" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-2">
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
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#D0D5DD] hover:bg-slate-100 transition-colors cursor-pointer shrink-0 bg-white"
                  title="Customer account options"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#17324D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser?.name ? currentUser.name.slice(0, 1).toUpperCase() : 'C'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap hidden sm:inline">
                    {currentUser?.name || 'Customer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
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

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg border border-[#D0D5DD] hover:bg-slate-100 text-slate-800 shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
            <button
              onClick={() => navigateTo('explore', 'explore-services-section')}
              className="w-full text-left py-2 font-semibold text-neutral-800 text-sm"
            >
              Services
            </button>
            <button
              onClick={() => navigateTo('explore', 'workers-directory-section')}
              className="w-full text-left py-2 font-semibold text-neutral-800 text-sm"
            >
              Find Workers
            </button>
            <button
              id="mobile-nav-live-tracking"
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentTab('tracking');
              }}
              className="w-full text-left py-2 font-semibold text-emerald-800 text-sm flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Live Map & GPS Tracking</span>
            </button>
            <button
              onClick={() => navigateTo('explore', 'how-it-works-section')}
              className="w-full text-left py-2 font-semibold text-neutral-800 text-sm"
            >
              How It Works
            </button>
            <button
              onClick={() => navigateTo('explore', 'bookings-section')}
              className="w-full text-left py-2 font-semibold text-neutral-800 text-sm"
            >
              My Bookings ({activeBookingsCount})
            </button>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="text-xs font-semibold text-neutral-700 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {selectedCity || 'Bahadurgarh, Haryana'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'pa' : 'en';
                  setLanguage(nextLang);
                }}
                className="text-xs font-bold text-neutral-800 uppercase px-2 py-1 bg-neutral-100 rounded"
              >
                Lang: {language}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (workers && workers.length > 0) setBookingTargetWorker(workers[0]);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs text-center mt-2 cursor-pointer shadow-xs whitespace-nowrap"
            >
              Book a Service
            </button>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => navigateTo('explore')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            currentTab === 'explore' ? 'text-neutral-950 font-bold' : 'text-neutral-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => navigateTo('explore', 'workers-directory-section')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-neutral-500"
        >
          <Wrench className="w-4 h-4" />
          <span>Workers</span>
        </button>
        <button
          onClick={() => setCurrentTab('tracking')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            currentTab === 'tracking' || currentTab === 'gps_tracking' ? 'text-emerald-700 font-bold' : 'text-neutral-500'
          }`}
        >
          <Navigation className="w-4 h-4 text-emerald-600" />
          <span>Live Map</span>
        </button>
        <button
          onClick={() => navigateTo('explore', 'bookings-section')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-neutral-500 relative"
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings</span>
          {activeBookingsCount > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>
        <button
          onClick={() => setProfileDropdownOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-neutral-500"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>

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
