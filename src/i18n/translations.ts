import { LanguageCode, ServiceCategory } from '../types';

export interface Translations {
  appName: string;
  appSubheading: string;
  tagline: string;
  emergencyBtn: string;
  emergencyTagline: string;
  searchPlaceholder: string;
  selectLocation: string;
  allServices: string;
  verifiedWorkerBadge: string;
  bookNow: string;
  viewProfile: string;
  experience: string;
  rating: string;
  jobsCompleted: string;
  startingFrom: string;
  cooperativeUnit: string;
  switchRole: string;
  trackLiveGPS: string;
  fairWorkDistribution: string;
  fairWorkDesc: string;
  welfareGuaranteed: string;
  welfareDesc: string;
  directWorkerPayout: string;
  directWorkerDesc: string;
  customerSafety: string;
  customerSafetyDesc: string;
  howItWorks: string;
  popularServices: string;
  nearbyWorkers: string;
  reviewsTitle: string;
  fileComplaint: string;
  complaintsHistory: string;
  payDigitally: string;
  viewInvoice: string;
  roles: {
    customer: string;
    worker: string;
  };
  categories: Record<ServiceCategory, string>;
  bookingStatuses: Record<string, string>;
  complaintStatuses: Record<string, string>;

  // Structured UI Sections
  nav: {
    brandSubtitle: string;
    allZones: string;
    northDelhi: string;
    southDelhi: string;
    westDelhi: string;
    eastDelhi: string;
    mohali: string;
    gurugram: string;
    serviceZoneLabel: string;
    exploreBook: string;
    verifiedWorkers: string;
    liveGpsTracking: string;
    myBookings: string;
    grievanceDesk: string;
    workerJobConsole: string;
    activeTripGps: string;
    welfareSchemes: string;
    fileGrievance: string;
    fairWorkAlgoActive: string;
    coopNotifs: string;
    alertsCount: string;
    verifiedWorkerTag: string;
    registeredCustomerTag: string;
    policeCoopVerified: string;
    activeAccount: string;
    phoneLabel: string;
    emailLabel: string;
    locationLabel: string;
    primaryTradeLabel: string;
    coopMemberIdLabel: string;
    primaryCoopLabel: string;
    ombudsmanGrievances: string;
    welfareHealthcareFund: string;
    logout: string;
    logoutSwitch: string;
  };

  hero: {
    badge: string;
    title: string;
    description: string;
    findWorkerBtn: string;
    clearBtn: string;
    policeVerifiedBadge: string;
    fixedTariffsBadge: string;
    liveGpsBadge: string;
    welfareComplianceBadge: string;
  };

  tickers: Array<{ text: string; tag: string }>;

