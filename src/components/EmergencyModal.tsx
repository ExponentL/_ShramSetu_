import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { INITIAL_WORKERS } from '../data/mockData';
import { X } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    workers,
    createBooking,
    setActiveTrackingBookingId,
    setCurrentTab,
    currentUser,
    language,
    t,
  } = useApp();

  const [emergencyType, setEmergencyType] = useState<string>('Electrical Sparking / Short Circuit / MCB Fire');
  const [category, setCategory] = useState<ServiceCategory>('Electrical');
  const [address, setAddress] = useState<string>('Sunshine Apartments, Sector 13, Rohini, New Delhi');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 98180 99887');
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  if (!isEmergencyModalOpen) return null;

  const emergencyOptions = [
    {
      id: 'electrical_sos',
      title: language === 'hi' ? 'बिजली स्पार्किंग / शॉर्ट सर्किट / एमसीबी आग' : 'Electrical Sparking / Short Circuit / MCB Fire',
      category: 'Electrical' as ServiceCategory,
      tag: 'ELECTRICAL',
    },
    {
      id: 'plumbing_sos',
      title: language === 'hi' ? 'गंभीर जल रिसाव / पाइप फटना / जलभराव' : 'Major Water Leakage / Pipe Burst / Flooding',
      category: 'Plumbing' as ServiceCategory,
      tag: 'PLUMBING',
    },
    {
      id: 'lockout_sos',
      title: language === 'hi' ? 'ताला जाम / चाबी टूटना / मुख्य द्वार लॉकआउट' : 'Lockout / Jammed Entrance Lock / Key Broken',
      category: 'Carpentry' as ServiceCategory,
      tag: 'LOCKOUT',
    },
    {
      id: 'technician_sos',
      title: language === 'hi' ? 'आवश्यक उपकरण विफलता / रेफ्रिजरेटर गैस' : 'Critical Appliance Breakdown / Refrigerator Gas',
      category: 'Technician' as ServiceCategory,
      tag: 'APPLIANCES',
    },
  ];

  // Nearest verified standby worker
  const standbyWorker =
    workers.find((w) => w.isVerified && w.isAvailable && (w.skills || []).includes(category)) ||
    workers[0] ||
    INITIAL_WORKERS[0];

  const handleInstantDispatch = () => {
    const newBooking = createBooking({
      customerId: currentUser?.id || 'cust-current',
      customerName: currentUser?.name || 'Emergency Citizen',
      customerPhone: phone,
      workerId: standbyWorker.id,
      workerName: standbyWorker.name,
      workerPhoto: standbyWorker.photoUrl,
      workerPhone: standbyWorker.phone,
      cooperativeId: standbyWorker.cooperativeId,
      cooperativeName: standbyWorker.cooperativeName,
      serviceCategory: category,
      serviceDescription: `EMERGENCY SOS: ${emergencyType}`,
      scheduledDate: new Date().toISOString().slice(0, 10),
      scheduledTime: language === 'hi' ? 'तत्काल (अगले 15 मिनट)' : 'Immediate (Next 15 mins)',
      isEmergency: true,
      customerLocation: {
        lat: 28.6942,
        lng: 77.1315,
        address,
        zone: 'North Delhi',
        city: 'New Delhi',
      },
      distanceKm: 1.6,
      estimatedArrivalMinutes: 12,
      status: 'Worker On The Way',
      estimatedPrice: 399,
      baseFeePaid: 249,
    });

    setIsDispatched(true);
    setActiveTrackingBookingId(newBooking.id);
    setTimeout(() => {
      setIsDispatched(false);
      setIsEmergencyModalOpen(false);
      setCurrentTab('tracking');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-neutral-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-200">
                SOS PRIORITY
              </span>
              <h2 className="text-base font-bold text-neutral-900">
                {language === 'hi' ? 'आपातकालीन त्वरित सेवा' : 'Emergency Priority Dispatch'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'hi'
                ? '15-25 मिनट में त्वरित आगमन • लाइव जीपीएस ट्रैकिंग'
                : '15-25 min rapid responder arrival • GPS tracked'}
            </p>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDispatched ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-lg font-black">
              ✓
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {language === 'hi' ? 'आपातकालीन डिस्पैच सक्रिय!' : 'Emergency Dispatch Activated!'}
            </h3>
            <p className="text-xs text-neutral-600">
              {language === 'hi'
                ? `कारीगर ${standbyWorker.name} को सतर्क कर दिया गया है और वे तुरंत आपके पते के लिए प्रस्थान कर रहे हैं।`
                : `Worker ${standbyWorker.name} has been alerted and is navigating to your address immediately.`}
            </p>
            <div className="text-xs font-bold text-neutral-900">
              {language === 'hi' ? 'लाइव जीपीएस ट्रैकिंग पर भेजा जा रहा है...' : 'Redirecting to Live GPS Tracking...'}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Emergency Categories */}
            <div>
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block mb-2">
                {language === 'hi' ? 'आपातकालीन समस्या का चयन करें' : 'Select Emergency Hazard'}
              </label>
              <div className="space-y-2">
                {emergencyOptions.map((opt) => {
                  const isSelected = category === opt.category;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setEmergencyType(opt.title);
                        setCategory(opt.category);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold leading-snug">{opt.title}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {language === 'hi' ? 'सेवा वर्ग: ' : 'Trade: '}
                          {t.categories[opt.category] || opt.category}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isSelected ? 'bg-white text-neutral-900' : 'bg-white border border-neutral-200 text-neutral-600'}`}>
                        {opt.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standby Worker Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TradeBadgeAvatar
                  trade={standbyWorker.primaryTrade}
                  name={standbyWorker.name}
                  size="sm"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">{standbyWorker.name}</div>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    {language === 'hi'
                      ? `सत्यापित ${t.categories[standbyWorker.primaryTrade] || standbyWorker.primaryTrade} स्टैंडबाय`
                      : `Verified ${standbyWorker.primaryTrade} Standby`}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {standbyWorker.cooperativeName}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-neutral-900">
                  {language === 'hi' ? '~12 मिनट' : '~12 mins'}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {language === 'hi' ? '1.6 किमी दूर' : '1.6 km away'}
                </div>
              </div>
            </div>

            {/* Address & Phone */}
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  {language === 'hi' ? 'आपातकालीन स्थल का पता' : 'Emergency Site Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  {language === 'hi' ? 'संपर्क मोबाइल नंबर' : 'Contact Mobile Number'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Dispatch Button */}
            <button
              id="confirm-emergency-dispatch-btn"
              onClick={handleInstantDispatch}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm cursor-pointer transition-colors"
            >
              {language === 'hi'
                ? 'निकटतम सहकारी कारीगर अभी भेजें (अनुमानित ₹399)'
                : 'DISPATCH NEAREST WORKER NOW (₹399 EST.)'} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
