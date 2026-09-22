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
import { ErrorBoundary } from './components/ErrorBoundary';
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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white w-full max-w-full">
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

      {/* Floating Customer Help Chatbot (Hindi & English) in Bottom Right Corner (Customer side only) */}
      {currentRole === 'customer' && <CustomerChatbot />}

      {/* ========================================================================= */}
      {/* Dark Professional Cooperative Footer (Dark Navy #112437)                   */}
      {/* ========================================================================= */}
      <footer className="mt-20 bg-[#112437] border-t border-[#1d3d5e] text-slate-300 text-xs w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Top Branding Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-10 border-b border-[#224466]">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#167A5B] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm border border-[#229972]">
                  SS
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-lg text-white tracking-tight">
                      ShramSetu
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      श्रमसेतु
                    </span>
                  </div>
                  <div className="text-xs text-[#C25E00] font-bold">
                    Trusted Skills. Right at Your Doorstep.
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                ShramSetu connects customers directly with skilled workers organised through labour cooperatives.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white bg-[#17324D] px-3.5 py-2 rounded-xl border border-[#2c5580] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Registered Labour Cooperative Platform</span>
              </div>
              <div className="text-xs text-slate-400 bg-[#17324D] px-3.5 py-2 rounded-xl border border-[#2c5580]">
                Toll-Free Helpline: <strong className="text-white">1800-419-2667</strong>
              </div>
            </div>
          </div>

          {/* 5 Column Directory Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-10">
            {/* Column 1: Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Services
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Electrical
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Plumbing
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Carpentry
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Cleaning
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Painting
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Appliance Repair
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Gardening
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Driving
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Caregiving
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Explore
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#skilled-workers-map-section" className="hover:text-white transition-colors">
                    Skilled Workers Map
                  </a>
                </li>
                <li>
                  <a href="#workers-directory-section" className="hover:text-white transition-colors">
                    Find Professionals
                  </a>
                </li>
                <li>
                  <a href="#customer-journey-section" className="hover:text-white transition-colors">
                    From Search to Doorstep
                  </a>
                </li>
                <li>
                  <a href="#job-pricing-section" className="hover:text-white transition-colors">
                    Job-Based Pricing
                  </a>
                </li>
                <li>
                  <a href="#verification-section" className="hover:text-white transition-colors">
                    Worker Verification
                  </a>
                </li>
                <li>
                  <a href="#customer-reviews-section" className="hover:text-white transition-colors">
                    Customer Reviews
                  </a>
                </li>
                <li>
                  <a href="#impact-counters-section" className="hover:text-white transition-colors">
                    Cooperative Impact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: For Workers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                For Workers
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#register" className="hover:text-white transition-colors">
                    Register as Artisan
                  </a>
                </li>
                <li>
                  <a href="#cooperatives" className="hover:text-white transition-colors">
                    Cooperative Society Join
                  </a>
                </li>
                <li>
                  <a href="#workload" className="hover:text-white transition-colors">
                    Fair Workload Policy
                  </a>
                </li>
                <li>
                  <a href="#direct-pay" className="hover:text-white transition-colors">
                    Zero Platform Commission
                  </a>
                </li>
                <li>
                  <a href="#certification" className="hover:text-white transition-colors">
                    Trade Skill Certification
                  </a>
                </li>
                <li>
                  <a href="#welfare" className="hover:text-white transition-colors">
                    Worker Welfare Pool
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: For Cooperatives */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                For Cooperatives
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#society-portal" className="hover:text-white transition-colors">
                    Society Portal
                  </a>
                </li>
                <li>
                  <a href="#worker-audit" className="hover:text-white transition-colors">
                    Worker Enrollment &amp; Audit
                  </a>
                </li>
                <li>
                  <a href="#charter" className="hover:text-white transition-colors">
                    Cooperative Charter
                  </a>
                </li>
                <li>
                  <a href="#verification" className="hover:text-white transition-colors">
                    Verification Protocol
                  </a>
                </li>
                <li>
                  <a href="#dispute" className="hover:text-white transition-colors">
                    Dispute Arbitration
                  </a>
                </li>
                <li>
                  <a href="#compliance" className="hover:text-white transition-colors">
                    Compliance Registry
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Information
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About ShramSetu
                  </a>
                </li>
                <li>
                  <a href="#cooperative-story-section" className="hover:text-white transition-colors">
                    The Cooperative Model
                  </a>
                </li>
                <li>
                  <a href="#dpdp" className="hover:text-white transition-colors">
                    DPDP Act Compliance
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="tel:18004192667" className="hover:text-white transition-colors">
                    Helpline: 1800-419-2667
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Compliance Bar */}
          <div className="pt-8 border-t border-[#224466] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
            <div>
              &copy; 2026 ShramSetu. A cooperative labour service platform.
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>Multi-State Cooperative Societies Act</span>
              <span>&bull;</span>
              <span>DPDP Act 2023 Compliant</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">Zero Commission &bull; 100% Direct Labour Remuneration</span>
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
