import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, WorkerProfile } from '../types';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Check,
  Layers,
  Wrench,
  Sparkles,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Tv,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  materialCost: number;
  labourCost: number;
  unit: string;
  defaultQty?: number;
}

const SERVICE_ITEMS_CATALOG: ServiceItem[] = [
  // Electrical (matches exact prompt example: 3 Fans + 6 Lights => Material ₹4,500 + Labour ₹1,500 = ₹6,000)
  { id: 'elec-fan', name: 'Ceiling Fan', category: 'Electrical', materialCost: 1000, labourCost: 300, unit: 'Fan', defaultQty: 3 },
  { id: 'elec-led', name: 'LED Lights', category: 'Electrical', materialCost: 250, labourCost: 100, unit: 'Fixture', defaultQty: 6 },
  { id: 'elec-switch', name: 'Switchboard', category: 'Electrical', materialCost: 400, labourCost: 200, unit: 'Board' },
  { id: 'elec-mcb', name: 'MCB / Fuse Box', category: 'Electrical', materialCost: 800, labourCost: 400, unit: 'Box' },

  // Plumbing
  { id: 'plumb-tap', name: 'Water Tap & Spindle', category: 'Plumbing', materialCost: 350, labourCost: 150, unit: 'Tap', defaultQty: 2 },
  { id: 'plumb-flush', name: 'Flush Tank Valve Set', category: 'Plumbing', materialCost: 650, labourCost: 250, unit: 'Set', defaultQty: 1 },
  { id: 'plumb-pipe', name: 'CPVC Pipe Joint Section', category: 'Plumbing', materialCost: 400, labourCost: 200, unit: 'Joint' },
  { id: 'plumb-pump', name: 'Motor Pump Connection', category: 'Plumbing', materialCost: 1200, labourCost: 500, unit: 'Unit' },

  // Carpentry
  { id: 'carp-lock', name: 'Door Lock & Latch', category: 'Carpentry', materialCost: 850, labourCost: 350, unit: 'Lock', defaultQty: 1 },
  { id: 'carp-plane', name: 'Door Planing & Alignment', category: 'Carpentry', materialCost: 150, labourCost: 250, unit: 'Door', defaultQty: 1 },
  { id: 'carp-hinge', name: 'Cabinet Soft-Close Hinges', category: 'Carpentry', materialCost: 350, labourCost: 150, unit: 'Pair', defaultQty: 2 },
  { id: 'carp-furniture', name: 'Wood Furniture Joint Repair', category: 'Carpentry', materialCost: 250, labourCost: 350, unit: 'Piece' },

  // Cleaning
  { id: 'clean-kitchen', name: 'Kitchen Degreasing & Scrub', category: 'Cleaning', materialCost: 350, labourCost: 550, unit: 'Room', defaultQty: 1 },
  { id: 'clean-bath', name: 'Bathroom Stain & Tile Polish', category: 'Cleaning', materialCost: 250, labourCost: 350, unit: 'Bathroom', defaultQty: 1 },
  { id: 'clean-floor', name: 'Floor Scrub & Sanitization', category: 'Cleaning', materialCost: 400, labourCost: 600, unit: 'Area' },

  // Painting
  { id: 'paint-primer', name: 'Waterproof Dampness Primer', category: 'Painting', materialCost: 750, labourCost: 450, unit: 'Wall', defaultQty: 1 },
  { id: 'paint-emulsion', name: 'Interior Touch-up Paint', category: 'Painting', materialCost: 950, labourCost: 650, unit: 'Room' },

  // Technician (Appliance)
  { id: 'tech-geyser', name: 'Geyser Heating Element Coil', category: 'Technician', materialCost: 650, labourCost: 350, unit: 'Unit', defaultQty: 1 },
  { id: 'tech-ac', name: 'AC Deep Coil Jet Service', category: 'Technician', materialCost: 500, labourCost: 400, unit: 'AC', defaultQty: 1 },
  { id: 'tech-wm', name: 'Washing Machine Motor Belt', category: 'Technician', materialCost: 550, labourCost: 350, unit: 'Machine' },

  // Gardening
  { id: 'gard-prune', name: 'Lawn Mowing & Hedge Trim', category: 'Gardening', materialCost: 200, labourCost: 400, unit: 'Lawn', defaultQty: 1 },
  { id: 'gard-soil', name: 'Organic Soil & Fertilizer Pack', category: 'Gardening', materialCost: 450, labourCost: 250, unit: 'Bed' },

  // Driving
  { id: 'driv-day', name: 'City Chauffeur Driver Service', category: 'Driving', materialCost: 0, labourCost: 750, unit: 'Trip', defaultQty: 1 },
  { id: 'driv-highway', name: 'Highway Trip Chauffeur Service', category: 'Driving', materialCost: 0, labourCost: 1200, unit: 'Trip' },

  // Domestic Help / Caregiving
  { id: 'care-elder', name: 'Elder Care & Mobility Support', category: 'Domestic Help', materialCost: 150, labourCost: 650, unit: 'Session', defaultQty: 1 },
  { id: 'care-recovery', name: 'Post-Surgery Patient Vital Assistance', category: 'Domestic Help', materialCost: 200, labourCost: 700, unit: 'Session' },
];

