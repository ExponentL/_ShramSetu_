import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, ServiceCategory, AuthUser, LanguageCode } from '../types';

export const AuthScreen: React.FC = () => {
  const { login, registerUser, language, setLanguage, t } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('9811234567');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRole, setLoginRole] = useState<UserRole>('customer');
  const [loginError, setLoginError] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  // Register form state
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('South Delhi');
  const [regTrade, setRegTrade] = useState<ServiceCategory>('Electrical');
  const [regExperience, setRegExperience] = useState('6');
  const [regSociety, setRegSociety] = useState('Delhi Labourers Autonomous Co-op Society');
  const [regPassword, setRegPassword] = useState('');
  const [regAgree, setRegAgree] = useState(true);
  const [regError, setRegError] = useState('');

  // Demo personas for instant evaluator access
  const demoPersonas: Array<{
    role: UserRole;
    title: string;
    badge: string;
    description: string;
    user: AuthUser;
  }> = [
    {
      role: 'customer',
      title: 'Customer Panel',
      badge: 'Citizen',
      description: 'Book verified workers, track live GPS & review jobs',
      user: {
        id: 'usr-cust-01',
        name: 'Customer',
        phone: '+91 98112 34567',
        email: 'customer@shramsetu.gov.in',
        role: 'customer',
        city: 'South Delhi (Saket)',
      },
    },
    {
      role: 'worker',
      title: 'Worker Panel',
      badge: 'Artisan',
      description: 'ITI Electrician, receive fair jobs & track welfare funds',
      user: {
        id: 'w-101',
        name: 'Worker',
        phone: '+91 98765 43210',
        role: 'worker',
        trade: 'Electrical',
        memberId: 'DLACS-1994-491',
        societyId: 'coop-delhi-01',
        societyName: 'Delhi Labourers Autonomous Co-op Society',
        city: 'South Delhi',
      },
    },
    {
      role: 'admin',
      title: 'Admin Verification Board',
      badge: 'Registrar',
      description: 'Audit & manually verify worker credentials across official tiers',
      user: {
        id: 'usr-admin-01',
        name: 'Cooperative Registrar Administrator',
        phone: '+91 99999 11111',
        email: 'registrar@coop.gov.in',
        role: 'admin',
        city: 'New Delhi',
      },
    },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 5) {
      setLoginError('Please enter a valid mobile number');
      return;
    }
    setLoginError('');

    // Authenticate with selected role
    const matchedPersona = demoPersonas.find((p) => p.role === loginRole);
    const isDefaultPhone = cleanPhone === '9811234567' || cleanPhone === '9876543210';
    if (matchedPersona && isDefaultPhone) {
      login(matchedPersona.user);
    } else {
      login({
        id: `usr-${Date.now()}`,
        name: loginRole === 'customer' ? 'Cooperative Citizen' : loginRole === 'admin' ? 'Cooperative Registrar Admin' : 'Harpreet Singh (Craftsman)',
        phone: `+91 ${cleanPhone.slice(-10)}`,
        role: loginRole,
        city: 'South Delhi',
        trade: loginRole === 'worker' ? 'Electrical' : undefined,
        memberId: loginRole === 'worker' ? `DLACS-1994-${Math.floor(100 + Math.random() * 900)}` : undefined,
        societyName: loginRole === 'worker' ? 'Delhi Labourers Autonomous Co-op Society' : undefined,
      });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Please enter your mobile number');
      return;
    }
    if (!regAgree) {
      setRegError('You must agree to Cooperative Bylaws to register');
      return;
    }

    setRegError('');
    registerUser({
      name: regName.trim(),
      phone: regPhone.startsWith('+91') ? regPhone : `+91 ${regPhone}`,
      email: regEmail.trim() || undefined,
      role: regRole,
      city: regCity,
      trade: regRole === 'worker' ? regTrade : undefined,
      societyName: regRole === 'worker' ? regSociety : undefined,
      memberId: regRole === 'worker' ? `COOP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-neutral-200/80 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm tracking-tighter">
            SS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-neutral-900 tracking-tight">
                ShramSetu <span className="text-neutral-500 font-sans text-xs">श्रमसेतु</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                {language === 'hi' ? 'सहकारी पंजीकृत' : 'Co-op Reg.'}
              </span>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200 text-xs">
            {(['en', 'hi', 'pa'] as LanguageCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === code
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {code === 'en' ? 'EN' : code === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white border border-neutral-200/90 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Cooperative Mission & Principles (5 Cols) */}
          <div className="lg:col-span-5 bg-[#f9fafb] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-200/80">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <span>{language === 'hi' ? 'लोकतांत्रिक सहकारी मंच' : 'Democratic Cooperative Platform'}</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                  {language === 'hi'
                    ? 'गरिमा, उचित पारिश्रमिक एवं सुरक्षित सेवा'
                    : 'Dignity, Fair Wages & Safe Service'}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  {language === 'hi'
                    ? 'निजी कमीशन शोषण के बिना सत्यापित कुशल कारीगरों को नागरिकों और संस्थानों से जोड़ना।'
                    : 'Connecting verified trade craftsmen with households without private commission exploitation.'}
                </p>
              </div>

              {/* Pillars */}
              <div className="space-y-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-neutral-900">
                    {language === 'hi' ? '90% सीधा कारीगर भुगतान' : '90% Direct Worker Payout'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'hi'
                      ? 'बिना किसी छुपे सर्ज चार्ज के पारदर्शी व मानक दरें'
                      : 'Regulated transparent rates with zero surge markups'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-neutral-900">
                    {language === 'hi' ? '8% सामाजिक सुरक्षा कोष' : '8% Social Security Pool'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'hi'
                      ? 'दुर्घटना बीमा, स्वास्थ्य सुरक्षा एवं बच्चों की छात्रवृत्ति'
                      : 'Accident cover, health insurance & children scholarships'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-neutral-900">
                    {language === 'hi' ? '100% पुलिस एवं ट्रेड सत्यापित' : '100% Police & Trade Verified'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'hi'
                      ? 'पृष्ठभूमि सत्यापन और लाइव जीपीएस यात्रा सुरक्षा'
                      : 'Background audited with live in-transit GPS tracking'}
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline Helper */}
            <div className="pt-6 mt-6 border-t border-neutral-200 text-[11px] text-neutral-500">
              <span className="text-neutral-900 font-bold">
                {language === 'hi' ? 'टोल-फ्री हेल्पलाइन:' : 'Toll-Free Helpline:'}
              </span>{' '}
              1800-419-2667
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {language === 'hi'
                  ? 'हिन्दी, पंजाबी और अंग्रेजी में 24x7 सहायता उपलब्ध'
                  : 'Support available 24x7 in Hindi, Punjabi & English'}
              </div>
            </div>
          </div>

          {/* Right Column: Form & One-Click Demo Access (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
                <button
                  id="auth-tab-login"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {language === 'hi' ? 'लॉगिन' : 'Sign In'}
                </button>
                <button
                  id="auth-tab-register"
                  onClick={() => {
                    setAuthMode('register');
                    setRegError('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {language === 'hi' ? 'नया पंजीकरण' : 'Register'}
                </button>
              </div>

              {/* LOGIN FORM */}
              {authMode === 'login' ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-neutral-900">
                      {language === 'hi' ? 'श्रमसेतु में आपका स्वागत है' : 'Welcome to ShramSetu'}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {language === 'hi'
                        ? 'सेवाएं बुक करने, कार्य प्रबंधित करने अथवा सहकारी पटल देखने हेतु लॉगिन करें।'
                        : 'Sign in to book doorstep services or manage artisan job schedules.'}
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                        {language === 'hi' ? 'लॉगिन भूमिका चुनें:' : 'Select Your Role:'}
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          id="login-role-customer"
                          onClick={() => {
                            setLoginRole('customer');
                            if (loginPhone === '9876543210') setLoginPhone('9811234567');
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            loginRole === 'customer'
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-neutral-300'
                          }`}
                        >
                          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                            {language === 'hi' ? 'नागरिक' : 'Household'}
                          </div>
                          <div className="text-sm font-bold">
                            {language === 'hi' ? 'नागरिक / ग्राहक' : 'Customer'}
                          </div>
                          <p className={`text-[11px] mt-1 ${loginRole === 'customer' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {language === 'hi'
                              ? 'सत्यापित कामगार बुक करें'
                              : 'Book verified doorstep workers'}
                          </p>
                        </button>

                        <button
                          type="button"
                          id="login-role-worker"
                          onClick={() => {
                            setLoginRole('worker');
                            if (loginPhone === '9811234567') setLoginPhone('9876543210');
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            loginRole === 'worker'
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-neutral-300'
                          }`}
                        >
                          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                            {language === 'hi' ? 'कारीगर' : 'Artisan'}
                          </div>
                          <div className="text-sm font-bold">
                            {language === 'hi' ? 'सहकारी कामगार' : 'Co-op Worker'}
                          </div>
                          <p className={`text-[11px] mt-1 ${loginRole === 'worker' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {language === 'hi'
                              ? 'कार्य स्वीकारें व लाभ पाएं'
                              : 'Accept jobs & social welfare'}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {language === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Mobile Number'}
                      </label>
                      <div className="flex rounded-xl border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-neutral-900 overflow-hidden">
                        <span className="px-3 py-2.5 bg-neutral-100 text-neutral-600 text-xs font-semibold border-r border-neutral-200">
                          +91
                        </span>
                        <input
                          id="login-phone-input"
                          type="tel"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full px-3 py-2.5 text-xs text-neutral-900 bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Password or PIN */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-neutral-700">
                          {language === 'hi' ? 'पासवर्ड / सहकारी पिन' : 'Password / PIN'}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginPassword('4912');
                            setOtpSentMessage(
                              language === 'hi'
                                ? 'डेमो ओटीपी 4912 भेजा गया'
                                : 'Demo OTP 4912 sent'
                            );
                            setTimeout(() => setOtpSentMessage(null), 3000);
                          }}
                          className="text-[11px] text-neutral-600 hover:text-neutral-950 font-semibold cursor-pointer"
                        >
                          {language === 'hi' ? 'ओटीपी द्वारा लॉगिन' : 'Fill Demo PIN'}
                        </button>
                      </div>
                      <input
                        id="login-password-input"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={language === 'hi' ? 'अपना पासवर्ड या पिन दर्ज करें' : 'Enter your password'}
                        className="w-full px-3.5 py-2.5 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      {otpSentMessage && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          {otpSentMessage}
                        </p>
                      )}
                    </div>

                    <button
                      id="login-submit-btn"
                      type="submit"
                      className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-wide shadow-sm transition-all cursor-pointer"
                    >
                      {language === 'hi'
                        ? (loginRole === 'worker' ? 'सहकारी कामगार के रूप में लॉगिन करें' : 'नागरिक ग्राहक के रूप में लॉगिन करें')
                        : `Sign In as ${loginRole === 'worker' ? 'Cooperative Worker' : 'Citizen Customer'}`} →
                    </button>
                  </form>
                </div>
              ) : (
                /* REGISTRATION FORM */
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-neutral-900">
                      {language === 'hi' ? 'नया सहकारी खाता बनाएं' : 'Create an Account'}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {language === 'hi'
                        ? 'नागरिक ग्राहक या प्रमाणित सहकारी कारीगर के रूप में जुड़ें।'
                        : 'Join as a citizen customer or certified cooperative artisan.'}
                    </p>
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                      {regError}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRegRole('customer')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          regRole === 'customer'
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {language === 'hi' ? 'नागरिक खाता' : 'Customer Account'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole('worker')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          regRole === 'worker'
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {language === 'hi' ? 'कारीगर खाता' : 'Artisan Account'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 text-xs text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    {regRole === 'worker' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'प्राथमिक व्यवसाय (ट्रेड)' : 'Primary Trade'}
                        </label>
                        <select
                          value={regTrade}
                          onChange={(e) => setRegTrade(e.target.value as ServiceCategory)}
                          className="w-full px-3 py-2 text-xs text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                        >
                          <option value="Electrical">Electrical</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Painting">Painting</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Gardening">Gardening</option>
                          <option value="Technician">Technician</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="reg-agree"
                        checked={regAgree}
                        onChange={(e) => setRegAgree(e.target.checked)}
                        className="rounded text-neutral-900 focus:ring-neutral-900"
                      />
                      <label htmlFor="reg-agree" className="text-[11px] text-neutral-600">
                        {language === 'hi'
                          ? 'मैं सहकारी समिति के उपनियमों और सेवा शर्तों से सहमत हूँ'
                          : 'I agree to the Cooperative Bylaws and Fair Code of Conduct'}
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
                    >
                      {language === 'hi' ? 'पंजीकरण पूर्ण करें' : 'Complete Registration'} →
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Quick Demo Personas (Hackathon Evaluator 1-Click Access) */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="text-[10px] uppercase font-bold text-neutral-400 mb-2">
                Quick Evaluator Access (1-Click Switch)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {demoPersonas.map((persona) => (
                  <button
                    key={persona.role}
                    type="button"
                    onClick={() => login(persona.user)}
                    className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{persona.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700">
                        {persona.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                      {persona.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-4 text-center text-[11px] text-neutral-500 border-t border-neutral-200/80 bg-white">
        © 2026 ShramSetu Cooperative Federation • Regulated under MSCS Act 2002
      </footer>
    </div>
  );
};
