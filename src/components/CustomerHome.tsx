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
  ChevronLeft,
  Users,
  Award,
  PhoneCall,
  HeartHandshake,
  Map,
  LayoutGrid,
  ChevronDown,
  AlertTriangle,
  Key,
  Flame,
  Check,
  Building2,
  Quote,
  BadgeCheck,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  SERVICE_CATEGORY_IMAGES,
  JOURNEY_STEP_IMAGES,
  WORKER_PHOTOGRAPHY_REGISTRY,
  IMAGE_REQUIRED_TOKEN,
} from '../data/imageAssets';
import { ServiceCategoryModal } from './ServiceCategoryModal';

// Subtle animated number counter for live availability
const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 850;
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

// Rich live search suggestion registry
interface ServiceSuggestionItem {
  name: string;
  category: ServiceCategory;
  keywords: string[];
  priceTag?: string;
  desc: string;
}

const SERVICE_SUGGESTIONS: ServiceSuggestionItem[] = [
  { name: 'Fan Installation', category: 'Electrical', keywords: ['fan', 'ceiling', 'exhaust', 'fitting', 'installation'], priceTag: '₹199', desc: 'Ceiling, exhaust or wall mount fan fitting' },
  { name: 'Fan Repair', category: 'Electrical', keywords: ['fan', 'speed', 'noise', 'capacitor', 'regulator', 'repair'], priceTag: '₹149', desc: 'Regulator, capacitor, noise & slow speed fix' },
  { name: 'Ceiling Fan Replacement', category: 'Electrical', keywords: ['fan', 'ceiling', 'replacement', 'motor', 'replace'], priceTag: '₹229', desc: 'Dismounting old unit & mounting new fan' },
  { name: 'Electrical Inspection', category: 'Electrical', keywords: ['fan', 'inspection', 'wiring', 'mcb', 'safety', 'electrical'], priceTag: '₹149', desc: 'Complete household wiring & load audit' },
  { name: 'Switchboard Repair & Upgrade', category: 'Electrical', keywords: ['switch', 'socket', 'plug', 'board', 'modular'], priceTag: '₹149', desc: 'Modular switch, socket & fuse repair' },
  { name: 'MCB Tripping Diagnosis & Fix', category: 'Electrical', keywords: ['mcb', 'trip', 'short circuit', 'fuse', 'power'], priceTag: '₹249', desc: 'Short circuit isolation & breaker overhaul' },
  { name: 'Inverter & Battery Wiring', category: 'Electrical', keywords: ['inverter', 'battery', 'backup', 'power'], priceTag: '₹349', desc: 'Power backup installation & cabling' },

  { name: 'Tap Repair & Spindle Fix', category: 'Plumbing', keywords: ['tap', 'faucet', 'leak', 'water', 'spindle'], priceTag: '₹149', desc: 'Washer seal, spindle change & drip repair' },
  { name: 'Flush Tank Valve Repair', category: 'Plumbing', keywords: ['flush', 'cistern', 'toilet', 'leak', 'tank'], priceTag: '₹249', desc: 'Ball cock, siphon valve & leakage overhaul' },
  { name: 'Water Pipe Leakage Overhaul', category: 'Plumbing', keywords: ['pipe', 'leak', 'plumbing', 'joint', 'water'], priceTag: '₹299', desc: 'GI/CPVC joint leakage welding & seal' },
  { name: 'Water Motor Pump Installation', category: 'Plumbing', keywords: ['motor', 'pump', 'water', 'submersible'], priceTag: '₹449', desc: 'Monoblock or submersible motor connection' },
  { name: 'Drain & Sink Blockage Clearing', category: 'Plumbing', keywords: ['drain', 'clog', 'block', 'sink', 'choke'], priceTag: '₹249', desc: 'Sink, waste pipe & sewer trap declogging' },

  { name: 'Door Lock Installation & Repair', category: 'Carpentry', keywords: ['lock', 'door', 'handle', 'key', 'mortise'], priceTag: '₹199', desc: 'Mortise, cylindrical or deadbolt lock fitting' },
  { name: 'Door Planing & Alignment', category: 'Carpentry', keywords: ['door', 'jammed', 'plane', 'hinge', 'align'], priceTag: '₹179', desc: 'Stuck door trimming, latch alignment' },
  { name: 'Wood Furniture Repair & Joint Fix', category: 'Carpentry', keywords: ['furniture', 'wood', 'chair', 'bed', 'table'], priceTag: '₹299', desc: 'Loose joint, wooden frame & chair repair' },
  { name: 'Cabinet Hinge & Channel Replacement', category: 'Carpentry', keywords: ['cabinet', 'drawer', 'channel', 'hinge'], priceTag: '₹149', desc: 'Hydraulic soft-close hinge & drawer fix' },

  { name: 'Deep Kitchen Degreasing & Clean', category: 'Cleaning', keywords: ['kitchen', 'clean', 'deep clean', 'tiles', 'grease'], priceTag: '₹599', desc: 'Tiles, chimney exterior & countertop scrub' },
  { name: 'Bathroom Stain & Tile Polish', category: 'Cleaning', keywords: ['bathroom', 'tiles', 'clean', 'hard water', 'stain'], priceTag: '₹399', desc: 'Hard water descaling & floor sanitization' },
  { name: 'Full Home Deep Sanitization', category: 'Cleaning', keywords: ['home', 'house', 'cleaning', 'deep', 'full'], priceTag: '₹1499', desc: 'Comprehensive multi-room floor scrubbing' },

  { name: 'AC Servicing & Gas Top-Up', category: 'Technician', keywords: ['ac', 'air conditioner', 'cooling', 'service', 'gas'], priceTag: '₹499', desc: 'Filter wash, cooling coil & pressure test' },
  { name: 'Washing Machine Drum & Motor Fix', category: 'Technician', keywords: ['washing machine', 'drum', 'spin', 'drainage'], priceTag: '₹249', desc: 'Spin error, drainage & motor diagnosis' },
  { name: 'Geyser Thermostat & Heating Element', category: 'Technician', keywords: ['geyser', 'heater', 'water heater', 'element'], priceTag: '₹299', desc: 'Heating coil replacement & thermostat fix' },
];

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
    setIsEmergencyModalOpen,
    setIsComplaintModalOpen,
  } = useApp();

  // Carousel ref for smooth horizontal scrolling
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmt = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  // Live Map State ("Skilled workers around you")
  const [mapClusterCategory, setMapClusterCategory] = useState<string>('ALL');
  const [selectedMapWorkerId, setSelectedMapWorkerId] = useState<string | null>(null);

  // "From Search to Doorstep" Journey active stage
  const [activeJourneyStage, setActiveJourneyStage] = useState<number>(0);

  // Active Category Detail Modal state (Service Page)
  const [activeCategoryModal, setActiveCategoryModal] = useState<ServiceCategory | null>(null);

  // Recent service activity ticker
  const [recentActivityIdx, setRecentActivityIdx] = useState<number>(0);
  const recentServiceActivities = [
    { text: 'Electrical service completed in Rohini', time: '12m ago', area: 'Rohini, Delhi' },
    { text: 'Plumbing booking confirmed in Bahadurgarh', time: '18m ago', area: 'Bahadurgarh' },
    { text: 'Carpenter assigned in Dwarka', time: '24m ago', area: 'Dwarka, Delhi' },
    { text: 'Switchboard repair completed in Paschim Vihar', time: '32m ago', area: 'West Delhi' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRecentActivityIdx((prev) => (prev + 1) % recentServiceActivities.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [recentServiceActivities.length]);

  // Dynamic Job-Based Pricing interactive calculation demo
  const [demoFans, setDemoFans] = useState<number>(3);
  const [demoLights, setDemoLights] = useState<number>(6);
  // Job-Based Pricing Equation: Items/Quantity + Material Cost + Labour Cost = Total Job Cost
  const demoMaterialCost = demoFans * 1200 + demoLights * 150;
  const demoLabourCost = demoFans * 350 + demoLights * 75;
  const demoTotalJobCost = demoMaterialCost + demoLabourCost;

  // Worker verification accordion state
  const [verificationAccordionOpen, setVerificationAccordionOpen] = useState<boolean>(false);

  // Markers for the Dedicated "Skilled workers around you" Live Map
  const skilledMapMarkers = useMemo<MapMarker[]>(() => {
    const markers: MapMarker[] = [
      {
        id: 'customer-home-pin',
        lat: 28.6924,
        lng: 76.9249,
        title: 'Customer Location',
        subtitle: `${selectedCity || 'Bahadurgarh'}, Haryana`,
        type: 'customer',
      },
    ];

    const displayList = workers.filter((w) => {
      if (mapClusterCategory !== 'ALL' && w.primaryTrade !== mapClusterCategory) return false;
      return true;
    });

    displayList.forEach((w) => {
      const latOffset = Math.sin(w.id.charCodeAt(w.id.length - 1) * 3) * 0.015;
      const lngOffset = Math.cos(w.id.charCodeAt(0) * 5) * 0.018;
      markers.push({
        id: w.id,
        lat: Number((28.6924 + latOffset).toFixed(5)),
        lng: Number((76.9249 + lngOffset).toFixed(5)),
        title: `${w.name} (${w.primaryTrade})`,
        subtitle: `${w.rating}★ • ${w.completedJobsCount} jobs • ${w.cooperativeName}`,
        type: 'worker',
        photoUrl: w.photoUrl,
      });
    });

    return markers;
  }, [workers, mapClusterCategory, selectedCity]);

  const selectedMapWorker = useMemo(() => {
    if (!selectedMapWorkerId) return null;
    return workers.find((w) => w.id === selectedMapWorkerId) || null;
  }, [selectedMapWorkerId, workers]);

  // Signature 7-Stage Journey Data
  const journeyStages = [
    {
      step: 1,
      title: 'Choose service',
      badge: 'Transparent Tariff',
      tagline: 'Itemized cooperative trade tariffs',
      desc: 'Browse verified trades with standard upfront itemized rates. Zero surge fees, zero hourly ambiguity.',
      guarantee: '100% itemized pricing agreed upfront before artisan dispatch.',
      photo: JOURNEY_STEP_IMAGES[1].url,
    },
    {
      step: 2,
      title: 'Choose professional',
      badge: 'Cooperative Audited',
      tagline: 'Certified trade artisans near you',
      desc: 'Inspect government skill certifications, cooperative peer audits, customer reviews, and authentic photo profiles.',
      guarantee: 'All artisans backed by registered district labour cooperatives.',
      photo: JOURNEY_STEP_IMAGES[2].url,
    },
    {
      step: 3,
      title: 'Define job',
      badge: 'Job-Based Pricing',
      tagline: 'Item & quantity scope selection',
      desc: 'Specify exact required items (e.g. 3 Ceiling Fans, 6 LED Lights) with material cost + labour cost separated cleanly.',
      guarantee: 'Strictly job-based pricing: items + materials + labour = total job cost.',
      photo: JOURNEY_STEP_IMAGES[3].url,
    },
    {
      step: 4,
      title: 'Book appointment',
      badge: 'Guaranteed Slot',
      tagline: 'Convenient schedule window',
      desc: 'Select preferred day and time window. Fair cooperative workload algorithm allocates the closest available specialist.',
      guarantee: 'Fair workload distribution ensures punctual attendance and rested workers.',
      photo: JOURNEY_STEP_IMAGES[4].url,
    },
    {
      step: 5,
      title: 'Track arrival',
      badge: 'Live Telemetry',
      tagline: 'Real-time GPS with arrival PIN',
      desc: 'Follow your assigned professional on a live map with estimated arrival time and a secure one-time doorstep safety PIN.',
      guarantee: 'Zero fake tracking: genuine cooperative telemetry with encrypted arrival OTP.',
      photo: JOURNEY_STEP_IMAGES[5].url,
    },
    {
      step: 6,
      title: 'Complete service',
      badge: 'Guild Standard',
      tagline: 'Professional execution & sign-off',
      desc: 'Skilled execution with trade safety standards. Diagnostic checklist verified and recorded under the cooperative charter.',
      guarantee: 'Master artisan dispute arbitration and 7-day cooperative workmanship warranty.',
      photo: JOURNEY_STEP_IMAGES[6].url,
    },
    {
      step: 7,
      title: 'Review',
      badge: 'Direct Remuneration',
      tagline: 'Feedback & direct artisan pay',
      desc: 'Rate quality, vouch for artisan skill, and remit digital payment where 100% of standard labour reaches the worker.',
      guarantee: 'Zero platform commission cuts: workers retain full dignity and earnings.',
      photo: JOURNEY_STEP_IMAGES[7].url,
    },
  ];

  // Verification & Directory filters
  const [filterGovVerified, setFilterGovVerified] = useState<boolean>(false);
  const [filterCoopVerified, setFilterCoopVerified] = useState<boolean>(false);
  const [filterPlatformVerified, setFilterPlatformVerified] = useState<boolean>(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState<boolean>(false);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [filterMinExperience, setFilterMinExperience] = useState<number>(0);
  const [filterLocationArea, setFilterLocationArea] = useState<string>('ALL');

  // Sorting & View Mode
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'jobs' | 'experience'>('recommended');
  const [directoryViewMode, setDirectoryViewMode] = useState<'grid' | 'map'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [mobileMapTab, setMobileMapTab] = useState<'map' | 'list'>('map');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (filterGovVerified) count++;
    if (filterCoopVerified) count++;
    if (filterPlatformVerified) count++;
    if (filterAvailableOnly) count++;
    if (filterMinRating > 0) count++;
    if (filterMinExperience > 0) count++;
    if (filterLocationArea !== 'ALL') count++;
    return count;
  }, [selectedCategory, filterGovVerified, filterCoopVerified, filterPlatformVerified, filterAvailableOnly, filterMinRating, filterMinExperience, filterLocationArea]);

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

  const matchingSuggestions = useMemo(() => {
    if (!localSearch.trim()) return [];
    const q = localSearch.toLowerCase().trim();
    return SERVICE_SUGGESTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
    );
  }, [localSearch]);

  // Visual Service Discovery Categories with Authentic Photography
  const visualServices: {
    category: ServiceCategory;
    title: string;
    tagline: string;
    photoUrl: string;
    alt: string;
    tasks: string[];
    availableCount: number;
    badge: string;
    startingPrice: string;
  }[] = [
    {
      category: 'Electrical',
      title: 'Electrical',
      tagline: 'Fan · Wiring · MCB',
      photoUrl: SERVICE_CATEGORY_IMAGES['Electrical'].url,
      alt: SERVICE_CATEGORY_IMAGES['Electrical'].alt,
      tasks: ['Fan installation', 'Wiring', 'Switches', 'MCB repair'],
      availableCount: 12,
      badge: 'Active Guild',
      startingPrice: '₹149',
    },
    {
      category: 'Plumbing',
      title: 'Plumbing',
      tagline: 'Sink · Tap · Water Pipe',
      photoUrl: SERVICE_CATEGORY_IMAGES['Plumbing'].url,
      alt: SERVICE_CATEGORY_IMAGES['Plumbing'].alt,
      tasks: ['Pipe repair', 'Tap fixing', 'Flush tank', 'Leakage fix'],
      availableCount: 9,
      badge: 'Active Guild',
      startingPrice: '₹149',
    },
    {
      category: 'Carpentry',
      title: 'Carpentry',
      tagline: 'Furniture · Door · Cabinet',
      photoUrl: SERVICE_CATEGORY_IMAGES['Carpentry'].url,
      alt: SERVICE_CATEGORY_IMAGES['Carpentry'].alt,
      tasks: ['Door locks', 'Furniture repair', 'Alignment', 'Shelving'],
      availableCount: 7,
      badge: 'Craft Guild',
      startingPrice: '₹179',
    },
    {
      category: 'Cleaning',
      title: 'Cleaning',
      tagline: 'Floor · Kitchen · Bathroom',
      photoUrl: SERVICE_CATEGORY_IMAGES['Cleaning'].url,
      alt: SERVICE_CATEGORY_IMAGES['Cleaning'].alt,
      tasks: ['Deep kitchen', 'Bathroom descaling', 'Floor sanitizing', 'Full home'],
      availableCount: 8,
      badge: 'Sanitation Cell',
      startingPrice: '₹399',
    },
    {
      category: 'Painting',
      title: 'Painting',
      tagline: 'Wall · Roller · Brush',
      photoUrl: SERVICE_CATEGORY_IMAGES['Painting'].url,
      alt: SERVICE_CATEGORY_IMAGES['Painting'].alt,
      tasks: ['Wall dampness', 'Touch-up', 'Waterproofing', 'Interior paint'],
      availableCount: 5,
      badge: 'Surface Guild',
      startingPrice: '₹499',
    },
    {
      category: 'Technician',
      title: 'Appliance Repair',
      tagline: 'AC · Washing Machine · Fridge',
      photoUrl: SERVICE_CATEGORY_IMAGES['Technician'].url,
      alt: SERVICE_CATEGORY_IMAGES['Technician'].alt,
      tasks: ['AC service', 'Washing machine', 'Geyser', 'Refrigerator'],
      availableCount: 6,
      badge: 'Appliance Guild',
      startingPrice: '₹249',
    },
    {
      category: 'Gardening',
      title: 'Gardening',
      tagline: 'Plants · Lawn · Landscaping',
      photoUrl: SERVICE_CATEGORY_IMAGES['Gardening'].url,
      alt: SERVICE_CATEGORY_IMAGES['Gardening'].alt,
      tasks: ['Lawn pruning', 'Plant health', 'Soil aeration', 'Hedge trimming'],
      availableCount: 4,
      badge: 'Horticulture Cell',
      startingPrice: '₹299',
    },
    {
      category: 'Driving',
      title: 'Driving',
      tagline: 'Chauffeur · Highway · Airport',
      photoUrl: SERVICE_CATEGORY_IMAGES['Driving'].url,
      alt: SERVICE_CATEGORY_IMAGES['Driving'].alt,
      tasks: ['Chauffeur', 'Highway trips', 'Vehicle inspection', 'Airport pickup'],
      availableCount: 5,
      badge: 'Verified Drivers',
      startingPrice: '₹449',
    },
    {
      category: 'Domestic Help',
      title: 'Caregiving',
      tagline: 'Elderly · Companion · Care',
      photoUrl: SERVICE_CATEGORY_IMAGES['Domestic Help'].url,
      alt: SERVICE_CATEGORY_IMAGES['Domestic Help'].alt,
      tasks: ['Elderly assistance', 'Patient companion', 'Mobility support', 'Medication timing'],
      availableCount: 6,
      badge: 'Care Cell',
      startingPrice: '₹599',
    },
  ];

  // Filter workers based on search, category, verification, availability, rating, experience, and area
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
      if (filterMinExperience > 0 && w.experienceYears < filterMinExperience) return false;
      if (filterLocationArea !== 'ALL' && !w.serviceArea.toLowerCase().includes(filterLocationArea.toLowerCase())) return false;

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
      {/* ================================================== */}
      {/* MOBILE-FIRST HOMEPAGE FLOW (lg:hidden) */}
      {/* Order: Branding -> Headline -> Supporting -> Search & Chips -> Popular Services (2-col grid) -> Worker Visual (ONE wide image) -> Nearby Availability -> Featured Workers */}
      {/* ================================================== */}
      <section className="lg:hidden space-y-6 pt-1">
        {/* 1. ShramSetu Branding */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#17324D] text-white flex items-center justify-center font-black text-sm border border-[#224466] shadow-2xs">
                SS
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-black text-[#17324D] tracking-tight">ShramSetu</span>
                  <span className="text-xs font-bold text-[#167A5B]">श्रमसेतु</span>
                </div>
                <div className="text-[11px] font-semibold text-[#C25E00] leading-none mt-0.5">
                  Trusted Skills. Right at Your Doorstep.
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#167A5B] shrink-0" />
              <span>Labour Cooperatives</span>
            </div>
          </div>
        </div>

        {/* 2. Short Headline & 3. Supporting Text */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#17324D] tracking-tight leading-tight">
            Skilled help, right at your doorstep.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Electricians, plumbers, carpenters, cleaners and technicians from trusted local cooperatives across Bahadurgarh &amp; NCR.
          </p>
        </div>

        {/* 4. Large Search Field & Popular Chips */}
        <div className="space-y-2.5">
          <div className="relative">
            <div className="relative flex items-center bg-white rounded-xl border border-[#D0D5DD] focus-within:border-[#17324D] p-1.5 shadow-2xs min-h-[48px]">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-[#17324D]" />
              </div>
              <input
                type="text"
                value={localSearch}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search electrical, plumbing, carpentry..."
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setShowSuggestions(false);
                  }}
                  className="px-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && matchingSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E2DFD8] rounded-xl shadow-xl z-30 p-2 space-y-1 text-xs max-h-64 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Matching Services
                </div>
                {matchingSuggestions.map((sugg) => (
                  <button
                    key={sugg.name}
                    type="button"
                    onClick={() => {
                      setLocalSearch(sugg.name);
                      setSelectedCategory(sugg.category);
                      setShowSuggestions(false);
                      const el = document.getElementById('workers-directory-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#FAF8F5] text-slate-800 transition-colors cursor-pointer flex items-center justify-between min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A5B] shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">{sugg.name}</div>
                        <div className="text-[10px] text-slate-500">{sugg.desc}</div>
                      </div>
                    </div>
                    {sugg.priceTag && (
                      <span className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E2DFD8] px-2 py-0.5 rounded">
                        {sugg.priceTag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Search Chips (min 44px touch targets) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">Popular:</span>
            {(['Electrical', 'Plumbing', 'Carpentry', 'Cleaning'] as const).map((trade) => (
              <button
                key={trade}
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === trade ? 'ALL' : trade);
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 min-h-[44px] transition-all cursor-pointer border ${
                  selectedCategory === trade
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-white text-slate-800 border-[#D0D5DD] hover:border-slate-400'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Popular Services (2-Column Responsive Grid) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#17324D] tracking-tight">
              Service Categories
            </h2>
            <span className="text-[11px] font-bold text-[#167A5B]">
              Itemized task tariffs
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {visualServices.map((service) => {
              const isSelected = selectedCategory === service.category;
              return (
                <div
                  key={`mob-${service.category}`}
                  onClick={() => setActiveCategoryModal(service.category)}
                  className={`group rounded-2xl border bg-white overflow-hidden shadow-2xs transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'border-[#17324D] ring-2 ring-[#17324D]' : 'border-[#E2DFD8]'
                  }`}
                >
                  {/* Top: Real Photograph (occupies ~50% of card, no text covering faces) */}
                  <div className="relative h-28 sm:h-32 overflow-hidden bg-slate-100">
                    <img
                      src={service.photoUrl}
                      alt={service.alt}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    {/* Small top right availability pill */}
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/95 text-slate-800 backdrop-blur-xs shadow-2xs">
                        {service.availableCount} Avail
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Clean simple text panel */}
                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#17324D] tracking-tight truncate">
                        {service.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                        {service.tagline}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between mt-2 text-[11px]">
                      <span className="font-bold text-[#167A5B]">From {service.startingPrice}</span>
                      <span className="w-6 h-6 rounded-lg bg-[#FAF8F5] border border-[#E2DFD8] flex items-center justify-center text-[#17324D]">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Worker/Service Visual (ONE Strong, Wide Realistic Image) */}
        <div className="rounded-2xl border border-[#E2DFD8] overflow-hidden bg-white shadow-xs relative">
          <div className="relative aspect-16/9 sm:aspect-21/9 bg-slate-100 overflow-hidden">
            <img
              src={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].url}
              alt={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Overlays */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#167A5B] text-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>✓ Verified Worker</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-xs font-bold shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                4.8★
              </span>
            </div>

            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Cooperative Member • ITI Certified
              </div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                Rajesh Kumar
              </h3>
              <div className="text-[11px] text-slate-200 mt-0.5 flex items-center justify-between">
                <span>Bahadurgarh Labour Cooperative</span>
                <span className="font-semibold text-emerald-300">100% Direct Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Nearby Availability Counter & Cluster Filter Pills */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 radar-beacon shrink-0" />
            <span className="font-bold text-slate-900 text-sm">
              <AnimatedCounter target={48} /> verified workers available nearby
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {selectedCity || 'Bahadurgarh & West Delhi NCR'}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { id: 'Electrical', label: 'Electrical', count: 12 },
              { id: 'Plumbing', label: 'Plumbing', count: 9 },
              { id: 'Carpentry', label: 'Carpentry', count: 7 },
              { id: 'Cleaning', label: 'Cleaning', count: 8 },
            ].map((cluster) => {
              const isSelected = selectedCategory === cluster.id;
              return (
                <button
                  key={`mob-avail-${cluster.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'ALL' : (cluster.id as ServiceCategory));
                    const el = document.getElementById('workers-directory-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                    isSelected
                      ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                      : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:bg-white'
                  }`}
                >
                  <span>{cluster.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                      isSelected ? 'bg-[#224466] text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {cluster.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Featured Workers Horizontal Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#167A5B]">
                Cooperative Guild
              </div>
              <h2 className="text-base font-black text-[#17324D] tracking-tight">
                Featured Professionals
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('workers-directory-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-xs font-bold text-[#17324D] hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-none -mx-1 px-1">
            {workers.slice(0, 8).map((worker) => (
              <div key={`mob-feat-${worker.id}`} className="snap-start shrink-0 w-[285px]">
                <WorkerCard worker={worker} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. SPLIT HERO SECTION WITH REALISTIC INDIAN ARTISAN PHOTOGRAPHY (DESKTOP) */}
      <section className="hidden lg:block pt-2 sm:pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Mission, Headline, Supporting Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#167A5B] shrink-0" />
              <span>Trusted workers from labour cooperatives</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17324D] tracking-tight leading-[1.12]">
                Skilled people.<br />
                <span className="text-[#167A5B]">Right where you need them.</span>
              </h1>
              <div className="text-xs sm:text-sm font-bold text-[#C25E00] flex flex-wrap items-center gap-1.5 pt-1">
                <span>Trusted Skills. Right at Your Doorstep.</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">Get skilled help at your doorstep across Bahadurgarh &amp; NCR</span>
              </div>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Find verified electricians, plumbers, carpenters, cleaners and technicians from trusted cooperative societies.
            </p>

            {/* Action Buttons: [Find a Professional] [Explore Services] */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-5 py-3 rounded-xl bg-[#17324D] hover:bg-[#112538] text-white text-sm font-bold transition-all cursor-pointer shadow-sm border border-[#224466] flex items-center gap-2 btn-tactile"
              >
                <span>Find a Professional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('explore-services-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#17324D] text-sm font-bold transition-all cursor-pointer border border-[#E2DFD8] hover:border-slate-400 shadow-2xs btn-tactile"
              >
                <span>Explore Services</span>
              </button>
            </div>

            {/* 3 Core Cooperative Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E2DFD8] card-interactive shadow-2xs">
                <span className="w-6 h-6 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">100% Direct Pay</div>
                  <div className="text-[11px] text-slate-500">Zero commission cut</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E2DFD8] card-interactive shadow-2xs">
                <span className="w-6 h-6 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Triple-Layer Audit</div>
                  <div className="text-[11px] text-slate-500">Gov &amp; guild certified</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E2DFD8] card-interactive shadow-2xs">
                <span className="w-6 h-6 rounded-md bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6E7D8]">
                  ✓
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Fixed Tariffs</div>
                  <div className="text-[11px] text-slate-500">Standard task pricing</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Indian Worker Photography Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white border border-[#E2DFD8] rounded-2xl p-4 sm:p-5 shadow-sm card-interactive">
              {/* Primary Visual Anchor: Electrician in authentic work environment */}
              <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-[#E2DFD8]">
                <img
                  src={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].url}
                  alt={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].alt}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Electrician Badge Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#167A5B] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                      Electrician • ITI Certified
                    </span>
                    <h3 className="font-black text-sm sm:text-base leading-tight">Rajesh Kumar</h3>
                    <p className="text-[11px] text-slate-200">Bahadurgarh Labour Cooperative Society</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 bg-white/95 text-slate-900 text-xs font-bold px-2 py-0.5 rounded shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      4.8★
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Duo: Plumber & Carpenter in authentic work settings */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Plumber Card */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] hover:border-slate-400 transition-colors">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#E2DFD8] bg-slate-200">
                    <img
                      src={WORKER_PHOTOGRAPHY_REGISTRY['w-102'].url}
                      alt={WORKER_PHOTOGRAPHY_REGISTRY['w-102'].alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-[#167A5B] uppercase tracking-wider">
                      Plumbing
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">Harpreet S.</div>
                    <div className="text-[10px] text-slate-500 truncate">4.9★ (38 jobs)</div>
                  </div>
                </div>

                {/* Carpenter Card */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] hover:border-slate-400 transition-colors">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#E2DFD8] bg-slate-200">
                    <img
                      src={WORKER_PHOTOGRAPHY_REGISTRY['w-104'].url}
                      alt={WORKER_PHOTOGRAPHY_REGISTRY['w-104'].alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-[#167A5B] uppercase tracking-wider">
                      Carpentry
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">Mohammed A.</div>
                    <div className="text-[10px] text-slate-500 truncate">4.7★ (41 jobs)</div>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="mt-3 pt-2.5 border-t border-[#EBE8E1] flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#17324D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#167A5B]" />
                  <span>100% Cooperative Verified Artisans</span>
                </span>
                <span className="text-[#C25E00] font-semibold">Zero Commission Cut</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LARGE SERVICE-SEARCH COMPONENT (OVERLAPPING HERO) & LIVE AVAILABILITY (DESKTOP) */}
      <section className="hidden lg:block relative z-20">
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-5 sm:p-7 shadow-md card-interactive">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-lg sm:text-xl font-black text-[#17324D] tracking-tight">
              What do you need help with?
            </h2>
            <span className="text-xs font-semibold text-[#167A5B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#167A5B]" />
              Itemized job tariffs • 100% direct worker pay
            </span>
          </div>

          {/* Search Input Bar with Smooth Live Suggestions */}
          <div className="relative">
            <div className="relative flex items-center bg-[#FAF8F5] rounded-xl border border-[#D0D5DD] hover:border-slate-500 focus-within:border-[#17324D] focus-within:bg-white transition-all p-1.5 shadow-2xs">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-[#17324D]" />
              </div>
              <input
                type="text"
                value={localSearch}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search for a service, skill or requirement (e.g. Fan installation, Tap repair)..."
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setShowSuggestions(false);
                  }}
                  className="px-3 text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Dropdown with Smooth Animation */}
            {showSuggestions && matchingSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E2DFD8] rounded-xl shadow-xl z-30 p-2 space-y-1 text-xs max-h-64 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Matching Services &amp; Requirements
                </div>
                {matchingSuggestions.map((sugg) => (
                  <button
                    key={sugg.name}
                    type="button"
                    onClick={() => {
                      setLocalSearch(sugg.name);
                      setSelectedCategory(sugg.category);
                      setShowSuggestions(false);
                      const el = document.getElementById('workers-directory-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF8F5] text-slate-800 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A5B] shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-[#17324D]">
                          {sugg.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{sugg.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {sugg.priceTag && (
                        <span className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E2DFD8] px-2 py-0.5 rounded">
                          {sugg.priceTag}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LIVE AVAILABILITY SECTION */}
          <div className="mt-5 pt-4 border-t border-[#EBE8E1] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 radar-beacon shrink-0" />
              <span className="font-bold text-slate-900">
                <AnimatedCounter target={48} /> verified professionals available nearby
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-500 hidden sm:inline">
                {selectedCity || 'Bahadurgarh & West Delhi NCR'}
              </span>
            </div>

            {/* Small Categories: Electrical 12, Plumbing 9, Carpentry 7, Cleaning 8 */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === 'Electrical' ? 'ALL' : 'Electrical');
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
                  selectedCategory === 'Electrical'
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span>Electrical</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                    selectedCategory === 'Electrical'
                      ? 'bg-[#224466] text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <AnimatedCounter target={12} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === 'Plumbing' ? 'ALL' : 'Plumbing');
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
                  selectedCategory === 'Plumbing'
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span>Plumbing</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                    selectedCategory === 'Plumbing'
                      ? 'bg-[#224466] text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <AnimatedCounter target={9} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === 'Carpentry' ? 'ALL' : 'Carpentry');
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
                  selectedCategory === 'Carpentry'
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span>Carpentry</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                    selectedCategory === 'Carpentry'
                      ? 'bg-[#224466] text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <AnimatedCounter target={7} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === 'Cleaning' ? 'ALL' : 'Cleaning');
                  const el = document.getElementById('workers-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
                  selectedCategory === 'Cleaning'
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span>Cleaning</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                    selectedCategory === 'Cleaning'
                      ? 'bg-[#224466] text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <AnimatedCounter target={8} />
                </span>
              </button>
            </div>
          </div>

          {/* RECENT SERVICE ACTIVITY TICKER */}
          <div className="mt-4 pt-3.5 border-t border-[#EBE8E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[11px] shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#167A5B] radar-beacon shrink-0" />
              <span className="text-[#17324D]">Recent service activity</span>
            </div>

            <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-xl">
              <div
                key={recentActivityIdx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] font-bold text-xs transition-all duration-300 animate-in fade-in slide-in-from-right-3"
              >
                <Check className="w-3.5 h-3.5 shrink-0 text-[#167A5B]" />
                <span className="truncate">{recentServiceActivities[recentActivityIdx].text}</span>
                <span className="text-[10px] text-slate-400 font-normal shrink-0">
                  • {recentServiceActivities[recentActivityIdx].time}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-medium hidden md:inline shrink-0">
              Cooperative dispatch across Delhi NCR
            </span>
          </div>
        </div>
      </section>

      {/* 3. SERVICE DISCOVERY (9 LARGE VISUAL SERVICE TILES) (DESKTOP) */}
      <section className="hidden lg:block pt-2 space-y-4" id="explore-services-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E4E7EC] pb-3">
          <div>
            <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
              Cooperative Trade Categories
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              Service Categories
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Governed by registered labour cooperatives with transparent itemized tariffs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visualServices.map((service) => {
            const isSelected = selectedCategory === service.category;
            return (
              <div
                key={service.category}
                onClick={() => setActiveCategoryModal(service.category)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between text-left shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#17324D] ring-2 ring-[#17324D] bg-white'
                    : 'border-[#E2DFD8] bg-white hover:border-slate-400'
                }`}
              >
                {/* Visual Service Photo Section (Occupies ~50% of the card) */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={service.photoUrl}
                    alt={service.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle top badge pills that do not block faces or work actions */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs border border-white/20 shadow-2xs">
                      {service.badge}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 backdrop-blur-xs shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {service.availableCount} Available
                    </span>
                  </div>
                </div>

                {/* Text section below the photograph (Simple clean text) */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#17324D] tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Bottom row with simple starting price & animated arrow */}
                  <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs mt-2">
                    <span className="font-semibold text-slate-600">
                      From {service.startingPrice}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#17324D] group-hover:text-[#167A5B] transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PROFESSIONALS PEOPLE TRUST (DEEP NAVY #17324D) (DESKTOP) */}
      <section className="hidden lg:block bg-[#17324D] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-5" id="professionals-trust-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#224466] pb-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
              Verified Artisans &amp; Tradespeople
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Professionals people trust
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Meet skilled workers from cooperative societies near you.
            </p>
          </div>

          {/* Carousel Navigation Buttons & View All */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="w-8 h-8 rounded-lg border border-[#2c5580] bg-[#1d3d5e] hover:bg-[#234b73] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous professionals"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="w-8 h-8 rounded-lg border border-[#2c5580] bg-[#1d3d5e] hover:bg-[#234b73] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Next professionals"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('workers-directory-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer ml-2"
            >
              <span>View all {workers.length} workers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visually Rich Horizontal Worker Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-none -mx-1 px-1"
        >
          {workers.map((worker) => (
            <div key={worker.id} className="snap-start shrink-0 w-[295px] sm:w-[325px]">
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE MAP: "Skilled workers around you" (WHITE #FFFFFF) */}
      <section className="bg-white border border-[#E4E7EC] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4" id="skilled-workers-map-section">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#E4E7EC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#167A5B] radar-beacon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#167A5B]">
                Live Cooperative Telemetry
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                Location updated
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              Skilled workers around you
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time view of verified cooperative trade professionals across {selectedCity || 'Bahadurgarh'} · <span className="text-slate-400 font-medium">Simulated cooperative telemetry</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-slate-800 border border-[#D0D5DD] rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Change cluster
            </button>
          </div>
        </div>

        {/* Live Availability Clusters Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Available Nearby:</span>
          {[
            { id: 'ALL', label: 'All Active' },
            { id: 'Electrical', label: '12 electricians nearby' },
            { id: 'Plumbing', label: '9 plumbers nearby' },
            { id: 'Carpentry', label: '7 carpenters nearby' },
            { id: 'Cleaning', label: '8 cleaners nearby' },
          ].map((cluster) => {
            const isSelected = mapClusterCategory === cluster.id;
            return (
              <button
                key={cluster.id}
                type="button"
                onClick={() => setMapClusterCategory(cluster.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-800 border-[#E2DFD8] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-[#167A5B]'}`} />
                <span>{cluster.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile View Toggle: [Map View] [List View] */}
        <div className="flex sm:hidden items-center bg-[#F7F8F6] p-1 rounded-xl border border-[#D0D5DD] text-xs">
          <button
            type="button"
            onClick={() => setMobileMapTab('map')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all min-h-[44px] cursor-pointer ${
              mobileMapTab === 'map' ? 'bg-[#17324D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMapTab('list')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all min-h-[44px] cursor-pointer ${
              mobileMapTab === 'list' ? 'bg-[#17324D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>

        {/* Professional Map Interface */}
        <div className={`relative rounded-xl overflow-hidden border border-[#E4E7EC] shadow-inner bg-slate-100 ${mobileMapTab === 'list' ? 'hidden sm:block' : 'block'}`}>
          <LeafletMap
            center={[28.6924, 76.9249]}
            zoom={13}
            heightClass="h-[360px] sm:h-[440px]"
            markers={skilledMapMarkers}
            onSelectMarker={(markerId) => {
              if (markerId === 'customer-home-pin') return;
              setSelectedMapWorkerId(markerId);
              const worker = workers.find((w) => w.id === markerId);
              if (worker) setSelectedWorkerForProfile(worker);
            }}
          />

          {/* Map Overlay Badge: Telemetry status */}
          <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-xs border border-[#E2DFD8] px-3 py-1.5 rounded-lg shadow-sm text-[11px] font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#167A5B] animate-pulse" />
            <span>Customer Pin &bull; {skilledMapMarkers.length - 1} Workers Nearby</span>
          </div>
        </div>

        {/* Mobile Worker Card below Map */}
        {mobileMapTab === 'map' && (
          <div className="sm:hidden">
            {(() => {
              const displayWorker = selectedMapWorker || workers.find((w) => (mapClusterCategory === 'ALL' || w.primaryTrade === mapClusterCategory) && w.isAvailable) || workers[0];
              if (!displayWorker) return null;
              return (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={displayWorker.photoUrl}
                      alt={displayWorker.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E2DFD8] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-[#17324D] truncate">{displayWorker.name}</h4>
                        <span className="text-[10px] font-bold text-[#167A5B] bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#C6E7D8] shrink-0">
                          ✓ Verified Worker
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 truncate mt-0.5">
                        {displayWorker.primaryTrade} • {displayWorker.experienceYears} yrs exp
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-bold text-amber-600">★ {displayWorker.rating}</span>
                        <span>•</span>
                        <span>1.4 km away</span>
                        <span>•</span>
                        <span className={displayWorker.isAvailable ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          {displayWorker.isAvailable ? 'Available Now' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#EBE8E1]">
                    <button
                      type="button"
                      onClick={() => setSelectedWorkerForProfile(displayWorker)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[#D0D5DD] bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer min-h-[44px] flex items-center justify-center btn-tactile"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingTargetWorker(displayWorker)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold cursor-pointer min-h-[44px] flex items-center justify-center btn-tactile shadow-xs"
                    >
                      Book Worker
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Mobile Worker List View */}
        {mobileMapTab === 'list' && (
          <div className="sm:hidden space-y-2.5 pt-1">
            {workers
              .filter((w) => mapClusterCategory === 'ALL' || w.primaryTrade === mapClusterCategory)
              .slice(0, 6)
              .map((worker) => (
                <div
                  key={`map-list-${worker.id}`}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={worker.photoUrl}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E2DFD8] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#17324D] truncate">{worker.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{worker.primaryTrade} • ★ {worker.rating}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">✓ Verified • {worker.isAvailable ? 'Available' : 'Busy'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedWorkerForProfile(worker)}
                      className="px-2.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-xs font-bold text-slate-800 min-h-[44px] cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingTargetWorker(worker)}
                      className="px-3 py-2 rounded-lg bg-[#17324D] text-white text-xs font-bold min-h-[44px] cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Selected Map Worker Quick Action Preview (Desktop / Tablet) */}
        {selectedMapWorker && (
          <div className="hidden sm:flex p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <img
                src={selectedMapWorker.photoUrl}
                alt={selectedMapWorker.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#E2DFD8]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#17324D]">{selectedMapWorker.name}</h4>
                  <span className="text-[10px] font-bold text-[#167A5B] bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#C6E7D8]">
                    ✓ Verified Worker
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {selectedMapWorker.primaryTrade} &bull; {selectedMapWorker.experienceYears} yrs exp &bull; {selectedMapWorker.completedJobsCount} completed jobs
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSelectedWorkerForProfile(selectedMapWorker)}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer min-h-[44px]"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={() => setBookingTargetWorker(selectedMapWorker)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold cursor-pointer min-h-[44px]"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS (JOURNEY): "From Search to Doorstep" */}
      <section className="bg-white border border-[#E4E7EC] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6" id="customer-journey-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E4E7EC] pb-4">
          <div>
            <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
              Transparent Cooperative Lifecycle
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              From Search to Doorstep
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              How ShramSetu guarantees fairness, safety, and trade accountability at every step.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E2DFD8]">
            Stage {activeJourneyStage + 1} of 7: {journeyStages[activeJourneyStage].title}
          </span>
        </div>

        {/* Desktop Interactive Stage Stepper */}
        <div className="hidden lg:flex items-center justify-between gap-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2DFD8]">
          {journeyStages.map((stage, idx) => {
            const isActive = activeJourneyStage === idx;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveJourneyStage(idx)}
                onMouseEnter={() => setActiveJourneyStage(idx)}
                className={`flex-1 py-2 px-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-[#17324D] shadow-xs border border-[#D0D5DD]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#17324D] text-white'
                      : idx < activeJourneyStage
                      ? 'bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {idx < activeJourneyStage ? '✓' : stage.step}
                </div>
                <div className="truncate min-w-0">
                  <div className={`text-[11px] truncate ${isActive ? 'font-black' : 'font-bold'}`}>
                    {stage.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop Active Stage Detailed Preview Card */}
        <div className="hidden lg:grid grid-cols-12 gap-6 bg-[#FAF8F5] rounded-2xl border border-[#E2DFD8] p-6 items-center">
          <div className="col-span-5 relative h-56 rounded-xl overflow-hidden shadow-xs bg-slate-200 border border-[#D0D5DD]">
            <img
              src={journeyStages[activeJourneyStage].photo}
              alt={journeyStages[activeJourneyStage].title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#17324D] text-white shadow-xs">
                Step {journeyStages[activeJourneyStage].step} • {journeyStages[activeJourneyStage].badge}
              </span>
            </div>
          </div>

          <div className="col-span-7 space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider">
                {journeyStages[activeJourneyStage].tagline}
              </span>
              <h3 className="text-xl font-black text-[#17324D] tracking-tight mt-0.5">
                {journeyStages[activeJourneyStage].title}
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {journeyStages[activeJourneyStage].desc}
            </p>
            <div className="p-3.5 rounded-lg bg-white border border-[#E2DFD8] flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#167A5B] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#17324D]">Cooperative Platform Guarantee</div>
                <div className="text-xs text-slate-600 mt-0.5">{journeyStages[activeJourneyStage].guarantee}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Vertical Interactive Timeline */}
        <div className="lg:hidden space-y-3">
          {journeyStages.map((stage, idx) => {
            const isExpanded = activeJourneyStage === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setActiveJourneyStage(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-[#FAF8F5] border-[#17324D] shadow-xs'
                    : 'bg-white border-[#E4E7EC] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isExpanded
                          ? 'bg-[#17324D] text-white'
                          : 'bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]'
                      }`}
                    >
                      {stage.step}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#17324D]">{stage.title}</div>
                      <div className="text-[10px] text-slate-500">{stage.tagline}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#E2DFD8] space-y-2.5 text-xs text-slate-700">
                    <p className="leading-relaxed">{stage.desc}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2DFD8] text-[11px] text-slate-600 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#167A5B] shrink-0" />
                      <span>{stage.guarantee}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. JOB-BASED PRICING SECTION (WARM NEUTRAL #FAF8F5) */}
      <section className="bg-[#FAF8F5] border border-[#E2DFD8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="job-pricing-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2DFD8] pb-4">
          <div>
            <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
              Transparent Tariff Protocol
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              Job-Based Pricing
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              ShramSetu tariffs are fixed by item count and trade scope — zero per-hour ambiguity.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2DFD8] text-xs font-bold text-[#167A5B] shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#167A5B]" />
            <span>Zero Per-Hour Uncertainty</span>
          </div>
        </div>

        {/* Pricing Formula Callout Equation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            The ShramSetu Fair Tariff Equation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Items / Quantity</div>
              <div className="text-sm sm:text-base font-black text-[#17324D] mt-1">Defined Scope</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
              <div className="text-[10px] font-bold text-slate-500 uppercase">+ Material Cost</div>
              <div className="text-sm sm:text-base font-black text-[#17324D] mt-1">MRP Audited</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
              <div className="text-[10px] font-bold text-slate-500 uppercase">+ Labour Cost</div>
              <div className="text-sm sm:text-base font-black text-[#167A5B] mt-1">100% Direct Pay</div>
            </div>
            <div className="p-3 rounded-xl bg-[#17324D] text-white">
              <div className="text-[10px] font-bold text-slate-300 uppercase">= Total Job Cost</div>
              <div className="text-sm sm:text-base font-black text-white mt-1">Guaranteed Fixed</div>
            </div>
          </div>
        </div>

        {/* Interactive Dynamic Price Example */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-5 sm:p-6 rounded-2xl border border-[#E2DFD8] shadow-2xs">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#C25E00] uppercase tracking-wider">
                Live Interactive Tariff Calculation
              </span>
              <h3 className="text-lg font-black text-[#17324D] mt-0.5">
                Electrical Installation Example
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Adjust the items below to see material and labour totals calculate smoothly in real-time. Appointment date and time remain completely separate from pricing.
              </p>
            </div>

            {/* Steppers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                <div>
                  <div className="font-bold text-xs text-slate-900">Ceiling Fans Installation</div>
                  <div className="text-[11px] text-slate-500">Material ₹1,200 each • Labour ₹350 each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoFans(Math.max(1, demoFans - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D0D5DD] hover:bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-xs text-[#17324D]">{demoFans} Fans</span>
                  <button
                    type="button"
                    onClick={() => setDemoFans(Math.min(10, demoFans + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D0D5DD] hover:bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                <div>
                  <div className="font-bold text-xs text-slate-900">LED Lights Fitting</div>
                  <div className="text-[11px] text-slate-500">Material ₹150 each • Labour ₹75 each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoLights(Math.max(0, demoLights - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D0D5DD] hover:bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-xs text-[#17324D]">{demoLights} Lights</span>
                  <button
                    type="button"
                    onClick={() => setDemoLights(Math.min(20, demoLights + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D0D5DD] hover:bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Price Output Box */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-[#E2DFD8]">
              Transparent Price Summary
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>{demoFans} Ceiling Fans + {demoLights} LED Lights</span>
                <span className="font-semibold text-slate-900">{demoFans + demoLights} Items</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Material Cost:</span>
                <span className="font-bold text-slate-900">₹{demoMaterialCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#167A5B]">
                <span>Labour Cost (100% direct artisan pay):</span>
                <span className="font-bold text-[#167A5B]">₹{demoLabourCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-[#E2DFD8] flex justify-between items-baseline">
                <span className="font-black text-sm text-[#17324D]">Total Job Cost:</span>
                <span className="font-black text-xl text-[#17324D]">₹{demoTotalJobCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 leading-snug">
              ✓ No surge charges &bull; No per-hour clock-watching &bull; Pay only for the agreed task
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFICATION SECTION (ACCORDION) */}
      <section className="bg-white border border-[#E4E7EC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="verification-section">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
            Institutional Accountability
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
            Know who you're booking.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Every professional on ShramSetu undergoes independent 3-layer audit before visiting your home.
          </p>
        </div>

        {/* Worker Profile Showcase with Accordion */}
        <div className="rounded-2xl border border-[#E2DFD8] bg-[#FAF8F5] p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].url}
                alt={WORKER_PHOTOGRAPHY_REGISTRY['w-100'].alt}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#17324D]">Rajesh Kumar</h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] text-[10px] font-bold">
                    ✓ Verified Worker
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Electrician &bull; 12 years experience &bull; Bahadurgarh Labour Cooperative Society
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1">
                  <span className="flex items-center gap-1 text-amber-600">★ 4.8</span>
                  <span className="text-slate-300">•</span>
                  <span>47 completed jobs</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">Bahadurgarh &amp; West Delhi</span>
                </div>
              </div>
            </div>

            {/* Accordion Toggle Button */}
            <button
              type="button"
              onClick={() => setVerificationAccordionOpen(!verificationAccordionOpen)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#17324D] border border-[#D0D5DD] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>{verificationAccordionOpen ? 'Hide verification details' : 'View verification details'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${verificationAccordionOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Accordion Content */}
          {verificationAccordionOpen && (
            <div className="pt-4 border-t border-[#E2DFD8] grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Layer 1: Government / Official Verification */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Layer 1
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B]">
                    Document Verified
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#17324D]">Government Verification</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Skill India / ITI Trade Certificate #ITI-DL-2018-8472</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Police antecedent clearance on record</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <span>ℹ</span>
                    <span>Central Labour Commissioner API status: Unconfigured bridge</span>
                  </li>
                </ul>
              </div>

              {/* Layer 2: Cooperative Verification */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Layer 2
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B]">
                    Active Guild
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#17324D]">Cooperative Verification</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Bahadurgarh Labour Cooperative Society (Reg. #SOC-HR-4421)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Passed 5/5 practical trade safety &amp; diagnostic audit</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Continuous peer accountability under Society charter</span>
                  </li>
                </ul>
              </div>

              {/* Layer 3: ShramSetu Verification */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Layer 3
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B]">
                    Platform Audited
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#17324D]">ShramSetu Verification</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Aadhaar offline XML KYC verified (DPDP Act compliant)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>Encrypted doorstep arrival safety PIN enabled</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#167A5B] font-bold">✓</span>
                    <span>100% direct remuneration &bull; 7-day cooperative warranty</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS SECTION (WHITE #FFFFFF) */}
      <section className="bg-white border border-[#E4E7EC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="customer-reviews-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E4E7EC] pb-4">
          <div>
            <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
              Authentic Feedback
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
              What customers say
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real testimonials from homeowners across Bahadurgarh and Delhi NCR.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            100% verified completed bookings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Review 1 */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] flex flex-col justify-between space-y-3.5 card-interactive">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 text-sm">★★★★★</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                  Verified booking
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "Everything was explained clearly and the work was completed properly. The electrician arrived with all required switches and cleaned up afterward."
              </p>
            </div>
            <div className="pt-3 border-t border-[#EBE8E1] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#17324D]">Sunita Sharma</div>
                <div className="text-[11px] text-slate-500">Bahadurgarh, Haryana</div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-[#E2DFD8]">
                Electrical Installation
              </span>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] flex flex-col justify-between space-y-3.5 card-interactive">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 text-sm">★★★★★</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                  Verified booking
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "The plumber arrived right on time with the required brass fittings. Job pricing was agreed beforehand, so there were zero extra charges."
              </p>
            </div>
            <div className="pt-3 border-t border-[#EBE8E1] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#17324D]">Vikas Mehra</div>
                <div className="text-[11px] text-slate-500">Rohini, West Delhi</div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-[#E2DFD8]">
                Plumbing Repair
              </span>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] flex flex-col justify-between space-y-3.5 card-interactive">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 text-sm">★★★★★</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                  Verified booking
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "It feels reassuring that workers belong to a verified cooperative society. Mohan ji was respectful, professional, and very neat with his woodwork."
              </p>
            </div>
            <div className="pt-3 border-t border-[#EBE8E1] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#17324D]">Anjali Verma</div>
                <div className="text-[11px] text-slate-500">Dwarka Sector 12, Delhi</div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-[#E2DFD8]">
                Carpentry Repair
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COOPERATIVE STORY SECTION */}
      <section className="bg-[#FAF8F5] border border-[#E2DFD8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="cooperative-story-section">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold text-[#167A5B] uppercase tracking-wider mb-0.5">
            Democratic Guild Model
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
            People behind the service.
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold leading-relaxed">
            ShramSetu connects customers directly with skilled workers organised through labour cooperatives.
          </p>
        </div>

        {/* Visual Flow: Worker → Labour Cooperative Society → ShramSetu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Step 1: Worker */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#EDF7F2] text-[#167A5B] font-black text-xs flex items-center justify-center border border-[#C6E7D8]">
                  01
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Trade Artisan
                </span>
              </div>
              <div>
                <h3 className="font-black text-base text-[#17324D]">Worker</h3>
                <div className="text-xs font-bold text-[#167A5B] mt-0.5">Rajesh Kumar</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skilled trade master with 12+ years of experience. Certified under national ITI electrical standards, proud member of the local labour guild.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 pt-3 border-t border-[#EBE8E1]">
              Full dignity of labour &bull; 100% direct pay
            </div>
          </div>

          {/* Step 2: Labour Cooperative Society */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs space-y-3 flex flex-col justify-between relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#EDF7F2] text-[#167A5B] font-black text-xs flex items-center justify-center border border-[#C6E7D8]">
                  02
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#167A5B]">
                  Cooperative Backing
                </span>
              </div>
              <div>
                <h3 className="font-black text-base text-[#17324D]">Labour Cooperative Society</h3>
                <div className="text-xs font-bold text-slate-600 mt-0.5">Bahadurgarh Cooperative Society</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registered democratic body ensuring trade skills auditing, accident insurance, family welfare fund, and mutual accountability across all member trades.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 pt-3 border-t border-[#EBE8E1]">
              Charter #SOC-HR-4421 &bull; Peer arbitration
            </div>
          </div>

          {/* Step 3: ShramSetu */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#17324D] text-white font-black text-xs flex items-center justify-center shadow-xs">
                  03
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E00]">
                  Public Digital Bridge
                </span>
              </div>
              <div>
                <h3 className="font-black text-base text-[#17324D]">ShramSetu</h3>
                <div className="text-xs font-bold text-slate-600 mt-0.5">Direct Customer Marketplace</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects customers directly with verified cooperative artisans. Transparent fixed tariffs, real-time dispatch tracking, and zero middleman extraction.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#167A5B] pt-3 border-t border-[#EBE8E1]">
              Fair technology for working people
            </div>
          </div>
        </div>
      </section>

      {/* 11. IMPACT COUNTERS SECTION */}
      <section className="bg-white border border-[#E4E7EC] rounded-3xl p-6 sm:p-8 shadow-xs" id="impact-counters-section">
        <div className="text-center max-w-xl mx-auto space-y-1.5 mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#167A5B]">
            Cooperative Scale &amp; Growth
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#17324D] tracking-tight">
            Impact in Numbers
          </h2>
          <p className="text-xs text-slate-500">
            Empowering trade artisans while protecting homeowner trust across NCR.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-1.5">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17324D]">
              <AnimatedCounter target={2480} />+
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Verified professionals</div>
            <div className="text-[11px] text-slate-500">ITI certified &amp; audited</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-1.5">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#167A5B]">
              <AnimatedCounter target={34} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Cooperative societies</div>
            <div className="text-[11px] text-slate-500">Registered member societies</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-1.5">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17324D]">
              <AnimatedCounter target={18620} />+
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Services completed</div>
            <div className="text-[11px] text-slate-500">Fixed itemized job tariffs</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DFD8] space-y-1.5">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#C25E00]">
              <AnimatedCounter target={27} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Service areas</div>
            <div className="text-[11px] text-slate-500">Bahadurgarh, Delhi &amp; NCR</div>
          </div>
        </div>
      </section>

      {/* 12. TRUST SECTION (DEEP GREEN #167A5B) */}
      <section className="bg-[#167A5B] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6" id="trust-section">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
            Our Promise
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Built around trust.
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 leading-relaxed">
            Four strong standards governing every service dispatch under our cooperative charter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Item 1 */}
          <div className="p-5 rounded-2xl bg-[#116349] border border-[#1b8c68] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-black text-sm">
              ✓
            </div>
            <h3 className="font-bold text-sm text-white">Verified workers</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Skill certified, identity verified, and background-checked under cooperative protocols.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-5 rounded-2xl bg-[#116349] border border-[#1b8c68] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-black text-sm">
              ✓
            </div>
            <h3 className="font-bold text-sm text-white">Cooperative-backed professionals</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Registered societies ensuring trade accountability, master artisan support, and workmanship standards.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-5 rounded-2xl bg-[#116349] border border-[#1b8c68] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-black text-sm">
              ✓
            </div>
            <h3 className="font-bold text-sm text-white">Transparent job pricing</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Strict task tariffs: Items + Material + Labour. Zero per-hour ambiguity and 100% direct worker pay.
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-5 rounded-2xl bg-[#116349] border border-[#1b8c68] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-black text-sm">
              ✓
            </div>
            <h3 className="font-bold text-sm text-white">Worker arrival tracking</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Live interactive map tracking with estimated arrival time and a secure one-time doorstep safety PIN.
            </p>
          </div>
        </div>
      </section>

      {/* 13. EMERGENCY SECTION: "Need urgent help?" (DARK RED #B42318) */}
      <section className="bg-white border-2 border-[#FECDCA] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden" id="emergency-assistance-section">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B42318]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B42318] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B42318]">
                Emergency Rapid Assistance
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#17324D] tracking-tight">
              Need urgent help?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Facing a critical home breakdown? Cooperative emergency dispatch mobilizes verified trade masters in 15–20 minutes with zero surge exploitation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-5 py-3 bg-[#B42318] hover:bg-[#912018] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-[#7A1913]"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>Request Emergency Service</span>
          </button>
        </div>

        {/* 4 Critical Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-4 border-t border-[#FECDCA]/60">
          {/* 1. Water leak */}
          <div
            onClick={() => setIsEmergencyModalOpen(true)}
            className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] hover:border-[#B42318] transition-colors cursor-pointer group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#FECDCA] flex items-center justify-center text-[#B42318] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17324D] group-hover:text-[#B42318] transition-colors">
                Water Leak
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Burst pipe, mainline leakage or toilet cistern flooding.
              </div>
            </div>
          </div>

          {/* 2. Electrical hazard */}
          <div
            onClick={() => setIsEmergencyModalOpen(true)}
            className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] hover:border-[#B42318] transition-colors cursor-pointer group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#FECDCA] flex items-center justify-center text-[#B42318] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17324D] group-hover:text-[#B42318] transition-colors">
                Electrical Hazard
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Sparking switchboard, burnt wire smell or total power trip.
              </div>
            </div>
          </div>

          {/* 3. Lockout */}
          <div
            onClick={() => setIsEmergencyModalOpen(true)}
            className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] hover:border-[#B42318] transition-colors cursor-pointer group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#FECDCA] flex items-center justify-center text-[#B42318] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17324D] group-hover:text-[#B42318] transition-colors">
                Lockout
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Jammed entrance latch, broken key inside lock or stuck door.
              </div>
            </div>
          </div>

          {/* 4. Critical appliance problem */}
          <div
            onClick={() => setIsEmergencyModalOpen(true)}
            className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] hover:border-[#B42318] transition-colors cursor-pointer group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#FECDCA] flex items-center justify-center text-[#B42318] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17324D] group-hover:text-[#B42318] transition-colors">
                Critical Appliance
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Geyser short circuit, motor stall or refrigerator failure.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. ACTIVE BOOKINGS / PERSONAL DASHBOARD (If customer has active bookings) */}
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

                {/* Pricing & Tracking */}
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

                {/* Need help with this booking? */}
                <div className="pt-2.5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 font-semibold">Need help with this booking?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const trigger = document.getElementById('chatbot-trigger-btn');
                        if (trigger) trigger.click();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#D0D5DD] hover:bg-slate-50 text-slate-700 font-bold text-[11px] cursor-pointer"
                    >
                      Contact Support
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsComplaintModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] hover:bg-[#FEE4E2] text-[#B42318] font-bold text-[11px] cursor-pointer"
                    >
                      Report a Problem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#D0D5DD] shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-[#17324D] cursor-pointer min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] hover:bg-slate-50 btn-tactile"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <span>
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </span>
          </button>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilterGovVerified(false);
                setFilterCoopVerified(false);
                setFilterPlatformVerified(false);
                setFilterAvailableOnly(false);
                setFilterMinRating(0);
                setFilterMinExperience(0);
                setFilterLocationArea('ALL');
                setSelectedCategory('ALL');
                setLocalSearch('');
              }}
              className="text-xs font-bold text-[#B42318] hover:underline cursor-pointer min-h-[44px] px-2 flex items-center"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Mobile Filter Bottom Sheet / Modal Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="absolute inset-0"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#17324D]" />
                  <h3 className="font-black text-base text-[#17324D]">
                    Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterGovVerified(false);
                        setFilterCoopVerified(false);
                        setFilterPlatformVerified(false);
                        setFilterAvailableOnly(false);
                        setFilterMinRating(0);
                        setFilterMinExperience(0);
                        setFilterLocationArea('ALL');
                        setSelectedCategory('ALL');
                        setLocalSearch('');
                      }}
                      className="text-xs font-bold text-[#B42318] hover:underline cursor-pointer min-h-[44px] px-2 flex items-center"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    aria-label="Close filters"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable Filters Content */}
              <div className="p-5 overflow-y-auto space-y-5 text-sm">
                {/* Trade Category */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-2">Trade Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 min-h-[44px]"
                  >
                    <option value="ALL">All Trade Categories</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Painting">Painting</option>
                    <option value="Technician">Appliance Repair</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Driving">Driving</option>
                    <option value="Domestic Help">Caregiving &amp; Domestic Help</option>
                  </select>
                </div>

                {/* Service Cluster */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-2">Service Cluster</label>
                  <select
                    value={filterLocationArea}
                    onChange={(e) => setFilterLocationArea(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 min-h-[44px]"
                  >
                    <option value="ALL">All Clusters ({selectedCity || 'Bahadurgarh & NCR'})</option>
                    <option value="Bahadurgarh">Bahadurgarh Cluster</option>
                    <option value="Delhi">Delhi NCR (Rohini, Pitampura, South)</option>
                    <option value="Gurugram">Gurugram Cluster</option>
                    <option value="Mohali">Mohali &amp; Chandigarh Cluster</option>
                  </select>
                </div>

                {/* Verification Layers */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-neutral-800 block">Verification Layers</label>
                  <label className="flex items-center gap-3 text-xs text-neutral-700 cursor-pointer min-h-[44px] p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                    <input
                      type="checkbox"
                      checked={filterGovVerified}
                      onChange={(e) => setFilterGovVerified(e.target.checked)}
                      className="w-5 h-5 rounded text-[#17324D] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Government Verified</div>
                      <div className="text-[11px] text-slate-500">Skill India / ITI trade certificate</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-neutral-700 cursor-pointer min-h-[44px] p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                    <input
                      type="checkbox"
                      checked={filterCoopVerified}
                      onChange={(e) => setFilterCoopVerified(e.target.checked)}
                      className="w-5 h-5 rounded text-[#17324D] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Cooperative Verified</div>
                      <div className="text-[11px] text-slate-500">Active member of registered society</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-neutral-700 cursor-pointer min-h-[44px] p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                    <input
                      type="checkbox"
                      checked={filterPlatformVerified}
                      onChange={(e) => setFilterPlatformVerified(e.target.checked)}
                      className="w-5 h-5 rounded text-[#17324D] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-900">ShramSetu Verified</div>
                      <div className="text-[11px] text-slate-500">KYC audited &amp; background checked</div>
                    </div>
                  </label>
                </div>

                {/* Availability */}
                <div>
                  <label className="flex items-center gap-3 text-xs text-neutral-700 cursor-pointer min-h-[44px] p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8]">
                    <input
                      type="checkbox"
                      checked={filterAvailableOnly}
                      onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                      className="w-5 h-5 rounded text-[#17324D] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Available Now Only</div>
                      <div className="text-[11px] text-slate-500">Ready for instant dispatch</div>
                    </div>
                  </label>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-2">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[0, 4.5, 4.8].map((rate) => (
                      <button
                        key={`mob-sheet-rate-${rate}`}
                        type="button"
                        onClick={() => setFilterMinRating(rate)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[44px] ${
                          filterMinRating === rate
                            ? 'bg-[#17324D] text-white border-[#17324D]'
                            : 'bg-[#FAF8F5] text-slate-700 border-[#D0D5DD]'
                        }`}
                      >
                        {rate === 0 ? 'All' : `⭐ ${rate}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trade Experience */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-2">Trade Experience</label>
                  <div className="flex gap-2">
                    {[0, 5, 10].map((exp) => (
                      <button
                        key={`mob-sheet-exp-${exp}`}
                        type="button"
                        onClick={() => setFilterMinExperience(exp)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[44px] ${
                          filterMinExperience === exp
                            ? 'bg-[#17324D] text-white border-[#17324D]'
                            : 'bg-[#FAF8F5] text-slate-700 border-[#D0D5DD]'
                        }`}
                      >
                        {exp === 0 ? 'Any' : `${exp}+ yrs`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Apply Button */}
              <div className="p-4 border-t border-[#E4E7EC] bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setMobileFiltersOpen(false);
                    const el = document.getElementById('workers-directory-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#17324D] hover:bg-[#112538] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <span>Show {filteredWorkers.length} Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Directory Layout: Left Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block bg-white rounded-xl border border-[#E4E7EC] p-5 space-y-5 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold text-[#17324D] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                Filter Workers
              </span>
              {(filterGovVerified || filterCoopVerified || filterPlatformVerified || filterAvailableOnly || filterMinRating > 0 || filterMinExperience > 0 || filterLocationArea !== 'ALL' || selectedCategory !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterGovVerified(false);
                    setFilterCoopVerified(false);
                    setFilterPlatformVerified(false);
                    setFilterAvailableOnly(false);
                    setFilterMinRating(0);
                    setFilterMinExperience(0);
                    setFilterLocationArea('ALL');
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
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
              >
                <option value="ALL">All Trade Categories</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Technician">Appliance Repair</option>
                <option value="Gardening">Gardening</option>
                <option value="Driving">Driving</option>
                <option value="Domestic Help">Caregiving &amp; Domestic Help</option>
              </select>
            </div>

            {/* Service Cluster / Location Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2">Service Cluster</label>
              <select
                value={filterLocationArea}
                onChange={(e) => setFilterLocationArea(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
              >
                <option value="ALL">All Clusters ({selectedCity || 'Bahadurgarh & NCR'})</option>
                <option value="Bahadurgarh">Bahadurgarh Cluster</option>
                <option value="Delhi">Delhi NCR (Rohini, Pitampura, South)</option>
                <option value="Gurugram">Gurugram Cluster</option>
                <option value="Mohali">Mohali &amp; Chandigarh Cluster</option>
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

            {/* Experience Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2">Trade Experience</label>
              <div className="flex gap-1.5">
                {[0, 5, 10].map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setFilterMinExperience(exp)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      filterMinExperience === exp
                        ? 'bg-[#17324D] text-white border-[#17324D]'
                        : 'bg-[#FAF8F5] hover:bg-slate-100 text-slate-700 border-[#D0D5DD]'
                    }`}
                  >
                    {exp === 0 ? 'Any' : `${exp}+ yrs`}
                  </button>
                ))}
              </div>
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
                        : 'bg-[#FAF8F5] hover:bg-slate-100 text-slate-700 border-[#D0D5DD]'
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

      {/* Service Category Detail Modal (Service Page) */}
      {activeCategoryModal && (
        <ServiceCategoryModal
          category={activeCategoryModal}
          onClose={() => setActiveCategoryModal(null)}
        />
      )}
    </div>
  );
};
