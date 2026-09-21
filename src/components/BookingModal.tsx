import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, WorkerProfile } from '../types';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
} from 'lucide-react';

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

  // Booking Flow Steps:
  // 1: Service details
  // 2: Location & Address
  // 3: Date/Time
  // 4: Worker Selection & Fair Allocation
  // 5: Price Estimate & Confirmation
  // 6: Digital Payment
  // 7: Confirmed
  const [step, setStep] = useState<number>(1);

  // Form State
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(
    bookingTargetWorker?.primaryTrade || (selectedCategory !== 'ALL' ? selectedCategory : 'Electrical')
  );
  const [serviceDescription, setServiceDescription] = useState<string>('Standard diagnostic inspection and repair');
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || 'Citizen Customer');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '+91 98180 99887');
  const [addressLine, setAddressLine] = useState<string>('Flat 402, Sunshine Apartments, Sector 13, Rohini');
  const [cityZone, setCityZone] = useState<string>('North Delhi');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-04');
  const [scheduledTime, setScheduledTime] = useState<string>('11:00 AM');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);

  // Selected Worker state (preselected or matched)
  const [chosenWorker, setChosenWorker] = useState<WorkerProfile | null>(bookingTargetWorker);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState<string>('citizen.customer@oksbi');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4567');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('891');
  const [bankSelected, setBankSelected] = useState<string>('State Bank of India (SBI)');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Result Booking
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!bookingTargetWorker && step === 1 && !chosenWorker) {
    // If opened generally, pick first available or matching
  }

  // Fair Work Distribution Ranking algorithm (Section 10)
  // Factors: Skill match, Availability, Distance score, Experience, Workload inverse (workers with fewer recent jobs get prioritized), Rating
  const eligibleWorkers = workers
    .filter((w) => w.isVerified && w.skills.includes(serviceCategory))
    .map((w) => {
      // Score calculation: higher is better
      // 1. Workload fairness: worker with 0 workload gets +30, 3 workload gets +10
      const workloadScore = Math.max(0, 30 - w.currentWorkload * 7);
      // 2. Rating score: 4.8 * 6 = 28.8
      const ratingScore = w.rating * 6;
      // 3. Experience score: cap at 20
      const expScore = Math.min(20, w.experienceYears * 1.5);
      // 4. Availability bonus
      const availScore = w.isAvailable ? 20 : 0;
      const totalFairScore = Math.round(workloadScore + ratingScore + expScore + availScore);

      return {
        worker: w,
        fairScore: totalFairScore,
        estimatedDistKm: (1.5 + Math.random() * 3).toFixed(1),
      };
    })
    .sort((a, b) => b.fairScore - a.fairScore);

  const activeWorker = chosenWorker || eligibleWorkers[0]?.worker || workers[0];

  // Two-Stage Pricing: Stage 1 = Advance Diagnostic & Dispatch Fee
  const baseRate = activeWorker?.baseCharge || 249;
  const initialWelfareFee = Math.round(baseRate * 0.08); // 8% to worker welfare fund
  const gst = Math.round(baseRate * 0.02); // 2% GST
  const initialAdvanceTotal = baseRate + initialWelfareFee + gst;

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
          lat: 28.6942,
          lng: 77.1315,
          address: addressLine,
          zone: cityZone,
          city: 'New Delhi',
        },
        distanceKm: parseFloat((2.1).toFixed(1)),
        estimatedArrivalMinutes: isEmergency ? 15 : 45,
        status: isEmergency ? 'Worker On The Way' : 'Accepted',
        estimatedPrice: initialAdvanceTotal,
        baseFeePaid: initialAdvanceTotal,
        payment: {
          id: `pay-base-${Date.now()}`,
          bookingId: '',
          amount: initialAdvanceTotal,
          method: paymentMethod,
          status: 'Completed',
          upiId: paymentMethod === 'UPI' ? upiId : undefined,
          cardLast4: paymentMethod === 'Card' ? cardNumber.slice(-4) : undefined,
          bankName: paymentMethod === 'NetBanking' ? bankSelected : undefined,
          transactionRef: `NPCI-COOP-BASE-${Date.now().toString().slice(-8)}`,
          paidAt: new Date().toISOString(),
          workerPayout: Math.round(baseRate * 0.9), // 90% direct to worker
          cooperativeWelfareLevy: initialWelfareFee,
          administrativeGST: gst,
        },
      });

      setIsProcessingPayment(false);
      setCreatedBookingId(newBooking.id);
      setActiveTrackingBookingId(newBooking.id);
      setStep(7); // Show Confirmation & Invoice
    }, 1200);
  };

  const closeModal = () => {
    setBookingTargetWorker(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E4E7EC] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#17324D]">
                {language === 'hi' ? 'सहकारी सेवा बुकिंग' : 'Cooperative Service Booking'}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]">
                {t.common.step} {step} {t.common.of} 7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'पारदर्शी सेवा शुल्क • 90% प्रत्यक्ष कारीगर पारिश्रमिक'
                : 'Transparent job pricing • 100% direct artisan remuneration'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Numbered Step Progress Bar */}
        <div className="px-6 py-2.5 bg-[#F7F8F6] border-b border-[#E4E7EC] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] gap-2">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Location' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Worker' },
              { num: 5, label: 'Estimate' },
              { num: 6, label: 'Payment' },
              { num: 7, label: 'Confirmed' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                    step === s.num
                      ? 'bg-[#17324D] text-white'
                      : step > s.num
                      ? 'bg-[#EDF7F2] text-[#167A5B] border border-[#C6E7D8]'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span
                  className={`text-[11px] font-medium truncate ${
                    step === s.num ? 'text-[#17324D] font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 6 && <div className="h-px bg-slate-300 flex-1 min-w-[8px]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: SERVICE DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? '1. आवंटित कार्य श्रेणी व समस्या विवरण' : '1. Assigned Trade Role & Problem Details'}
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {language === 'hi' ? 'कारीगर व्यवसाय व विशेषज्ञता' : 'Worker Trade & Specialization'}
                </label>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 border border-emerald-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {language === 'hi' ? 'आवंटित व्यावसायिक भूमिका' : 'Assigned Professional Role'}
                    </div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{t.roles.worker} – {t.categories[activeWorker.primaryTrade as ServiceCategory] || activeWorker.primaryTrade}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {language === 'hi' ? 'समर्पित विशेषज्ञ' : 'Dedicated Specialist'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi'
                        ? `यह कारीगर विशेष रूप से ${t.categories[activeWorker.primaryTrade as ServiceCategory] || activeWorker.primaryTrade} में सत्यापित और प्रमाणित हैं।`
                        : `This craftsman is verified and certified specifically in ${activeWorker.primaryTrade}.`}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {language === 'hi' ? 'समस्या का विवरण / लक्षण' : 'Service Description / Symptoms'}
                </label>
                <textarea
                  rows={3}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'मरम्मत या सेवा की आवश्यकता का विवरण लिखें (उदा. एमसीबी ट्रिप, नल से पानी टपकना, पंखा लगाना)...'
                      : 'Describe what needs repair or attention (e.g., circuit breaker tripping, water tap leaking, fan installation)...'
                  }
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
                <div className="text-xs text-blue-900">
                  <span className="font-bold">{language === 'hi' ? 'सहकारी मानक: ' : 'Cooperative Standard: '}</span>
                  {language === 'hi'
                    ? 'सभी कार्य राष्ट्रीय सुरक्षा मानकों का पालन करने वाले सत्यापित कारीगरों द्वारा किए जाते हैं।'
                    : 'All tasks are performed by verified craftsmen adhering to national safety protocols.'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & ADDRESS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? '2. ग्राहक का पता व सेवा स्थान' : '2. Customer Address & Service Location'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'hi' ? 'ग्राहक का पूरा नाम' : 'Customer Full Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'hi' ? 'परिसर का पता (मकान/फ्लैट, लैंडमार्क)' : 'Premises Address (House/Flat, Landmark)'}
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'hi' ? 'शहर / प्रशासनिक वार्ड ज़ोन' : 'City / Administrative Ward Zone'}
                </label>
                <select
                  value={cityZone}
                  onChange={(e) => setCityZone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium"
                >
                  <option value="North Delhi">{language === 'hi' ? 'उत्तरी दिल्ली (रोहिणी, पीतमपुरा, मॉडल टाउन)' : 'North Delhi (Rohini, Pitampura, Model Town)'}</option>
                  <option value="South Delhi">{language === 'hi' ? 'दक्षिणी दिल्ली (साकेत, हौज खास, लाजपत नगर)' : 'South Delhi (Saket, Hauz Khas, Lajpat Nagar)'}</option>
                  <option value="West Delhi">{language === 'hi' ? 'पश्चिमी दिल्ली (जनकपुरी, द्वारका, विकास पुरी)' : 'West Delhi (Janakpuri, Dwarka, Vikas Puri)'}</option>
                  <option value="East Delhi">{language === 'hi' ? 'पूर्वी दिल्ली (मयूर विहार, लक्ष्मी नगर)' : 'East Delhi (Mayur Vihar, Laxmi Nagar)'}</option>
                  <option value="Mohali & Chandigarh">{language === 'hi' ? 'मोहाली व चंडीगढ़ ट्राइसिटी' : 'Mohali & Chandigarh Tricity'}</option>
                  <option value="Central Gurugram">{language === 'hi' ? 'गुरुग्राम (डीएलएफ, सेक्टर 14-31)' : 'Gurugram (DLF, Sector 14-31)'}</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? '3. दिनांक व समय स्लॉट चुनें' : '3. Select Date & Slot Schedule'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पसंदीदा दिनांक' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'hi' ? 'आगमन समय स्लॉट' : 'Arrival Time Slot'}
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium"
                  >
                    <option value="09:00 AM">09:00 AM - 10:30 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:30 PM</option>
                    <option value="04:30 PM">04:30 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-amber-900">
                      {language === 'hi' ? 'क्या तुरंत आपातकालीन सेवा चाहिए?' : 'Need Immediate Emergency Dispatch?'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  {language === 'hi'
                    ? 'निकटतम उपलब्ध कारीगर को 15-25 मिनट में प्राथमिकता एसओएस ट्रैकिंग के साथ भेजा जाता है।'
                    : 'Dispatches the closest standby worker within 15-25 minutes with priority SOS tracking.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: FAIR WORKER MATCHING & SELECTION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? '4. सहकारी सदस्य कारीगर का चयन' : '4. Select Cooperative Member Worker'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi'
                      ? 'समान कार्य वितरण और जीपीएस दूरी के आधार पर क्रमित'
                      : 'Ranked by Fair Work Distribution & Geospatial proximity'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {language === 'hi' ? 'न्यायसंगत आवंटन' : 'Fair Share Match'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {eligibleWorkers.map(({ worker, fairScore, estimatedDistKm }) => {
                  const isSelected = activeWorker.id === worker.id;
                  return (
                    <div
                      key={worker.id}
                      onClick={() => setChosenWorker(worker)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <TradeBadgeAvatar
                          trade={worker.primaryTrade}
                          name={worker.name}
                          size="sm"
                          photoUrl={worker.photoUrl}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{worker.name}</span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              ✓ {language === 'hi' ? 'सत्यापित' : 'Verified'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {worker.cooperativeName.slice(0, 35)}...
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                            <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-400" /> {worker.rating}
                            </span>
                            <span>{worker.completedJobsCount} {t.directory.jobsSuffix}</span>
                            <span>~{estimatedDistKm} {language === 'hi' ? 'किमी दूर' : 'km away'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-blue-900">₹{worker.baseCharge}</div>
                        <div className="text-[10px] text-slate-400">{language === 'hi' ? 'अनुमानित शुल्क' : 'Est. job fee'}</div>
                        <div className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {language === 'hi' ? 'न्यायसंगत स्कोर:' : 'Fair Score:'} {fairScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: ADVANCE DIAGNOSTIC FEE BREAKDOWN */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? '5. अग्रिम तकनीकी जांच व प्रस्थान शुल्क (चरण 1)' : '5. Advance Diagnostic & Dispatch Fee (Stage 1)'}
              </h3>

              {/* Worker Verification Section */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Worker Verification
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {activeWorker.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Government Verification */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                    <div className="text-[11px] font-medium text-neutral-500">Government Verification</div>
                    <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isActiveGovVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {govStatusText}
                    </div>
                  </div>

                  {/* Cooperative Verification */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                    <div className="text-[11px] font-medium text-neutral-500">Cooperative Verification</div>
                    <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isActiveCoopVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {coopStatusText}
                    </div>
                  </div>

                  {/* ShramSetu Verification */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                    <div className="text-[11px] font-medium text-neutral-500">ShramSetu Verification</div>
                    <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isActivePlatformVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {platformStatusText}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>{language === 'hi' ? 'ऑन-साइट निरीक्षण व सेवा शुल्क:' : 'On-Site Inspection & Service Fee:'}</span>
                  <span className="font-semibold text-slate-900">₹{baseRate}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>{language === 'hi' ? 'सहकारी कामगार कल्याण कोष (8%):' : 'Cooperative Worker Welfare Pool (8%):'}</span>
                  <span>₹{initialWelfareFee}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{language === 'hi' ? 'सांविधिक प्रशासनिक व जीएसटी (2%):' : 'Statutory GST / Administrative (2%):'}</span>
                  <span>₹{gst}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-blue-950">
                  <span>{language === 'hi' ? 'अभी देय प्रारंभिक अग्रिम:' : 'Initial Advance Payable Now:'}</span>
                  <span className="text-base text-emerald-700">₹{initialAdvanceTotal}</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{language === 'hi' ? 'दो-चरणीय सहकारी भुगतान सुरक्षा:' : 'Two-Stage Cooperative Payment Protection:'}</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {language === 'hi'
                    ? `आप अभी केवल प्रारंभिक अग्रिम शुल्क का भुगतान करते हैं। जब ${activeWorker.name} मौके पर पहुंचेंगे और खराबी की जांच करेंगे, तो वे आपको सटीक समस्या बताएंगे। इसके बाद आप वेबसाइट पर चेकलिस्ट से पुष्टि करके अंतिम बिल का भुगतान करेंगे।`
                    : `You only pay the initial base diagnostic fee now. Once ${activeWorker.name} arrives and diagnoses the issue on-site, they will tell you the exact fault. You will then select the diagnosed problem from a checklist on the website to finalize the transparent cooperative repair bill.`}
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: DIGITAL PAYMENTS FOR ADVANCE */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'hi' ? '6. अग्रिम जांच शुल्क का भुगतान करें' : '6. Pay Advance Diagnostic Fee'}
                </h3>
                <span className="text-xs font-bold text-emerald-700">
                  ₹{initialAdvanceTotal} {language === 'hi' ? 'अग्रिम' : 'Advance'}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs block">{language === 'hi' ? 'रुपे / कार्ड' : 'RuPay / Cards'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'NetBanking'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-blue-900" />
                  <span className="text-xs block">{language === 'hi' ? 'नेट बैंकिंग' : 'Net Banking'}</span>
                </button>
              </div>

              {/* UPI Options */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'hi' ? 'यूपीआई आईडी दर्ज करें' : 'Enter UPI VPA ID'}
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank or @upi"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'hi'
                      ? 'गूगल पे, फोनपे, पेटीएम, भीम यूपीआई और सभी बैंक ऐप्स समर्थित हैं।'
                      : 'Supports Google Pay, PhonePe, Paytm, BHIM UPI and all Indian banking apps.'}
                  </div>
                </div>
              )}

              {/* Card Options */}
              {paymentMethod === 'Card' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'hi' ? 'कार्ड नंबर (RuPay, Visa, Master)' : 'Card Number (RuPay, Visa, Master)'}
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {language === 'hi' ? 'वैधता (MM/YY)' : 'Expiry (MM/YY)'}
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Options */}
              {paymentMethod === 'NetBanking' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'hi' ? 'बैंक चुनें' : 'Select Bank'}
                  </label>
                  <select
                    value={bankSelected}
                    onChange={(e) => setBankSelected(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium"
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Delhi State Co-operative Bank">Delhi State Co-operative Bank</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: CONFIRMED & INVOICE RECEIPT */}
          {step === 7 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'अग्रिम भुगतान सफल व कारीगर रवाना!' : 'Advance Paid & Craftsman Dispatched!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'hi'
                    ? `कारीगर ${activeWorker.name} ने आपका अनुरोध स्वीकार कर लिया है।`
                    : `Worker ${activeWorker.name} has accepted your request.`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'hi' ? 'सेवा:' : 'Service:'}</span>
                  <span className="font-bold text-slate-900">
                    {t.categories[serviceCategory as ServiceCategory] || serviceCategory}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'hi' ? 'कारीगर:' : 'Worker:'}</span>
                  <span className="font-bold text-slate-900">{activeWorker.name} ({activeWorker.phone})</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'hi' ? 'भुगतान किया गया अग्रिम:' : 'Advance Paid:'}</span>
                  <span className="font-bold text-emerald-700">₹{initialAdvanceTotal} via {paymentMethod}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'hi' ? 'अगला चरण:' : 'Next Step:'}</span>
                  <span className="font-bold text-blue-700">
                    {language === 'hi' ? 'ऑन-साइट तकनीकी जांच व समस्या चयन' : 'On-Site Diagnosis & Problem Selection'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 7 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white cursor-pointer"
            >
              {t.common.back}
            </button>
          )}

          {step === 1 && (
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white cursor-pointer"
            >
              {t.common.cancel}
            </button>
          )}

          {step < 5 && (
            <button
              id={`booking-next-step-${step}`}
              onClick={() => setStep(step + 1)}
              className="ml-auto px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {t.common.next}
            </button>
          )}

          {step === 5 && (
            <button
              id="booking-proceed-to-payment"
              onClick={() => setStep(6)}
              className="ml-auto px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {language === 'hi'
                ? `अग्रिम जांच शुल्क (₹${initialAdvanceTotal}) का भुगतान करें`
                : `Pay Advance Diagnostic Fee (₹${initialAdvanceTotal})`}
            </button>
          )}

          {step === 6 && (
            <button
              id="booking-pay-confirm-btn"
              disabled={isProcessingPayment}
              onClick={handleConfirmAndPay}
              className="ml-auto px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <span>{language === 'hi' ? 'एनपीसीआई गेटवे द्वारा भुगतान संसाधित...' : 'Settling via NPCI Gateway...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  {language === 'hi'
                    ? `₹${initialAdvanceTotal} अग्रिम भुगतान स्वीकृत करें`
                    : `Authorize & Pay ₹${initialAdvanceTotal} Advance`}
                </>
              )}
            </button>
          )}

          {step === 7 && (
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                {t.common.close}
              </button>
              <button
                id="booking-view-live-tracking-btn"
                onClick={() => {
                  closeModal();
                  setCurrentTab('tracking');
                }}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                <span>{language === 'hi' ? 'लाइव जीपीएस पर ट्रैक करें' : 'Track Live on GPS Radar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
