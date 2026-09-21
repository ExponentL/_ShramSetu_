import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiagnosedProblem, ServiceCategory } from '../types';
import { getProblemsForTrade, getLocalizedProblem } from '../data/tradeProblems';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Check,
  AlertCircle,
  QrCode,
  CreditCard,
  Building,
  Banknote,
  Sparkles,
  ArrowRight,
  Receipt,
  Clock,
  Wrench,
} from 'lucide-react';

export const DiagnosisProblemModal: React.FC = () => {
  const {
    isDiagnosisModalOpen,
    setIsDiagnosisModalOpen,
    diagnosisTargetBooking,
    setDiagnosisTargetBooking,
    finalizeDiagnosisAndPayment,
    language,
    t,
  } = useApp();

  const booking = diagnosisTargetBooking;
  if (!isDiagnosisModalOpen || !booking) return null;

  const tradeProblems = getProblemsForTrade(booking.serviceCategory);

  // Selected diagnosed problems (at least 1 pre-selected by default)
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([
    tradeProblems[0]?.id || '',
  ]);
  const [customNote, setCustomNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'CashAtService'>('UPI');
  const [upiId, setUpiId] = useState<string>('citizen.customer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const toggleProblemSelection = (id: string) => {
    setSelectedProblemIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((p) => p !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectedProblems = tradeProblems.filter((p) => selectedProblemIds.includes(p.id));
  const laborSubtotal = selectedProblems.reduce((sum, p) => sum + p.standardTariff, 0);
  const welfareFee = Math.round(laborSubtotal * 0.08);
  const gst = Math.round(laborSubtotal * 0.02);
  const fullJobTotal = laborSubtotal + welfareFee + gst;
  const baseFeePaid = booking.baseFeePaid || 249;
  const balancePayable = Math.max(0, fullJobTotal - baseFeePaid);

  const handleConfirmAndSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProblems.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      finalizeDiagnosisAndPayment(booking.id, selectedProblems, paymentMethod, upiId);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsDiagnosisModalOpen(false);
        setDiagnosisTargetBooking(null);
      }, 1800);
    }, 900);
  };

  const handleClose = () => {
    setIsDiagnosisModalOpen(false);
    setDiagnosisTargetBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-neutral-900">
                {language === 'hi'
                  ? 'ऑन-साइट तकनीकी जांच व टैरिफ निपटान'
                  : language === 'pa'
                  ? 'ਮੌਕੇ ’ਤੇ ਤਕਨੀਕੀ ਜਾਂਚ ਅਤੇ ਟੈਰਿਫ ਨਿਪਟਾਰਾ'
                  : 'On-Site Diagnosis & Tariff Settlement'}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                {language === 'hi' ? 'चरण 2' : language === 'pa' ? 'ਕਦਮ 2' : 'Step 2'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {booking.workerName} ({t.categories[booking.serviceCategory as ServiceCategory] || booking.serviceCategory}) • {booking.bookingNumber}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close dialog"
            className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="px-5 py-3 bg-emerald-50/80 border-b border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {language === 'hi'
                ? 'कारीगर ने समस्या की जांच कर ली है: '
                : language === 'pa'
                ? 'ਕਾਰੀਗਰ ਨੇ ਨੁਕਸ ਦੀ ਜਾਂਚ ਕਰ ਲਈ ਹੈ: '
                : 'Technician Has Diagnosed Your Issue: '}
            </span>
            {language === 'hi'
              ? `कारीगर द्वारा पुष्टि की गई समस्याओं का चयन करें। सरकारी अनुमोदित सहकारी दर लागू होगी और आपकी अग्रिम जांच राशि (₹${baseFeePaid}) स्वतः समायोजित हो जाएगी।`
              : language === 'pa'
              ? `ਕਾਰੀਗਰ ਦੁਆਰਾ ਪੁਸ਼ਟੀ ਕੀਤੇ ਨੁਕਸਾਂ ਦੀ ਚੋਣ ਕਰੋ। ਸਰਕਾਰੀ ਮਨਜ਼ੂਰ ਸ਼ੁਦਾ ਦਰ ਲਾਗੂ ਹੋਵੇਗੀ ਅਤੇ ਤੁਹਾਡੀ ਅਗਾਊਂ ਫੀਸ (₹${baseFeePaid}) ਕੱਟ ਲਈ ਜਾਵੇਗੀ।`
              : `Select the specific problem(s) confirmed on-site by your craftsman. The government-approved cooperative tariff will be finalized below, and your advance base inspection fee (₹${baseFeePaid}) will be automatically credited.`}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section: MCQ Problem Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'hi'
                  ? `${t.categories[booking.serviceCategory as ServiceCategory] || booking.serviceCategory} के लिए पहचानी गई समस्या(एं) चुनें`
                  : language === 'pa'
                  ? `${t.categories[booking.serviceCategory as ServiceCategory] || booking.serviceCategory} ਲਈ ਨੁਕਸ ਚੁਣੋ`
                  : `Select Diagnosed Problem(s) for ${booking.serviceCategory}`}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedProblemIds.length} {language === 'hi' ? 'चयनित' : language === 'pa' ? 'ਚੁਣੇ ਗਏ' : 'selected'}
              </span>
            </div>

            <div className="space-y-2.5">
              {tradeProblems.map((rawProb) => {
                const prob = getLocalizedProblem(rawProb, language);
                const isChecked = selectedProblemIds.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    onClick={() => toggleProblemSelection(prob.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'border-blue-900 bg-blue-50/50 shadow-xs ring-1 ring-blue-800'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isChecked
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Problem Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                          <span>{prob.icon}</span>
                          <span>{prob.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              prob.complexity === 'Major'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : prob.complexity === 'Moderate'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {language === 'hi'
                              ? prob.complexity === 'Major' ? 'विस्तृत कार्य' : prob.complexity === 'Moderate' ? 'मध्यम कार्य' : 'मानक कार्य'
                              : `${prob.complexity} Scope`}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            ₹{prob.standardTariff}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Notes from Customer / Craftsman */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {language === 'hi'
                ? 'ऑन-साइट टिप्पणियां / विशेष पुर्जे का विवरण (वैकल्पिक)'
                : language === 'pa'
                ? 'ਮੌਕੇ ’ਤੇ ਨੋਟਸ / ਸਪੇਅਰ ਪਾਰਟਸ ਵੇਰਵਾ (ਵਿਕਲਪਿਕ)'
                : 'On-Site Observations / Specific Part Details (Optional)'}
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'उदा. कारीगर ने 16A के स्थान पर 32A MCB लगाने की सलाह दी'
                  : 'e.g. Technician suggested replacing 32A MCB instead of 16A'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* Tariff Settlement Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Receipt className="w-3.5 h-3.5 text-blue-900" />
              <span>
                {language === 'hi'
                  ? 'सहकारी पारदर्शी निपटान गणना'
                  : language === 'pa'
                  ? 'ਸਹਿਕਾਰੀ ਪਾਰਦਰਸ਼ੀ ਹਿਸਾਬ-ਕਿਤਾਬ'
                  : 'Cooperative Transparent Settlement Calculation'}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {language === 'hi'
                  ? `पहचानी गई सेवाओं का टैरिफ (${selectedProblems.length} कार्य):`
                  : `Selected Diagnosed Service Tariff (${selectedProblems.length} items):`}
              </span>
              <span className="font-semibold text-slate-900">₹{laborSubtotal}</span>
            </div>

            <div className="flex justify-between text-emerald-700 font-medium">
              <span>
                {language === 'hi'
                  ? 'घटाएं: अग्रिम जांच शुल्क (पहले से भुगतान):'
                  : 'Less Advance Diagnostic Fee (Already Paid):'}
              </span>
              <span className="font-bold">-₹{baseFeePaid}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {language === 'hi'
                  ? 'सहकारी कामगार कल्याण व स्वास्थ्य कोष (8%):'
                  : 'Cooperative Worker Welfare & Healthcare Pool (8%):'}
              </span>
              <span className="font-semibold text-slate-900">₹{welfareFee}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {language === 'hi'
                  ? 'सांविधिक प्रशासनिक व जीएसटी (2%):'
                  : 'Statutory Administrative & GST (2%):'}
              </span>
              <span className="font-semibold text-slate-900">₹{gst}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-blue-950">
              <span>{language === 'hi' ? 'देय शेष राशि:' : 'Net Balance Payable:'}</span>
              <span className="text-base sm:text-lg text-emerald-700 font-black">
                ₹{balancePayable}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              {language === 'hi'
                ? `सेवा शुल्क का 90% (₹${Math.round(laborSubtotal * 0.9)}) सीधे कारीगर ${booking.workerName} को बिना किसी बिचौलिए कमीशन के मिलता है।`
                : `90% of service tariff (₹${Math.round(laborSubtotal * 0.9)}) transfers directly to ${booking.workerName} with zero corporate commission cut.`}
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              {language === 'hi' ? 'शेष भुगतान माध्यम चुनें' : 'Select Balance Payment Method'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-900 bg-blue-900 text-white font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 mx-auto mb-1" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-blue-900 bg-blue-900 text-white font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span>{language === 'hi' ? 'डेबिट / क्रेडिट कार्ड' : 'Debit / Card'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'NetBanking'
                    ? 'border-blue-900 bg-blue-900 text-white font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4 mx-auto mb-1" />
                <span>{language === 'hi' ? 'नेट बैंकिंग' : 'Net Banking'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CashAtService')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'CashAtService'
                    ? 'border-emerald-700 bg-emerald-700 text-white font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4 mx-auto mb-1" />
                <span>{language === 'hi' ? 'नकद भुगतान (काम के बाद)' : 'Cash on Done'}</span>
              </button>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="mt-2 p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">{language === 'hi' ? 'यूपीआई आईडी:' : 'UPI Virtual Address:'}</span>
                <span className="font-mono font-bold text-blue-900">{upiId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-white text-xs cursor-pointer"
          >
            {t.common.cancel}
          </button>

          <button
            type="button"
            disabled={isProcessing || selectedProblems.length === 0}
            onClick={handleConfirmAndSettle}
            className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all ${
              paymentMethod === 'CashAtService'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-blue-900 hover:bg-blue-950'
            } ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isProcessing ? (
              <span>{language === 'hi' ? 'सहकारी डेस्क पर पुष्टि की जा रही है...' : 'Finalizing with Cooperative Desk...'}</span>
            ) : isSuccess ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'भुगतान सफल व कार्य स्वीकृत!' : 'Payment Clear & Work Approved!'}</span>
              </span>
            ) : (
              <>
                <span>
                  {language === 'hi'
                    ? paymentMethod === 'CashAtService'
                      ? `नकद निपटान पुष्टि (₹${balancePayable})`
                      : `₹${balancePayable} भुगतान करें व कार्य शुरू करें`
                    : paymentMethod === 'CashAtService'
                      ? `Confirm Cash Settlement (₹${balancePayable})`
                      : `Pay ₹${balancePayable} & Authorize Repair`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