export const BookingModal: React.FC = () => {
  const {
    bookingTargetWorker,
    setBookingTargetWorker,
    selectedCategory,
    workers,
    createBooking,
    setActiveTrackingBookingId,
    setCurrentTab,
    currentUser,
    t,
    language,
    governmentVerifications,
  } = useApp();

  // 7 Clean Steps:
  // 1. Service
  // 2. Requirements
  // 3. Items & Quantity
  // 4. Schedule
  // 5. Address
  // 6. Review
  // 7. Confirm
  const [step, setStep] = useState<number>(1);

  // Step 1: Service
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(
    bookingTargetWorker?.primaryTrade || (selectedCategory !== 'ALL' ? selectedCategory : 'Electrical')
  );

  // Step 2: Requirements
  const [serviceDescription, setServiceDescription] = useState<string>(
    'Standard diagnostic inspection, item installation, and trade testing'
  );
  const [requirementType, setRequirementType] = useState<string>('New Installation & Setup');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);

  // Step 3: Items & Quantity (Job-Based Pricing)
  // Default preselected quantities (e.g. 3 fans and 6 lights if Electrical)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'elec-fan': 3,
    'elec-led': 6,
    'plumb-tap': 2,
    'plumb-flush': 1,
    'carp-lock': 1,
    'carp-hinge': 2,
    'clean-kitchen': 1,
    'clean-bath': 1,
    'paint-primer': 1,
    'tech-geyser': 1,
    'gard-prune': 1,
    'driv-day': 1,
    'care-elder': 1,
  });

  // Step 4: Schedule (Strictly separate from pricing)
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-24');
  const [scheduledTime, setScheduledTime] = useState<string>('11:00 AM');

  // Step 5: Address
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || 'Citizen Customer');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '+91 98180 99887');
  const [addressLine, setAddressLine] = useState<string>('Flat 402, Sunshine Apartments, Sector 13, Rohini');
  const [cityZone, setCityZone] = useState<string>('North Delhi / Bahadurgarh NCR');
  const [landmark, setLandmark] = useState<string>('Near City Park Metro');

  // Assigned Worker (Preselected or matched by fair workload allocation)
  const [chosenWorker, setChosenWorker] = useState<WorkerProfile | null>(bookingTargetWorker);

  // Step 7: Confirm & Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState<string>('citizen.customer@oksbi');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4567');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('891');
  const [bankSelected, setBankSelected] = useState<string>('State Bank of India (SBI)');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Available items for the selected category
  const categoryItems = useMemo(() => {
    return SERVICE_ITEMS_CATALOG.filter((item) => item.category === serviceCategory);
  }, [serviceCategory]);

  // Selected items with count > 0
  const activeSelectedItems = useMemo(() => {
    return categoryItems.filter((item) => (quantities[item.id] || 0) > 0);
  }, [categoryItems, quantities]);

  // Dynamic Price Calculations (STRICT JOB-BASED PRICING)
  // ITEMS / QUANTITY + MATERIAL COST + LABOUR COST = TOTAL JOB COST
  const { totalMaterialCost, totalLabourCost, totalJobCost } = useMemo(() => {
    let mat = 0;
    let lab = 0;
    activeSelectedItems.forEach((item) => {
      const q = quantities[item.id] || 0;
      mat += item.materialCost * q;
      lab += item.labourCost * q;
    });

    // If customer has 0 items chosen, default to base single task
    if (activeSelectedItems.length === 0) {
      const defaultItem = categoryItems[0];
      if (defaultItem) {
        mat = defaultItem.materialCost;
        lab = defaultItem.labourCost;
      } else {
        mat = 500;
        lab = 300;
      }
    }

    return {
      totalMaterialCost: mat,
      totalLabourCost: lab,
      totalJobCost: mat + lab,
    };
  }, [activeSelectedItems, quantities, categoryItems]);

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  // Eligible workers for the trade
  const eligibleWorkers = useMemo(() => {
    return workers
      .filter((w) => w.isVerified && w.skills.includes(serviceCategory))
      .sort((a, b) => b.rating - a.rating);
  }, [workers, serviceCategory]);

  const activeWorker = chosenWorker || eligibleWorkers[0] || workers[0];

  // Worker Verification status computations
  const activeGovRecord = governmentVerifications.find((gv) => gv.workerId === activeWorker?.id);
  const isActiveGovVerified = activeGovRecord?.status === 'VERIFIED';
  const isActiveCoopVerified = activeWorker?.cooperativeVerificationStatus === 'VERIFIED';
  const isActivePlatformVerified = activeWorker?.shramsetuVerificationStatus === 'VERIFIED';

  const govStatusText = isActiveGovVerified
    ? '✓ Verified'
    : activeGovRecord?.status === 'NOT_CONFIGURED'
    ? 'Connection unavailable'
    : activeGovRecord?.status === 'PENDING'
    ? 'Pending'
    : activeGovRecord?.status === 'REQUIRES_REVIEW'
    ? 'Requires Review'
    : activeGovRecord?.status === 'REJECTED'
    ? 'Rejected'
    : 'Pending';

  const coopStatusText = isActiveCoopVerified
    ? '✓ Verified'
    : activeWorker?.cooperativeVerificationStatus === 'PENDING'
    ? 'Pending'
    : activeWorker?.cooperativeVerificationStatus === 'REJECTED'
    ? 'Rejected'
    : 'Pending';

  const platformStatusText = isActivePlatformVerified
    ? '✓ Verified'
    : activeWorker?.shramsetuVerificationStatus === 'PENDING'
    ? 'Pending'
    : activeWorker?.shramsetuVerificationStatus === 'REJECTED'
    ? 'Rejected'
    : 'Pending';

  const handleConfirmAndPay = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newBooking = createBooking({
        customerId: currentUser?.id || 'cust-201',
        customerName: customerName || currentUser?.name || 'Citizen Customer',
        customerPhone: customerPhone || currentUser?.phone || '+91 98180 99887',
        workerId: activeWorker.id,
        workerName: activeWorker.name,
        workerPhoto: activeWorker.photoUrl,
        workerPhone: activeWorker.phone,
        cooperativeId: activeWorker.cooperativeId,
        cooperativeName: activeWorker.cooperativeName,
        serviceCategory,
        serviceDescription,
        scheduledDate,
        scheduledTime,
        isEmergency,
        customerLocation: {
          lat: 28.6924,
          lng: 76.9249,
          address: addressLine,
          zone: cityZone,
          city: 'Bahadurgarh',
        },
        distanceKm: 1.4,
        estimatedArrivalMinutes: isEmergency ? 15 : 35,
        status: 'Accepted',
        estimatedPrice: totalJobCost,
        baseFeePaid: totalJobCost,
        payment: {
          id: `pay-job-${Date.now()}`,
          bookingId: '',
          amount: totalJobCost,
          method: paymentMethod,
          status: 'Completed',
          upiId: paymentMethod === 'UPI' ? upiId : undefined,
          cardLast4: paymentMethod === 'Card' ? cardNumber.slice(-4) : undefined,
          bankName: paymentMethod === 'NetBanking' ? bankSelected : undefined,
          transactionRef: `NPCI-COOP-JOB-${Date.now().toString().slice(-8)}`,
          paidAt: new Date().toISOString(),
          workerPayout: totalLabourCost, // 100% labour direct to worker
          cooperativeWelfareLevy: Math.round(totalLabourCost * 0.05),
          administrativeGST: 0,
        },
      });

      setIsProcessingPayment(false);
      setCreatedBookingId(newBooking.id);
      setActiveTrackingBookingId(newBooking.id);
      setStep(7); // Show Confirmation
    }, 1200);
  };

  const closeModal = () => {
    setBookingTargetWorker(null);
  };

  const stepsList = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Requirements' },
    { num: 3, label: 'Items & Quantity' },
    { num: 4, label: 'Schedule' },
    { num: 5, label: 'Address' },
    { num: 6, label: 'Review' },
    { num: 7, label: 'Confirm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-[#D0D5DD] overflow-hidden my-0 sm:my-6 flex flex-col h-full sm:h-auto sm:max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-[#E4E7EC] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#17324D] tracking-tight">
                ShramSetu Booking
              </h2>
              <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                Step {step} of 7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Transparent job-based pricing • 100% direct artisan remuneration
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Numbered Progress Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-[#E4E7EC] shrink-0">
          {/* Mobile step progress summary: Step X of 7 */}
          <div className="sm:hidden flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#17324D]">
              Step {step} of 7: {stepsList[step - 1]?.label}
            </span>
            <div className="flex-1 max-w-[140px] bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#17324D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop full numbered steps */}
          <div className="hidden sm:flex items-center justify-between gap-2 overflow-x-auto">
            {stepsList.map((s, idx) => (
              <div key={s.num} className="flex items-center gap-1.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    // Allow navigating backwards or to reviewed steps
                    if (s.num < step) setStep(s.num);
                  }}
                  disabled={s.num > step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-colors ${
                    step === s.num
                      ? 'bg-[#17324D] text-white'
                      : step > s.num
                      ? 'bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8] cursor-pointer'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </button>
                <span
                  className={`text-[11px] truncate ${
                    step === s.num ? 'text-[#17324D] font-black' : 'text-slate-500 font-medium'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 6 && <div className="h-px bg-slate-200 flex-1 min-w-[6px]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Main Area: Left Form Content + Right Sticky Summary Panel */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Main Form Content (Left 7 or 8 Cols) */}
          <div className="lg:col-span-8 p-5 sm:p-7 space-y-6">
            {/* STEP 1: SERVICE SELECTION */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">1. Select Cooperative Trade Service</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose the skill category required. Tariffs are fixed upfront by registered trade guilds.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { cat: 'Electrical', title: 'Electrical', icon: Zap },
                    { cat: 'Plumbing', title: 'Plumbing', icon: Droplets },
                    { cat: 'Carpentry', title: 'Carpentry', icon: Hammer },
                    { cat: 'Cleaning', title: 'Cleaning', icon: Sparkles },
                    { cat: 'Painting', title: 'Painting', icon: Paintbrush },
                    { cat: 'Technician', title: 'Appliance Repair', icon: Tv },
                    { cat: 'Gardening', title: 'Gardening', icon: Layers },
                    { cat: 'Driving', title: 'Driving', icon: Navigation },
                    { cat: 'Domestic Help', title: 'Caregiving', icon: ShieldCheck },
                  ].map((item) => {
                    const isSelected = serviceCategory === item.cat;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.cat}
                        type="button"
                        onClick={() => setServiceCategory(item.cat as ServiceCategory)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-white border-[#17324D] ring-2 ring-[#17324D] shadow-sm'
                            : 'bg-white border-[#E2DFD8] hover:border-slate-400 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#17324D] text-white' : 'bg-[#EDF7F2] text-[#167A5B]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#17324D]">{item.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Itemized tariffs</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Preselected or recommended worker badge */}
                <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] flex items-center gap-3.5">
                  <img
                    src={activeWorker.photoUrl}
                    alt={activeWorker.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E2DFD8] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#17324D]">{activeWorker.name}</span>
                      <span className="text-[10px] font-bold text-[#167A5B] bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#C6E7D8]">
                        ✓ Verified Artisan
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {activeWorker.primaryTrade} &bull; {activeWorker.cooperativeName} &bull; {activeWorker.completedJobsCount} jobs
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: REQUIREMENTS */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">2. Define Work Requirements</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Describe what needs fixing or installation so the artisan arrives with correct tools.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Scope of Requirement</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'New Installation & Setup',
                      'Repair & Fault Fix',
                      'Replacement of Broken Fixture',
                      'Preventive Maintenance',
                    ].map((req) => (
                      <button
                        key={req}
                        type="button"
                        onClick={() => setRequirementType(req)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                          requirementType === req
                            ? 'bg-white border-[#17324D] text-[#17324D] shadow-xs ring-1 ring-[#17324D]'
                            : 'bg-white border-[#E2DFD8] text-slate-700 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{req}</span>
                        {requirementType === req && <Check className="w-4 h-4 text-[#167A5B]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Specific Problem Details / Notes for Artisan
                  </label>
                  <textarea
                    rows={3}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="e.g. 3 ceiling fans to be installed on 10ft ceiling, 6 LED ceiling lights wired..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#17324D] flex items-center gap-1.5">
                      <span>Emergency Rapid Dispatch</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mobilize the nearest artisan within 15–20 minutes with zero surge pricing.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 text-[#17324D] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: ITEMS & QUANTITY (STRICT JOB-BASED PRICING) */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#17324D]">3. Select Items &amp; Quantity</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                      Job-Based Pricing
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Select exact items required. Material and labour costs update dynamically with zero hidden rates.
                  </p>
                </div>

                {/* STRICT FORMULA CALLOUT */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2DFD8] text-xs space-y-1">
                  <div className="font-bold text-[#17324D] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#167A5B]" />
                    <span>Transparent Pricing Formula:</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 bg-[#FAF8F5] p-2 rounded-lg border border-[#EBE8E1]">
                    ITEMS / QUANTITY + MATERIAL COST + LABOUR COST = TOTAL JOB COST
                  </div>
                </div>

                {/* Clear Job Pricing Breakdown Summary */}
                <div className="p-4 rounded-2xl bg-white border border-[#17324D]/20 shadow-xs space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Required Items</span>
                    <span className="text-[10px] text-[#167A5B] font-bold">Itemized Scope</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    {categoryItems.filter(it => (quantities[it.id] || 0) > 0).map(it => (
                      <div key={it.id} className="flex items-center justify-between text-slate-800 font-semibold">
                        <span>{quantities[it.id]} {it.name}{quantities[it.id] > 1 && !it.name.endsWith('s') ? 's' : ''}</span>
                        <span className="text-slate-500 font-normal">Mat ₹{it.materialCost * quantities[it.id]} + Lab ₹{it.labourCost * quantities[it.id]}</span>
                      </div>
                    ))}
                    {categoryItems.filter(it => (quantities[it.id] || 0) > 0).length === 0 && (
                      <div className="text-slate-400 text-xs italic">No items selected yet. Tap [+] below to add items.</div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Material</span>
                      <span className="font-bold text-slate-900">₹{totalMaterialCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Labour</span>
                      <span className="font-bold text-slate-900">₹{totalLabourCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 text-sm">
                      <span className="font-black text-[#17324D]">TOTAL</span>
                      <span className="text-lg sm:text-xl font-black text-[#17324D]">₹{totalJobCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Catalogue Stepper List */}
                <div className="space-y-3">
                  {categoryItems.map((item) => {
                    const qty = quantities[item.id] || 0;
                    const itemMat = item.materialCost * qty;
                    const itemLab = item.labourCost * qty;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          qty > 0 ? 'border-[#17324D] shadow-xs' : 'border-[#E2DFD8]'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-[#17324D]">{item.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Material: ₹{item.materialCost}</span>
                            <span>&bull;</span>
                            <span>Labour: ₹{item.labourCost}</span>
                            <span>per {item.unit}</span>
                          </div>
                          {qty > 0 && (
                            <div className="text-[11px] font-semibold text-[#167A5B] mt-1">
                              Subtotal: ₹{itemMat + itemLab} (Mat ₹{itemMat} + Lab ₹{itemLab})
                            </div>
                          )}
                        </div>

                        {/* Touch-First Quantity Stepper */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="min-h-[44px] min-w-[44px] rounded-xl border border-[#D0D5DD] bg-[#FAF8F5] hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-slate-900 font-mono">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="min-h-[44px] min-w-[44px] rounded-xl border border-[#17324D] bg-[#17324D] hover:bg-[#112437] flex items-center justify-center text-white font-bold transition-colors cursor-pointer"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">4. Select Appointment Schedule</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pick your preferred date and arrival window. Appointment timing is strictly independent from service cost.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E2DFD8] text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#167A5B] shrink-0" />
                  <span>Fair dispatch rule: Timing window never alters fixed job tariffs.</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Service Date</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: 'Today', val: '2026-09-24' },
                      { label: 'Tomorrow', val: '2026-09-25' },
                      { label: 'Thu, 24 Sep', val: '2026-09-26' },
                    ].map((d) => (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => setScheduledDate(d.val)}
                        className={`min-h-[48px] py-2.5 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          scheduledDate === d.val
                            ? 'bg-[#17324D] border-[#17324D] text-white shadow-xs'
                            : 'bg-white border-[#E2DFD8] text-slate-700 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>{d.label}</div>
                        <div className={`text-[10px] font-normal mt-0.5 ${scheduledDate === d.val ? 'text-slate-200' : 'text-slate-500'}`}>{d.val}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Arrival Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      '10:00 AM - 11:30 AM',
                      '11:30 AM - 01:00 PM',
                      '02:00 PM - 03:30 PM',
                      '03:30 PM - 05:00 PM',
                      '05:00 PM - 06:30 PM',
                      '06:30 PM - 08:00 PM',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setScheduledTime(slot)}
                        className={`min-h-[48px] p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center ${
                          scheduledTime === slot
                            ? 'bg-[#17324D] border-[#17324D] text-white shadow-xs'
                            : 'bg-white border-[#E2DFD8] text-slate-700 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: ADDRESS */}
            {step === 5 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">5. Service Location &amp; Contact</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide precise doorstep details for verified cooperative dispatch.
                  </p>
                </div>

                {/* Saved Addresses quick chips */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Saved Addresses</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Home', addr: 'Flat 402, Sunshine Apartments, Sector 13, Rohini', zone: 'North Delhi / Bahadurgarh NCR', lmk: 'Near City Park Metro' },
                      { label: 'Work', addr: 'Cooperative Technology Hub, Sector 14, Bahadurgarh', zone: 'Bahadurgarh Central', lmk: 'Near Metro Pillar 842' },
                      { label: 'Other', addr: 'Plot 12, Line Par, Bahadurgarh', zone: 'Bahadurgarh Industrial Zone', lmk: 'Opposite Water Tank' },
                    ].map((saved) => (
                      <button
                        key={saved.label}
                        type="button"
                        onClick={() => {
                          setAddressLine(saved.addr);
                          setCityZone(saved.zone);
                          setLandmark(saved.lmk);
                        }}
                        className={`min-h-[44px] p-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          addressLine === saved.addr
                            ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs'
                            : 'bg-white border-[#E2DFD8] text-slate-700 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {saved.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Use current location button */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressLine('Current Location • Sector 6, Bahadurgarh, Haryana');
                      setCityZone('Bahadurgarh Cluster');
                      setLandmark('Verified GPS coordinates');
                    }}
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-[#167A5B]/30 bg-[#EDF7F2] text-[#167A5B] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <MapPin className="w-4 h-4 text-[#167A5B]" />
                    <span>Use current location</span>
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Location permission is used strictly to calculate proximity to registered trade cooperatives. Your address is never sold or shared.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Contact (for OTP)</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Complete Address Line</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Service Cluster / Zone</label>
                    <input
                      type="text"
                      value={cityZone}
                      onChange={(e) => setCityZone(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nearest Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW */}
            {step === 6 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">6. Review Booking &amp; Tariffs</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Carefully inspect the verified credentials and itemized tariff breakdown before payment.
                  </p>
                </div>

                {/* 3-Tier Verification Status Card */}
                <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-3">
                  <div className="text-xs font-bold text-[#17324D] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#167A5B]" />
                    <span>Assigned Professional Verification Status</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Tier 1: Government Verification */}
                    <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DFD8]">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Government Verification
                      </div>
                      <div className="font-black text-slate-900 mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isActiveGovVerified ? 'bg-[#167A5B]' : 'bg-slate-400'}`} />
                        <span>{govStatusText}</span>
                      </div>
                    </div>

                    {/* Tier 2: Cooperative Verification */}
                    <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DFD8]">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Cooperative Verification
                      </div>
                      <div className="font-black text-slate-900 mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isActiveCoopVerified ? 'bg-[#167A5B]' : 'bg-slate-400'}`} />
                        <span>{coopStatusText}</span>
                      </div>
                    </div>

                    {/* Tier 3: ShramSetu Verification */}
                    <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DFD8]">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        ShramSetu Verification
                      </div>
                      <div className="font-black text-slate-900 mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isActivePlatformVerified ? 'bg-[#167A5B]' : 'bg-slate-400'}`} />
                        <span>{platformStatusText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itemized Breakdown Table */}
                <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-3">
                  <div className="font-bold text-xs text-[#17324D] uppercase tracking-wider">
                    Itemized Cost Breakdown
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {activeSelectedItems.map((item) => {
                      const qty = quantities[item.id] || 1;
                      const mat = item.materialCost * qty;
                      const lab = item.labourCost * qty;
                      return (
                        <div key={item.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{qty} × {item.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2">
                              (Material: ₹{mat} + Labour: ₹{lab})
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 font-mono">₹{mat + lab}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#E2DFD8] flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Total Material Cost</span>
                    <span className="font-mono">₹{totalMaterialCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Total Labour Cost</span>
                    <span className="font-mono">₹{totalLabourCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-[#17324D] flex items-center justify-between text-sm font-black text-[#17324D]">
                    <span>Total Job Cost</span>
                    <span className="font-mono">₹{totalJobCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Appointment & Address Review Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2DFD8]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Appointment Schedule</div>
                    <div className="font-bold text-slate-900 mt-1">{scheduledDate}</div>
                    <div className="text-slate-600">{scheduledTime}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2DFD8]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Doorstep Location</div>
                    <div className="font-bold text-slate-900 mt-1 truncate">{customerName} ({customerPhone})</div>
                    <div className="text-slate-600 truncate">{addressLine}, {cityZone}</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: CONFIRM & PAYMENT */}
            {step === 7 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-[#17324D]">7. Payment &amp; Confirmation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Secure NPCI / UPI remittance. 100% of standard labour is transferred directly to the artisan.
                  </p>
                </div>

                {createdBookingId ? (
                  /* Success Screen after confirmation */
                  <div className="p-6 rounded-2xl bg-white border border-[#C6E7D8] text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-[#EDF7F2] text-[#167A5B] flex items-center justify-center font-black mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-[#167A5B]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#17324D]">Booking Successfully Confirmed!</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Assigned Artisan: <strong>{activeWorker.name}</strong> ({activeWorker.primaryTrade})
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] border border-[#E2DFD8] rounded-xl text-xs space-y-1">
                      <div className="text-slate-500">Scheduled Arrival</div>
                      <div className="font-bold text-[#17324D]">{scheduledDate} at {scheduledTime}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          closeModal();
                          setCurrentTab('tracking');
                        }}
                        className="w-full py-2.5 px-4 bg-[#17324D] hover:bg-[#112437] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4 text-emerald-400" />
                        <span>Track Worker Live</span>
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-[#D0D5DD] rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Payment Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'UPI', label: 'UPI / QR' },
                        { id: 'Card', label: 'RuPay / Card' },
                        { id: 'NetBanking', label: 'NetBanking' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentMethod(p.id as any)}
                          className={`py-3 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            paymentMethod === p.id
                              ? 'bg-white border-[#17324D] text-[#17324D] ring-1 ring-[#17324D] shadow-xs'
                              : 'bg-white border-[#E2DFD8] text-slate-700 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-3">
                        <label className="text-xs font-bold text-slate-700 block">Enter UPI ID (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@oksbi"
                          className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#17324D]"
                        />
                        <div className="text-[11px] text-slate-500">
                          Supports BHIM UPI, Google Pay, PhonePe, and Paytm.
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-mono font-medium text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Expiry</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'NetBanking' && (
                      <div className="p-4 rounded-xl bg-white border border-[#E2DFD8] space-y-3">
                        <label className="text-xs font-bold text-slate-700 block">Select Cooperative Partner Bank</label>
                        <select
                          value={bankSelected}
                          onChange={(e) => setBankSelected(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D0D5DD] rounded-xl text-xs font-bold text-slate-900"
                        >
                          <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                          <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                          <option value="Delhi State Co-operative Bank">Delhi State Co-operative Bank</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                        </select>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DFD8] text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-[#17324D]">Cooperative Pay Guarantee:</div>
                      <div>
                        100% of standard labour cost (₹{totalLabourCost}) is credited directly to {activeWorker.name}&apos;s verified bank account upon OTP sign-off.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 7 && (
              <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="px-4 py-2 bg-white hover:bg-[#FAF8F5] text-slate-700 border border-[#D0D5DD] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (step === 6) {
                      setStep(7);
                    } else {
                      setStep((s) => Math.min(7, s + 1));
                    }
                  }}
                  className="px-5 py-2.5 bg-[#17324D] hover:bg-[#112437] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>{step === 6 ? 'Proceed to Confirm & Pay' : `Continue to ${stepsList[step]?.label}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sticky Booking Summary Panel (Desktop 4 Cols) */}
          <div className="lg:col-span-4 bg-white border-t lg:border-t-0 lg:border-l border-[#E4E7EC] p-5 sm:p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="border-b border-[#E4E7EC] pb-3">
                <div className="text-[10px] font-bold text-[#167A5B] uppercase tracking-wider">
                  Tariff Breakdown
                </div>
                <h4 className="text-sm font-black text-[#17324D] tracking-tight mt-0.5">
                  Booking Summary
                </h4>
              </div>

              {/* Service & Items */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Service</span>
                  <span className="font-bold text-[#17324D]">{serviceCategory}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Required Items</span>
                  <div className="font-semibold text-slate-800 space-y-0.5 mt-0.5">
                    {activeSelectedItems.length > 0 ? (
                      activeSelectedItems.map((it) => (
                        <div key={it.id} className="text-[11px] text-slate-700">
                          {quantities[it.id]} × {it.name}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400">1 × Standard service diagnostic</span>
                    )}
                  </div>
                </div>

                {/* Pricing: Material + Labour = Total */}
                <div className="pt-3 border-t border-[#EBE8E1] space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Material Cost</span>
                    <span className="font-bold font-mono text-slate-900">
                      ₹{totalMaterialCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Labour Cost</span>
                    <span className="font-bold font-mono text-slate-900">
                      ₹{totalLabourCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#17324D] flex items-center justify-between text-sm font-black text-[#17324D]">
                    <span>Total Job Cost</span>
                    <span className="font-mono text-base text-[#167A5B]">
                      ₹{totalJobCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Appointment Date & Time: Kept strictly separate from pricing */}
                <div className="pt-3 border-t border-[#EBE8E1] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Appointment (Separate from pricing)
                  </span>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#167A5B]" />
                    <span>{scheduledDate}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scheduledTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action in Sticky Panel */}
            <div className="pt-4 border-t border-[#E4E7EC] space-y-2">
              {step === 7 && !createdBookingId ? (
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleConfirmAndPay}
                  className="w-full py-3 bg-[#167A5B] hover:bg-[#126349] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Processing NPCI Remittance...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Booking &bull; ₹{totalJobCost.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              ) : step < 6 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(7, s + 1))}
                  className="w-full py-2.5 bg-[#17324D] hover:bg-[#112437] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Next: {stepsList[step]?.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}

              <div className="text-[10px] text-center text-slate-400 font-medium">
                Protected by ShramSetu Cooperative Charter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
