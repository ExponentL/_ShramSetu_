import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_DETAILED_SERVICES, CategoryDetailMeta, SubServiceItem } from '../data/imageAssets';
import { ServiceCategory } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  Award,
  Sparkles,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Tv,
  ExternalLink,
} from 'lucide-react';

interface ServiceCategoryModalProps {
  category: ServiceCategory;
  onClose: () => void;
  onSelectSubService?: (subService: SubServiceItem) => void;
}

export const ServiceCategoryModal: React.FC<ServiceCategoryModalProps> = ({
  category,
  onClose,
  onSelectSubService,
}) => {
  const { setSelectedCategory, setBookingTargetWorker, workers } = useApp();

  const details: CategoryDetailMeta | undefined = CATEGORY_DETAILED_SERVICES[category];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!details) {
    return null;
  }

  // Find nearby available workers for this category
  const availableWorkers = workers.filter(
    (w) => (w.primaryTrade === category || w.skills.includes(category)) && w.isAvailable
  );

  const handleBookSubService = (subService: SubServiceItem) => {
    // Pick the best rated available worker for this trade or first worker
    const worker = availableWorkers[0] || workers.find((w) => w.primaryTrade === category) || workers[0];
    if (onSelectSubService) {
      onSelectSubService(subService);
    }
    if (worker) {
      setBookingTargetWorker(worker);
    }
    onClose();
  };

  const handleViewWorkers = () => {
    setSelectedCategory(category);
    onClose();
    setTimeout(() => {
      const el = document.getElementById('workers-directory-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-4xl md:max-w-5xl sm:rounded-3xl shadow-2xl border border-[#E2DFD8] flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#E2DFD8] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[10px] font-bold text-[#167A5B] uppercase tracking-wider">
                Cooperative Trade Service
              </div>
              <h2 id="service-modal-title" className="font-black text-base sm:text-lg text-[#17324D] leading-tight">
                {details.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#E2DFD8] bg-[#FAF8F5] hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#FAF8F5]">
          {/* Large Relevant Hero Photograph */}
          <div className="rounded-2xl border border-[#E2DFD8] overflow-hidden bg-white shadow-xs relative">
            <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[380px] bg-slate-100 overflow-hidden">
              <img
                src={details.heroImage}
                alt={details.heroAlt}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              {/* Subtle gradient overlay that does not block faces or work action */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-[#167A5B] text-white shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{details.guildBadge}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{availableWorkers.length} Artisans Available</span>
                </span>
              </div>

              {/* Title & Tagline Overlay at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  Registered Labour Cooperative Society
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight drop-shadow-xs">
                  {details.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl line-clamp-2">
                  {details.overview}
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Cooperative Pricing Guarantee Callout */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DFD8] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F2] border border-[#C6E7D8] flex items-center justify-center text-[#167A5B] shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#17324D]">Strict Job-Based Pricing Guarantee</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Standard items + materials at actuals + fixed labour cost = total job cost. Strictly fixed job tariffs, zero surge fees.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleViewWorkers}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#D0D5DD] text-xs font-bold text-[#17324D] flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              <span>View {availableWorkers.length} Workers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Services Section: "Electrical Services", etc. */}
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-[#E2DFD8] pb-2.5">
              <div>
                <div className="text-[10px] font-bold text-[#167A5B] uppercase tracking-wider">
                  Available Job Packages
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#17324D] tracking-tight">
                  {details.title}
                </h3>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Click any service to book directly
              </span>
            </div>

            {/* Grid of 4 Specific Sub-Services with Smaller Relevant Real Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {details.subServices.map((subService) => (
                <div
                  key={subService.id}
                  className="group rounded-2xl border border-[#E2DFD8] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Smaller Relevant Real Image (occupies ~45% of card) */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={subService.photoUrl}
                      alt={subService.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-900 shadow-2xs">
                        {subService.typicalTariff}
                      </span>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-base text-[#17324D] tracking-tight">
                        {subService.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {subService.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F2EFE9] space-y-2.5">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="truncate">{subService.itemsScope}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleBookSubService(subService)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] active:scale-[0.98]"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book This Service</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#E2DFD8] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 hidden sm:flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#167A5B]" />
            <span>100% Verified Artisans &bull; No middleman surge &bull; Cooperative Warranty</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#D0D5DD] bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 min-h-[44px] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleViewWorkers}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Browse All {details.title} Artisans</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
