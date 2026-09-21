import React, { useState } from 'react';
import { ServiceCategory } from '../types';

interface TradeBadgeAvatarProps {
  trade?: ServiceCategory | string;
  name?: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  isOnline?: boolean;
}

// Fallback high-quality documentary portrait photos representing diverse skilled Indian professionals
const TRADE_DEFAULT_PHOTOS: Record<string, string> = {
  Electrical: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  Plumbing: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  Carpentry: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  Painting: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  Cleaning: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  Gardening: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  Driving: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'Domestic Help': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  Technician: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
};

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

export const TradeBadgeAvatar: React.FC<TradeBadgeAvatarProps> = ({
  trade = 'Electrical',
  name,
  photoUrl,
  size = 'md',
  className = '',
  isOnline,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-20 h-20 rounded-2xl',
    xl: 'w-28 h-28 rounded-3xl',
    '2xl': 'w-36 h-36 rounded-3xl',
  };

  const resolvedPhoto =
    photoUrl && !imgError
      ? photoUrl
      : TRADE_DEFAULT_PHOTOS[trade] || DEFAULT_PHOTO;

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-2xs`}
      >
        <img
          src={resolvedPhoto}
          alt={name ? `${name} - ${trade}` : trade}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {isOnline !== undefined && (
        <span
          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-2xs ${
            isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
          }`}
          title={isOnline ? 'Available now' : 'Currently offline'}
        />
      )}
    </div>
  );
};
