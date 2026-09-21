/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './components/CustomerHome';
import { WorkerDashboard } from './components/WorkerDashboard';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';
import { ComplaintModal } from './components/ComplaintModal';
import { EmergencyModal } from './components/EmergencyModal';
import { DiagnosisProblemModal } from './components/DiagnosisProblemModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthScreen } from './components/AuthScreen';
import { CustomerChatbot } from './components/CustomerChatbot';
import { AdminVerificationConsole } from './components/AdminVerificationConsole';
import {
  ShieldCheck,
  Building2,
  HeartHandshake,
  PhoneCall,
  Lock,
  Compass,
  FileText,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    currentRole,
    currentTab,
    setCurrentTab,
    bookingTargetWorker,
    reviewTargetBooking,
    isComplaintModalOpen,
    isEmergencyModalOpen,
    selectedWorkerForProfile,
    language,
    t,
  } = useApp();

  // If the user has not logged in or registered, show the dedicated Login/Register screen
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white w-full max-w-full">
      {/* Primary Navigation Bar (Urban Company Style Header) */}
      <Navbar />

      {/* Main App Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Route view switcher based on currentRole and currentTab */}
        {currentTab === 'gps_tracking' || currentTab === 'tracking' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentTab(currentRole === 'customer' ? 'explore' : 'worker_dashboard')}
                className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← {currentRole === 'customer' ? t.footer.backToHome : t.footer.backToWorkerConsole}
              </button>
            </div>
            <LiveTrackingModal />
          </div>
        ) : currentRole === 'customer' ? (
          <CustomerHome onNavigateToTracking={() => setCurrentTab('tracking')} />
        ) : currentRole === 'admin' ? (
          <AdminVerificationConsole />
        ) : (
          <WorkerDashboard />
        )}
      </main>

      {/* Global Modals */}
      {selectedWorkerForProfile && <WorkerProfileModal />}
      {bookingTargetWorker && <BookingModal />}
      {reviewTargetBooking && <ReviewModal />}
      {isComplaintModalOpen && <ComplaintModal />}
      {isEmergencyModalOpen && <EmergencyModal />}
      <DiagnosisProblemModal />
      <InvoiceModal />

      {/* Floating Customer Help Chatbot (Hindi & English) in Bottom Right Corner */}
      <CustomerChatbot />

      {/* ========================================================================= */}
      {/* Urban Company Exact Clean Footer (Reference Image 2)                      */}
      {/* ========================================================================= */}
      <footer className="mt-20 bg-[#f5f5f7] border-t border-neutral-200/80 text-neutral-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Top Branding Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-10 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm tracking-tighter">
                SS
              </div>
              <div>
                <span className="font-extrabold text-base text-neutral-900 tracking-tight">
                  ShramSetu
                </span>
                <span className="text-xs text-neutral-500 ml-1.5 font-medium">
                  {language === 'hi' ? 'श्रमसेतु सहकारी मंच' : 'Cooperative Artisan Platform'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white px-3.5 py-1.5 rounded-full border border-neutral-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.footer.bottomGovtNote}</span>
            </div>
          </div>

          {/* 4 Column Directory Links (Matching Urban Company Image 2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            {/* Column 1: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {language === 'hi' ? 'संस्था' : 'Company'}
              </h4>
              <ul className="space-y-2 text-neutral-500 font-medium">
                <li>
                  <a href="#about" className="hover:text-neutral-950 transition-colors">
                    {language === 'hi' ? 'हमारे बारे में' : 'About us'}
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-neutral-950 transition-colors">
                    {language === 'hi' ? 'नियम व शर्तें' : 'Terms & conditions'}
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-neutral-950 transition-colors">
                    {t.footer.dataPrivacy}
                  </a>
                </li>
                <li>
                  <a href="#anti-discrimination" className="hover:text-neutral-950 transition-colors">
                    {language === 'hi' ? 'समानता व सुरक्षा नीति' : 'Anti-discrimination policy'}
                  </a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-neutral-950 transition-colors">
                    {language === 'hi' ? 'सहकारी प्रभाव रिपोर्ट' : 'Cooperative impact report'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: For Customers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {language === 'hi' ? 'ग्राहकों के लिए' : 'For customers'}
              </h4>
              <ul className="space-y-2 text-neutral-500 font-medium">
                <li>
                  <a href="#workers-directory-section" className="hover:text-neutral-950 transition-colors">
                    {t.nearbyWorkers}
                  </a>
                </li>
                <li>
                  <a href="#tariff-calculator-section" className="hover:text-neutral-950 transition-colors">
                    {t.calculator.title}
                  </a>
                </li>
                <li>
                  <a href="#customer-assistance-section" className="hover:text-neutral-950 transition-colors">
                    {t.assistance.title}
                  </a>
                </li>
                <li>
                  <a href="tel:18004192667" className="hover:text-neutral-950 transition-colors">
                    {t.footer.tollFree}
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-neutral-950 transition-colors">
                    {t.hero.policeVerifiedBadge}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: For Professionals / Artisans */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {language === 'hi' ? 'कारीगरों के लिए' : 'For professionals'}
              </h4>
              <ul className="space-y-2 text-neutral-500 font-medium">
                <li>
                  <a href="#register" className="hover:text-neutral-950 transition-colors">
                    {language === 'hi' ? 'सहकारी सदस्य के रूप में जुड़ें' : 'Register as artisan'}
                  </a>
                </li>
                <li>
                  <a href="#welfare" className="hover:text-neutral-950 transition-colors">
                    {t.footer.welfareItem1}
                  </a>
                </li>
                <li>
                  <a href="#charter" className="hover:text-neutral-950 transition-colors">
                    {t.footer.zeroCommissionBadge}
                  </a>
                </li>
                <li>
                  <a href="#insurance" className="hover:text-neutral-950 transition-colors">
                    {t.footer.welfareItem3}
                  </a>
                </li>
                <li>
                  <a href="#training" className="hover:text-neutral-950 transition-colors">
                    {t.footer.welfareItem5}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Social Links & App Download (Reference Image 2) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {language === 'hi' ? 'सोशल मीडिया व ऐप' : 'Social links & App'}
              </h4>

              {/* Social Media Circular Buttons */}
              <div className="flex items-center gap-2">
                {/* Twitter / X */}
                <a
                  href="#twitter"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#linkedin"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>

              {/* App Store / Google Play Store Badges */}
              <div className="space-y-2 pt-2">
                {/* App Store Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 text-white cursor-pointer hover:bg-neutral-800 transition-colors w-36">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.83.93-2.89-.92.04-2.03.62-2.69 1.38-.58.67-1.09 1.76-.95 2.8 1.03.08 2.08-.53 2.71-1.29z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-[8px] text-neutral-400 uppercase">Download on the</div>
                    <div className="text-[11px] font-bold">App Store</div>
                  </div>
                </div>

                {/* Google Play Store Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 text-white cursor-pointer hover:bg-neutral-800 transition-colors w-36">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.198-.242-.321-.572-.321-.944V2.758c0-.372.123-.702.32-.944zm11.246 11.248l2.062 2.062-11.458 6.547 9.396-8.609zm0-2.124L5.457 2.33 16.915 8.877l-2.06 2.061zm1.094 1.062l2.673-1.527c.725-.414.725-1.088 0-1.502l-2.673-1.528-1.547 1.547 1.547 1.51z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-[8px] text-neutral-400 uppercase">Get it on</div>
                    <div className="text-[11px] font-bold">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Compliance Bar (Exact Reference Image 2) */}
          <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-medium">
            <div>
              {t.footer.copyright}
            </div>
            <div className="flex items-center gap-3">
              <span>{t.footer.actCompliance}</span>
              <span>•</span>
              <span>{t.footer.welfareAct}</span>
              <span>•</span>
              <span>{t.footer.dataPrivacy}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
