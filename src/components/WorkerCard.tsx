import React from 'react';
import { WorkerProfile } from '../types';
import { useApp } from '../context/AppContext';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { Star, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface WorkerCardProps {
  worker: WorkerProfile;
  onSelectWorker?: (worker: WorkerProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelectWorker }) => {
  const { setSelectedWorkerForProfile, setBookingTargetWorker, governmentVerifications } = useApp();

  const govRecord = governmentVerifications.find((gv) => gv.workerId === worker.id);
  const isGovVerified = govRecord?.status === 'VERIFIED';
  const isCoopVerified = worker.cooperativeVerificationStatus === 'VERIFIED';
  const isPlatformVerified = worker.shramsetuVerificationStatus === 'VERIFIED';

  // Any verified tier qualifies for the compact verified badge
  const isVerified = isGovVerified || isCoopVerified || isPlatformVerified || worker.isVerified;

  const tradeDisplay =
    worker.primaryTrade === 'Electrical'
      ? 'Electrician'
      : worker.primaryTrade === 'Domestic Help'
      ? 'Home Care & Assistant'
      : worker.primaryTrade;

  // Extract human-friendly top skills
  const displaySkills = worker.skills && worker.skills.length > 0
    ? worker.skills.slice(0, 3)
    : [tradeDisplay];

  return (
    <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-xs hover:shadow-md hover:border-slate-400 transition-all duration-150 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top: Portrait visual anchor + Core Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <TradeBadgeAvatar
              trade={worker.primaryTrade}
              name={worker.name}
              photoUrl={worker.photoUrl}
              size="md"
              isOnline={worker.isOnline}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#17324D] tracking-tight leading-snug truncate">
              {worker.name}
            </h3>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              {tradeDisplay}
            </div>

            {isVerified && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#167A5B] bg-[#EDF7F2] px-2 py-0.5 rounded-md border border-[#C6E7D8] whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#167A5B] shrink-0" />
                  <span>Verified Worker</span>
                </span>
              </div>
            )}

            {/* Rating & Completed Jobs */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {worker.rating}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">
                {worker.completedJobsCount} jobs completed
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{worker.serviceArea || 'Bahadurgarh · West Delhi NCR'}</span>
        </div>

        {/* Skills */}
        <div className="mt-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Key Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F7F8F6] text-slate-700 border border-[#E4E7EC]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Cooperative Society */}
        <div className="mt-3.5 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#167A5B] shrink-0" />
          <span className="truncate">{worker.cooperativeName}</span>
        </div>
      </div>

      {/* Bottom Actions: View Profile & Book Service (Strict Job-Based Pricing) */}
      <div className="px-5 py-3.5 bg-[#F7F8F6] border-t border-[#E4E7EC] flex items-center gap-2.5">
        <button
          type="button"
          id={`view-profile-${worker.id}`}
          onClick={() => setSelectedWorkerForProfile(worker)}
          className="flex-1 py-2 px-2.5 sm:px-3 rounded-lg border border-[#D0D5DD] hover:border-slate-400 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer bg-white text-center shadow-2xs whitespace-nowrap shrink-0"
        >
          View Profile
        </button>
        <button
          type="button"
          id={`book-worker-${worker.id}`}
          onClick={() => {
            if (onSelectWorker) {
              onSelectWorker(worker);
            } else {
              setBookingTargetWorker(worker);
            }
          }}
          className="flex-1 py-2 px-2.5 sm:px-3 rounded-lg bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold transition-all cursor-pointer text-center shadow-xs whitespace-nowrap shrink-0 border border-[#224466]"
        >
          Book Service
        </button>
      </div>
    </div>
  );
};
