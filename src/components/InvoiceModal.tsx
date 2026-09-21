import React from 'react';
import { useApp } from '../context/AppContext';
import { getLocalizedProblem } from '../data/tradeProblems';
import { ServiceCategory } from '../types';
import {
  X,
  Printer,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Receipt,
  Download,
  Calendar,
  Phone,
  User,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceTargetBooking, setInvoiceTargetBooking, language, t } = useApp();

  if (!invoiceTargetBooking) return null;
  const booking = invoiceTargetBooking;

  const handleClose = () => {
    setInvoiceTargetBooking(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Financial calculations
  const totalAmount = booking.finalPrice || booking.estimatedPrice || 399;
  const baseFeePaid = booking.baseFeePaid || Math.min(249, totalAmount);
  const laborSubtotal = booking.finalLaborFee || (booking.diagnosedProblems && booking.diagnosedProblems.length > 0
    ? booking.diagnosedProblems.reduce((acc, p) => acc + p.standardTariff, 0)
    : totalAmount);
  const workerPayout = booking.payment?.workerPayout || Math.round(totalAmount * 0.9);
  const welfareLevy = booking.payment?.cooperativeWelfareLevy || Math.round(totalAmount * 0.08);
  const gstAdmin = booking.payment?.administrativeGST || Math.max(0, totalAmount - workerPayout - welfareLevy);
  const paymentMethod = booking.payment?.method || 'UPI';
  const transactionRef = booking.payment?.transactionRef || `COOP-TXN-${booking.bookingNumber.replace(/\D/g, '') || '901842'}`;
  const paidDate = booking.payment?.paidAt
    ? new Date(booking.payment.paidAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const invoiceNumber = `INV-${booking.bookingNumber || 'CSM-2026-0901'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:m-0 print:rounded-none">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="px-6 py-4 bg-white border-b border-neutral-200 text-neutral-900 flex items-center justify-between print:hidden shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {language === 'hi' ? 'सहकारी कर चालान व भुगतान रसीद' : 'Tax Invoice & Payout Receipt'}
            </h2>
            <p className="text-xs text-neutral-500">
              {language === 'hi' ? 'सहकारी समिति अधिनियम के अंतर्गत वैधानिक रिकॉर्ड' : 'Statutory Cooperative Societies Act Compliance Record'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट / पीडीएफ' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={handleClose}
              aria-label="Close invoice dialog"
              className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Invoice Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-800 flex-1 print:p-8 print:overflow-visible">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                  सह
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-base tracking-tight">
                    {language === 'hi' ? 'श्रमसेतु सहकारी सेवा बाज़ार' : 'ShramSetu Cooperative Marketplace'}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold">
                    {language === 'hi' ? 'श्रम सहकारी समितियों का महासंघ लिमिटेड' : 'Federation of Labour Cooperative Societies Ltd.'}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                {booking.cooperativeName} • Reg No: DLACS-1994-049/MSCS
              </p>
              <p className="text-[10px] text-slate-400">
                GSTIN / UIN: 07AAACL1402M1Z8 • NLCF Accreditation Unit #1402
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 sm:self-center">
              <div className="text-base font-black text-blue-950">{invoiceNumber}</div>
              <div className="text-slate-500 font-medium">
                {language === 'hi' ? 'जारी करने की तिथि:' : 'Issue Date:'} {paidDate}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{language === 'hi' ? 'भुगतान चुकता' : 'PAYMENT SETTLED'}</span>
              </div>
            </div>
          </div>

          {/* Customer & Craftsman Billed Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Customer Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'ग्राहक विवरण (नागरिक / परिवार)' : 'Billed To (Citizen / Household)'}
              </div>
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{booking.customerPhone}</span>
              </div>
              <div className="text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>{booking.customerLocation.address}, {booking.customerLocation.zone}</span>
              </div>
            </div>

            {/* Craftsman Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'कार्य निष्पादक सदस्य कारीगर' : 'Executing Member Craftsman'}
              </div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{booking.workerName}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  ✓ {language === 'hi' ? 'सत्यापित' : 'Verified'}
                </span>
              </div>
              <div className="text-slate-600">
                {language === 'hi'
                  ? `व्यवसाय: ${t.categories[booking.serviceCategory as ServiceCategory] || booking.serviceCategory} विशेषज्ञ`
                  : `Trade: ${booking.serviceCategory} Specialist`}
              </div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{booking.workerPhone}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {language === 'hi' ? 'सहकारी समिति:' : 'Cooperative Society:'} {booking.cooperativeName}
              </div>
            </div>
          </div>

          {/* Service Particulars Table */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase text-slate-700 tracking-wider">
              {language === 'hi' ? 'मदवार सेवा व मरम्मत शुल्क' : 'Itemized Service & Repair Charges'}
            </div>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'कार्य विवरण' : 'Description of Work'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'चरण / स्तर' : 'Stage / Scope'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'hi' ? 'मानक दर' : 'Standard Tariff'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">
                        {language === 'hi' ? 'अग्रिम तकनीकी जांच व ऑन-साइट निरीक्षण' : 'Advance Diagnostic & Technical Inspection'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'hi' ? 'मौके पर समस्या निवारण व सुरक्षा जांच' : 'On-site troubleshooting, electrical/plumbing safety audit'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {language === 'hi' ? 'चरण 1 अग्रिम' : 'Stage 1 Advance'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium">₹{baseFeePaid}</td>
                  </tr>

                  {booking.diagnosedProblems && booking.diagnosedProblems.length > 0 ? (
                    booking.diagnosedProblems.map((rawProb, idx) => {
                      const p = getLocalizedProblem(rawProb, language);
                      return (
                        <tr key={idx}>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 flex items-center gap-1">
                              <span>{p.icon}</span>
                              <span>{p.title}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{p.description}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {language === 'hi'
                              ? p.complexity === 'Major' ? 'विस्तृत मरम्मत' : p.complexity === 'Moderate' ? 'मध्यम मरम्मत' : 'मानक मरम्मत'
                              : `${p.complexity} Repair`}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium">₹{p.standardTariff}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">
                          {t.categories[booking.serviceCategory as ServiceCategory] || booking.serviceCategory} {language === 'hi' ? 'मानक सेवा' : 'Standard Service'}
                        </div>
                        <div className="text-[10px] text-slate-500">{booking.serviceDescription}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {language === 'hi' ? 'प्रत्यक्ष सेवा' : 'Direct Service'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">₹{totalAmount}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transparent Cooperative Payout & Welfare Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="font-bold text-xs uppercase text-slate-700 tracking-wider flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'hi' ? 'सांविधिक सहकारी कल्याण व कर वितरण' : 'Statutory Cooperative Welfare & Tax Distribution'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {language === 'hi' ? 'शून्य निजी बिचौलिया कटौती' : 'Zero Private Middleman Cut'}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {language === 'hi'
                  ? `कारीगर ${booking.workerName} को प्रत्यक्ष पारिश्रमिक (90%):`
                  : `Direct Remuneration to Craftsman ${booking.workerName} (90%):`}
              </span>
              <span className="font-bold text-slate-900">₹{workerPayout}</span>
            </div>

            <div className="flex justify-between text-emerald-800 font-medium">
              <span>
                {language === 'hi'
                  ? 'सदस्य कल्याण, स्वास्थ्य व दुर्घटना कोष (8%):'
                  : 'Member Welfare, Health & Accident Pool (8%):'}
              </span>
              <span className="font-bold text-emerald-700">₹{welfareLevy}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {language === 'hi'
                  ? 'सांविधिक प्रशासनिक उपकर व जीएसटी (2%):'
                  : 'Statutory Administrative Levy & GST (2%):'}
              </span>
              <span className="font-semibold text-slate-900">₹{gstAdmin}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-blue-950">
              <span>{language === 'hi' ? 'कुल निपटान राशि:' : 'Total Settled Amount:'}</span>
              <span className="text-base sm:text-lg text-emerald-700">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Gateway Verification Stamp */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>
                  {language === 'hi' ? 'एनपीसीआई / बैंकिंग भुगतान पुष्टिकृत' : 'NPCI / Banking Settlement Confirmed'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                {language === 'hi' ? 'माध्यम:' : 'Settled via'} <strong>{paymentMethod}</strong> • {language === 'hi' ? 'संदर्भ:' : 'Ref:'} <span className="font-mono">{transactionRef}</span>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-500 sm:self-center">
              <div>{language === 'hi' ? 'श्रमसेतु पोर्टल द्वारा डिजिटल हस्ताक्षरित' : 'Digitally Signed by ShramSetu Portal'}</div>
              <div className="text-emerald-700 font-bold">{language === 'hi' ? '100% ऑडिट सत्यापित' : '100% Audit Verified'}</div>
            </div>
          </div>

          {/* Statutory Footer Notice */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
            <p>
              {language === 'hi'
                ? 'यह बहु-राज्य सहकारी समिति अधिनियम की धारा 24 के अंतर्गत इलेक्ट्रॉनिक रूप से जनरेटेड वैध सेवा कर चालान है।'
                : 'This is an electronically generated valid cooperative service tax invoice pursuant to Section 24 of the Multi-State Cooperative Societies Act.'}
            </p>
            <p>
              {t.footer.helplineBadge} • {language === 'hi' ? 'शिकायत निवारण: grievance@shramsetu.gov.in' : 'Dispute Redressal: grievance@shramsetu.gov.in'}
            </p>
          </div>
        </div>

        {/* Modal Footer (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 print:hidden shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-white text-xs cursor-pointer"
          >
            {t.common.close}
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट / कर चालान सुरक्षित करें' : 'Print / Save Tax Invoice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

