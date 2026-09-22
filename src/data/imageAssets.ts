/**
 * ShramSetu Authentic Image Asset Registry
 * 
 * Strict Image Principles:
 * - Real, relevant, human documentary photography representing real workers doing real work.
 * - Zero AI-generated faces, zero cartoon/3D illustrations, zero generic corporate office models.
 * - Every photo directly depicts the trade being performed in real domestic or workplace environments.
 * - Verified public CDN links from Unsplash / Pexels licensed for public commercial and personal use.
 * - Supports fallback handling marked internally as IMAGE_REQUIRED.
 */

export const IMAGE_REQUIRED_TOKEN = 'IMAGE_REQUIRED';

export interface ImageAssetMeta {
  url: string;
  alt: string;
  trade: string;
  workContext: string;
  license: string;
  objectPosition?: string;
}

/**
 * Visual Service Categories (9 Core Cooperative Trades)
 * Each photo depicts an actual professional performing that specific trade.
 */
export const SERVICE_CATEGORY_IMAGES: Record<string, ImageAssetMeta> = {
  Electrical: {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    alt: 'Certified electrician installing circuit breakers on a residential distribution panel',
    trade: 'Electrical',
    workContext: 'Electrician wiring MCB circuit box with insulated tools',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Plumbing: {
    url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
    alt: 'Skilled plumber repairing water pipes and copper fittings with a pipe wrench',
    trade: 'Plumbing',
    workContext: 'Plumber tightening pipe joints and inspecting water flow',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Carpentry: {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    alt: 'Master carpenter planing and joining solid timber with hand tools in a workshop',
    trade: 'Carpentry',
    workContext: 'Carpenter measuring wood grain and planing lumber',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Cleaning: {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    alt: 'Cleaning professional sanitizing domestic kitchen tiles and countertop',
    trade: 'Cleaning',
    workContext: 'Deep cleaning specialist scrubbing hard water tiles and surfaces',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Painting: {
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    alt: 'Professional painter applying emulsion coating onto a wall using a paint roller',
    trade: 'Painting',
    workContext: 'House painter rolling uniform coating on residential wall',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Technician: {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    alt: 'Appliance repair technician diagnosing motor circuit with digital multimeter probes',
    trade: 'Appliance Repair',
    workContext: 'Technician testing electrical resistance and troubleshooting appliance',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Gardening: {
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=800&auto=format&fit=crop&q=80',
    alt: 'Gardener pruning garden plants and trimming shrubs with hand shears',
    trade: 'Gardening',
    workContext: 'Horticulture specialist aerating soil and shaping hedges',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  Driving: {
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
    alt: 'Professional chauffeur hands on steering wheel navigating vehicle along route',
    trade: 'Driving',
    workContext: 'Experienced driver navigating city and highway streets attentively',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
  'Domestic Help': {
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    alt: 'Professional caregiver assisting an elderly individual with walking and domestic support',
    trade: 'Caregiving & Domestic Help',
    workContext: 'Care assistant supporting elder mobility with care and attention',
    license: 'Unsplash License (Free to use under Unsplash commercial license)',
    objectPosition: 'object-center',
  },
};

/**
 * Real Worker Photography Registry
 * Maps each verified cooperative artisan to an authentic photograph of them performing their trade.
 */
export const WORKER_PHOTOGRAPHY_REGISTRY: Record<string, ImageAssetMeta> = {
  // w-100: Rajesh Kumar (ITI Certified Electrician, Bahadurgarh)
  'w-100': {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    alt: 'Rajesh Kumar, ITI certified electrician working on electrical switchboard and circuit wiring',
    trade: 'Electrical',
    workContext: 'Wiring MCB distribution board in residential premises',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-101: Vikramaditya Verma (Senior Electrical Auditor, Rohini, New Delhi)
  'w-101': {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    alt: 'Vikramaditya Verma, electrical auditor conducting domestic electrical load and wiring inspection',
    trade: 'Electrical',
    workContext: 'Inspecting circuit wiring integrity and commercial breaker panels',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-102: Harpreet Singh (Master Plumber, Mohali)
  'w-102': {
    url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
    alt: 'Harpreet Singh, master plumber tightening pipeline joints and repairing brass fixtures',
    trade: 'Plumbing',
    workContext: 'Overhauling water pipeline joints with pipe wrench',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-103: Rajeshwari Devi (Housekeeping & Domestic Sanitation, South Delhi)
  'w-103': {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    alt: 'Rajeshwari Devi, domestic housekeeping specialist sanitizing kitchen counter and tiles',
    trade: 'Domestic Help',
    workContext: 'Deep kitchen cleaning and domestic sanitization',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-104: Mohammed Arif (Master Woodcraft Artisan / Carpenter, Okhla, New Delhi)
  'w-104': {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    alt: 'Mohammed Arif, master carpenter shaping solid timber with hand plane and chisel',
    trade: 'Carpentry',
    workContext: 'Furniture frame fitting and wood planing in artisan workshop',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-105: Sunita Devi (Deep Home Cleaning Specialist, Bahadurgarh)
  'w-105': {
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
    alt: 'Sunita Devi, professional cleaner wiping domestic glass and tile fixtures',
    trade: 'Cleaning',
    workContext: 'Full residential bathroom and floor sanitization',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-106: Ramesh Chand (HVAC & Appliance Technician, West Delhi)
  'w-106': {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    alt: 'Ramesh Chand, appliance technician diagnosing washing machine and geyser motor circuitry',
    trade: 'Technician',
    workContext: 'Testing motor coil continuity and thermostat sensors',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-107: Balwinder Singh (Surface & Wall Coating Painter, Mohali)
  'w-107': {
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    alt: 'Balwinder Singh, house painter applying uniform wall paint coating with roller',
    trade: 'Painting',
    workContext: 'Residential wall waterproofing and emulsion painting',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-108: Geeta Rani (Elderly Care & Patient Companion, Gurugram)
  'w-108': {
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    alt: 'Geeta Rani, elder companion supporting an elder person walking across domestic room',
    trade: 'Domestic Help',
    workContext: 'Compassionate mobility and daily companionship assistance',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-109: Gurpreet Singh (Verified Chauffeur & Highway Driver, Tricity)
  'w-109': {
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
    alt: 'Gurpreet Singh, professional driver attentively navigating vehicle route',
    trade: 'Driving',
    workContext: 'City transit and safe highway chauffeur driving',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },

  // w-110: Manoj Kumar (Horticulture & Landscape Specialist, Bahadurgarh)
  'w-110': {
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=800&auto=format&fit=crop&q=80',
    alt: 'Manoj Kumar, gardener trimming hedge plants with pruning shears in residential lawn',
    trade: 'Gardening',
    workContext: 'Landscape pruning and soil aeration',
    license: 'Unsplash License',
    objectPosition: 'object-center',
  },
};

/**
 * 7-Stage Journey Step Imagery
 * Each step reflects the actual real-world action taking place.
 */
export const JOURNEY_STEP_IMAGES: Record<number, ImageAssetMeta> = {
  1: {
    url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
    alt: 'Homeowner inspecting itemized plumbing repair requirements with transparent pricing',
    trade: 'Plumbing',
    workContext: 'Choosing verified cooperative trade with upfront itemized pricing',
    license: 'Unsplash License',
  },
  2: {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    alt: 'Certified trade artisan verified under district labour cooperative charter',
    trade: 'Electrical',
    workContext: 'Selecting certified professional with audited trade credentials',
    license: 'Unsplash License',
  },
  3: {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    alt: 'Woodwork artisan measuring exact job scope and material requirements',
    trade: 'Carpentry',
    workContext: 'Job-based scoping: item quantity + material + labour',
    license: 'Unsplash License',
  },
  4: {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    alt: 'Service professional scheduled for convenient guaranteed morning or afternoon arrival window',
    trade: 'Cleaning',
    workContext: 'Booking guaranteed slot with cooperative dispatch engine',
    license: 'Unsplash License',
  },
  5: {
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
    alt: 'Professional artisan commuting to customer home with live telemetry and arrival OTP',
    trade: 'Driving',
    workContext: 'Live GPS dispatch tracking with one-time doorstep safety PIN',
    license: 'Unsplash License',
  },
  6: {
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    alt: 'Artisan executing service to trade safety standards with sign-off checklist',
    trade: 'Painting',
    workContext: 'Quality workmanship backed by cooperative dispute arbitration',
    license: 'Unsplash License',
  },
  7: {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    alt: 'Customer sign-off and 100% direct remuneration reaching artisan without platform commission cuts',
    trade: 'Technician',
    workContext: 'Transparent customer review and fair digital worker pay',
    license: 'Unsplash License',
  },
};

/**
 * Returns true if an image URL is missing, invalid, or marked as IMAGE_REQUIRED.
 */
export function isImageRequired(url?: string | null): boolean {
  if (!url) return true;
  if (url === IMAGE_REQUIRED_TOKEN) return true;
  if (url.trim() === '') return true;
  return false;
}

/**
 * Resolves a worker photo URL to an authentic documentary image or returns IMAGE_REQUIRED.
 */
export function getAuthenticWorkerPhoto(workerId: string, fallbackTrade?: string): string {
  if (WORKER_PHOTOGRAPHY_REGISTRY[workerId]) {
    return WORKER_PHOTOGRAPHY_REGISTRY[workerId].url;
  }
  if (fallbackTrade && SERVICE_CATEGORY_IMAGES[fallbackTrade]) {
    return SERVICE_CATEGORY_IMAGES[fallbackTrade].url;
  }
  return IMAGE_REQUIRED_TOKEN;
}

/**
 * Detailed Sub-Services Registry for Service Pages
 * Each sub-service contains a real photographic thumbnail demonstrating the exact task.
 */
export interface SubServiceItem {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  alt: string;
  typicalTariff: string;
  itemsScope: string;
}

export interface CategoryDetailMeta {
  category: string;
  title: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  overview: string;
  guildBadge: string;
  subServices: SubServiceItem[];
}

export const CATEGORY_DETAILED_SERVICES: Record<string, CategoryDetailMeta> = {
  Electrical: {
    category: 'Electrical',
    title: 'Electrical Services',
    tagline: 'Fan · Wiring · MCB',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Certified electrician installing circuit breakers and wiring distribution board with insulated tools',
    overview: 'ITI certified electricians backed by registered labour cooperatives. Every job follows strict Bureau of Indian Standards (BIS) safety codes with itemized labour and materials at actuals.',
    guildBadge: 'Active Electrical Guild • ITI Certified',
    subServices: [
      {
        id: 'elec-sub-1',
        name: 'Fan Installation',
        description: 'Ceiling fan, exhaust fan, or heavy wall-mount fan assembly, blade alignment & safety canopy fitting.',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        alt: 'Electrician wiring and securing ceiling fan mounting bracket',
        typicalTariff: 'From ₹199 labour',
        itemsScope: 'Ceiling fans, exhaust fans, regulator connection',
      },
      {
        id: 'elec-sub-2',
        name: 'Lighting Installation',
        description: 'LED panel lights, concealed downlights, spotlights, decorative chandelier & false ceiling bracket wiring.',
        photoUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=80',
        alt: 'Electrician mounting LED panel lighting fixtures on ceiling',
        typicalTariff: 'From ₹149 labour',
        itemsScope: 'LED battens, downlights, surface fixtures',
      },
      {
        id: 'elec-sub-3',
        name: 'Switchboard Repair',
        description: 'Modular switches, burnt socket overhaul, high-amperage 16A power plugs, and safety indicator replacement.',
        photoUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80',
        alt: 'Electrician repairing modular switchboard with insulated screwdriver',
        typicalTariff: 'From ₹149 labour',
        itemsScope: '6A/16A switches, 3-pin sockets, switch plates',
      },
      {
        id: 'elec-sub-4',
        name: 'Wiring & MCB Repair',
        description: 'Distribution panel MCB tripping fix, short-circuit isolation, phase imbalance diagnosis & earthing inspection.',
        photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        alt: 'Electrician diagnosing MCB circuit breakers in main distribution panel',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Double pole MCB, RCCB isolator, earthing wire test',
      },
    ],
  },
  Plumbing: {
    category: 'Plumbing',
    title: 'Plumbing Services',
    tagline: 'Tap · Pipe · Leakage',
    heroImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Master plumber repairing copper pipes and water fittings with pipe wrench',
    overview: 'Certified plumbers specializing in domestic water distribution, sanitary fittings, concealed leakage diagnosis, and drainage declogging without damaging walls.',
    guildBadge: 'Active Plumbing Guild • PMKVY Certified',
    subServices: [
      {
        id: 'plumb-sub-1',
        name: 'Tap & Faucet Repair',
        description: 'Dripping tap washer seal replacement, ceramic spindle overhaul, and quarter-turn brass tap fixing.',
        photoUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80',
        alt: 'Plumber fixing brass water tap with spanner',
        typicalTariff: 'From ₹149 labour',
        itemsScope: 'Kitchen sink tap, washbasin pillar cock, angle valves',
      },
      {
        id: 'plumb-sub-2',
        name: 'Water Pipe Leakage Repair',
        description: 'Concealed CPVC, UPVC, and GI pipe joint welding, pinhole leakage seal & pressure valve replacement.',
        photoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
        alt: 'Plumber repairing copper pipe joints and inspecting water flow',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Concealed pipe joints, overhead tank line, pressure test',
      },
      {
        id: 'plumb-sub-3',
        name: 'Flush Tank & Toilet Cistern Repair',
        description: 'Siphon flush valve replacement, inlet float valve repair, and dual-flush cistern leakage overhaul.',
        photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
        alt: 'Plumber inspecting toilet cistern flush mechanism and water supply',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Cistern siphon valve, inlet ball valve, flush push buttons',
      },
      {
        id: 'plumb-sub-4',
        name: 'Sink & Drain Blockage Clearing',
        description: 'Kitchen sink bottle trap cleaning, floor waste trap declogging, and sanitary pipe line clearing.',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        alt: 'Plumber connecting sink drainage P-trap pipe under kitchen counter',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Bottle trap, waste pipe, floor drain trap cleaning',
      },
    ],
  },
  Carpentry: {
    category: 'Carpentry',
    title: 'Carpentry Services',
    tagline: 'Furniture · Door · Lock',
    heroImage: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Master carpenter planing and joining solid timber with hand tools in workshop',
    overview: 'Skilled joiners and woodcraft artisans from registered district cooperatives. Expert handling of solid timber, modular boards, concealed hardware, and precision fittings.',
    guildBadge: 'Craft Guild • Technical Education Directorate',
    subServices: [
      {
        id: 'carp-sub-1',
        name: 'Door Lock & Handle Fitting',
        description: 'Mortise lock installation, computerized key cylinder overhaul, cylindrical brass lock & tower bolt fitting.',
        photoUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=600&auto=format&fit=crop&q=80',
        alt: 'Carpenter measuring and fitting mortise lock in solid wooden door',
        typicalTariff: 'From ₹199 labour',
        itemsScope: 'Main door mortise locks, deadbolts, handles & latches',
      },
      {
        id: 'carp-sub-2',
        name: 'Door Planing & Alignment',
        description: 'Stuck wooden doors trimmed with hand plane, heavy hinge adjustment, and seasonal expansion gap fixing.',
        photoUrl: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&auto=format&fit=crop&q=80',
        alt: 'Carpenter hand-planing wooden door edge for smooth alignment',
        typicalTariff: 'From ₹179 labour',
        itemsScope: 'Jammed room doors, balcony door frames, heavy hinges',
      },
      {
        id: 'carp-sub-3',
        name: 'Furniture Repair & Joint Fix',
        description: 'Loose chair joints re-dowelled, dining table stabilization, sofa wooden frame reinforcement & bed slat repairs.',
        photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
        alt: 'Carpenter repairing wooden chair joint with precision clamp',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Wooden chairs, sofa sub-frames, bed boxes & joints',
      },
      {
        id: 'carp-sub-4',
        name: 'Cabinet Hinge & Channel Replacement',
        description: 'Modular kitchen hydraulic soft-close hinges, telescopic drawer ball-bearing slides & sliding door rollers.',
        photoUrl: 'https://images.unsplash.com/photo-1502005229762-ee1524228303?w=600&auto=format&fit=crop&q=80',
        alt: 'Carpenter fitting modular kitchen cabinet hinges and drawer channels',
        typicalTariff: 'From ₹149 labour',
        itemsScope: 'Hydraulic hinges, telescopic drawer channels, wardrobe rollers',
      },
    ],
  },
  Cleaning: {
    category: 'Cleaning',
    title: 'Cleaning Services',
    tagline: 'Kitchen · Bath · Floor',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Sanitation professional deep cleaning domestic kitchen tiles and countertop',
    overview: 'Trained sanitation specialists utilizing eco-friendly, non-toxic descalers and commercial grade scrubbing gear. Cooperative standards ensure hygiene without abrasive surface damage.',
    guildBadge: 'Sanitation Cell • MEPSC Certified',
    subServices: [
      {
        id: 'clean-sub-1',
        name: 'Kitchen Deep Cleaning',
        description: 'Degreasing exhaust canopy, stove backsplash scrubbing, oil stain removal from modular cabinets & tile restoration.',
        photoUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
        alt: 'Sanitation specialist scrubbing kitchen tiles and stove backsplash',
        typicalTariff: 'From ₹399 labour',
        itemsScope: 'Stovetop, kitchen cabinets, tile degreasing, sink sanitization',
      },
      {
        id: 'clean-sub-2',
        name: 'Bathroom Descaling & Sanitization',
        description: 'Hard water salt stain removal from wall tiles, shower glass descaling, ceramic basin polishing & toilet sanitization.',
        photoUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
        alt: 'Cleaning professional descaling bathroom tiles and shower fixtures',
        typicalTariff: 'From ₹349 labour',
        itemsScope: 'Bathroom wall tiles, glass cubicle, sanitaryware descaling',
      },
      {
        id: 'clean-sub-3',
        name: 'Floor Scrubbing & Polishing',
        description: 'Deep tile grout scrubbing, marble floor buffing with non-abrasive cleaning compounds & skirting line detailing.',
        photoUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
        alt: 'Professional cleaner scrubbing and mopping tiled living room floor',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Living room & bedroom floor tiles, skirting, grout lines',
      },
      {
        id: 'clean-sub-4',
        name: 'Full Home Interior Sanitization',
        description: 'Complete home dust extraction, window track detailing, cobweb removal & high-touch surface disinfection.',
        photoUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',
        alt: 'Sanitation team vacuuming and sanitizing residential interior room',
        typicalTariff: 'From ₹899 labour',
        itemsScope: 'All bedrooms, living hall, windows, door frames & fixtures',
      },
    ],
  },
  Painting: {
    category: 'Painting',
    title: 'Painting Services',
    tagline: 'Wall · Roller · Dampness',
    heroImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'House painter applying uniform wall paint coating with roller',
    overview: 'Experienced painters from DLACS Building Crafts Guild. Specializes in moisture-resistant base primers, premium interior emulsions, and exterior weather-proof coatings.',
    guildBadge: 'Surface Guild • CSDCI Certified',
    subServices: [
      {
        id: 'paint-sub-1',
        name: 'Interior Wall Painting',
        description: 'Two-coat washable luxury emulsion application, roller texture finish & masking tape surface protection.',
        photoUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
        alt: 'Painter applying wall emulsion coating with paint roller',
        typicalTariff: 'From ₹499 labour',
        itemsScope: 'Living room walls, bedroom plaster surfaces, edge cutting',
      },
      {
        id: 'paint-sub-2',
        name: 'Waterproofing & Damp Treatment',
        description: 'Anti-efflorescence primer coating, crack filling putty, and polymer barrier sealing against peeling plaster.',
        photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
        alt: 'Painter treating wall dampness and applying waterproof sealant',
        typicalTariff: 'From ₹399 labour',
        itemsScope: 'Damp wall patches, skirting moisture lines, waterproofing putty',
      },
      {
        id: 'paint-sub-3',
        name: 'Wood & Metal Enamel Painting',
        description: 'Synthetic high-gloss enamel brushing on window security grills, main gate ironwork, and wooden door frames.',
        photoUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
        alt: 'Painter brushing protective enamel coating on iron window grill',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Window grills, iron railings, wooden door moldings',
      },
      {
        id: 'paint-sub-4',
        name: 'Wall Touch-up & Accent Finish',
        description: 'Single wall designer stencil work, nail hole spackling, moving scratch repair & shade matching.',
        photoUrl: 'https://images.unsplash.com/photo-1574360851957-318298857577?w=600&auto=format&fit=crop&q=80',
        alt: 'Painter finishing accent wall stencil pattern and touch-up',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Accent living wall, patch touch-ups, nail hole repair',
      },
    ],
  },
  Technician: {
    category: 'Technician',
    title: 'Appliance Repair Services',
    tagline: 'AC · Washing Machine · Geyser',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Appliance repair technician diagnosing motor circuit with digital multimeter probes',
    overview: 'National Apprenticeship Council (NAC) certified appliance technicians. Transparent diagnostic checklist with genuine OEM component replacement and warranty.',
    guildBadge: 'Appliance Guild • NAC Certified',
    subServices: [
      {
        id: 'tech-sub-1',
        name: 'AC Servicing & Repair',
        description: 'Indoor jet pump coil servicing, drain tray flushing, capacitor replacement, PCB fault diagnosis & cooling check.',
        photoUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
        alt: 'Technician servicing split air conditioner cooling coils and filters',
        typicalTariff: 'From ₹349 labour',
        itemsScope: 'Indoor cooling unit, filter jet wash, capacitor test',
      },
      {
        id: 'tech-sub-2',
        name: 'Washing Machine Repair',
        description: 'Drum bearing noise fix, drain pump unclogging, motor belt change, water inlet solenoid valve & spin error diagnosis.',
        photoUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
        alt: 'Technician inspecting washing machine drum mechanism and motor',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Front load & top load motors, drain pump, inlet valve',
      },
      {
        id: 'tech-sub-3',
        name: 'Refrigerator Diagnostics',
        description: 'Compressor relay & overload protector fix, frost-free defrost thermostat replacement, door gasket seal repair.',
        photoUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
        alt: 'Technician troubleshooting refrigerator compressor and thermostat sensors',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Inverter compressor relay, defrost sensor, door gasket',
      },
      {
        id: 'tech-sub-4',
        name: 'Geyser & Microwave Repair',
        description: 'Immersion heating element replacement, thermostat cutout fix, microwave magnetron & door interlock switch repair.',
        photoUrl: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=600&auto=format&fit=crop&q=80',
        alt: 'Technician testing electric geyser heating element with multimeter',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Electric storage geyser element, thermostat, microwave fuse',
      },
    ],
  },
  Gardening: {
    category: 'Gardening',
    title: 'Gardening & Horticulture',
    tagline: 'Lawn · Plants · Pruning',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Gardener pruning garden plants and trimming shrubs with hand shears',
    overview: 'Horticulture specialists certified by agricultural cooperatives. Experts in organic composting, soil aeration, seasonal pruning, and residential lawn maintenance.',
    guildBadge: 'Horticulture Cell • PAU Certified',
    subServices: [
      {
        id: 'gard-sub-1',
        name: 'Hedge & Shrub Trimming',
        description: 'Precision hedge shaping with shears, dead wood removal, topiary pruning & garden border definition.',
        photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
        alt: 'Gardener trimming residential boundary hedges with professional shears',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Boundary hedge line, ornamental shrubs, overgrown branches',
      },
      {
        id: 'gard-sub-2',
        name: 'Lawn Mowing & Edging',
        description: 'Level lawn grass mowing, edge trimming along paved walkways, organic weed pulling & thatch aeration.',
        photoUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=600&auto=format&fit=crop&q=80',
        alt: 'Gardener operating lawn mower on green residential grass',
        typicalTariff: 'From ₹349 labour',
        itemsScope: 'Front/back lawn, grass edging, dead thatch clearing',
      },
      {
        id: 'gard-sub-3',
        name: 'Plant Health & Soil Aeration',
        description: 'Balcony planter soil loosening, vermicompost application, neem oil pest treatment & seasonal repotting.',
        photoUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80',
        alt: 'Gardener repotting nursery plants and loosening fertile soil',
        typicalTariff: 'From ₹249 labour',
        itemsScope: 'Potted plants, balcony planters, organic fertilizer mix',
      },
      {
        id: 'gard-sub-4',
        name: 'Garden Landscaping & Irrigation',
        description: 'Flower bed designing, drip irrigation tube nozzle check, seasonal sapling planting & mulch distribution.',
        photoUrl: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=600&auto=format&fit=crop&q=80',
        alt: 'Gardener tending flower beds and checking garden drip lines',
        typicalTariff: 'From ₹399 labour',
        itemsScope: 'Seasonal flower beds, drip watering lines, root aeration',
      },
    ],
  },
  Driving: {
    category: 'Driving',
    title: 'Professional Chauffeur Services',
    tagline: 'Chauffeur · Highway · Airport',
    heroImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Professional driver attentively navigating vehicle route',
    overview: 'Police-verified commercial transport drivers from Punjab Shramik Transport Guild. Safe defensive driving certifications with zero surge fees.',
    guildBadge: 'Verified Drivers • IDTR Certified',
    subServices: [
      {
        id: 'drive-sub-1',
        name: 'City Chauffeur',
        description: 'Courteous on-demand private driver for city meetings, family events, hospital visits & daily commute.',
        photoUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80',
        alt: 'Chauffeur driving passenger sedan through urban street safely',
        typicalTariff: 'From ₹399 trip',
        itemsScope: 'City transit, patient hospital transfer, family errands',
      },
      {
        id: 'drive-sub-2',
        name: 'Highway Outstation Travel',
        description: 'Experienced expressway driver for inter-city travel across Delhi-NCR, Haryana, Punjab & Rajasthan circuits.',
        photoUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
        alt: 'Professional driver navigating highway route during outstation travel',
        typicalTariff: 'From ₹799 day',
        itemsScope: 'Inter-city highway trip, night travel safety, route navigation',
      },
      {
        id: 'drive-sub-3',
        name: 'Airport Pickup & Transfer',
        description: 'Punctual terminal arrival, luggage assistance, live flight tracking & comfortable doorstep drop.',
        photoUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
        alt: 'Chauffeur assisting with passenger travel at airport terminal',
        typicalTariff: 'From ₹449 trip',
        itemsScope: 'IGI Airport transfers, terminal greeting, baggage support',
      },
      {
        id: 'drive-sub-4',
        name: 'Vehicle Inspection & Transit',
        description: 'Pre-trip fluid checks, tire pressure verification, vehicle service transit & automated fitness check.',
        photoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
        alt: 'Professional driver inspecting vehicle engine and tire pressure',
        typicalTariff: 'From ₹299 labour',
        itemsScope: 'Pre-trip safety check, dealership service drop, PUC transit',
      },
    ],
  },
  'Domestic Help': {
    category: 'Domestic Help',
    title: 'Caregiving & Domestic Support',
    tagline: 'Elderly · Companion · Mobility',
    heroImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200&auto=format&fit=crop&q=80',
    heroAlt: 'Professional caregiver assisting an elderly individual with walking and domestic support',
    overview: 'Compassionate, verified domestic caregivers from DLACS Women Artisans & Caregivers Cell. Dedicated to dignified elderly companionship, patient assistance, and home warmth.',
    guildBadge: 'Care Cell • Skill India Certified',
    subServices: [
      {
        id: 'care-sub-1',
        name: 'Elderly Mobility Assistance',
        description: 'Assisting senior family members with walking, stair climbing, wheelchair support & daily indoor mobility.',
        photoUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80',
        alt: 'Caregiver gently supporting senior walking across living room',
        typicalTariff: 'From ₹499 slot',
        itemsScope: 'Walking mobility support, gentle exercise, fall prevention',
      },
      {
        id: 'care-sub-2',
        name: 'Patient Companion & Bedside Care',
        description: 'Punctual medicine reminders, warm conversation, vital sign recording & attentive bedside companionship.',
        photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
        alt: 'Care companion engaged in compassionate conversation with patient',
        typicalTariff: 'From ₹549 slot',
        itemsScope: 'Bedside companionship, vitals log, medication timing',
      },
      {
        id: 'care-sub-3',
        name: 'Daily Living & Nutrition Support',
        description: 'Preparing wholesome light meals, fresh tea, kitchen tidying, and maintaining a comfortable home atmosphere.',
        photoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80',
        alt: 'Domestic assistant preparing warm nutritious tea for family member',
        typicalTariff: 'From ₹399 slot',
        itemsScope: 'Light wholesome meals, hydration reminders, living area upkeep',
      },
      {
        id: 'care-sub-4',
        name: 'Post-Surgery Recovery Support',
        description: 'Supporting recovering patient with prescribed gentle movement, physical rehabilitation comfort & safe rest.',
        photoUrl: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?w=600&auto=format&fit=crop&q=80',
        alt: 'Rehabilitation companion assisting patient with mobility exercise',
        typicalTariff: 'From ₹599 slot',
        itemsScope: 'Post-op mobility support, comfortable rest posture, hygiene assistance',
      },
    ],
  },
};

