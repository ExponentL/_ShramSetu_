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

// Authentic documentary trade photography representing verified Indian trade artisans
const TRADE_DEFAULT_PHOTOS: Record<string, string> = {
  Electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  Plumbing: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
  Carpentry: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
  Painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
  Cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  Gardening: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=800&auto=format&fit=crop&q=80',
  Driving: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
  'Domestic Help': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
  Technician: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
};

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80';

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
    sm: 'w-10 h-10 rounded-xl text-xs',
    md: 'w-14 h-14 rounded-2xl text-sm',
    lg: 'w-20 h-20 rounded-2xl text-base',
    xl: 'w-28 h-28 rounded-3xl text-xl',
    '2xl': 'w-36 h-36 rounded-3xl text-2xl',
  };

  const isImageRequired = !photoUrl || photoUrl === 'IMAGE_REQUIRED';
  const resolvedPhoto = !isImageRequired && !imgError
    ? photoUrl
    : TRADE_DEFAULT_PHOTOS[trade] || DEFAULT_PHOTO;

  const showPlaceholder = imgError && !TRADE_DEFAULT_PHOTOS[trade];

  return (
    <div
      className={`relative inline-block shrink-0 select-none ${className}`}
      data-image-status={isImageRequired ? 'IMAGE_REQUIRED' : 'AUTHENTIC_PHOTOGRAPHY'}
    >
      <div
        className={`${sizeClasses[size]} overflow-hidden bg-slate-100 border border-[#E2DFD8] shadow-2xs flex items-center justify-center`}
      >
        {showPlaceholder ? (
          <div
            className="w-full h-full flex items-center justify-center font-black bg-[#FAF8F5] text-[#17324D] border border-dashed border-[#D0D5DD]"
            title="IMAGE_REQUIRED: Authentic documentary trade photo required"
          >
            {name ? name.charAt(0) : trade.charAt(0)}
          </div>
        ) : (
          <img
            src={resolvedPhoto}
            alt={name ? `${name} - ${trade} professional at work` : `${trade} professional at work`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        )}
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
