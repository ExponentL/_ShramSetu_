import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Electrical: Simple plug and circuit switch
export const ElectricalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M12 2v4" />
    <path d="M8 6h8" />
    <path d="M7 6v4a5 5 0 0 0 10 0V6" />
    <path d="M12 15v7" />
    <path d="M9 22h6" />
  </svg>
);

// 2. Plumbing: Pipe and water faucet tap
export const PlumbingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M4 12h5v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4h5" />
    <path d="M10 6h4" />
    <path d="M12 6v6" />
    <path d="M12 19v3" />
    <path d="M4 10v4" />
    <path d="M20 10v4" />
  </svg>
);

// 3. Carpentry: Hammer and square ruler
export const CarpentryIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
    <path d="M17.64 4.36a2 2 0 0 1 2.83 0l.17.17a2 2 0 0 1 0 2.83L17 11l-4-4 3.64-3.64a2 2 0 0 1 1-.72" />
    <path d="M18 2h3v3" />
  </svg>
);

// 4. Cleaning: Simple broom and cleaning brush
export const CleaningIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M18 3 9 12" />
    <path d="M7 14c-.6.6-1.5.6-2.1 0l-.8-.8a1.5 1.5 0 0 1 0-2.1l1.5-1.5 4.4 4.4L8.5 15.5" />
    <path d="M11 16 6 21" />
    <path d="m14 13-5 5" />
    <path d="m12 11-4 4" />
    <path d="M8 19h8a2 2 0 0 0 2-2v-2" />
  </svg>
);

// 5. Painting: Paint roller
export const PaintingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <rect x="4" y="3" width="16" height="5" rx="1" />
    <path d="M12 8v4a2 2 0 0 1-2 2H8a2 2 0 0 0-2 2v6" />
    <path d="M6 22h4" />
  </svg>
);

// 6. Appliance Repair & Technician: Toolbox / Service tool
export const ApplianceIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <rect x="3" y="6" width="18" height="15" rx="2" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M3 12h18" />
    <path d="M10 12v3" />
    <path d="M14 12v3" />
  </svg>
);

// 7. Gardening: Garden tool / Leaf
export const GardeningIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

// 8. Driving: Steering wheel / Transport
export const DrivingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v7" />
    <path d="m4.93 16.07 5.2-3.1" />
    <path d="m19.07 16.07-5.2-3.1" />
  </svg>
);

// 9. Caregiving: Healthcare and helping hands
export const CaregivingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 7v6" />
    <path d="M9 10h6" />
  </svg>
);

// Helper function to return institutional icon by service category
export const getInstitutionalServiceIcon = (
  category: string,
  className = 'w-5 h-5 text-[#17324D]'
) => {
  switch (category) {
    case 'Electrical':
      return <ElectricalIcon className={className} />;
    case 'Plumbing':
      return <PlumbingIcon className={className} />;
    case 'Carpentry':
      return <CarpentryIcon className={className} />;
    case 'Cleaning':
      return <CleaningIcon className={className} />;
    case 'Painting':
      return <PaintingIcon className={className} />;
    case 'Technician':
      return <ApplianceIcon className={className} />;
    case 'Gardening':
      return <GardeningIcon className={className} />;
    case 'Driving':
      return <DrivingIcon className={className} />;
    case 'Domestic Help':
      return <CaregivingIcon className={className} />;
    default:
      return <ApplianceIcon className={className} />;
  }
};

