import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, WorkerProfile } from '../types';
import { WorkerCard } from './WorkerCard';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { LeafletMap, MapMarker } from './LeafletMap';
import { getInstitutionalServiceIcon } from './InstitutionalIcons';
import {
  Search,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Zap,
  Droplets,
  Hammer,
  Sparkles,
  Paintbrush,
  Tv,
  Calendar,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  Users,
  Award,
  PhoneCall,
  HeartHandshake,
  Map,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';

interface CustomerHomeProps {
  onNavigateToTracking?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigateToTracking }) => {
  const {
    currentTab,
    setCurrentTab,
    language,
    workers,
    bookings,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    setBookingTargetWorker,
    setSelectedWorkerForProfile,
    currentUser,
  } = useApp();

  // Verification filters
  const [filterGovVerified, setFilterGovVerified] = useState<boolean>(false);
  const [filterCoopVerified, setFilterCoopVerified] = useState<boolean>(false);
  const [filterPlatformVerified, setFilterPlatformVerified] = useState<boolean>(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState<boolean>(false);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);

  // Sorting & View Mode
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'jobs' | 'experience'>('recommended');
  const [directoryViewMode, setDirectoryViewMode] = useState<'grid' | 'map'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Search input state & suggestions
  const [localSearch, setLocalSearch] = useState('');
  const searchPlaceholders = [
    'Fan installation',
    'Plumbing repair',
    'Home cleaning',
    'Furniture repair',
    'Switchboard wiring',
    'Bathroom leakage fix',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLocality, setSearchLocality] = useState(selectedCity || 'Bahadurgarh, Haryana');
  const [searchIsEmergency, setSearchIsEmergency] = useState(false);

  const searchSuggestions = [
    'Ceiling fan installation',
    'Switchboard wiring & MCB',
    'Main water line leak repair',
    'Bathroom tap & mixer fix',
    'Door lock & handle repair',
    'Deep kitchen & bathroom scrubbing',
    'AC service & gas refill',
    'Wall dampness & touch-up paint',
  ];

  const popularServices: {
    category: ServiceCategory;
    title: string;
    subtitle: string;
  }[] = [
    {
      category: 'Electrical',
      title: 'Electrical',
      subtitle: 'Fans, wiring, switches & MCB',
    },
    {
      category: 'Plumbing',
      title: 'Plumbing',
      subtitle: 'Pipes, taps, motor & leaks',
    },
    {
      category: 'Carpentry',
      title: 'Carpentry',
      subtitle: 'Locks, doors & furniture repair',
    },
    {
      category: 'Cleaning',
      title: 'Cleaning',
      subtitle: 'Deep home & kitchen cleaning',
    },
    {
      category: 'Painting',
      title: 'Painting',
      subtitle: 'Touch-up, waterproofing & paint',
    },
    {
      category: 'Technician',
      title: 'Appliance Repair',
      subtitle: 'AC, geyser, washing machine & fridge',
    },
  ];

  // Filter workers based on search, category, verification, availability, and rating
  const filteredWorkers = workers
    .filter((w) => {
      if (selectedCategory !== 'ALL' && !w.skills.includes(selectedCategory) && w.primaryTrade !== selectedCategory) {
        return false;
      }
      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(query);
        const matchesTrade = w.primaryTrade.toLowerCase().includes(query);
        const matchesSkills = w.skills.some((s) => s.toLowerCase().includes(query));
        const matchesArea = w.serviceArea.toLowerCase().includes(query);
        if (!matchesName && !matchesTrade && !matchesSkills && !matchesArea) {
          return false;
        }
      }
      if (filterGovVerified && !w.isVerified) return false;
      if (filterCoopVerified && w.cooperativeVerificationStatus !== 'VERIFIED') return false;
      if (filterPlatformVerified && w.shramsetuVerificationStatus !== 'VERIFIED') return false;
      if (filterAvailableOnly && !w.isAvailable) return false;
      if (filterMinRating > 0 && w.rating < filterMinRating) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.completedJobsCount - a.completedJobsCount;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      // Default: recommended (combination of availability, rating, and fair distribution)
      return b.rating * 10 + (b.isAvailable ? 20 : 0) - (a.rating * 10 + (a.isAvailable ? 20 : 0));
    });

  // Active bookings for the customer dashboard
  const activeBookings = bookings.filter(
    (b) => b.status !== 'Work Completed' && b.status !== 'Cancelled'
  );

  // Map markers for workers in directory map view
  const workerMapMarkers: MapMarker[] = useMemo(() => {
    const baseLat = 28.6924;
    const baseLng = 76.9249;

    return filteredWorkers.map((w, idx) => {
      const lat = w.currentLocation?.lat ?? baseLat + Math.sin((idx + 1) * 1.35) * 0.038;
      const lng = w.currentLocation?.lng ?? baseLng + Math.cos((idx + 1) * 1.35) * 0.042;

      return {
        id: w.id,
        lat,
        lng,
        title: `${w.name} (${w.primaryTrade})`,
        subtitle: `${w.serviceArea} • ${w.rating}★ (${w.completedJobsCount} jobs) • ${w.isAvailable ? 'Available' : 'Busy'}`,
        type: 'worker' as const,
        photoUrl: w.photoUrl,
        speed: w.isOnline ? 18 : 0,
      };
    });
  }, [filteredWorkers]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 sm:pb-16 w-full max-w-full">
      {/* 1. INSTITUTIONAL SPLIT HERO SECTION & DISPATCH CONSOLE */}
      <section className="pt-2 sm:pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60%): Public-Service & Cooperative Mission */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
              <span className="w-2 h-2 rounded-full bg-[#167A5B] shrink-0" />
              <span>श्रम एवं रोजगार सहकारिता पहल • MSCS Act Registered</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#17324D] tracking-tight leading-[1.18]">
              Get skilled help at your doorstep.
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-800 -mt-2">
              Certified Trade Professionals. Governed by Registered Labour Cooperatives.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Connecting households, housing societies, and commercial enterprises with certified electricians, plumbers, carpenters, and technicians under transparent institutional governance.
            </p>

            {/* 3 Core Institutional Pillars */}
            <div className="space-y-2.5 pt-1 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <span className="font-semibold text-slate-800">
                  100% Direct Worker Remuneration
                </span>
                <span className="text-slate-500">— Zero intermediary commission on baseline labour</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <span className="font-semibold text-slate-800">
                  Triple-Layer Verification
                </span>
                <span className="text-slate-500">— Government records, cooperative federation audit &amp; identity checks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <span className="font-semibold text-slate-800">
                  Transparent Job-Based Pricing
                </span>
                <span className="text-slate-500">— Standard task tariffs with full digital receipt breakdown</span>
              </div>
            </div>

            {/* Public Stat Indicator */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                <strong>48 Verified Artisans</strong> active in {selectedCity || 'Bahadurgarh & West Delhi NCR'}
              </span>
            </div>
          </div>

          {/* Right Column (40%): Institutional Service-Search & Dispatch Panel */}
          <div className="lg:col-span-5 bg-white border border-[#D0D5DD] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#167A5B]">
                Cooperative Dispatch Panel
              </div>
              <h2 className="text-base font-bold text-[#17324D] mt-0.5">
                Find &amp; Dispatch Verified Artisans
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Search verified trade registry by specific task or equipment problem
              </p>
            </div>

            {/* Search Input with Autocomplete Dropdown */}
            <div className="relative">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Required Service or Problem
              </label>
              <div className="relative flex items-center bg-white rounded-lg border border-[#D0D5DD] hover:border-slate-500 focus-within:border-[#17324D] transition-colors p-1">
                <div className="pl-2.5 text-slate-400">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={localSearch}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder={`Try "${searchPlaceholders[placeholderIndex]}"`}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      setShowSuggestions(false);
                    }}
                    className="px-2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg z-30 p-1.5 space-y-1 text-xs max-h-48 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                    Common Service Requests
                  </div>
                  {searchSuggestions
                    .filter((s) => !localSearch || s.toLowerCase().includes(localSearch.toLowerCase()))
                    .map((sugg) => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => {
                          setLocalSearch(sugg);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{sugg}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Locality Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Service Locality / Sector
              </label>
              <div className="flex items-center gap-2 p-2 rounded-lg border border-[#D0D5DD] bg-[#F7F8F6] text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-800 flex-1 truncate">
                  {selectedCity || 'Bahadurgarh, Haryana'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const locBtn = document.querySelector('header button[class*="border-[#D0D5DD]"]') as HTMLElement;
                    if (locBtn) locBtn.click();
                  }}
                  className="text-[11px] font-bold text-[#17324D] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Emergency Dispatch Toggle */}
            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer pt-1 bg-[#FEF3F2]/60 p-2.5 rounded-lg border border-[#FECDCA]/80">
              <input
                type="checkbox"
                checked={searchIsEmergency}
                onChange={(e) => setSearchIsEmergency(e.target.checked)}
                className="mt-0.5 rounded text-[#B42318] focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-bold text-[#B42318]">Emergency Dispatch (within 45 mins)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Immediate dispatch for water pipe bursts, electrical sparks, or lockouts.
                </p>
              </div>
            </label>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={() => {
                setShowSuggestions(false);
                const el = document.getElementById('workers-directory-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full py-2.5 rounded-lg bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs text-center border border-[#224466]"
            >
              Find Verified Workers
            </button>

            {/* Quick Keyword Pills */}
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Popular:</span>
              {['Ceiling Fan', 'Water Leak', 'Switchboard', 'Door Lock'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setLocalSearch(tag);
                    setShowSuggestions(false);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services Grid (Institutional Icons & Restrained Geometry) */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3 border-b border-[#E4E7EC] pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Trade Categories
            </h3>
            <span className="text-[11px] text-slate-500">
              Governed by registered labour cooperative federations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {popularServices.map((service) => {
              const isSelected = selectedCategory === service.category;
              return (
                <button
                  key={service.category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'ALL' : service.category);
                    const el = document.getElementById('workers-directory-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-32 ${
                    isSelected
                      ? 'bg-[#17324D] text-white border-[#17324D] shadow-sm'
                      : 'bg-white hover:bg-[#F7F8F6] border-[#E4E7EC] text-slate-900 shadow-2xs hover:border-slate-400'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[#224466] border-[#2c5580] text-white'
                        : 'bg-[#F7F8F6] border-[#E4E7EC] text-[#17324D]'
                    }`}
                  >
                    {getInstitutionalServiceIcon(service.category, 'w-5 h-5 stroke-[1.75]')}
                  </div>
                  <div>
                    <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {service.title}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {service.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE LOCATION COMPONENT */}
      <section className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Cooperative Service Cluster</div>
            <div className="text-base font-bold text-[#17324D] flex items-center gap-2">
              <span>{selectedCity || 'Bahadurgarh, Haryana'}</span>
              <span className="w-2 h-2 rounded-full bg-[#167A5B]" />
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              48 verified trade professionals active across Electrical, Plumbing, Carpentry, Cleaning, and Appliance Repair.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="open-live-map-banner-btn"
            onClick={() => {
              if (onNavigateToTracking) {
                onNavigateToTracking();
              } else {
                setCurrentTab('tracking');
              }
            }}
            className="px-4 py-2 bg-[#17324D] hover:bg-[#112437] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 border border-[#224466]"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Live Map</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const locBtn = document.querySelector('header button[class*="border-[#D0D5DD]"]') as HTMLElement;
              if (locBtn) locBtn.click();
            }}
            className="px-4 py-2 bg-white hover:bg-[#F7F8F6] text-slate-800 border border-[#D0D5DD] rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Change cluster
          </button>
        </div>
      </section>

      {/* 3. ACTIVE BOOKINGS / PERSONAL DASHBOARD (If customer has active bookings) */}
      {activeBookings.length > 0 && (
        <section className="space-y-4" id="bookings-section">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Your Active Service</h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {activeBookings.length} In Progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">
                      {b.bookingNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <TradeBadgeAvatar
                      trade={b.serviceCategory}
                      name={b.workerName}
                      size="sm"
                    />
                    <div>
                      <div className="font-bold text-sm text-neutral-900">{b.workerName}</div>
                      <div className="text-xs text-neutral-500">{b.serviceCategory} Professional</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-neutral-600 space-y-1">
                    <div>
                      <span className="text-neutral-400">Scheduled: </span>
                      <span className="font-semibold text-neutral-800">{b.scheduledDate} at {b.scheduledTime}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Address: </span>
                      <span className="font-medium text-neutral-800">{b.customerLocation.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-neutral-900">
                    ₹{b.estimatedPrice} <span className="text-[10px] text-neutral-500 font-normal">total</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToTracking) onNavigateToTracking();
                      else setCurrentTab('tracking');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Track Worker Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PROFESSIONALS NEAR YOU (HORIZONTAL PREVIEW SECTION) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Professionals near you</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified local professionals available for residential and commercial bookings
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('workers-directory-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all 48 workers <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Worker Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workers.slice(0, 4).map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      {/* 5. TRUST SECTION: Why customers choose ShramSetu */}
      <section className="bg-white border border-[#E4E7EC] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="max-w-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#167A5B] mb-1">
            Institutional Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
            Why Customers Choose ShramSetu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            Directly connected with registered labour cooperatives to ensure worker safety, trade skill credibility, and transparent job pricing without middlemen exploitation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Benefit 1 */}
          <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F6] border border-[#E4E7EC]">
            <div className="w-8 h-8 rounded-md bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] font-black text-xs">
              ✓
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">3-Layer Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every professional undergoes trade certification validation, cooperative federation membership audit, and platform KYC checks.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F6] border border-[#E4E7EC]">
            <div className="w-8 h-8 rounded-md bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] font-black text-xs">
              ✓
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Cooperative-Backed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Workers belong to registered labour cooperative societies with fair welfare allocation, local accountability, and trade master support.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F6] border border-[#E4E7EC]">
            <div className="w-8 h-8 rounded-md bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] font-black text-xs">
              ✓
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Transparent Job Pricing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No hidden surge charges or arbitrary rates. Standard task tariffs with 100% baseline labour paid directly to workers.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F6] border border-[#E4E7EC]">
            <div className="w-8 h-8 rounded-md bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] font-black text-xs">
              ✓
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Worker Arrival Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track your assigned professional live on an interactive map with turn-by-turn route and safe one-time verification OTP upon arrival.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FULL MARKETPLACE DIRECTORY ("FIND WORKERS") */}
      <section className="pt-4 space-y-6" id="workers-directory-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7EC]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              Find Professionals Near You
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredWorkers.length} certified professionals in {selectedCity || 'Bahadurgarh'}
            </p>
          </div>

          {/* View Mode Toggle (Cards vs Live Map) & Sort By Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F7F8F6] p-1 rounded-lg border border-[#D0D5DD] text-xs">
              <button
                type="button"
                id="toggle-workers-grid-btn"
                onClick={() => setDirectoryViewMode('grid')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  directoryViewMode === 'grid'
                    ? 'bg-[#17324D] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                id="toggle-workers-map-btn"
                onClick={() => setDirectoryViewMode('map')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  directoryViewMode === 'map'
                    ? 'bg-[#17324D] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Map</span>
              </button>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-[#D0D5DD] rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#17324D]"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="jobs">Most Completed Jobs</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#D0D5DD] shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-bold text-[#17324D] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <span>
              Filter Workers{' '}
              {(filterGovVerified || filterCoopVerified || filterPlatformVerified || filterAvailableOnly || filterMinRating > 0 || selectedCategory !== 'ALL') ? '(Active)' : ''}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
          {(filterGovVerified || filterCoopVerified || filterPlatformVerified || filterAvailableOnly || filterMinRating > 0 || selectedCategory !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setFilterGovVerified(false);
                setFilterCoopVerified(false);
                setFilterPlatformVerified(false);
                setFilterAvailableOnly(false);
                setFilterMinRating(0);
                setSelectedCategory('ALL');
                setLocalSearch('');
              }}
              className="text-[11px] font-bold text-[#B42318] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Directory Layout: Left Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Filter Sidebar */}
          <aside className={`bg-white rounded-xl border border-[#E4E7EC] p-5 space-y-5 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto shadow-xs ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold text-[#17324D] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                Filter Workers
              </span>
              {(filterGovVerified || filterCoopVerified || filterPlatformVerified || filterAvailableOnly || filterMinRating > 0 || selectedCategory !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterGovVerified(false);
                    setFilterCoopVerified(false);
                    setFilterPlatformVerified(false);
                    setFilterAvailableOnly(false);
                    setFilterMinRating(0);
                    setSelectedCategory('ALL');
                    setLocalSearch('');
                  }}
                  className="text-[11px] font-bold text-[#17324D] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2">Trade Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none"
              >
                <option value="ALL">All Trade Categories</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Technician">Technician & Appliance</option>
                <option value="Gardening">Gardening</option>
                <option value="Domestic Help">Domestic Help</option>
              </select>
            </div>

            {/* Verification Status Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Verification Layers</label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterGovVerified}
                  onChange={(e) => setFilterGovVerified(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>Government Verified</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterCoopVerified}
                  onChange={(e) => setFilterCoopVerified(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>Cooperative Verified</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterPlatformVerified}
                  onChange={(e) => setFilterPlatformVerified(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>ShramSetu Verified</span>
              </label>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Availability</label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAvailableOnly}
                  onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>Available Now Only</span>
              </label>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2">Minimum Rating</label>
              <div className="flex gap-1.5">
                {[0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFilterMinRating(rate)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      filterMinRating === rate
                        ? 'bg-[#17324D] text-white border-[#17324D]'
                        : 'bg-[#F7F8F6] hover:bg-slate-100 text-slate-700 border-[#D0D5DD]'
                    }`}
                  >
                    {rate === 0 ? 'All' : `⭐ ${rate}+`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Worker Cards Grid OR Interactive Leaflet Map */}
          <main className="lg:col-span-3">
            {directoryViewMode === 'map' ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E4E7EC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#167A5B] animate-pulse" />
                      <span className="text-xs font-bold text-[#17324D] uppercase tracking-wider">
                        Live Worker Map • {filteredWorkers.length} Active in {selectedCity || 'Bahadurgarh'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Click any pin to inspect worker credentials or book
                    </span>
                  </div>

                  <LeafletMap
                    center={[28.6924, 76.9249]}
                    zoom={13}
                    heightClass="h-[460px] sm:h-[500px]"
                    markers={workerMapMarkers}
                    onSelectMarker={(workerId) => {
                      const worker = filteredWorkers.find((w) => w.id === workerId);
                      if (worker) setSelectedWorkerForProfile(worker);
                    }}
                  />
                </div>

                {/* Nearby Available Workers list below map */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Nearby Available Professionals ({filteredWorkers.length})</span>
                    <button
                      type="button"
                      onClick={() => setDirectoryViewMode('grid')}
                      className="text-[#17324D] hover:underline font-semibold text-xs cursor-pointer"
                    >
                      Switch to full grid view →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkers.slice(0, 6).map((worker) => (
                      <WorkerCard key={worker.id} worker={worker} />
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-[#E4E7EC] space-y-3 shadow-xs">
                <div className="text-3xl">🔍</div>
                <h3 className="text-base font-bold text-[#17324D]">No professionals found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query, location or filter settings to see available workers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterGovVerified(false);
                    setFilterCoopVerified(false);
                    setFilterPlatformVerified(false);
                    setFilterAvailableOnly(false);
                    setFilterMinRating(0);
                    setSelectedCategory('ALL');
                    setLocalSearch('');
                  }}
                  className="px-4 py-2 bg-[#17324D] hover:bg-[#112437] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#224466]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* 7. HOW IT WORKS SECTION */}
      <section className="pt-4 border-t border-[#E4E7EC]" id="how-it-works-section">
        <div className="text-center max-w-xl mx-auto space-y-1.5 mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#167A5B]">
            Transparent Cooperative Process
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
            How ShramSetu Operates
          </h2>
          <p className="text-xs text-slate-500">
            Connecting citizens directly with trade artisans under audited cooperative charters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-white border border-[#E4E7EC] shadow-xs space-y-2.5 text-center">
            <div className="w-10 h-10 rounded-lg bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] font-black text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Select Service &amp; Requirement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the trade work required and inspect itemized transparent standard job tariffs before booking.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E4E7EC] shadow-xs space-y-2.5 text-center">
            <div className="w-10 h-10 rounded-lg bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] font-black text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Cooperative Dispatch Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our fair workload algorithm assigns an accredited, verified trade artisan from your local cooperative society.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E4E7EC] shadow-xs space-y-2.5 text-center">
            <div className="w-10 h-10 rounded-lg bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] font-black text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-xs text-[#17324D]">Live GPS Tracking &amp; Direct Pay</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track worker dispatch on a live map with arrival OTP. Remit payments where 100% of standard labour reaches the artisan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
