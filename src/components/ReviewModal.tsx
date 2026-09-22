import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import { X, Star, CheckCircle2 } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    reviewTargetBooking,
    setReviewTargetBooking,
    submitReview,
    language,
    t,
    workers,
    governmentVerifications,
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(() =>
    language === 'hi'
      ? 'उत्कृष्ट कारीगर। समय पर पहुंचे, सुरक्षा नियमों का पालन किया और उचित सहकारी दरों पर कार्य पूर्ण किया।'
      : 'Excellent artisan. Arrived on time, adhered to safety rules, and completed the work properly at regulated rates.'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!reviewTargetBooking) return null;
  const booking = reviewTargetBooking;

  const ratingDescriptions: Record<number, string> = language === 'hi' ? {
    5: 'उत्कृष्ट (अत्यधिक अनुशंसित)',
    4: 'बहुत अच्छा (संतुष्ट)',
    3: 'सामान्य (स्वीकार्य)',
    2: 'औसत से कम (सुधार आवश्यक)',
    1: 'असंतोषजनक सेवा',
  } : {
    5: 'Excellent (Highly Recommended)',
    4: 'Very Good (Satisfied)',
    3: 'Average (Acceptable)',
    2: 'Below Average (Needs Improvement)',
    1: 'Poor Service',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(booking.id, rating, comment);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setReviewTargetBooking(null);
    }, 1500);
  };

  const localizedTrade = t.categories[booking.serviceCategory] || booking.serviceCategory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {language === 'hi' ? 'सार्वजनिक सेवा समीक्षा एवं रेटिंग' : 'Service Review & Rating'}
            </h2>
            <p className="text-xs text-neutral-500">
              {language === 'hi'
                ? 'सहकारी पारदर्शिता • समुदाय एवं सदस्य कारीगरों के लिए सहायक'
                : 'Cooperative transparency • Verified community feedback'}
            </p>
          </div>
          <button
            onClick={() => setReviewTargetBooking(null)}
            className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-lg font-black">
              ✓
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {language === 'hi' ? 'समीक्षा सफलतापूर्वक प्रकाशित हुई!' : 'Review Published!'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {language === 'hi'
                ? `आपकी प्रतिक्रिया अब ${booking.workerName} के सहकारी प्रोफाइल पर दर्ज हो गई है।`
                : `Your feedback is now visible on ${booking.workerName}'s cooperative profile.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Worker Info with Verification Badges */}
            {(() => {
              const matchedWorker = workers.find((w) => w.id === booking.workerId);
              const govRecord = governmentVerifications.find((gv) => gv.workerId === booking.workerId);
              const isGov = govRecord?.status === 'VERIFIED';
              const isCoop = matchedWorker?.cooperativeVerificationStatus === 'VERIFIED';
              const isPlatform = matchedWorker?.shramsetuVerificationStatus === 'VERIFIED';

              return (
                <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <TradeBadgeAvatar
                    trade={booking.serviceCategory}
                    name={booking.workerName}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-neutral-900">{booking.workerName}</span>
                      {isGov && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Government Verified
                        </span>
                      )}
                      {isCoop && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Cooperative Verified
                        </span>
                      )}
                      {isPlatform && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ ShramSetu Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1">
                      {localizedTrade} • {booking.cooperativeName}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                      {language === 'hi' ? 'बुकिंग #' : 'Booking #'}{booking.bookingNumber}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Large Star Selector */}
            <div className="text-center py-2 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'hi' ? 'सेवा रेटिंग' : 'Overall Rating'}
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="min-h-[48px] min-w-[48px] p-1.5 text-neutral-300 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-10 sm:h-10 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-[#17324D]">
                {ratingDescriptions[rating] || ''}
              </div>
            </div>

            {/* Rating Dimensions: Service Quality, Punctuality, Professionalism */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: 'Service Quality', hi: 'उत्कृष्ट गुणवत्ता' },
                { label: 'Punctuality', hi: 'समय की पाबंदी' },
                { label: 'Professionalism', hi: 'पेशेवर आचरण' },
              ].map((dim) => (
                <div
                  key={dim.label}
                  className="min-h-[44px] p-2 rounded-xl bg-[#EDF7F2] border border-[#C6E7D8] text-center flex flex-col items-center justify-center shadow-2xs"
                >
                  <span className="text-[10px] font-bold text-[#167A5B] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#167A5B]" />
                    <span>✓ Rated</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">
                    {dim.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Written Comments */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Comment
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your experience..."
                className="w-full p-3.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#17324D] focus:outline-none bg-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setReviewTargetBooking(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 rounded-xl bg-[#17324D] hover:bg-[#112437] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center btn-tactile"
              >
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
