import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCategory, ComplaintStatus } from '../types';
import {
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Clock,
  ShieldAlert,
  HelpCircle,
  Building2,
} from 'lucide-react';
 
export const ComplaintModal: React.FC = () => {
  const {
    isComplaintModalOpen,
    setIsComplaintModalOpen,
    currentRole,
    bookings,
    complaints,
    submitComplaint,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'file' | 'history'>('file');

  // Customer complaint categories vs Worker complaint categories
  const customerCategories: ComplaintCategory[] = [
    'Worker behavior',
    'Poor service',
    'Late arrival',
    'Payment issue',
    'Incorrect charges',
    'Safety concern',
    'Service quality',
    'Other',
  ];

  const workerCategories: ComplaintCategory[] = [
    'Customer behavior',
    'Unsafe working conditions',
    'Payment issue',
    'Incorrect booking information',
    'Harassment/abuse',
    'Cancellation issue',
    'Other',
  ];

  const categoryTranslations: Record<string, string> = {
    'Worker behavior': 'कारीगर का अनुचित व्यवहार',
    'Poor service': 'असंतोषजनक सेवा गुणवत्ता',
    'Late arrival': 'देरी से आगमन',
    'Payment issue': 'भुगतान संबंधी समस्या',
    'Incorrect charges': 'अतिरिक्त या अनुचित शुल्क',
    'Safety concern': 'सुरक्षा संबंधी चिंता',
    'Customer behavior': 'ग्राहक का अनुचित व्यवहार',
    'Unsafe working conditions': 'असुरक्षित कार्यस्थल स्थिति',
    'Incorrect booking information': 'गलत बुकिंग विवरण',
    'Harassment/abuse': 'दुर्व्यवहार / उत्पीड़न',
    'Cancellation issue': 'रद्दीकरण समस्या',
    'Service quality': 'सेवा गुणवत्ता शिकायत',
    'Other': 'अन्य शिकायत',
  };

  const getLocalizedCategory = (cat: string) => (language === 'hi' ? categoryTranslations[cat] || cat : cat);

  const statusTranslations: Record<string, string> = {
    'Submitted': 'दर्ज की गई',
    'Under Review': 'समीक्षाधीन',
    'Resolved': 'निस्तारित (हल)',
    'Escalated': 'उच्च स्तर पर प्रेषित',
    'Rejected': 'अस्वीकृत',
  };

  const getLocalizedStatus = (st: string) => (language === 'hi' ? statusTranslations[st] || st : st);

  const relevantCategories = currentRole === 'worker' ? workerCategories : customerCategories;

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>(relevantCategories[0]);
  const [bookingId, setBookingId] = useState<string>(bookings[0]?.id || '');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [submittedMsg, setSubmittedMsg] = useState<boolean>(false);

  if (!isComplaintModalOpen) return null;

  // Filter complaints filed by current user or relevant to active role
  const myComplaints = complaints.filter((c) =>
    currentRole === 'worker' ? c.filedByRole === 'worker' : c.filedByRole === 'customer'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComplaint({
      bookingId: bookingId || undefined,
      filedByRole: currentRole === 'worker' ? 'worker' : 'customer',
      category: selectedCategory,
      description: subject ? `${subject} - ${description}` : description,
      attachments: attachmentName ? [attachmentName] : [],
    });

    setSubmittedMsg(true);
    setSubject('');
    setDescription('');
    setAttachmentName('');
    setTimeout(() => {
      setSubmittedMsg(false);
      setActiveTab('history');
    }, 1500);
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Escalated':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {language === 'hi' ? 'सहकारी शिकायत एवं विवाद निवारण पटल' : 'Grievance & Dispute Desk'}
            </h2>
            <p className="text-xs text-neutral-500">
              {language === 'hi'
                ? 'सोसायटी निगरानी समिति की देखरेख में निष्पक्ष एवं पारदर्शी निवारण'
                : 'Impartial resolution overseen by the Society Oversight Committee'}
            </p>
          </div>
          <button
            onClick={() => setIsComplaintModalOpen(false)}
            className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {language === 'hi'
              ? `नई शिकायत दर्ज करें (${currentRole === 'worker' ? 'कारीगर' : 'नागरिक'})`
              : `File New Grievance (${currentRole === 'worker' ? 'Worker' : 'Customer'})`}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span>{language === 'hi' ? 'मेरी शिकायत स्थिति' : 'My Grievance Status'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {myComplaints.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'file' ? (
            submittedMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'शिकायत सफलतापूर्वक पंजीकृत हुई' : 'Grievance Registered Successfully'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'आपकी शिकायत संदर्भ संख्या दर्ज हो गई है। सहकारी विवाद निवारण अधिकारी 24 घंटे के भीतर दोनों पक्षों से संपर्क करेंगे।'
                    : 'Your complaint reference has been generated. The Cooperative Dispute Officer will contact both parties within 24 hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Note */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {language === 'hi' ? 'सहकारी लोकपाल नियमावली:' : 'Cooperative Ombudsman Protocol:'}
                    </span>{' '}
                    {language === 'hi'
                      ? currentRole === 'worker'
                        ? 'राज्य सहकारी उप-नियमों के तहत कामगारों को खतरनाक परिस्थितियों, अपमानजनक आचरण या मनमाने गैर-भुगतान से सुरक्षा प्रदान की जाती है।'
                        : 'नागरिकों को घटिया काम, अधिक शुल्क या सुरक्षा उल्लंघन से पूरी सुरक्षा मिलती है, जिसके अंतर्गत निःशुल्क सुधार कार्य या रिफंड की गारंटी है।'
                      : currentRole === 'worker'
                      ? 'Workers are protected from hazardous conditions, abusive conduct, or arbitrary non-payment under State Cooperative Bylaws.'
                      : 'Customers are protected against substandard work, overcharging, or safety violations with free re-work or refund guarantee.'}
                  </div>
                </div>

                {/* Problem Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Problem Type
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ComplaintCategory)}
                    className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                  >
                    {relevantCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getLocalizedCategory(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue..."
                    className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                  />
                </div>

                {/* Booking ID Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'संबंधित बुकिंग संख्या' : 'Associated Booking ID'}
                  </label>
                  <select
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                  >
                    <option value="">
                      {language === 'hi' ? 'सामान्य (कोई विशिष्ट बुकिंग नहीं)' : 'General (No Specific Booking)'}
                    </option>
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bookingNumber} — {t.categories[b.serviceCategory] || b.serviceCategory} ({b.workerName} / {b.customerName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide clear details including date, time, what happened, and requested remediation..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#17324D] bg-white"
                  />
                </div>

                {/* Attachment if supported */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Attachment (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="e.g. photo.jpg or receipt.pdf"
                      className="flex-1 min-h-[44px] p-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    <label className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer border border-slate-300 flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4" />
                      <span>Browse</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachmentName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsComplaintModalOpen(false)}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    id="submit-grievance-btn"
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center btn-tactile"
                  >
                    <span>Submit Complaint</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {myComplaints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  {language === 'hi'
                    ? 'आपके खाते द्वारा कोई शिकायत दर्ज नहीं की गई है।'
                    : 'No grievances lodged by your account.'}
                </div>
              ) : (
                myComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.complaintNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              c.status
                            )}`}
                          >
                            {getLocalizedStatus(c.status)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {language === 'hi' ? 'श्रेणी: ' : 'Category: '}
                          <strong className="text-slate-800">{getLocalizedCategory(c.category)}</strong>
                          {language === 'hi' ? ' • दर्ज तिथि: ' : ' • Lodged on '}
                          {c.submissionDate}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {language === 'hi'
                          ? `भूमिका: ${c.filedByRole === 'worker' ? 'कारीगर' : 'नागरिक'}`
                          : `Role: ${c.filedByRole}`}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      "{c.description}"
                    </p>

                    {c.resolutionNotes && (
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                        <div className="font-bold text-[11px] text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'hi' ? 'सहकारी समिति का निवारण निर्णय:' : 'Cooperative Committee Resolution:'}
                        </div>
                        <p className="text-[11px] mt-0.5">{c.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