  diagnoser: {
    badge: string;
    title: string;
    subtitle: string;
    zeroSurgeTag: string;
    standardTariff: string;
    oneTapMatch: string;
    issues: Array<{
      id: string;
      title: string;
      subtitle: string;
      badge: string;
    }>;
  };

  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    tradeLabel: string;
    complexityLabel: string;
    optMinor: string;
    optMedium: string;
    optExtensive: string;
    coopTitle: string;
    totalStandardFee: string;
    regulatedTariff: string;
    directTakeHome: string;
    welfarePool: string;
    adminGst: string;
    bookAtTariff: string;
    privateTitle: string;
    estimatedSurge: string;
    surgeMarkup: string;
    privateWorkerCut: string;
    corporateCut: string;
    zeroSafetyNet: string;
    savingsBanner: string;
  };

  assistance: {
    badge: string;
    title: string;
    subtitle: string;
    callBtn: string;
    raiseTicketBtn: string;
    c1Title: string;
    c1Desc: string;
    c1Action: string;
    c2Title: string;
    c2Desc: string;
    c2Action: string;
    c3Title: string;
    c3Desc: string;
    c3Badge: string;
    c4Title: string;
    c4Desc: string;
    c4Action: string;
  };

  coopVsGig: {
    title: string;
    subtitle: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    p4Title: string;
    p4Desc: string;
  };

  directory: {
    availableCount: string;
    subtext: string;
    zoneLabel: string;
    noWorkersTitle: string;
    noWorkersSubtext: string;
    resetFiltersBtn: string;
    jobsSuffix: string;
    expSuffix: string;
    baseSuffix: string;
  };

  bookingsSection: {
    title: string;
    subtitle: string;
    emptyText: string;
    workerLabel: string;
    openGpsBtn: string;
    fillDiagnosisBtn: string;
    rateReviewBtn: string;
    viewInvoiceBtn: string;
  };

  workerDashboard: {
    panelTitle: string;
    verifiedMember: string;
    primaryTrade: string;
    lifetimeJobs: string;
    dutyAvailability: string;
    onDuty: string;
    offDuty: string;
    queueRank: string;
    netEarnings: string;
    directBankCredit: string;
    welfarePool: string;
    medicalPensionCess: string;
    accidentInsurance: string;
    insuranceCover: string;
    insurancePolicy: string;
    assignedJobs: string;
    balancedQuota: string;
    tabJobs: string;
    tabWelfare: string;
    tabEarnings: string;
    tabProfile: string;
    activeJobTitle: string;
    emergencySosTag: string;
    currentStatus: string;
    customerLoc: string;
    zone: string;
    customerLabel: string;
    taskReq: string;
    scheduledTime: string;
    expectedPayout: string;
    startTripBtn: string;
    confirmArrivalBtn: string;
    openMapBtn: string;
    diagnoseMcqBtn: string;
    proceedWorkBtn: string;
    finishWorkBtn: string;
    reportUnsafeBtn: string;
    allJobsDone: string;
    allJobsDoneSub: string;
    jobHistoryTitle: string;
    settledBank: string;
    invoiceBtn: string;
    socialSecurityTitle: string;
    socialSecurityDesc: string;
    submitClaim: string;
    enrolledMembers: string;
    eligibility: string;
    payoutLedgerTitle: string;
    payoutLedgerDesc: string;
    linkedAccount: string;
    totalCharge: string;
    welfareCessRow: string;
    skillsTitle: string;
    skillsDesc: string;
    activeCredentials: string;
    verifiedByAdmin: string;
    registeredSkills: string;
    addSkillTitle: string;
    addSkillPlaceholder: string;
    addSkillBtn: string;
  };

  tracking: {
    activeTrips: string;
    privacyNotice: string;
    privacySubtext: string;
    openGmaps: string;
    shareTrip: string;
    radarTitle: string;
    assignedUnit: string;
    usingDeviceGps: string;
    useDeviceGps: string;
    pause: string;
    resume: string;
    transitScrubber: string;
    routeCompleted: string;
    remainingDist: string;
    estimatedArrival: string;
    arrivedText: string;
    minsSuffix: string;
    liveVelocity: string;
    transitHeading: string;
    verifiedArtisan: string;
    masterArtisan: string;
    callWorker: string;
    sosBtn: string;
    doorstepPin: string;
    coopProtocol: string;
    customerPinHelp: string;
    workerPinPrompt: string;
    pinPlaceholder: string;
    verifyPinBtn: string;
    pinVerified: string;
    milestonesTitle: string;
    m1Title: string;
    m1Desc: string;
    m2Title: string;
    m2Desc: string;
    m3Title: string;
    m3Desc: string;
    m4Title: string;
    m4Desc: string;
    workflowActions: string;
    startTripBroadcast: string;
    confirmArrivalPremises: string;
    stage2Title: string;
    advancePaid: string;
    stage2Help: string;
    fillDiagnosisBtn: string;
    notifyDiagComplete: string;
    confirmedFaultTitle: string;
    balanceCleared: string;
    markWorkCompleted: string;
    rateReviewWorker: string;
    shareModalTitle: string;
    shareModalDesc: string;
    copyLink: string;
    copiedLink: string;
    shareWhatsapp: string;
    sosModalTitle: string;
    sosModalSubtitle: string;
    sosCallPolice: string;
    sosCallCoop: string;
    sosDismiss: string;
  };

  footer: {
    backToHome: string;
    backToWorkerConsole: string;
    empoweringText: string;
    regNumber: string;
    coopWelfareTitle: string;
    welfareItem1: string;
    welfareItem2: string;
    welfareItem3: string;
    welfareItem4: string;
    welfareItem5: string;
    consumerSafetyTitle: string;
    safetyItem1: string;
    safetyItem2: string;
    safetyItem3: string;
    safetyItem4: string;
    safetyItem5: string;
    supportDeskTitle: string;
    tollFree: string;
    supportHours: string;
    emergencyAvailable: string;
    copyright: string;
    actCompliance: string;
    welfareAct: string;
    dataPrivacy: string;
    bottomGovtNote: string;
    verifiedWorkersBadge: string;
    zeroCommissionBadge: string;
    helplineBadge: string;
  };

  common: {
    back: string;
    next: string;
    cancel: string;
    close: string;
    submit: string;
    confirm: string;
    step: string;
    of: string;
    rupeeSymbol: string;
    all: string;
    showAll: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: 'Labour Cooperative Service Marketplace',
    appSubheading: 'Government & Cooperative Society Backed Worker Welfare Network',
    tagline: 'Trust • Worker Welfare • Fair Work Distribution • Consumer Safety • Cooperative Ownership',
    emergencyBtn: 'EMERGENCY SERVICE',
    emergencyTagline: 'Urgent assistance dispatched within 15-25 minutes by nearest verified worker',
    searchPlaceholder: 'Search electrician, plumber, carpenter, cleaning, AC technician...',
    selectLocation: 'Select Ward / Sector',
    allServices: 'Service Categories',
    verifiedWorkerBadge: 'Verified Cooperative Worker',
    bookNow: 'Book Service',
    viewProfile: 'View Profile',
    experience: 'Experience',
    rating: 'Rating',
    jobsCompleted: 'Jobs Completed',
    startingFrom: 'Standard Rate',
    cooperativeUnit: 'Affiliated Cooperative',
    switchRole: 'Simulate User Role',
    trackLiveGPS: 'Live Worker GPS Tracking',
    fairWorkDistribution: 'Algorithmic Fair Work Allocation',
    fairWorkDesc: 'Jobs are balanced equitably among all member workers without commission exploitation.',
    welfareGuaranteed: 'Cooperative Welfare & Health Cover',
    welfareDesc: 'Every booking directly contributes to pension, medical aid, accident cover, and children education.',
    directWorkerPayout: 'Transparent Fair Remuneration',
    directWorkerDesc: 'Workers receive up to 90% direct payout. Zero arbitrary platform surge charges.',
    customerSafety: '100% Police & Skill Verified',
    customerSafetyDesc: 'Background checked with certified vocational trade credentials and live trip monitoring.',
    howItWorks: 'How Cooperative Service Works',
    popularServices: 'Popular Services',
    nearbyWorkers: 'Nearby Verified Workers',
    reviewsTitle: 'Customer Ratings & Public Reviews',
    fileComplaint: 'Grievance / Complaint Desk',
    complaintsHistory: 'My Grievances',
    payDigitally: 'Pay Securely via UPI / Cards / Net Banking',
    viewInvoice: 'Download Formal Co-op Invoice',
    roles: {
      customer: 'Customer',
      worker: 'Cooperative Worker',
    },
    categories: {
      Electrical: 'Electrical Services',
      Plumbing: 'Plumbing & Drainage',
      Carpentry: 'Carpentry & Woodwork',
      Painting: 'Painting & Polishing',
      Cleaning: 'Deep Cleaning & Sanitation',
      Gardening: 'Gardening & Landscaping',
      Driving: 'Driver & Chauffeur',
      'Domestic Help': 'Domestic & Kitchen Help',
      Technician: 'Appliance & Tech Repair',
      Other: 'General Artisans & Helpers',
    },
    bookingStatuses: {
      Requested: 'Booking Requested',
      Accepted: 'Worker Accepted',
      'Worker On The Way': 'Worker On The Way (Live GPS)',
      Arrived: 'Worker Arrived at Location',
      Diagnosing: 'On-Site Diagnosis in Progress',
      'Diagnosis Completed': 'Diagnosis Completed (MCQ Verified)',
      'Work Started': 'Work in Progress',
      'Work Completed': 'Work Completed',
      'Payment Completed': 'Payment Settled',
      Cancelled: 'Booking Cancelled',
      Disputed: 'Dispute / Under Review',
    },
    complaintStatuses: {
      Submitted: 'Grievance Submitted',
      'Under Review': 'Under Cooperative Review',
      Resolved: 'Resolved & Closed',
      Rejected: 'Rejected',
      Escalated: 'Escalated to Federation',
    },
    nav: {
      brandSubtitle: 'Labour Cooperative Service Marketplace',
      allZones: 'All Service Zones (NCR & Tricity)',
      northDelhi: 'North Delhi (Rohini, Pitampura)',
      southDelhi: 'South Delhi (Saket, Lajpat Nagar)',
      westDelhi: 'West Delhi (Janakpuri, Dwarka)',
      eastDelhi: 'East Delhi & Noida',
      mohali: 'Mohali & Chandigarh Tricity',
      gurugram: 'Gurugram (DLF & Sec 14-31)',
      serviceZoneLabel: 'Service Zone',
      exploreBook: 'Explore & Book Services',
      verifiedWorkers: 'Verified Workers Directory',
      liveGpsTracking: 'Live GPS Worker Tracking',
      myBookings: 'My Bookings & Invoices',
      grievanceDesk: 'Grievance / Complaint Desk',
      workerJobConsole: 'Worker Job Console',
      activeTripGps: 'Active Trip & GPS Broadcast',
      welfareSchemes: 'Welfare, Insurance & Schemes',
      fileGrievance: 'File Workplace Grievance',
      fairWorkAlgoActive: 'Fair Work Distribution Algorithm: Active',
      coopNotifs: 'Cooperative Notifications',
      alertsCount: 'alerts',
      verifiedWorkerTag: 'Verified Worker',
      registeredCustomerTag: 'Registered Customer',
      policeCoopVerified: 'Police & Co-op Verified',
      activeAccount: 'Active Account',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      locationLabel: 'Location:',
      primaryTradeLabel: 'Primary Trade:',
      coopMemberIdLabel: 'Co-op Member ID:',
      primaryCoopLabel: 'Primary Cooperative:',
      ombudsmanGrievances: 'Ombudsman & Grievances',
      welfareHealthcareFund: 'Welfare & Healthcare Fund',
      logout: 'Log Out',
      logoutSwitch: 'Log Out / Switch User',
    },
    hero: {
      badge: 'Regulated Home Services Network',
      title: 'Reliable home services at your doorstep',
      description:
        'Book verified electricians, plumbers, carpenters, and appliance technicians. Regulated rates with 90% paid directly to skilled professionals.',
      findWorkerBtn: 'Find professional',
      clearBtn: 'Clear',
      policeVerifiedBadge: 'Background verified professionals',
      fixedTariffsBadge: 'Regulated standard rates',
      liveGpsBadge: 'Live GPS arrival tracking',
      welfareComplianceBadge: 'Welfare & healthcare protection',
    },
    tickers: [
      { text: 'Electrician service completed in Rohini · 3 mins ago', tag: 'Recent booking' },
      { text: 'Harpreet Singh (Plumbing) rated 5.0 in South Delhi', tag: 'Customer review' },
      { text: '48 verified technicians available across Delhi NCR & Mohali', tag: 'Available now' },
      { text: 'Regulated cooperative platform: zero surge pricing on all repairs', tag: 'Guaranteed rate' },
    ],
    diagnoser: {
      badge: 'Quick repair',
      title: 'Need help with a common repair?',
      subtitle: 'Select an issue below for standard upfront rates and fast technician matching.',
      zeroSurgeTag: 'Fixed pricing · Zero surge fees',
      standardTariff: 'Standard rate',
      oneTapMatch: 'Select',
      issues: [
        {
          id: 'diag-mcb',
          title: 'Switchboard repair & MCB tripping',
          subtitle: 'Short circuits, socket heat, tripped switches',
          badge: 'Electrical',
        },
        {
          id: 'diag-leak',
          title: 'Pipe leakage & tap repair',
          subtitle: 'Concealed leaks, dripping taps, low pressure',
          badge: 'Plumbing',
        },
        {
          id: 'diag-wood',
          title: 'Door lock & hinge repair',
          subtitle: 'Jammed locks, wardrobe handles, loose fittings',
          badge: 'Carpentry',
        },
        {
          id: 'diag-appliance',
          title: 'AC & appliance inspection',
          subtitle: 'Cooling issues, gas check, geyser or washing machine fix',
          badge: 'Appliances',
        },
        {
          id: 'diag-clean',
          title: 'Deep kitchen & home cleaning',
          subtitle: 'Floor scrubbing, tile descaling, grease removal',
          badge: 'Cleaning',
        },
        {
          id: 'diag-paint',
          title: 'Wall dampness & paint touch-up',
          subtitle: 'Plaster cracks, anti-damp treatment, touch-up',
          badge: 'Painting',
        },
      ],
    },
    calculator: {
      badge: 'Price transparency',
      title: 'Transparent rate breakdown',
      subtitle:
        'See how fees are allocated. 90% goes directly to the service professional, with 8% contributing to worker welfare and healthcare funds.',
      tradeLabel: 'Service',
      complexityLabel: 'Service scope',
      optMinor: 'Standard inspection / minor repair (1 hr)',
      optMedium: 'Standard repair (2 hrs)',
      optExtensive: 'Comprehensive overhaul (3 hrs)',
      coopTitle: 'ShramSetu Standard Rate',
      totalStandardFee: 'Total fee',
      regulatedTariff: 'Standard rate',
      directTakeHome: 'Direct professional payout (90%):',
      welfarePool: 'Worker welfare & healthcare pool (8%):',
      adminGst: 'GST & portal administration (2%):',
      bookAtTariff: 'Book at standard rate',
      privateTitle: 'Private gig aggregators',
      estimatedSurge: 'Estimated market price',
      surgeMarkup: 'Includes commission & surge',
      privateWorkerCut: 'Professional payout after app cut (~65%):',
      corporateCut: 'Platform commission (~25-35%):',
      zeroSafetyNet: '₹0 (No welfare coverage)',
      savingsBanner: 'Cooperative pricing ensures skilled workers receive fair wages while you pay standard regulated rates.',
    },
    assistance: {
      badge: 'Support & Protection',
      title: 'Customer assistance and protection',
      subtitle:
        'Every booking is backed by transparent dispute resolution, a 30-day rework warranty, and 24/7 support.',
      callBtn: '1800-419-2667',
      raiseTicketBtn: 'Help desk',
      c1Title: 'Toll-free customer helpline',
      c1Desc: 'Call our dispatch team for urgent booking support, status updates, or scheduling assistance.',
      c1Action: 'Call 1800-419-2667',
      c2Title: 'WhatsApp support',
      c2Desc: 'Send photos or a short video of the fault to confirm scope and estimated pricing before arrival.',
      c2Action: 'Message on WhatsApp',
      c3Title: '30-day rework warranty',
      c3Desc: 'If the issue recurs within 30 days of completion, a technician inspects and resolves it at no additional cost.',
      c3Badge: 'Included with every service',
      c4Title: 'Grievance resolution ombudsman',
      c4Desc: 'Submit any feedback or complaints for impartial review by the cooperative committee within 24 hours.',
      c4Action: 'Submit ticket',
    },
    coopVsGig: {
      title: 'Built on cooperative principles',
      subtitle: 'A public cooperative model designed to deliver dependable service for citizens while ensuring fair livelihoods for skilled workers.',
      p1Title: 'Background verified',
      p1Desc: 'Every technician is police-verified and tested for vocational trade standards.',
      p2Title: 'Fair worker compensation',
      p2Desc: '90% of every fee goes directly to the professional with 8% into health and pension funds.',
      p3Title: 'No surge pricing',
      p3Desc: 'Fixed, transparent rates whether it is peak hours or rainy days.',
      p4Title: 'Accountable service',
      p4Desc: 'Supervised by the Cooperative Federation with formal tax invoices and warranties.',
    },
    directory: {
      availableCount: 'Available',
      subtext: 'Verified cooperative members • Algorithmic fair workload allocation',
      zoneLabel: 'Zone:',
      noWorkersTitle: 'No verified workers match the selected criteria.',
      noWorkersSubtext: 'Try changing the trade category or selecting "All Service Zones".',
      resetFiltersBtn: 'Reset Filters',
      jobsSuffix: 'jobs',
      expSuffix: 'y exp',
      baseSuffix: '/ base',
    },
    bookingsSection: {
      title: 'Recent Customer Bookings',
      subtitle: 'Track active dispatches, view digital invoices, and submit star reviews',
      emptyText: 'No bookings placed yet. Select a service above to book your first verified cooperative worker!',
      workerLabel: 'Worker:',
      openGpsBtn: 'Open Live GPS Tracking',
      fillDiagnosisBtn: 'Select Diagnosed Problem (MCQ)',
      rateReviewBtn: 'Rate & Review Worker',
      viewInvoiceBtn: 'View Invoice',
    },
    workerDashboard: {
      panelTitle: 'Worker Panel',
      verifiedMember: 'Verified Cooperative Member',
      primaryTrade: 'Primary Trade:',
      lifetimeJobs: 'Lifetime Jobs',
      dutyAvailability: 'Duty Availability:',
      onDuty: 'ON DUTY (Receiving Jobs)',
      offDuty: 'OFF DUTY (Paused)',
      queueRank: 'Fair Allocation Queue Rank: #1 in Zone',
      netEarnings: 'Net Worker Earnings',
      directBankCredit: '90% direct bank credit',
      welfarePool: 'Welfare Fund Pool',
      medicalPensionCess: 'Cess for Medical & Pension',
      accidentInsurance: 'Accident Insurance',
      insuranceCover: '₹5,00,000 Cover',
      insurancePolicy: 'PMSBY + Society Policy',
      assignedJobs: 'Assigned Jobs This Week',
      balancedQuota: 'Balanced fair quota',
      tabJobs: 'Active & Scheduled Jobs',
      tabWelfare: 'Welfare Schemes & Claims',
      tabEarnings: 'Earnings & Payout Ledger',
      tabProfile: 'Skills & Certifications',
      activeJobTitle: 'Active Job:',
      emergencySosTag: 'EMERGENCY SOS',
      currentStatus: 'Current Status:',
      customerLoc: 'Customer Location:',
      zone: 'Zone:',
      customerLabel: 'Customer:',
      taskReq: 'Task Requirements:',
      scheduledTime: 'Scheduled Time:',
      expectedPayout: 'Expected Worker Payout:',
      startTripBtn: 'Start Trip & Share Live GPS with Customer',
      confirmArrivalBtn: 'Confirm Arrival at Destination (Stop GPS Sharing)',
      openMapBtn: 'Open Live Map View',
      diagnoseMcqBtn: 'Diagnose Fault & Open Customer MCQ Form',
      proceedWorkBtn: 'Proceed with Work',
      finishWorkBtn: 'Service Finished (Mark Work Completed)',
      reportUnsafeBtn: 'Report Customer Unsafe Condition',
      allJobsDone: 'All Scheduled Jobs Completed',
      allJobsDoneSub: 'You are on duty. The fair work distribution engine will notify you when a new nearby request is assigned.',
      jobHistoryTitle: 'Job History & Payout Status',
      settledBank: 'Settled to Bank',
      invoiceBtn: 'Invoice',
      socialSecurityTitle: 'Cooperative Social Security Shield',
      socialSecurityDesc: '8% of every service fee is deposited into your welfare pool. This funds family health hospitalization, personal accident coverage, and child education.',
      submitClaim: 'Submit Claim / Apply',
      enrolledMembers: 'Members Enrolled',
      eligibility: 'Eligibility:',
      payoutLedgerTitle: 'Transparent Payout Ledger',
      payoutLedgerDesc: 'Zero arbitrary cuts. Direct automated bank settlement via IMPS / UPI.',
      linkedAccount: 'Linked Account: State Bank of India •••• 4910',
      totalCharge: 'Total Customer Charge:',
      welfareCessRow: 'Welfare Cess (8%):',
      skillsTitle: 'Trade Skills & Verification Status',
      skillsDesc: 'Verified certifications elevate your standing on the public cooperative register.',
      activeCredentials: 'Active Government / Vocational Credentials',
      verifiedByAdmin: 'Verified by Co-op Admin',
      registeredSkills: 'Registered Trade Skills',
      addSkillTitle: 'Add New Trade Skill / Specialization',
      addSkillPlaceholder: 'Select a Trade Category to add...',
      addSkillBtn: 'Add Skill',
    },
    tracking: {
      activeTrips: 'Active Dispatch Trips',
      privacyNotice: 'Cooperative GPS Privacy & Encryption Active',
      privacySubtext: 'Tracking is active solely during transit. Off-duty worker location is never recorded.',
      openGmaps: 'Open in Google Maps',
      shareTrip: 'Share Live Trip',
      radarTitle: 'Live Dispatch & Telemetry Radar',
      assignedUnit: 'Assigned Unit:',
      usingDeviceGps: 'Using Device GPS',
      useDeviceGps: 'Use Device GPS',
      pause: 'Pause',
      resume: 'Resume',
      transitScrubber: 'Interactive Transit Scrubber:',
      routeCompleted: 'Route Completed',
      remainingDist: 'Remaining Dist.',
      estimatedArrival: 'Estimated Arrival',
      arrivedText: 'Arrived!',
      minsSuffix: 'mins',
      liveVelocity: 'Live Velocity',
      transitHeading: 'Transit Heading',
      verifiedArtisan: 'Verified',
      masterArtisan: 'Master Artisan',
      callWorker: 'Call',
      sosBtn: 'SOS',
      doorstepPin: 'Doorstep Safety PIN',
      coopProtocol: 'Co-op Protocol',
      customerPinHelp: 'Share this PIN with worker upon arrival to authenticate dispatch.',
      workerPinPrompt: 'Ask customer for the 4-digit arrival PIN to begin authorized work:',
      pinPlaceholder: 'Enter 4-digit PIN',
      verifyPinBtn: 'Verify',
      pinVerified: '✓ Security Handshake Verified',
      milestonesTitle: 'Trip Waypoint Milestones',
      m1Title: 'Dispatched from Cooperative Hub',
      m1Desc: 'Tool kit inspected & credentials verified',
      m2Title: 'En Route via Main Corridor',
      m2Desc: 'Live GPS telemetry broadcasting',
      m3Title: 'Turning into Sector Avenue',
      m3Desc: 'Within 500m proximity of customer location',
      m4Title: 'Arrived at Doorstep',
      m4Desc: 'PIN handshake & on-site inspection',
      workflowActions: 'Workflow Actions',
      startTripBroadcast: 'Start Trip & Broadcast Live GPS',
      confirmArrivalPremises: 'Confirm Arrival at Premises',
      stage2Title: 'Stage 2: On-Site Diagnosis in Progress',
      advancePaid: 'Advance Paid:',
      stage2Help: 'Worker has arrived. Once they diagnose the exact fault on-site, fill out the MCQ problem form to finalize tariff.',
      fillDiagnosisBtn: 'Fill Diagnosed Problem Checklist (MCQ)',
      notifyDiagComplete: 'Notify Customer: Diagnosis Complete',
      confirmedFaultTitle: 'Confirmed Fault & Cooperative Tariff',
      balanceCleared: 'Net Balance Cleared:',
      markWorkCompleted: 'Mark Work Completed',
      rateReviewWorker: 'Rate & Review Cooperative Worker',
      shareModalTitle: 'Share Live Tracking',
      shareModalDesc: 'Anyone with this encrypted link can monitor real-time arrival for your family peace of mind.',
      copyLink: 'Copy',
      copiedLink: 'Copied!',
      shareWhatsapp: 'Share via WhatsApp',
      sosModalTitle: 'Cooperative Emergency SOS Response',
      sosModalSubtitle: 'Immediate Geolocation Safety Broadcast',
      sosCallPolice: 'Call Police (112)',
      sosCallCoop: 'Co-op Helpline',
      sosDismiss: 'Dismiss / False Alarm',
    },
    footer: {
      backToHome: '← Back to Home & Services',
      backToWorkerConsole: '← Back to Worker Console',
      empoweringText: "Empowering India's skilled trade workforce through democratic cooperatives. Registered under the Cooperative Societies Act.",
      regNumber: 'Reg No: DLACS-1994-049/MSCS • NLCF Member #1402',
      coopWelfareTitle: 'Cooperative Welfare',
      welfareItem1: 'Accident & Health Insurance Pool',
      welfareItem2: 'Children Education Scholarships',
      welfareItem3: 'Modern Tool Purchase Subsidies',
      welfareItem4: 'Regulated Living Wage Guarantee',
      welfareItem5: 'Old-Age Pension Reserve Fund',
      consumerSafetyTitle: 'Consumer Safety',
      safetyItem1: '100% Police & CID Antecedent Check',
      safetyItem2: 'Accredited Vocational Trade Testing',
      safetyItem3: 'Zero Surge Pricing Guarantee',
      safetyItem4: 'Grievance Redressal Ombudsman',
      safetyItem5: 'GPS In-Transit Safety Tracking',
      supportDeskTitle: 'Support & Verification Desk',
      tollFree: '1800-419-COOP (Toll Free)',
      supportHours: 'Open 24x7 for Citizens & Member Craftsmen',
      emergencyAvailable: 'Emergency SOS Response Available',
      copyright: '© 2026 Federation of Labour Cooperative Societies Ltd. All rights reserved.',
      actCompliance: 'Cooperative Societies Act Compliance',
      welfareAct: 'Worker Welfare Fund Act',
      dataPrivacy: 'Data Protection & Geolocation Privacy',
      bottomGovtNote: 'National Labour Cooperative Federation (NLCF) & State Societies Initiative',
      verifiedWorkersBadge: '100% Verified Workers',
      zeroCommissionBadge: 'Zero Middleman Commission',
      helplineBadge: 'Helpline: 1800-11-2026 (Toll Free)',
    },
    common: {
      back: 'Back',
      next: 'Next',
      cancel: 'Cancel',
      close: 'Close',
      submit: 'Submit',
      confirm: 'Confirm',
      step: 'Step',
      of: 'of',
      rupeeSymbol: '₹',
      all: 'ALL',
      showAll: 'Show All Trades',
    },
  },

  hi: {
    appName: 'सहकारी श्रम सेवा बाज़ार',
    appSubheading: 'शासन एवं सहकारी समिति समर्थित श्रमिक कल्याण मंच',
    tagline: 'विश्वास • श्रमिक कल्याण • समान कार्य वितरण • उपभोक्ता सुरक्षा • सहकारी स्वामित्व',
    emergencyBtn: 'आपातकालीन सेवा (EMERGENCY)',
    emergencyTagline: 'निकटतम सत्यापित श्रमिक द्वारा 15-25 मिनट में त्वरित सहायता',
    searchPlaceholder: 'इलेक्ट्रीशियन, प्लंबर, बढ़ई, सफाईकर्मी, मैकेनिक खोजें...',
    selectLocation: 'वार्ड / सेक्टर चुनें',
    allServices: 'सेवा श्रेणियां',
    verifiedWorkerBadge: 'सत्यापित सहकारी श्रमिक',
    bookNow: 'सेवा बुक करें',
    viewProfile: 'प्रोफ़ाइल देखें',
    experience: 'अनुभव',
    rating: 'रेटिंग',
    jobsCompleted: 'पूर्ण कार्य',
    startingFrom: 'मानक दर',
    cooperativeUnit: 'संबद्ध सहकारी समिति',
    switchRole: 'भूमिका बदलें (डेमो)',
    trackLiveGPS: 'लाइव जीपीएस ट्रैकिंग',
    fairWorkDistribution: 'न्यायसंगत कार्य वितरण',
    fairWorkDesc: 'बिचौलियों और शोषण के बिना सभी सहकारी सदस्यों में पारदर्शी कार्य वितरण।',
    welfareGuaranteed: 'श्रमिक कल्याण एवं स्वास्थ्य सुरक्षा',
    welfareDesc: 'प्रत्येक कार्य से पेंशन, स्वास्थ्य बीमा, दुर्घटना सुरक्षा और शिक्षा कोष में सीधा योगदान।',
    directWorkerPayout: 'पारदर्शी एवं न्यायसंगत भुगतान',
    directWorkerDesc: 'श्रमिकों को 90% तक सीधा पारिश्रमिक। कोई अनुचित कमीशन कटौती नहीं।',
    customerSafety: '100% पुलिस एवं कौशल सत्यापित',
    customerSafetyDesc: 'सत्यापित आईटीआई/कौशल प्रमाण पत्र और वास्तविक समय जीपीएस निगरानी।',
    howItWorks: 'सहकारी सेवा कैसे काम करती है',
    popularServices: 'लोकप्रिय सेवाएं',
    nearbyWorkers: 'निकटतम सत्यापित श्रमिक',
    reviewsTitle: 'ग्राहक रेटिंग एवं समीक्षाएं',
    fileComplaint: 'शिकायत एवं निवारण केंद्र',
    complaintsHistory: 'मेरी शिकायतें',
    payDigitally: 'यूपीआई / कार्ड / नेट बैंकिंग द्वारा भुगतान',
    viewInvoice: 'सहकारी चालान (रसीद)',
    roles: {
      customer: 'ग्राहक',
      worker: 'सहकारी श्रमिक',
    },
    categories: {
      Electrical: 'विद्युत कार्य (इलेक्ट्रीशियन)',
      Plumbing: 'नलसाजी (प्लंबर)',
      Carpentry: 'बढ़ईगीरी (कारपेंटर)',
      Painting: 'रंगाई-पुताई (पेंटर)',
      Cleaning: 'गहन स्वच्छता एवं सफाई',
      Gardening: 'बागवानी एवं रख-रखाव',
      Driving: 'ड्राइवर एवं वाहन चालक',
      'Domestic Help': 'घरेलू व रसोई सहायक',
      Technician: 'उपकरण एवं एसी तकनीशियन',
      Other: 'अन्य कुशल श्रमिक',
    },
    bookingStatuses: {
      Requested: 'अनुरोध भेजा गया',
      Accepted: 'श्रमिक द्वारा स्वीकृत',
      'Worker On The Way': 'श्रमिक मार्ग में है (लाइव GPS)',
      Arrived: 'श्रमिक स्थान पर पहुंच गया',
      Diagnosing: 'समस्या की जांच जारी',
      'Diagnosis Completed': 'समस्या की पहचान पूर्ण (MCQ सत्यापित)',
      'Work Started': 'कार्य प्रगति पर है',
      'Work Completed': 'कार्य पूर्ण हुआ',
      'Payment Completed': 'भुगतान संपन्न',
      Cancelled: 'रद्द किया गया',
      Disputed: 'विवाद / समीक्षाधीन',
    },
    complaintStatuses: {
      Submitted: 'शिकायत दर्ज',
      'Under Review': 'समीक्षाधीन',
      Resolved: 'निस्तारित एवं बंद',
      Rejected: 'अस्वीकृत',
      Escalated: 'फेडरेशन को अग्रेषित',
    },
    nav: {
      brandSubtitle: 'सहकारी श्रम सेवा बाज़ार',
      allZones: 'सभी सेवा क्षेत्र (एनसीआर व ट्राइसिटी)',
      northDelhi: 'उत्तरी दिल्ली (रोहिणी, पीतमपुरा)',
      southDelhi: 'दक्षिणी दिल्ली (साकेत, लाजपत नगर)',
      westDelhi: 'पश्चिमी दिल्ली (जनकपुरी, द्वारका)',
      eastDelhi: 'पूर्वी दिल्ली एवं नोएडा',
      mohali: 'मोहाली एवं चंडीगढ़ ट्राइसिटी',
      gurugram: 'गुरुग्राम (डीएलएफ व सेक्टर 14-31)',
      serviceZoneLabel: 'सेवा क्षेत्र',
      exploreBook: 'सेवाएं देखें व बुक करें',
      verifiedWorkers: 'सत्यापित श्रमिक निर्देशिका',
      liveGpsTracking: 'लाइव जीपीएस श्रमिक ट्रैकिंग',
      myBookings: 'मेरी बुकिंग व इनवॉइस',
      grievanceDesk: 'शिकायत एवं निवारण केंद्र',
      workerJobConsole: 'श्रमिक कार्य कंसोल',
      activeTripGps: 'सक्रिय यात्रा व जीपीएस प्रसारण',
      welfareSchemes: 'कल्याण, बीमा व योजनाएं',
      fileGrievance: 'कार्यस्थल शिकायत दर्ज करें',
      fairWorkAlgoActive: 'समान कार्य वितरण एल्गोरिदम: सक्रिय',
      coopNotifs: 'सहकारी सूचनाएं',
      alertsCount: 'सूचनाएं',
      verifiedWorkerTag: 'सत्यापित श्रमिक',
      registeredCustomerTag: 'पंजीकृत ग्राहक',
      policeCoopVerified: 'पुलिस एवं सहकारी सत्यापित',
      activeAccount: 'सक्रिय खाता',
      phoneLabel: 'फ़ोन:',
      emailLabel: 'ईमेल:',
      locationLabel: 'स्थान:',
      primaryTradeLabel: 'मुख्य व्यवसाय:',
      coopMemberIdLabel: 'सहकारी सदस्य आईडी:',
      primaryCoopLabel: 'संबद्ध सहकारी समिति:',
      ombudsmanGrievances: 'लोकपाल एवं शिकायतें',
      welfareHealthcareFund: 'कल्याण एवं स्वास्थ्य सुरक्षा कोष',
      logout: 'लॉग आउट',
      logoutSwitch: 'लॉग आउट / उपयोगकर्ता बदलें',
    },
    hero: {
      badge: 'शासन एवं सहकारी समिति समर्थित श्रमिक कल्याण सेवा',
      title: 'घर और संस्थानों के लिए प्रमाणित कुशल कारीगर।',
      description:
        'आईटीआई-प्रमाणित इलेक्ट्रीशियन, प्लंबर, बढ़ई, तकनीशियन और देखभाल सहायकों से सीधा संपर्क। बिना बिचौलियों का शोषण — श्रमिकों को 90% तक सीधा भुगतान जो उनकी पेंशन, स्वास्थ्य बीमा और बच्चों की शिक्षा को सुरक्षित करता है।',
      findWorkerBtn: 'श्रमिक खोजें',
      clearBtn: 'साफ़ करें',
      policeVerifiedBadge: '100% पुलिस एवं कौशल सत्यापित',
      fixedTariffsBadge: 'सहकारी समिति तय मानक दरें',
      liveGpsBadge: 'लाइव जीपीएस श्रमिक ट्रैकिंग',
      welfareComplianceBadge: 'पूर्ण कल्याण उपकर अनुपालन',
    },
    tickers: [
      { text: 'रोहिणी से पूजा ने 3 मिनट पहले इलेक्ट्रीशियन बुक किया (आपातकालीन सेवा)', tag: 'लाइव बुकिंग' },
      { text: 'हरप्रीत सिंह (प्लंबर) को 5.0★ मिला: "कोई अतिरिक्त शुल्क नहीं, उत्कृष्ट कार्य"', tag: '5-स्टार समीक्षा' },
      { text: 'दिल्ली एनसीआर और मोहाली में 48 प्रमाणित कुशल श्रमिक ऑन-ड्यूटी हैं', tag: 'सक्रिय कार्यबल' },
      { text: 'इस तिमाही में ₹14.2 लाख सीधे श्रमिक पेंशन व कल्याण कोष में जमा किए गए', tag: 'सामाजिक प्रभाव' },
    ],
    diagnoser: {
      badge: 'त्वरित समस्या पहचान',
      title: 'घरेलू मरम्मत एवं त्वरित समाधान',
      subtitle: 'पारदर्शी तय दरों पर कुशल कारीगर चुनने के लिए अपनी घरेलू समस्या चुनें',
      zeroSurgeTag: 'कोई पीक या सर्ज शुल्क नहीं',
      standardTariff: 'मानक सहकारी दर',
      oneTapMatch: 'कारीगर चुनें →',
      issues: [
        {
          id: 'diag-mcb',
          title: 'स्पार्किंग एमसीबी / बिजली ट्रिपिंग',
          subtitle: 'शॉर्ट सर्किट, स्विचबोर्ड गर्म होना, फ्यूज उड़ना',
          badge: '15-30 मिनट में रवानगी',
        },
        {
          id: 'diag-leak',
          title: 'दीवार में पाइप लीकेज / नल जाम',
          subtitle: 'पानी का रिसाव, सिंक ड्रेनेज, शॉवर में कम दबाव',
          badge: 'सर्वाधिक बुक किया गया',
        },
        {
          id: 'diag-wood',
          title: 'दरवाजे का लॉक जाम / कब्जे की मरम्मत',
          subtitle: 'अलमारी मरम्मत, खिड़की की कुंडी, ढीली लकड़ी फिटिंग',
          badge: 'दक्ष बढ़ई',
        },
        {
          id: 'diag-appliance',
          title: 'एसी कूलिंग नहीं / गैस लीकेज',
          subtitle: 'माइक्रोवेव, गीजर थर्मोस्टेट, वाशिंग मशीन पीसीबी',
          badge: 'प्रमाणित आईटीआई',
        },
        {
          id: 'diag-clean',
          title: 'घर व रसोई डीप क्लीनिंग',
          subtitle: 'फ्लोर स्क्रबिंग, टाइल सफाई, किचन ग्रीस हटाना',
          badge: 'गहन स्वच्छता',
        },
        {
          id: 'diag-paint',
          title: 'दीवारों में सीलन और नमी का इलाज',
          subtitle: 'दरार पुट्टी मरम्मत, एंटी-फंगल वाटरप्रूफिंग',
          badge: 'सीलन-रोधी',
        },
      ],
    },
    calculator: {
      badge: 'पारदर्शी मूल्य एवं सामाजिक प्रभाव कैलकुलेटर',
      title: 'देखें आपका एक-एक रुपया कहाँ जाता है।',
      subtitle:
        'निजी एग्रीगेटर ऐप्स 35% तक कमीशन काटते हैं। श्रमसेतु के सहकारी मॉडल में 98% राशि सीधे कुशल कारीगर और उनके कल्याण कोष में रहती है।',
      tradeLabel: 'कार्य श्रेणी',
      complexityLabel: 'कार्य की जटिलता',
      optMinor: 'मानक निरीक्षण / छोटी मरम्मत',
      optMedium: 'सामान्य मध्यम कार्य',
      optExtensive: 'विस्तृत संपूर्ण मरम्मत कार्य',
      coopTitle: 'श्रमसेतु सहकारी समिति',
      totalStandardFee: 'कुल मानक शुल्क',
      regulatedTariff: 'विनियमित दर',
      directTakeHome: 'कारीगर का सीधा पारिश्रमिक (90%):',
      welfarePool: 'श्रमिक पेंशन एवं स्वास्थ्य बीमा कोष (8%):',
      adminGst: 'प्रशासनिक जीएसटी एवं पोर्टल रख-रखाव (2%):',
      bookAtTariff: 'मानक दर पर बुक करें',
      privateTitle: 'निजी गिग एग्रीगेटर्स',
      estimatedSurge: 'सर्ज शुल्क सहित अनुमानित',
      surgeMarkup: 'सर्ज कमीशन',
      privateWorkerCut: 'ऐप कमीशन के बाद श्रमिक का हिस्सा (~65%):',
      corporateCut: 'कॉर्पोरेट कमीशन व मध्यस्थों का हिस्सा (25-35%):',
      zeroSafetyNet: '₹0 (शून्य सुरक्षा)',
      savingsBanner: 'श्रमसेतु से बुकिंग करके आप बचत करते हैं और कारीगरों को 35%+ अधिक कमाने में मदद करते हैं।',
    },
    assistance: {
      badge: 'समर्पित ग्राहक सहायता एवं सुरक्षा',
      title: 'हमेशा सुरक्षित। मिनटों में मानवीय सहायता।',
      subtitle:
        'कोई स्वचालित बॉट नहीं। श्रमिक सहकारी समिति के रूप में, हमारा लोकपाल पारदर्शी विवाद समाधान, निःशुल्क पुनः-कार्य वारंटी और 24/7 मानवीय सहायता सुनिश्चित करता है।',
      callBtn: '1800-419-COOP',
      raiseTicketBtn: 'शिकायत दर्ज करें',
      c1Title: 'टोल-फ्री 24x7 हेल्पलाइन',
      c1Desc: 'आपातकालीन नलसाजी, विद्युत फॉल्ट या त्वरित तकनीशियन सहायता के लिए सीधे सहायता अधिकारियों से बात करें।',
      c1Action: '1800-419-COOP पर कॉल करें',
      c2Title: 'व्हाट्सएप फोटो समस्या निदान',
      c2Desc: 'खराबी का 10-सेकंड का वीडियो या फोटो भेजें। हमारे वरिष्ठ तकनीशियन आने से पहले ही समाधान का आकलन करेंगे।',
      c2Action: 'व्हाट्सएप पर चैट करें',
      c3Title: '30-दिन निःशुल्क पुनः-कार्य सुरक्षा',
      c3Desc: 'यदि ठीक की गई समस्या 30 दिनों के भीतर दोबारा आती है, तो प्रमाणित कारीगर बिना किसी अतिरिक्त शुल्क के इसे दोबारा ठीक करेंगे।',
      c3Badge: 'सभी बुकिंग पर मान्य',
      c4Title: 'स्वतंत्र लोकपाल एवं मध्यस्थता',
      c4Desc: 'सेवा से असंतुष्ट हैं? हमारी स्वतंत्र समिति 24 घंटे के भीतर निष्पक्ष और न्यायपूर्ण समाधान सुनिश्चित करती है।',
      c4Action: 'विवाद निवारण टिकट खोलें',
    },
    coopVsGig: {
      title: 'सहकारी श्रम मॉडल निजी गिग एग्रीगेटर्स से बेहतर क्यों है',
      subtitle: 'श्रमिकों द्वारा लोकतांत्रिक रूप से संचालित, सहकारी समिति अधिनियम द्वारा विनियमित, मानवीय गरिमा और सामुदायिक विश्वास सुनिश्चित करता है।',
      p1Title: '100% पृष्ठभूमि सत्यापन',
      p1Desc: 'प्रत्येक सदस्य श्रमिक का पुलिस सत्यापन और मान्यता प्राप्त व्यावसायिक कौशल परीक्षण होता है।',
      p2Title: 'सामाजिक कल्याण कोष',
      p2Desc: 'प्रत्येक बुकिंग का 8% सीधे श्रमिक दुर्घटना बीमा, परिवार स्वास्थ्य सुरक्षा और बच्चों की छात्रवृत्ति में जाता है।',
      p3Title: 'समान कार्य वितरण',
      p3Desc: 'सभी कुशल कारीगरों को बिना बोली लगाए नियमित कार्य और सम्मानजनक आजीविका मिलती है।',
      p4Title: 'लोकतांत्रिक स्वामित्व',
      p4Desc: 'सहकारी समिति अधिनियम के तहत निर्वाचित श्रमिक प्रतिनिधियों द्वारा निष्पक्ष संचालन।',
    },
    directory: {
      availableCount: 'उपलब्ध',
      subtext: 'सत्यापित सहकारी सदस्य • पारदर्शी समान कार्यभार आवंटन',
      zoneLabel: 'क्षेत्र:',
      noWorkersTitle: 'चयनित मानदंडों से मेल खाने वाला कोई श्रमिक नहीं मिला।',
      noWorkersSubtext: 'कृपया कार्य श्रेणी बदलकर देखें या "सभी सेवा क्षेत्र" चुनें।',
      resetFiltersBtn: 'फ़िल्टर हटाएं',
      jobsSuffix: 'कार्य',
      expSuffix: 'वर्ष अनुभव',
      baseSuffix: '/ आधार',
    },
    bookingsSection: {
      title: 'हालिया ग्राहक बुकिंग',
      subtitle: 'सक्रिय रवानगी ट्रैक करें, डिजिटल रसीद देखें और रेटिंग दें',
      emptyText: 'अभी तक कोई बुकिंग नहीं हुई है। अपने पहले सत्यापित सहकारी श्रमिक को बुक करने के लिए ऊपर से सेवा चुनें!',
      workerLabel: 'श्रमिक:',
      openGpsBtn: 'लाइव जीपीएस ट्रैकिंग खोलें',
      fillDiagnosisBtn: 'पहचानी गई समस्या चुनें (MCQ)',
      rateReviewBtn: 'श्रमिक को रेटिंग व समीक्षा दें',
      viewInvoiceBtn: 'रसीद देखें',
    },
    workerDashboard: {
      panelTitle: 'श्रमिक कार्य कंसोल',
      verifiedMember: 'सत्यापित सहकारी सदस्य',
      primaryTrade: 'मुख्य व्यवसाय:',
      lifetimeJobs: 'कुल पूर्ण कार्य',
      dutyAvailability: 'ड्यूटी उपलब्धता:',
      onDuty: 'ड्यूटी पर (कार्य प्राप्त हो रहे हैं)',
      offDuty: 'ड्यूटी बंद (विश्राम पर)',
      queueRank: 'समान आवंटन कतार रैंक: क्षेत्र में #1',
      netEarnings: 'कुल श्रमिक आय',
      directBankCredit: '90% सीधा बैंक हस्तांतरण',
      welfarePool: 'कल्याण कोष संचय',
      medicalPensionCess: 'चिकित्सा व पेंशन उपकर',
      accidentInsurance: 'दुर्घटना बीमा',
      insuranceCover: '₹5,00,000 सुरक्षा कवर',
      insurancePolicy: 'पीएमएसबीवाई + समिति पॉलिसी',
      assignedJobs: 'इस सप्ताह आवंटित कार्य',
      balancedQuota: 'संतुलित समान कोटा',
      tabJobs: 'सक्रिय व निर्धारित कार्य',
      tabWelfare: 'कल्याण योजनाएं व दावे',
      tabEarnings: 'कमाई एवं भुगतान बहीखाता',
      tabProfile: 'कौशल एवं प्रमाणन',
      activeJobTitle: 'सक्रिय कार्य:',
      emergencySosTag: 'आपातकालीन SOS',
      currentStatus: 'वर्तमान स्थिति:',
      customerLoc: 'ग्राहक का पता:',
      zone: 'क्षेत्र:',
      customerLabel: 'ग्राहक:',
      taskReq: 'कार्य विवरण:',
      scheduledTime: 'निर्धारित समय:',
      expectedPayout: 'अनुमानित श्रमिक पारिश्रमिक:',
      startTripBtn: 'यात्रा शुरू करें व लाइव जीपीएस साझा करें',
      confirmArrivalBtn: 'गंतव्य पर आगमन की पुष्टि करें (जीपीएस रोकें)',
      openMapBtn: 'लाइव मैप देखें',
      diagnoseMcqBtn: 'समस्या की जांच करें व ग्राहक MCQ फॉर्म खोलें',
      proceedWorkBtn: 'कार्य शुरू करें',
      finishWorkBtn: 'कार्य पूर्ण हुआ (समापन दर्ज करें)',
      reportUnsafeBtn: 'असुरक्षित स्थिति की रिपोर्ट करें',
      allJobsDone: 'सभी निर्धारित कार्य पूर्ण हो चुके हैं',
      allJobsDoneSub: 'आप ड्यूटी पर हैं। नया नजदीकी कार्य आवंटित होने पर सिस्टम आपको तुरंत सूचित करेगा।',
      jobHistoryTitle: 'कार्य इतिहास एवं भुगतान स्थिति',
      settledBank: 'बैंक खाते में जमा',
      invoiceBtn: 'रसीद',
      socialSecurityTitle: 'सहकारी सामाजिक सुरक्षा कवच',
      socialSecurityDesc: 'प्रत्येक सेवा शुल्क का 8% आपके कल्याण कोष में जमा होता है। इससे परिवार स्वास्थ्य बीमा, दुर्घटना सुरक्षा और बच्चों की शिक्षा को सहायता मिलती है।',
      submitClaim: 'दावा प्रस्तुत करें / आवेदन करें',
      enrolledMembers: 'सदस्य पंजीकृत',
      eligibility: 'पात्रता:',
      payoutLedgerTitle: 'पारदर्शी भुगतान बहीखाता',
      payoutLedgerDesc: 'कोई अनुचित कटौती नहीं। आईएमपीएस / यूपीआई द्वारा स्वचालित प्रत्यक्ष बैंक निपटान।',
      linkedAccount: 'संबद्ध बैंक खाता: स्टेट बैंक ऑफ इंडिया •••• 4910',
      totalCharge: 'ग्राहक से कुल राशि:',
      welfareCessRow: 'कल्याण उपकर (8%):',
      skillsTitle: 'कौशल एवं सत्यापन स्थिति',
      skillsDesc: 'प्रमाणित कौशल सार्वजनिक सहकारी रजिस्टर में आपकी साख को बढ़ाते हैं।',
      activeCredentials: 'सक्रिय सरकारी / व्यावसायिक प्रमाणपत्र',
      verifiedByAdmin: 'सहकारी व्यवस्थापक द्वारा सत्यापित',
      registeredSkills: 'पंजीकृत कार्य कौशल',
      addSkillTitle: 'नया कौशल / विशेषज्ञता जोड़ें',
      addSkillPlaceholder: 'जोड़ने के लिए कार्य श्रेणी चुनें...',
      addSkillBtn: 'कौशल जोड़ें',
    },
    tracking: {
      activeTrips: 'सक्रिय रवानगी यात्राएं',
      privacyNotice: 'सहकारी जीपीएस गोपनीयता एवं एन्क्रिप्शन सक्रिय',
      privacySubtext: 'ट्रैकिंग केवल यात्रा के दौरान सक्रिय रहती है। ड्यूटी से बाहर श्रमिक की लोकेशन कभी रिकॉर्ड नहीं होती।',
      openGmaps: 'गूगल मैप्स में खोलें',
      shareTrip: 'लाइव यात्रा साझा करें',
      radarTitle: 'लाइव रवानगी एवं टेलीमेट्री रडार',
      assignedUnit: 'आवंटित कारीगर:',
      usingDeviceGps: 'डिवाइस जीपीएस उपयोग में',
      useDeviceGps: 'डिवाइस जीपीएस उपयोग करें',
      pause: 'रोकें',
      resume: 'जारी रखें',
      transitScrubber: 'इंटरैक्टिव यात्रा नियंत्रण:',
      routeCompleted: 'मार्ग पूर्ण',
      remainingDist: 'शेष दूरी',
      estimatedArrival: 'पहुंचने का समय',
      arrivedText: 'पहुंच गए!',
      minsSuffix: 'मिनट',
      liveVelocity: 'वर्तमान गति',
      transitHeading: 'दिशा',
      verifiedArtisan: 'सत्यापित',
      masterArtisan: 'दक्ष कारीगर',
      callWorker: 'कॉल करें',
      sosBtn: 'एसओएस',
      doorstepPin: 'सुरक्षा पिन (PIN)',
      coopProtocol: 'सहकारी सुरक्षा नियम',
      customerPinHelp: 'कारीगर के दरवाजे पर आने पर उन्हें यह 4-अंकों का पिन बताएं।',
      workerPinPrompt: 'कार्य शुरू करने के लिए ग्राहक से 4-अंकों का आगमन पिन पूछें:',
      pinPlaceholder: '4-अंकों का पिन दर्ज करें',
      verifyPinBtn: 'सत्यापित करें',
      pinVerified: '✓ सुरक्षा पिन सत्यापित हुआ',
      milestonesTitle: 'यात्रा पड़ाव मील के पत्थर',
      m1Title: 'सहकारी केंद्र से प्रस्थान',
      m1Desc: 'उपकरण किट जांची गई और पहचान पत्र सत्यापित',
      m2Title: 'मुख्य सड़क मार्ग से अग्रसर',
      m2Desc: 'लाइव जीपीएस टेलीमेट्री सक्रिय',
      m3Title: 'सेक्टर एवेन्यू में प्रवेश',
      m3Desc: 'ग्राहक के 500 मीटर के दायरे में आगमन',
      m4Title: 'दरवाजे पर आगमन',
      m4Desc: 'सुरक्षा पिन सत्यापन एवं ऑन-साइट निरीक्षण',
      workflowActions: 'कार्य प्रवाह क्रियाएं',
      startTripBroadcast: 'यात्रा शुरू करें व लाइव जीपीएस साझा करें',
      confirmArrivalPremises: 'परिसर में आगमन की पुष्टि करें',
      stage2Title: 'चरण 2: मौके पर समस्या पहचान जारी',
      advancePaid: 'अग्रिम भुगतान:',
      stage2Help: 'कारीगर पहुंच चुके हैं। मौके पर खराबी की जांच के बाद, अंतिम दर तय करने के लिए बहुविकल्पीय समस्या फॉर्म भरें।',
      fillDiagnosisBtn: 'पहचानी गई समस्या की सूची भरें (MCQ)',
      notifyDiagComplete: 'ग्राहक को सूचित करें: समस्या पहचान पूर्ण',
      confirmedFaultTitle: 'पहचानी गई समस्या एवं तय सहकारी दर',
      balanceCleared: 'अंतिम भुगतान संपन्न:',
      markWorkCompleted: 'कार्य समापन दर्ज करें',
      rateReviewWorker: 'सहकारी श्रमिक को रेटिंग व समीक्षा दें',
      shareModalTitle: 'लाइव ट्रैकिंग साझा करें',
      shareModalDesc: 'इस लिंक द्वारा कोई भी वास्तविक समय में कारीगर के आगमन की निगरानी कर सकता है।',
      copyLink: 'कॉपी करें',
      copiedLink: 'कॉपी हो गया!',
      shareWhatsapp: 'व्हाट्सएप पर साझा करें',
      sosModalTitle: 'सहकारी आपातकालीन एसओएस प्रतिक्रिया',
      sosModalSubtitle: 'त्वरित भू-स्थान सुरक्षा प्रसारण',
      sosCallPolice: 'पुलिस को कॉल करें (112)',
      sosCallCoop: 'सहकारी हेल्पलाइन',
      sosDismiss: 'खारिज करें / गलती से दबा',
    },
    footer: {
      backToHome: '← सेवाएं और बुकिंग पर वापस जाएं',
      backToWorkerConsole: '← श्रमिक कंसोल पर वापस जाएं',
      empoweringText: 'लोकतांत्रिक सहकारी समितियों के माध्यम से भारत के कुशल कार्यबल का सशक्तीकरण। सहकारी समिति अधिनियम के तहत पंजीकृत।',
      regNumber: 'पंजीकरण संख्या: DLACS-1994-049/MSCS • NLCF सदस्य #1402',
      coopWelfareTitle: 'सहकारी कल्याण',
      welfareItem1: 'दुर्घटना एवं स्वास्थ्य बीमा कोष',
      welfareItem2: 'बच्चों की शिक्षा छात्रवृत्ति',
      welfareItem3: 'आधुनिक उपकरण खरीद सब्सिडी',
      welfareItem4: 'विनियमित न्यूनतम पारिश्रमिक गारंटी',
      welfareItem5: 'वृद्धावस्था पेंशन आरक्षित कोष',
      consumerSafetyTitle: 'उपभोक्ता सुरक्षा',
      safetyItem1: '100% पुलिस एवं सीआईडी चरित्र सत्यापन',
      safetyItem2: 'मान्यता प्राप्त व्यावसायिक कौशल परीक्षण',
      safetyItem3: 'शून्य सर्ज मूल्य निर्धारण गारंटी',
      safetyItem4: 'शिकायत निवारण स्वतंत्र लोकपाल',
      safetyItem5: 'जीपीएस इन-ट्रांजिट सुरक्षा ट्रैकिंग',
      supportDeskTitle: 'सहायता एवं सत्यापन केंद्र',
      tollFree: '1800-419-COOP (टोल फ्री)',
      supportHours: 'नागरिकों व कारीगरों के लिए 24x7 उपलब्ध',
      emergencyAvailable: 'आपातकालीन एसओएस प्रतिक्रिया उपलब्ध',
      copyright: '© 2026 श्रम सहकारी समिति महासंघ लिमिटेड। सर्वाधिकार सुरक्षित।',
      actCompliance: 'सहकारी समिति अधिनियम अनुपालन',
      welfareAct: 'श्रमिक कल्याण कोष अधिनियम',
      dataPrivacy: 'डेटा सुरक्षा एवं जीपीएस गोपनीयता',
      bottomGovtNote: 'राष्ट्रीय श्रम सहकारी संघ (NLCF) एवं राज्य समितियां पहल',
      verifiedWorkersBadge: '100% सत्यापित श्रमिक',
      zeroCommissionBadge: 'शून्य बिचौलिया कमीशन',
      helplineBadge: 'हेल्पलाइन: 1800-11-2026 (टोल फ्री)',
    },
    common: {
      back: 'वापस',
      next: 'आगे बढ़ें',
      cancel: 'रद्द करें',
      close: 'बंद करें',
      submit: 'जमा करें',
      confirm: 'पुष्टि करें',
      step: 'चरण',
      of: 'का',
      rupeeSymbol: '₹',
      all: 'सभी',
      showAll: 'सभी श्रेणियां देखें',
    },
  },

  pa: {
    appName: 'ਸਹਿਕਾਰੀ ਕਿਰਤ ਸੇਵਾ ਬਾਜ਼ਾਰ',
    appSubheading: 'ਸਰਕਾਰ ਅਤੇ ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਸਮਰਥਿਤ ਕਿਰਤੀ ਭਲਾਈ ਮੰਚ',
    tagline: 'ਭਰੋਸਾ • ਕਿਰਤੀ ਭਲਾਈ • ਬਰਾਬਰ ਕੰਮ ਵੰਡ • ਖਪਤਕਾਰ ਸੁਰੱਖਿਆ • ਸਹਿਕਾਰੀ ਮਲਕੀਅਤ',
    emergencyBtn: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾ (EMERGENCY)',
    emergencyTagline: 'ਸਭ ਤੋਂ ਨੇੜਲੇ ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ ਦੁਆਰਾ 15-25 ਮਿੰਟਾਂ ਵਿੱਚ ਤੁਰੰਤ ਸੇਵਾ',
    searchPlaceholder: 'ਬਿਜਲੀ ਮਿਸਤਰੀ, ਪਲੰਬਰ, ਤਰਖਾਣ, ਸਫ਼ਾਈ, ਡਰਾਈਵਰ ਲੱਭੋ...',
    selectLocation: 'ਵਾਰਡ / ਸੈਕਟਰ ਚੁਣੋ',
    allServices: 'ਸੇਵਾ ਸ਼੍ਰੇਣੀਆਂ',
    verifiedWorkerBadge: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਹਿਕਾਰੀ ਕਾਰੀਗਰ',
    bookNow: 'ਸੇਵਾ ਬੁੱਕ ਕਰੋ',
    viewProfile: 'ਪ੍ਰੋਫਾਈਲ ਵੇਖੋ',
    experience: 'ਤਜਰਬਾ',
    rating: 'ਰੇਟਿੰਗ',
    jobsCompleted: 'ਮੁਕੰਮਲ ਕੰਮ',
    startingFrom: 'ਮਿਆਰੀ ਦਰ',
    cooperativeUnit: 'ਸੰਬੰਧਿਤ ਸਹਿਕਾਰੀ ਸਭਾ',
    switchRole: 'ਰੋਲ ਬਦਲੋ (ਡੈਮੋ)',
    trackLiveGPS: 'ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ',
    fairWorkDistribution: 'ਨਿਰਪੱਖ ਕੰਮ ਵੰਡ',
    fairWorkDesc: 'ਸਾਰੇ ਸਹਿਕਾਰੀ ਮੈਂਬਰਾਂ ਵਿੱਚ ਬਿਨਾਂ ਸ਼ੋਸ਼ਣ ਅਤੇ ਨਿਰਪੱਖਤਾ ਨਾਲ ਕੰਮ ਦੀ ਵੰਡ।',
    welfareGuaranteed: 'ਕਿਰਤੀ ਭਲਾਈ ਅਤੇ ਸਿਹਤ ਬੀਮਾ',
    welfareDesc: 'ਹਰੇਕ ਬੁਕਿੰਗ ਤੋਂ ਪੈਨਸ਼ਨ, ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਅਤੇ ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ ਫੰਡ ਵਿੱਚ ਸਿੱਧਾ ਯੋਗਦਾਨ।',
    directWorkerPayout: 'ਪਾਰਦਰਸ਼ੀ ਸਿੱਧਾ ਭੁਗਤਾਨ',
    directWorkerDesc: 'ਕਿਰਤੀਆਂ ਨੂੰ 90% ਤੱਕ ਸਿੱਧੀ ਅਦਾਇਗੀ। ਕੋਈ ਲੁਕਵੀਂ ਕਟੌਤੀ ਨਹੀਂ।',
    customerSafety: '100% ਪੁਲਿਸ ਅਤੇ ਹੁਨਰ ਤਸਦੀਕਸ਼ੁਦਾ',
    customerSafetyDesc: 'ਪੂਰੀ ਜਾਂਚ-ਪੜਤਾਲ ਅਤੇ ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ ਨਾਲ ਸੁਰੱਖਿਅਤ ਸੇਵਾ।',
    howItWorks: 'ਸਹਿਕਾਰੀ ਸੇਵਾ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ',
    popularServices: 'ਮਕਬੂਲ ਸੇਵਾਵਾਂ',
    nearbyWorkers: 'ਨੇੜਲੇ ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ',
    reviewsTitle: 'ਗਾਹਕ ਰੇਟਿੰਗ ਅਤੇ ਰਾਏ',
    fileComplaint: 'ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਕੇਂਦਰ',
    complaintsHistory: 'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ',
    payDigitally: 'ਯੂਪੀਆਈ / ਕਾਰਡ / ਨੈੱਟ ਬੈਂਕਿੰਗ ਰਾਹੀਂ ਭੁਗਤਾਨ',
    viewInvoice: 'ਸਹਿਕਾਰੀ ਰਸੀਦ / ਬਿੱਲ',
    roles: {
      customer: 'ਗਾਹਕ',
      worker: 'ਸਹਿਕਾਰੀ ਕਿਰਤੀ',
    },
    categories: {
      Electrical: 'ਬਿਜਲੀ ਕਾਰੀਗਰ (ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ)',
      Plumbing: 'ਪਲੰਬਰ ਅਤੇ ਪਾਈਪ ਫਿਟਿੰਗ',
      Carpentry: 'ਤਰਖਾਣ ਅਤੇ ਲੱਕੜ ਦਾ ਕੰਮ',
      Painting: 'ਰੰਗ-ਰੋਗਨ (ਪੇਂਟਰ)',
      Cleaning: 'ਸਫ਼ਾਈ ਅਤੇ ਸੈਨੀਟੇਸ਼ਨ',
      Gardening: 'ਬਾਗਬਾਨੀ ਅਤੇ ਮਾਲੀ',
      Driving: 'ਡਰਾਈਵਰ ਸੇਵਾ',
      'Domestic Help': 'ਘਰੇਲੂ ਅਤੇ ਰਸੋਈ ਸਹਾਇਕ',
      Technician: 'ਉਪਕਰਣ ਅਤੇ ਏਸੀ ਤਕਨੀਸ਼ੀਅਨ',
      Other: 'ਹੋਰ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰ',
    },
    bookingStatuses: {
      Requested: 'ਬੇਨਤੀ ਭੇਜੀ ਗਈ',
      Accepted: 'ਕਾਰੀਗਰ ਵੱਲੋਂ ਪ੍ਰਵਾਨਿਤ',
      'Worker On The Way': 'ਕਾਰੀਗਰ ਰਸਤੇ ਵਿੱਚ ਹੈ (ਲਾਈਵ GPS)',
      Arrived: 'ਕਾਰੀਗਰ ਪਹੁੰਚ ਗਿਆ ਹੈ',
      Diagnosing: 'ਮੌਕੇ ਤੇ ਨਿਰੀਖਣ ਜਾਰੀ',
      'Diagnosis Completed': 'ਨਿਰੀਖਣ ਮੁਕੰਮਲ (MCQ ਤਸਦੀਕਸ਼ੁਦਾ)',
      'Work Started': 'ਕੰਮ ਚੱਲ ਰਿਹਾ ਹੈ',
      'Work Completed': 'ਕੰਮ ਮੁਕੰਮਲ ਹੋਇਆ',
      'Payment Completed': 'ਭੁਗਤਾਨ ਮੁਕੰਮਲ',
      Cancelled: 'ਰੱਦ ਕੀਤਾ ਗਿਆ',
      Disputed: 'ਸਮੀਖਿਆ ਅਧੀਨ / ਝਗੜਾ',
    },
    complaintStatuses: {
      Submitted: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਹੋਈ',
      'Under Review': 'ਜਾਂਚ ਅਧੀਨ',
      Resolved: 'ਹੱਲ ਹੋ ਚੁੱਕੀ ਹੈ',
      Rejected: 'ਰੱਦ ਕੀਤੀ ਗਈ',
      Escalated: 'ਫੈਡਰੇਸ਼ਨ ਨੂੰ ਭੇਜੀ ਗਈ',
    },
    nav: {
      brandSubtitle: 'ਸਹਿਕਾਰੀ ਕਿਰਤ ਸੇਵਾ ਬਾਜ਼ਾਰ',
      allZones: 'ਸਾਰੇ ਸੇਵਾ ਖੇਤਰ (ਐਨਸੀਆਰ ਅਤੇ ਟ੍ਰਾਈਸਿਟੀ)',
      northDelhi: 'ਉੱਤਰੀ ਦਿੱਲੀ (ਰੋਹਿਣੀ, ਪੀਤਮਪੁਰਾ)',
      southDelhi: 'ਦੱਖਣੀ ਦਿੱਲੀ (ਸਾਕਤੇ, ਲਾਜਪਤ ਨਗਰ)',
      westDelhi: 'ਪੱਛਮੀ ਦਿੱਲੀ (ਜਨਕਪੁਰੀ, ਦਵਾਰਕਾ)',
      eastDelhi: 'ਪੂਰਬੀ ਦਿੱਲੀ ਅਤੇ ਨੋਇਡਾ',
      mohali: 'ਮੋਹਾਲੀ ਅਤੇ ਚੰਡੀਗੜ੍ਹ ਟ੍ਰਾਈਸਿਟੀ',
      gurugram: 'ਗੁਰੂਗ੍ਰਾਮ (ਡੀਐਲਐਫ ਅਤੇ ਸੈਕਟਰ 14-31)',
      serviceZoneLabel: 'ਸੇਵਾ ਖੇਤਰ',
      exploreBook: 'ਸੇਵਾਵਾਂ ਵੇਖੋ ਅਤੇ ਬੁੱਕ ਕਰੋ',
      verifiedWorkers: 'ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ ਸੂਚੀ',
      liveGpsTracking: 'ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ',
      myBookings: 'ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ ਅਤੇ ਬਿੱਲ',
      grievanceDesk: 'ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਕੇਂਦਰ',
      workerJobConsole: 'ਕਾਰੀਗਰ ਕੰਮ ਕੰਸੋਲ',
      activeTripGps: 'ਸਰਗਰਮ ਯਾਤਰਾ ਅਤੇ ਜੀਪੀਐਸ',
      welfareSchemes: 'ਭਲਾਈ, ਬੀਮਾ ਅਤੇ ਸਕੀਮਾਂ',
      fileGrievance: 'ਕੰਮ ਵਾਲੀ ਥਾਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
      fairWorkAlgoActive: 'ਬਰਾਬਰ ਕੰਮ ਵੰਡ ਐਲਗੋਰਿਦਮ: ਸਰਗਰਮ',
      coopNotifs: 'ਸਹਿਕਾਰੀ ਸੂਚਨਾਵਾਂ',
      alertsCount: 'ਅਲਰਟ',
      verifiedWorkerTag: 'ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ',
      registeredCustomerTag: 'ਰਜਿਸਟਰਡ ਗਾਹਕ',
      policeCoopVerified: 'ਪੁਲਿਸ ਅਤੇ ਸਹਿਕਾਰੀ ਤਸਦੀਕਸ਼ੁਦਾ',
      activeAccount: 'ਸਰਗਰਮ ਖਾਤਾ',
      phoneLabel: 'ਫ਼ੋਨ:',
      emailLabel: 'ਈਮੇਲ:',
      locationLabel: 'ਟਿਕਾਣਾ:',
      primaryTradeLabel: 'ਮੁੱਖ ਕਿੱਤਾ:',
      coopMemberIdLabel: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਆਈਡੀ:',
      primaryCoopLabel: 'ਮੁੱਖ ਸਹਿਕਾਰੀ ਸਭਾ:',
      ombudsmanGrievances: 'ਲੋਕਪਾਲ ਅਤੇ ਸ਼ਿਕਾਇਤਾਂ',
      welfareHealthcareFund: 'ਭਲਾਈ ਅਤੇ ਸਿਹਤ ਸੰਭਾਲ ਫੰਡ',
      logout: 'ਲਾਗ ਆਉਟ',
      logoutSwitch: 'ਲਾਗ ਆਉਟ / ਵਰਤੋਂਕਾਰ ਬਦਲੋ',
    },
    hero: {
      badge: 'ਸਰਕਾਰ ਅਤੇ ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਸਮਰਥਿਤ ਕਿਰਤੀ ਭਲਾਈ ਸੇਵਾ',
      title: 'ਘਰਾਂ ਅਤੇ ਅਦਾਰਿਆਂ ਲਈ ਪ੍ਰਮਾਣਿਤ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰ।',
      description:
        'ਆਈਟੀਆਈ-ਪ੍ਰਮਾਣਿਤ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ, ਤਰਖਾਣ ਅਤੇ ਤਕਨੀਸ਼ੀਅਨਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ। ਕੋਈ ਵਿਚੋਲਾ ਨਹੀਂ — ਕਾਰੀਗਰਾਂ ਨੂੰ 90% ਤੱਕ ਸਿੱਧੀ ਅਦਾਇਗੀ ਜੋ ਉਨ੍ਹਾਂ ਦੀ ਪੈਨਸ਼ਨ ਅਤੇ ਸਿਹਤ ਸੁਰੱਖਿਅਤ ਕਰਦੀ ਹੈ।',
      findWorkerBtn: 'ਕਾਰੀਗਰ ਲੱਭੋ',
      clearBtn: 'ਸਾਫ਼ ਕਰੋ',
      policeVerifiedBadge: '100% ਪੁਲਿਸ ਅਤੇ ਹੁਨਰ ਤਸਦੀਕਸ਼ੁਦਾ',
      fixedTariffsBadge: 'ਸਹਿਕਾਰੀ ਨਿਯੰਤਰਿਤ ਦਰਾਂ',
      liveGpsBadge: 'ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ',
      welfareComplianceBadge: 'ਕਿਰਤੀ ਭਲਾਈ ਨਿਯਮਾਂ ਅਧੀਨ',
    },
    tickers: [
      { text: 'ਰੋਹਿਣੀ ਤੋਂ ਪੂਜਾ ਨੇ 3 ਮਿੰਟ ਪਹਿਲਾਂ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ ਬੁੱਕ ਕੀਤਾ (ਜ਼ਰੂਰੀ ਸੇਵਾ)', tag: 'ਲਾਈਵ ਬੁਕਿੰਗ' },
      { text: 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ (ਪਲੰਬਰ) ਨੂੰ 5.0★ ਮਿਲਿਆ: "ਕੋਈ ਵਾਧੂ ਖਰਚਾ ਨਹੀਂ, ਸ਼ਾਨਦਾਰ ਕੰਮ"', tag: '5-ਸਟਾਰ ਰੇਟਿੰਗ' },
      { text: 'ਦਿੱਲੀ ਐਨਸੀਆਰ ਅਤੇ ਮੋਹਾਲੀ ਵਿੱਚ 48 ਕਾਰੀਗਰ ਡਿਊਟੀ ਤੇ ਹਨ', tag: 'ਸਰਗਰਮ ਕਾਰੀਗਰ' },
      { text: 'ਇਸ ਤਿਮਾਹੀ ਵਿੱਚ ₹14.2 ਲੱਖ ਕਿਰਤੀ ਭਲਾਈ ਫੰਡ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੋਏ', tag: 'ਸਮਾਜਿਕ ਪ੍ਰਭਾਵ' },
    ],
    diagnoser: {
      badge: 'ਤੁਰੰਤ ਸਮੱਸਿਆ ਨਿਰੀਖਣ',
      title: 'ਘਰੇਲੂ ਮੁਰੰਮਤ ਅਤੇ ਤੁਰੰਤ ਹੱਲ',
      subtitle: 'ਪਾਰਦਰਸ਼ੀ ਦਰਾਂ ਤੇ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰ ਚੁਣਨ ਲਈ ਆਪਣੀ ਸਮੱਸਿਆ ਚੁਣੋ',
      zeroSurgeTag: 'ਕੋਈ ਪੀਕ ਜਾਂ ਸਰਜ ਰੇਟ ਨਹੀਂ',
      standardTariff: 'ਮਿਆਰੀ ਸਹਿਕਾਰੀ ਦਰ',
      oneTapMatch: 'ਕਾਰੀਗਰ ਚੁਣੋ →',
      issues: [
        {
          id: 'diag-mcb',
          title: 'ਸਪਾਰਕਿੰਗ ਐਮਸੀਬੀ / ਬਿਜਲੀ ਟ੍ਰਿਪਿੰਗ',
          subtitle: 'ਸ਼ਾਰਟ ਸਰਕਟ, ਸਵਿੱਚਬੋਰਡ ਗਰਮ ਹੋਣਾ, ਫਿਊਜ਼ ਉੱਡਣਾ',
          badge: '15-30 ਮਿੰਟ ਵਿੱਚ ਪਹੁੰਚ',
        },
        {
          id: 'diag-leak',
          title: 'ਕੰਧ ਅੰਦਰ ਪਾਈਪ ਲੀਕੇਜ / ਟੂਟੀ ਜਾਮ',
          subtitle: 'ਪਾਣੀ ਦਾ ਰਿਸਾਵ, ਸਿੰਕ ਡਰੇਨੇਜ, ਸ਼ਾਵਰ ਵਿੱਚ ਘੱਟ ਪ੍ਰੈਸ਼ਰ',
          badge: 'ਸਭ ਤੋਂ ਵੱਧ ਬੁੱਕ',
        },
        {
          id: 'diag-wood',
          title: 'ਦਰਵਾਜ਼ੇ ਦਾ ਲੌਕ ਜਾਮ / ਕਬਜ਼ੇ ਦੀ ਮੁਰੰਮਤ',
          subtitle: 'ਅਲਮਾਰੀ ਮੁਰੰਮਤ, ਖਿੜਕੀ ਦੀ ਕੁੰਡੀ, ਢਿੱਲੀ ਲੱਕੜ ਫਿਟਿੰਗ',
          badge: 'ਮਾਹਰ ਤਰਖਾਣ',
        },
        {
          id: 'diag-appliance',
          title: 'ਏਸੀ ਕੂਲਿੰਗ ਨਹੀਂ / ਗੈਸ ਲੀਕੇਜ',
          subtitle: 'ਮਾਈਕ੍ਰੋਵੇਵ, ਗੀਜ਼ਰ ਥਰਮੋਸਟੈਟ, ਵਾਸ਼ਿੰਗ ਮਸ਼ੀਨ ਪੀਸੀਬੀ',
          badge: 'ਪ੍ਰਮਾਣਿਤ ਆਈਟੀਆਈ',
        },
        {
          id: 'diag-clean',
          title: 'ਘਰ ਅਤੇ ਰਸੋਈ ਦੀ ਡੀਪ ਕਲੀਨਿੰਗ',
          subtitle: 'ਫ਼ਰਸ਼ ਸਕ੍ਰਬਿੰਗ, ਟਾਈਲ ਸਫ਼ਾਈ, ਰਸੋਈ ਗਰੀਸ ਹਟਾਉਣਾ',
          badge: 'ਗਹਿਰੀ ਸਵੱਛਤਾ',
        },
        {
          id: 'diag-paint',
          title: 'ਕੰਧਾਂ ਦੀ ਸਿੱਲ੍ਹ ਅਤੇ ਨਮੀ ਦਾ ਇਲਾਜ',
          subtitle: 'ਤ੍ਰੇੜਾਂ ਦੀ ਪੁਟੀ, ਐਂਟੀ-ਫੰਗਲ ਵਾਟਰਪਰੂਫਿੰਗ',
          badge: 'ਸਿੱਲ੍ਹ-ਰੋਕੂ',
        },
      ],
    },
    calculator: {
      badge: 'ਪਾਰਦਰਸ਼ੀ ਕੀਮਤ ਅਤੇ ਸਮਾਜਿਕ ਪ੍ਰਭਾਵ ਕੈਲਕੁਲੇਟਰ',
      title: 'ਵੇਖੋ ਤੁਹਾਡਾ ਇੱਕ-ਇੱਕ ਰੁਪਿਆ ਕਿੱਥੇ ਜਾਂਦਾ ਹੈ।',
      subtitle:
        'ਨਿੱਜੀ ਕੰਪਨੀਆਂ 35% ਤੱਕ ਕਮਿਸ਼ਨ ਲੈਂਦੀਆਂ ਹਨ। ਸ਼੍ਰਮਸੇਤੂ ਦੇ ਸਹਿਕਾਰੀ ਮਾਡਲ ਅਧੀਨ 98% ਸਿੱਧਾ ਕਾਰੀਗਰ ਅਤੇ ਭਲਾਈ ਫੰਡ ਕੋਲ ਰਹਿੰਦਾ ਹੈ।',
      tradeLabel: 'ਕੰਮ ਸ਼੍ਰੇਣੀ',
      complexityLabel: 'ਕੰਮ ਦਾ ਪੱਧਰ',
      optMinor: 'ਮਿਆਰੀ ਨਿਰੀਖਣ / ਛੋਟੀ ਮੁਰੰਮਤ',
      optMedium: 'ਆਮ ਦਰਮਿਆਨਾ ਕੰਮ',
      optExtensive: 'ਵੱਡਾ ਸਮੁੱਚਾ ਮੁਰੰਮਤ ਕੰਮ',
      coopTitle: 'ਸ਼੍ਰਮਸੇਤੂ ਸਹਿਕਾਰੀ ਸਭਾ',
      totalStandardFee: 'ਕੁੱਲ ਮਿਆਰੀ ਫੀਸ',
      regulatedTariff: 'ਨਿਯਮਿਤ ਦਰ',
      directTakeHome: 'ਕਾਰੀਗਰ ਦਾ ਸਿੱਧਾ ਹਿੱਸਾ (90%):',
      welfarePool: 'ਕਿਰਤੀ ਪੈਨਸ਼ਨ ਅਤੇ ਸਿਹਤ ਬੀਮਾ ਫੰਡ (8%):',
      adminGst: 'ਪ੍ਰਬੰਧਕੀ ਜੀਐਸਟੀ ਅਤੇ ਪੋਰਟਲ ਸਾਂਭ-ਸੰਭਾਲ (2%):',
      bookAtTariff: 'ਮਿਆਰੀ ਦਰ ਤੇ ਬੁੱਕ ਕਰੋ',
      privateTitle: 'ਨਿੱਜੀ ਕੰਪਨੀਆਂ',
      estimatedSurge: 'ਵਾਧੂ ਸਰਜ ਰੇਟ ਸਮੇਤ',
      surgeMarkup: 'ਸਰਜ ਕਮਿਸ਼ਨ',
      privateWorkerCut: 'ਐਪ ਕਮਿਸ਼ਨ ਤੋਂ ਬਾਅਦ ਕਾਰੀਗਰ ਦਾ ਹਿੱਸਾ (~65%):',
      corporateCut: 'ਕਾਰਪੋਰੇਟ ਕਮਿਸ਼ਨ (25-35%):',
      zeroSafetyNet: '₹0 (ਕੋਈ ਸੁਰੱਖਿਆ ਨਹੀਂ)',
      savingsBanner: 'ਸ਼੍ਰਮਸੇਤੂ ਰਾਹੀਂ ਬੁੱਕ ਕਰਕੇ ਤੁਸੀਂ ਬੱਚਤ ਕਰਦੇ ਹੋ ਅਤੇ ਕਾਰੀਗਰਾਂ ਨੂੰ 35%+ ਵੱਧ ਕਮਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹੋ।',
    },
    assistance: {
      badge: 'ਸਮਰਪਿਤ ਗਾਹਕ ਸਹਾਇਤਾ ਅਤੇ ਸੁਰੱਖਿਆ',
      title: 'ਹਮੇਸ਼ਾ ਸੁਰੱਖਿਅਤ। ਮਿੰਟਾਂ ਵਿੱਚ ਮਨੁੱਖੀ ਸਹਾਇਤਾ।',
      subtitle:
        'ਕੋਈ ਕੰਪਿਊਟਰ ਬੋਟ ਨਹੀਂ। ਸਹਿਕਾਰੀ ਸਭਾ ਵਜੋਂ, ਸਾਡਾ ਲੋਕਪਾਲ ਪਾਰਦਰਸ਼ੀ ਨਿਪਟਾਰਾ ਅਤੇ 24/7 ਮਨੁੱਖੀ ਸਹਾਇਤਾ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।',
      callBtn: '1800-419-COOP',
      raiseTicketBtn: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
      c1Title: 'ਟੋਲ-ਫ੍ਰੀ 24x7 ਹੈਲਪਲਾਈਨ',
      c1Desc: 'ਐਮਰਜੈਂਸੀ ਪਲੰਬਿੰਗ, ਬਿਜਲੀ ਫਾਲਟ ਲਈ ਸਿੱਧੇ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਗੱਲ ਕਰੋ।',
      c1Action: '1800-419-COOP ਤੇ ਕਾਲ ਕਰੋ',
      c2Title: 'ਵਟਸਐਪ ਫੋਟੋ ਨਿਰੀਖਣ',
      c2Desc: 'ਨੁਕਸ ਦੀ 10-ਸਕਿੰਟ ਦੀ ਵੀਡੀਓ ਜਾਂ ਫੋਟੋ ਭੇਜੋ। ਸਾਡੇ ਮਾਹਰ ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਗੇ।',
      c2Action: 'ਵਟਸਐਪ ਤੇ ਚੈਟ ਕਰੋ',
      c3Title: '30-ਦਿਨ ਮੁਫ਼ਤ ਮੁੜ-ਕੰਮ ਕਵਰ',
      c3Desc: 'ਜੇਕਰ ਠੀਕ ਕੀਤਾ ਨੁਕਸ 30 ਦਿਨਾਂ ਵਿੱਚ ਦੁਬਾਰਾ ਆਉਂਦਾ ਹੈ, ਤਾਂ ਕਾਰੀਗਰ ਬਿਨਾਂ ਕਿਸੇ ਵਾਧੂ ਖਰਚੇ ਦੇ ਇਸਨੂੰ ਦੁਬਾਰਾ ਠੀਕ ਕਰੇਗਾ।',
      c3Badge: 'ਸਾਰੀਆਂ ਬੁਕਿੰਗਾਂ ਤੇ ਲਾਗੂ',
      c4Title: 'ਲੋਕਪਾਲ ਅਤੇ ਸਮਝੌਤਾ ਬੋਰਡ',
      c4Desc: 'ਸੇਵਾ ਤੋਂ ਅਸੰਤੁਸ਼ਟ ਹੋ? ਸਾਡੀ ਕਮੇਟੀ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਨਿਰਪੱਖ ਹੱਲ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ।',
      c4Action: 'ਵਿਵਾਦ ਟਿਕਟ ਖੋਲ੍ਹੋ',
    },
    coopVsGig: {
      title: 'ਸਹਿਕਾਰੀ ਕਿਰਤ ਮਾਡਲ ਨਿੱਜੀ ਐਗਰੀਗੇਟਰਾਂ ਨਾਲੋਂ ਬਿਹਤਰ ਕਿਉਂ ਹੈ',
      subtitle: 'ਕਿਰਤੀਆਂ ਦੁਆਰਾ ਲੋਕਤੰਤਰੀ ਢੰਗ ਨਾਲ ਚਲਾਇਆ ਜਾਂਦਾ, ਸਹਿਕਾਰੀ ਕਾਨੂੰਨਾਂ ਅਧੀਨ ਨਿਯੰਤਰਿਤ।',
      p1Title: '100% ਪਿਛੋਕੜ ਜਾਂਚ',
      p1Desc: 'ਹਰ ਮੈਂਬਰ ਕਾਰੀਗਰ ਦੀ ਪੁਲਿਸ ਜਾਂਚ ਅਤੇ ਹੁਨਰ ਟੈਸਟ ਹੁੰਦਾ ਹੈ।',
      p2Title: 'ਸਮਾਜਿਕ ਭਲਾਈ ਫੰਡ',
      p2Desc: 'ਹਰੇਕ ਬੁਕਿੰਗ ਦਾ 8% ਸਿੱਧਾ ਕਾਰੀਗਰ ਬੀਮਾ ਅਤੇ ਬੱਚਿਆਂ ਦੇ ਵਜ਼ੀਫ਼ਿਆਂ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।',
      p3Title: 'ਬਰਾਬਰ ਕੰਮ ਵੰਡ',
      p3Desc: 'ਸਾਰੇ ਕਾਰੀਗਰਾਂ ਨੂੰ ਬਿਨਾਂ ਬੋਲੀ ਲਗਾਏ ਨਿਯਮਿਤ ਕੰਮ ਅਤੇ ਇੱਜ਼ਤਦਾਰ ਰੋਜ਼ੀ-ਰੋਟੀ ਮਿਲਦੀ ਹੈ।',
      p4Title: 'ਲੋਕਤੰਤਰੀ ਮਲਕੀਅਤ',
      p4Desc: 'ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਐਕਟ ਅਧੀਨ ਚੁਣੇ ਹੋਏ ਨੁਮਾਇੰਦਿਆਂ ਦੁਆਰਾ ਸੰਚਾਲਨ।',
    },
    directory: {
      availableCount: 'ਉਪਲਬਧ',
      subtext: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਹਿਕਾਰੀ ਮੈਂਬਰ • ਨਿਰਪੱਖ ਕੰਮ ਵੰਡ',
      zoneLabel: 'ਖੇਤਰ:',
      noWorkersTitle: 'ਚੋਣਵੇਂ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਕਾਰੀਗਰ ਨਹੀਂ ਮਿਲਿਆ।',
      noWorkersSubtext: 'ਕਿਰਪਾ ਕਰਕੇ ਕੰਮ ਸ਼੍ਰੇਣੀ ਬਦਲੋ ਜਾਂ "ਸਾਰੇ ਸੇਵਾ ਖੇਤਰ" ਚੁਣੋ।',
      resetFiltersBtn: 'ਫਿਲਟਰ ਹਟਾਓ',
      jobsSuffix: 'ਕੰਮ',
      expSuffix: 'ਸਾਲ ਤਜਰਬਾ',
      baseSuffix: '/ ਅਧਾਰ',
    },
    bookingsSection: {
      title: 'ਹਾਲੀਆ ਗਾਹਕ ਬੁਕਿੰਗਾਂ',
      subtitle: 'ਸਰਗਰਮ ਯਾਤਰਾ ਟਰੈਕ ਕਰੋ, ਡਿਜੀਟਲ ਬਿੱਲ ਵੇਖੋ ਅਤੇ ਰੇਟਿੰਗ ਦਿਓ',
      emptyText: 'ਅਜੇ ਤੱਕ ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ ਹੋਈ। ਆਪਣਾ ਪਹਿਲਾ ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ ਬੁੱਕ ਕਰਨ ਲਈ ਉੱਪਰੋਂ ਸੇਵਾ ਚੁਣੋ!',
      workerLabel: 'ਕਾਰੀਗਰ:',
      openGpsBtn: 'ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ ਖੋਲ੍ਹੋ',
      fillDiagnosisBtn: 'ਪਛਾਣੀ ਗਈ ਸਮੱਸਿਆ ਚੁਣੋ (MCQ)',
      rateReviewBtn: 'ਕਾਰੀਗਰ ਨੂੰ ਰੇਟਿੰਗ ਦਿਓ',
      viewInvoiceBtn: 'ਬਿੱਲ ਵੇਖੋ',
    },
    workerDashboard: {
      panelTitle: 'ਕਾਰੀਗਰ ਕੰਸੋਲ',
      verifiedMember: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਹਿਕਾਰੀ ਮੈਂਬਰ',
      primaryTrade: 'ਮੁੱਖ ਕਿੱਤਾ:',
      lifetimeJobs: 'ਕੁੱਲ ਮੁਕੰਮਲ ਕੰਮ',
      dutyAvailability: 'ਡਿਊਟੀ ਉਪਲਬਧਤਾ:',
      onDuty: 'ਡਿਊਟੀ ਤੇ (ਕੰਮ ਪ੍ਰਾਪਤ ਹੋ ਰਹੇ ਹਨ)',
      offDuty: 'ਡਿਊਟੀ ਬੰਦ (ਆਰਾਮ ਤੇ)',
      queueRank: 'ਨਿਰਪੱਖ ਵੰਡ ਕਤਾਰ ਰੈਂਕ: ਖੇਤਰ ਵਿੱਚ #1',
      netEarnings: 'ਕੁੱਲ ਕਿਰਤੀ ਕਮਾਈ',
      directBankCredit: '90% ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ',
      welfarePool: 'ਭਲਾਈ ਫੰਡ ਜਮ੍ਹਾਂ',
      medicalPensionCess: 'ਮੈਡੀਕਲ ਅਤੇ ਪੈਨਸ਼ਨ ਸੈੱਸ',
      accidentInsurance: 'ਹਾਦਸਾ ਬੀਮਾ',
      insuranceCover: '₹5,00,000 ਕਵਰ',
      insurancePolicy: 'ਪੀਐਮਐਸਬੀਵਾਈ + ਸਭਾ ਪਾਲਿਸੀ',
      assignedJobs: 'ਇਸ ਹਫ਼ਤੇ ਮਿਲੇ ਕੰਮ',
      balancedQuota: 'ਸੰਤੁਲਿਤ ਬਰਾਬਰ ਕੋਟਾ',
      tabJobs: 'ਸਰਗਰਮ ਅਤੇ ਤੈਅ ਕੰਮ',
      tabWelfare: 'ਭਲਾਈ ਸਕੀਮਾਂ ਅਤੇ ਦਾਅਵੇ',
      tabEarnings: 'ਕਮਾਈ ਅਤੇ ਭੁਗਤਾਨ ਖਾਤਾ',
      tabProfile: 'ਹੁਨਰ ਅਤੇ ਸਰਟੀਫਿਕੇਟ',
      activeJobTitle: 'ਸਰਗਰਮ ਕੰਮ:',
      emergencySosTag: 'ਐਮਰਜੈਂਸੀ SOS',
      currentStatus: 'ਮੌਜੂਦਾ ਸਥਿਤੀ:',
      customerLoc: 'ਗਾਹਕ ਦਾ ਪਤਾ:',
      zone: 'ਖੇਤਰ:',
      customerLabel: 'ਗਾਹਕ:',
      taskReq: 'ਕੰਮ ਦਾ ਵੇਰਵਾ:',
      scheduledTime: 'ਤੈਅ ਸਮਾਂ:',
      expectedPayout: 'ਅੰਦਾਜ਼ਨ ਕਿਰਤੀ ਮਿਹਨਤਾਨਾ:',
      startTripBtn: 'ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਜੀਪੀਐਸ ਸਾਂਝਾ ਕਰੋ',
      confirmArrivalBtn: 'ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ (ਜੀਪੀਐਸ ਬੰਦ ਕਰੋ)',
      openMapBtn: 'ਲਾਈਵ ਨਕਸ਼ਾ ਵੇਖੋ',
      diagnoseMcqBtn: 'ਸਮੱਸਿਆ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਫਾਰਮ ਖੋਲ੍ਹੋ',
      proceedWorkBtn: 'ਕੰਮ ਸ਼ੁਰੂ ਕਰੋ',
      finishWorkBtn: 'ਕੰਮ ਮੁਕੰਮਲ ਹੋਇਆ',
      reportUnsafeBtn: 'ਅਸੁਰੱਖਿਅਤ ਸਥਿਤੀ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
      allJobsDone: 'ਸਾਰੇ ਤੈਅ ਕੰਮ ਮੁਕੰਮਲ ਹੋ ਚੁੱਕੇ ਹਨ',
      allJobsDoneSub: 'ਤੁਸੀਂ ਡਿਊਟੀ ਤੇ ਹੋ। ਨਵਾਂ ਕੰਮ ਮਿਲਣ ਤੇ ਸਿਸਟਮ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਸੂਚਿਤ ਕਰੇਗਾ।',
      jobHistoryTitle: 'ਕੰਮ ਦਾ ਇਤਿਹਾਸ ਅਤੇ ਭੁਗਤਾਨ ਸਥਿਤੀ',
      settledBank: 'ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੋਇਆ',
      invoiceBtn: 'ਰਸੀਦ',
      socialSecurityTitle: 'ਸਹਿਕਾਰੀ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਕਵਚ',
      socialSecurityDesc: 'ਹਰੇਕ ਸੇਵਾ ਫੀਸ ਦਾ 8% ਤੁਹਾਡੇ ਭਲਾਈ ਫੰਡ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੁੰਦਾ ਹੈ। ਇਸ ਨਾਲ ਪਰਿਵਾਰਕ ਸਿਹਤ ਅਤੇ ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ ਸੁਰੱਖਿਅਤ ਹੁੰਦੀ ਹੈ।',
      submitClaim: 'ਦਾਅਵਾ ਪੇਸ਼ ਕਰੋ / ਅਰਜ਼ੀ ਦਿਓ',
      enrolledMembers: 'ਮੈਂਬਰ ਦਰਜ ਹਨ',
      eligibility: 'ਯੋਗਤਾ:',
      payoutLedgerTitle: 'ਪਾਰਦਰਸ਼ੀ ਭੁਗਤਾਨ ਖਾਤਾ',
      payoutLedgerDesc: 'ਕੋਈ ਲੁਕਵੀਂ ਕਟੌਤੀ ਨਹੀਂ। ਆਈਐਮਪੀਐਸ / ਯੂਪੀਆਈ ਰਾਹੀਂ ਸਿੱਧਾ ਨਿਪਟਾਰਾ।',
      linkedAccount: 'ਜੁੜਿਆ ਬੈਂਕ ਖਾਤਾ: ਸਟੇਟ ਬੈਂਕ ਆਫ ਇੰਡੀਆ •••• 4910',
      totalCharge: 'ਗਾਹਕ ਤੋਂ ਕੁੱਲ ਰਕਮ:',
      welfareCessRow: 'ਭਲਾਈ ਸੈੱਸ (8%):',
      skillsTitle: 'ਹੁਨਰ ਅਤੇ ਤਸਦੀਕ ਸਥਿਤੀ',
      skillsDesc: 'ਪ੍ਰਮਾਣਿਤ ਹੁਨਰ ਸਹਿਕਾਰੀ ਰਜਿਸਟਰ ਵਿੱਚ ਤੁਹਾਡਾ ਮਾਣ ਵਧਾਉਂਦੇ ਹਨ।',
      activeCredentials: 'ਸਰਗਰਮ ਸਰਕਾਰੀ / ਕਿੱਤਾਮੁਖੀ ਸਰਟੀਫਿਕੇਟ',
      verifiedByAdmin: 'ਸਹਿਕਾਰੀ ਪ੍ਰਬੰਧਕ ਵੱਲੋਂ ਤਸਦੀਕਸ਼ੁਦਾ',
      registeredSkills: 'ਦਰਜ ਕੀਤੇ ਕਿੱਤਾਮੁਖੀ ਹੁਨਰ',
      addSkillTitle: 'ਨਵਾਂ ਹੁਨਰ ਜੋੜੋ',
      addSkillPlaceholder: 'ਜੋੜਨ ਲਈ ਸ਼੍ਰੇਣੀ ਚੁਣੋ...',
      addSkillBtn: 'ਹੁਨਰ ਜੋੜੋ',
    },
    tracking: {
      activeTrips: 'ਸਰਗਰਮ ਯਾਤਰਾਵਾਂ',
      privacyNotice: 'ਸਹਿਕਾਰੀ ਜੀਪੀਐਸ ਗੋਪਨੀਯਤਾ ਸਰਗਰਮ',
      privacySubtext: 'ਟਰੈਕਿੰਗ ਸਿਰਫ਼ ਯਾਤਰਾ ਦੌਰਾਨ ਸਰਗਰਮ ਰਹਿੰਦੀ ਹੈ। ਡਿਊਟੀ ਤੋਂ ਬਾਹਰ ਕਾਰੀਗਰ ਦੀ ਲੋਕੇਸ਼ਨ ਰਿਕਾਰਡ ਨਹੀਂ ਹੁੰਦੀ।',
      openGmaps: 'ਗੂਗਲ ਮੈਪਸ ਵਿੱਚ ਖੋਲ੍ਹੋ',
      shareTrip: 'ਲਾਈਵ ਯਾਤਰਾ ਸਾਂਝੀ ਕਰੋ',
      radarTitle: 'ਲਾਈਵ ਰਡਾਰ',
      assignedUnit: 'ਕਾਰੀਗਰ:',
      usingDeviceGps: 'ਮੋਬਾਈਲ ਜੀਪੀਐਸ ਚੱਲ ਰਿਹਾ ਹੈ',
      useDeviceGps: 'ਮੋਬਾਈਲ ਜੀਪੀਐਸ ਵਰਤੋ',
      pause: 'ਰੋਕੋ',
      resume: 'ਜਾਰੀ ਰੱਖੋ',
      transitScrubber: 'ਯਾਤਰਾ ਕੰਟਰੋਲ:',
      routeCompleted: 'ਰਾਹ ਮੁਕੰਮਲ',
      remainingDist: 'ਬਾਕੀ ਦੂਰੀ',
      estimatedArrival: 'ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ',
      arrivedText: 'ਪਹੁੰਚ ਗਏ!',
      minsSuffix: 'ਮਿੰਟ',
      liveVelocity: 'ਮੌਜੂਦਾ ਗਤੀ',
      transitHeading: 'ਦਿਸ਼ਾ',
      verifiedArtisan: 'ਤਸਦੀਕਸ਼ੁਦਾ',
      masterArtisan: 'ਮਾਹਰ ਕਾਰੀਗਰ',
      callWorker: 'ਕਾਲ ਕਰੋ',
      sosBtn: 'SOS',
      doorstepPin: 'ਦਰਵਾਜ਼ਾ ਸੁਰੱਖਿਆ ਪਿੰਨ (PIN)',
      coopProtocol: 'ਸਹਿਕਾਰੀ ਸੁਰੱਖਿਆ ਨਿਯਮ',
      customerPinHelp: 'ਕਾਰੀਗਰ ਦੇ ਆਉਣ ਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਇਹ 4-ਅੰਕਾਂ ਦਾ ਪਿੰਨ ਦੱਸੋ।',
      workerPinPrompt: 'ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਗਾਹਕ ਤੋਂ 4-ਅੰਕਾਂ ਦਾ ਪਿੰਨ ਪੁੱਛੋ:',
      pinPlaceholder: '4-ਅੰਕਾਂ ਦਾ ਪਿੰਨ ਦਰਜ ਕਰੋ',
      verifyPinBtn: 'ਤਸਦੀਕ ਕਰੋ',
      pinVerified: '✓ ਸੁਰੱਖਿਆ ਪਿੰਨ ਤਸਦੀਕ ਹੋਇਆ',
      milestonesTitle: 'ਯਾਤਰਾ ਪੜਾਅ',
      m1Title: 'ਸਹਿਕਾਰੀ ਕੇਂਦਰ ਤੋਂ ਰਵਾਨਗੀ',
      m1Desc: 'ਟੂਲ ਕਿੱਟ ਚੈੱਕ ਅਤੇ ਪਛਾਣ ਪੱਤਰ ਤਸਦੀਕ',
      m2Title: 'ਮੁੱਖ ਸੜਕ ਰਾਹੀਂ ਰਵਾਨਾ',
      m2Desc: 'ਲਾਈਵ ਜੀਪੀਐਸ ਸਰਗਰਮ',
      m3Title: 'ਸੈਕਟਰ ਵਿੱਚ ਦਾਖਲ',
      m3Desc: 'ਗਾਹਕ ਦੇ 500 ਮੀਟਰ ਦੇ ਦਾਇਰੇ ਵਿੱਚ',
      m4Title: 'ਦਰਵਾਜ਼ੇ ਤੇ ਪਹੁੰਚ ਗਏ',
      m4Desc: 'ਸੁਰੱਖਿਆ ਪਿੰਨ ਜਾਂਚ ਅਤੇ ਨਿਰੀਖਣ',
      workflowActions: 'ਕਾਰਵਾਈਆਂ',
      startTripBroadcast: 'ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਜੀਪੀਐਸ ਸਾਂਝਾ ਕਰੋ',
      confirmArrivalPremises: 'ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
      stage2Title: 'ਪੜਾਅ 2: ਮੌਕੇ ਤੇ ਜਾਂਚ ਜਾਰੀ',
      advancePaid: 'ਪੇਸ਼ਗੀ ਦਿੱਤੀ ਗਈ:',
      stage2Help: 'ਕਾਰੀਗਰ ਪਹੁੰਚ ਚੁੱਕੇ ਹਨ। ਜਾਂਚ ਤੋਂ ਬਾਅਦ, ਰੇਟ ਤੈਅ ਕਰਨ ਲਈ ਫਾਰਮ ਭਰੋ।',
      fillDiagnosisBtn: 'ਪਛਾਣੀ ਗਈ ਸਮੱਸਿਆ ਦਾ ਫਾਰਮ ਭਰੋ (MCQ)',
      notifyDiagComplete: 'ਗਾਹਕ ਨੂੰ ਸੂਚਿਤ ਕਰੋ: ਜਾਂਚ ਮੁਕੰਮਲ',
      confirmedFaultTitle: 'ਤੈਅ ਸਮੱਸਿਆ ਅਤੇ ਸਹਿਕਾਰੀ ਰੇਟ',
      balanceCleared: 'ਬਾਕੀ ਭੁਗਤਾਨ ਮੁਕੰਮਲ:',
      markWorkCompleted: 'ਕੰਮ ਮੁਕੰਮਲ ਦਰਜ ਕਰੋ',
      rateReviewWorker: 'ਕਾਰੀਗਰ ਨੂੰ ਰੇਟਿੰਗ ਦਿਓ',
      shareModalTitle: 'ਲਾਈਵ ਟਰੈਕਿੰਗ ਸਾਂਝੀ ਕਰੋ',
      shareModalDesc: 'ਇਸ ਲਿੰਕ ਰਾਹੀਂ ਕੋਈ ਵੀ ਕਾਰੀਗਰ ਦੇ ਆਉਣ ਦੀ ਨਿਗਰਾਨੀ ਕਰ ਸਕਦਾ ਹੈ।',
      copyLink: 'ਕਾਪੀ ਕਰੋ',
      copiedLink: 'ਕਾਪੀ ਹੋ ਗਿਆ!',
      shareWhatsapp: 'ਵਟਸਐਪ ਤੇ ਸਾਂਝਾ ਕਰੋ',
      sosModalTitle: 'ਸਹਿਕਾਰੀ ਐਮਰਜੈਂਸੀ SOS ਕਾਰਵਾਈ',
      sosModalSubtitle: 'ਤੁਰੰਤ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ',
      sosCallPolice: 'ਪੁਲਿਸ ਨੂੰ ਕਾਲ ਕਰੋ (112)',
      sosCallCoop: 'ਸਹਿਕਾਰੀ ਹੈਲਪਲਾਈਨ',
      sosDismiss: 'ਰੱਦ ਕਰੋ',
    },
    footer: {
      backToHome: '← ਸੇਵਾਵਾਂ ਅਤੇ ਬੁਕਿੰਗਾਂ ਤੇ ਵਾਪਸ ਜਾਓ',
      backToWorkerConsole: '← ਕਾਰੀਗਰ ਕੰਸੋਲ ਤੇ ਵਾਪਸ ਜਾਓ',
      empoweringText: 'ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਰਾਹੀਂ ਭਾਰਤ ਦੇ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ। ਸਹਿਕਾਰੀ ਐਕਟ ਅਧੀਨ ਰਜਿਸਟਰਡ।',
      regNumber: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ: DLACS-1994-049/MSCS • NLCF ਮੈਂਬਰ #1402',
      coopWelfareTitle: 'ਸਹਿਕਾਰੀ ਭਲਾਈ',
      welfareItem1: 'ਹਾਦਸਾ ਅਤੇ ਸਿਹਤ ਬੀਮਾ ਫੰਡ',
      welfareItem2: 'ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ ਵਜ਼ੀਫ਼ੇ',
      welfareItem3: 'ਆਧੁਨਿਕ ਔਜ਼ਾਰ ਖਰੀਦ ਸਬਸਿਡੀ',
      welfareItem4: 'ਨਿਯਮਿਤ ਗੁਜ਼ਾਰਾ ਭੱਤਾ ਗਾਰੰਟੀ',
      welfareItem5: 'ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਰਾਖਵਾਂ ਫੰਡ',
      consumerSafetyTitle: 'ਗਾਹਕ ਸੁਰੱਖਿਆ',
      safetyItem1: '100% ਪੁਲਿਸ ਅਤੇ ਸੀਆਈਡੀ ਜਾਂਚ',
      safetyItem2: 'ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਹੁਨਰ ਟੈਸਟਿੰਗ',
      safetyItem3: 'ਕੋਈ ਵਾਧੂ ਸਰਜ ਰੇਟ ਨਹੀਂ ਗਾਰੰਟੀ',
      safetyItem4: 'ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਲੋਕਪਾਲ',
      safetyItem5: 'ਜੀਪੀਐਸ ਸੁਰੱਖਿਆ ਟਰੈਕਿੰਗ',
      supportDeskTitle: 'ਸਹਾਇਤਾ ਅਤੇ ਤਸਦੀਕ ਡੈਸਕ',
      tollFree: '1800-419-COOP (ਟੋਲ ਫ੍ਰੀ)',
      supportHours: 'ਨਾਗਰਿਕਾਂ ਅਤੇ ਕਾਰੀਗਰਾਂ ਲਈ 24x7 ਉਪਲਬਧ',
      emergencyAvailable: 'ਐਮਰਜੈਂਸੀ SOS ਸੇਵਾ ਉਪਲਬਧ',
      copyright: '© 2026 ਫੈਡਰੇਸ਼ਨ ਆਫ ਲੇਬਰ ਕੋਆਪ੍ਰੇਟਿਵ ਸੋਸਾਇਟੀਜ਼ ਲਿਮਿਟੇਡ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
      actCompliance: 'ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਐਕਟ ਅਧੀਨ',
      welfareAct: 'ਕਿਰਤੀ ਭਲਾਈ ਫੰਡ ਐਕਟ',
      dataPrivacy: 'ਡੇਟਾ ਸੁਰੱਖਿਆ ਅਤੇ ਜੀਪੀਐਸ ਗੋਪਨੀਯਤਾ',
      bottomGovtNote: 'ਰਾਸ਼ਟਰੀ ਕਿਰਤ ਸਹਿਕਾਰੀ ਫੈਡਰੇਸ਼ਨ (NLCF) ਦੀ ਪਹਿਲਕਦਮੀ',
      verifiedWorkersBadge: '100% ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ',
      zeroCommissionBadge: 'ਕੋਈ ਵਿਚੋਲਾ ਕਮਿਸ਼ਨ ਨਹੀਂ',
      helplineBadge: 'ਹੈਲਪਲਾਈਨ: 1800-11-2026 (ਟੋਲ ਫ੍ਰੀ)',
    },
    common: {
      back: 'ਵਾਪਸ',
      next: 'ਅੱਗੇ',
      cancel: 'ਰੱਦ ਕਰੋ',
      close: 'ਬੰਦ ਕਰੋ',
      submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
      step: 'ਪੜਾਅ',
      of: 'ਦਾ',
      rupeeSymbol: '₹',
      all: 'ਸਾਰੇ',
      showAll: 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਵੇਖੋ',
    },
  },
};
