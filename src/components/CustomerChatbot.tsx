import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Headphones,
  User,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Search,
  Navigation,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  Calculator,
  PhoneCall,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  hindiText?: string;
  punjabiText?: string;
  timestamp: string;
  actionButton?: {
    label: string;
    hindiLabel: string;
    punjabiLabel?: string;
    actionType: 'explore' | 'tracking' | 'emergency' | 'complaint' | 'calc';
  };
}

export const CustomerChatbot: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setIsEmergencyModalOpen,
    setIsComplaintModalOpen,
    bookings,
    setSelectedCategory,
    language,
    t,
    workers,
    governmentVerifications,
    selectedWorkerForProfile,
    bookingTargetWorker,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'pa'>(language);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCostEstimator, setShowCostEstimator] = useState<boolean>(false);
  const [selectedEstimatorTrade, setSelectedEstimatorTrade] = useState<string>('Electrical');
  const [jobScopeLevel, setJobScopeLevel] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatLang(language);
  }, [language]);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: 'Namaste! Welcome to ShramSetu Help & Support. How can we assist you with our cooperative services, bookings, or worker verification today?',
      hindiText:
        'नमस्ते! श्रमसेतु सहायता केंद्र (Help & Support) में आपका स्वागत है। आज सेवाओं, बुकिंग या कारीगर सत्यापन में हम आपकी क्या मदद कर सकते हैं?',
      punjabiText:
        'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਸ਼੍ਰਮਸੇਤੂ ਸਹਾਇਤਾ ਕੇਂਦਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?',
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Active travelling booking for instant banner in assistant
  const activeBooking = bookings.find(
    (b) => b.status === 'Worker On The Way' || b.status === 'Accepted'
  );

  const quickPrompts = [
    {
      id: 'qp-verify-worker',
      labelEn: 'Is this worker verified?',
      labelHi: 'क्या यह कारीगर सत्यापित है?',
      labelPa: 'ਕੀ ਇਹ ਕਾਰੀਗਰ ਤਸਦੀਕਸ਼ੁਦਾ ਹੈ?',
      action: 'verify-worker',
    },
    {
      id: 'qp-book',
      labelEn: 'How to book a verified worker?',
      labelHi: 'वर्कर कैसे बुक करें?',
      labelPa: 'ਕਾਰੀਗਰ ਕਿਵੇਂ ਬੁੱਕ ਕਰੀਏ?',
      action: 'book',
    },
    {
      id: 'qp-track',
      labelEn: 'How to track worker live on GPS?',
      labelHi: 'लाइव जीपीएस ट्रैकिंग कैसे देखें?',
      labelPa: 'ਲਾਈਵ ਜੀਪੀਐਸ ਕਿਵੇਂ ਵੇਖੀਏ?',
      action: 'track',
    },
    {
      id: 'qp-calc',
      labelEn: 'Calculate fair repair cost & tariff',
      labelHi: 'उचित दर व लागत की गणना करें',
      labelPa: 'ਵਾਜਬ ਦਰਾਂ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ',
      action: 'calc',
    },
    {
      id: 'qp-emergency',
      labelEn: 'How does 24x7 Emergency SOS work?',
      labelHi: '24x7 आपातकालीन सेवा कैसे काम करती है?',
      labelPa: '24x7 ਐਮਰਜੈਂਸੀ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ?',
      action: 'emergency',
    },
    {
      id: 'qp-rates',
      labelEn: 'Zero commission & worker 90% payout',
      labelHi: 'शून्य कमीशन व कारीगर को 90% भुगतान',
      labelPa: 'ਜ਼ੀਰੋ ਕਮੀਸ਼ਨ ਤੇ 90% ਸਿੱਧੀ ਤਨਖਾਹ',
      action: 'rates',
    },
    {
      id: 'qp-safety',
      labelEn: 'Are workers police background-checked?',
      labelHi: 'क्या सभी कारीगर पुलिस सत्यापित हैं?',
      labelPa: 'ਕੀ ਕਾਰੀਗਰ ਪੁਲਿਸ ਤਸਦੀਕਸ਼ੁਦਾ ਹਨ?',
      action: 'safety',
    },
  ];

  // Text-To-Speech Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = chatLang === 'hi' ? 'hi-IN' : chatLang === 'pa' ? 'pa-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleActionClick = (actionType: 'explore' | 'tracking' | 'emergency' | 'complaint' | 'calc') => {
    if (actionType === 'explore') {
      setCurrentTab('explore');
      const searchElem = document.querySelector('input[placeholder*="Search"]');
      if (searchElem) {
        (searchElem as HTMLInputElement).focus();
      }
    } else if (actionType === 'tracking') {
      setCurrentTab('tracking');
    } else if (actionType === 'emergency') {
      setIsEmergencyModalOpen(true);
    } else if (actionType === 'complaint') {
      setIsComplaintModalOpen(true);
    } else if (actionType === 'calc') {
      setShowCostEstimator(true);
    }
  };

  const getBotResponse = (query: string): { text: string; hindiText: string; punjabiText?: string; actionButton?: ChatMessage['actionButton'] } => {
    const q = query.toLowerCase().trim();

    // Specific Worker Verification Query: "Is this worker verified?"
    if (
      q.includes('is this worker verified') ||
      q.includes('is worker verified') ||
      (q.includes('worker') && q.includes('verified')) ||
      (q.includes('verification') && (q.includes('worker') || q.includes('status') || q.includes('check'))) ||
      workers.some((w) => q.includes(w.name.toLowerCase().split(' ')[0]) && (q.includes('verified') || q.includes('verification'))) ||
      (q.includes('kya') && q.includes('verified') && q.includes('hai'))
    ) {
      // Resolve target worker: check mentioned name, active booking worker, profile worker, or fallback
      const mentionedWorker = workers.find(
        (w) =>
          q.includes(w.name.toLowerCase()) ||
          w.name.toLowerCase().split(' ').some((part) => part.length > 2 && q.includes(part))
      );
      const targetWorker =
        mentionedWorker ||
        bookingTargetWorker ||
        selectedWorkerForProfile ||
        (activeBooking ? workers.find((w) => w.id === activeBooking.workerId) : undefined) ||
        workers.find((w) => w.id === 'w-102') ||
        workers[0];

      const govRec = governmentVerifications.find((gv) => gv.workerId === targetWorker.id);
      const govStatus = govRec ? govRec.status : 'NOT_VERIFIED';
      const coopStatus = targetWorker.cooperativeVerificationStatus || 'PENDING';
      const platformStatus = targetWorker.shramsetuVerificationStatus || 'PENDING';

      const verifiedLayers: string[] = [];
      if (govStatus === 'VERIFIED') verifiedLayers.push('Government Verification');
      if (coopStatus === 'VERIFIED') verifiedLayers.push('Cooperative Verification');
      if (platformStatus === 'VERIFIED') verifiedLayers.push('ShramSetu Verification');

      let responseText = '';
      if (verifiedLayers.length === 3) {
        responseText = `This worker has Government Verification, Cooperative Verification, and ShramSetu Verification. All three verification tiers are active and verified.`;
      } else if (verifiedLayers.length > 0) {
        responseText = `This worker has ${verifiedLayers.join(' and ')}.`;
        if (govStatus === 'PENDING') {
          responseText += ' Government verification is currently pending.';
        } else if (govStatus === 'NOT_CONFIGURED') {
          responseText += ' Government verification connection is currently unavailable.';
        } else if (govStatus === 'REJECTED') {
          responseText += ' Government verification was rejected.';
        } else if (govStatus === 'NOT_VERIFIED') {
          responseText += ' Government verification is currently not verified.';
        }
      } else {
        responseText = `This worker currently has no verified layers. Government verification is ${govStatus === 'NOT_CONFIGURED' ? 'unavailable' : govStatus.toLowerCase()}, Cooperative verification is ${coopStatus.toLowerCase()}, and ShramSetu verification is ${platformStatus.toLowerCase()}.`;
      }

      const formattedGov =
        govStatus === 'VERIFIED'
          ? `✓ Verified (${govRec?.authority || 'CLC'})`
          : govStatus === 'NOT_CONFIGURED'
          ? 'Connection unavailable'
          : govStatus === 'PENDING'
          ? 'Pending'
          : govStatus;
      const formattedCoop =
        coopStatus === 'VERIFIED'
          ? `✓ Verified (${targetWorker.cooperativeName || 'Cooperative'})`
          : coopStatus === 'PENDING'
          ? 'Pending'
          : coopStatus;
      const formattedPlatform =
        platformStatus === 'VERIFIED'
          ? '✓ Verified (Platform)'
          : platformStatus === 'PENDING'
          ? 'Pending'
          : platformStatus;

      return {
        text: `${responseText}\n\nWorker: ${targetWorker.name} (${targetWorker.primaryTrade})\n• Government Verification: ${formattedGov}\n• Cooperative Verification: ${formattedCoop}\n• ShramSetu Verification: ${formattedPlatform}`,
        hindiText: `${targetWorker.name} के सत्यापन विवरण:\n• सरकारी सत्यापन: ${govStatus === 'VERIFIED' ? '✓ सत्यापित' : govStatus === 'PENDING' ? 'प्रक्रियाधीन (Pending)' : 'सत्यापित नहीं'}\n• सहकारी सत्यापन: ${coopStatus === 'VERIFIED' ? '✓ सत्यापित' : coopStatus === 'PENDING' ? 'प्रक्रियाधीन' : 'अस्वीकृत'}\n• श्रमसेतु सत्यापन: ${platformStatus === 'VERIFIED' ? '✓ सत्यापित' : platformStatus === 'PENDING' ? 'प्रक्रियाधीन' : 'अस्वीकृत'}`,
        punjabiText: `${targetWorker.name} ਦੀ ਤਸਦੀਕ ਜਾਣਕਾਰੀ:\n• ਸਰਕਾਰੀ ਤਸਦੀਕ: ${govStatus === 'VERIFIED' ? 'ਤਸਦੀਕਸ਼ੁਦਾ' : 'ਪੈਂਡਿੰਗ'}\n• ਸਹਿਕਾਰੀ ਤਸਦੀਕ: ${coopStatus === 'VERIFIED' ? 'ਤਸਦੀਕਸ਼ੁਦਾ' : 'ਪੈਂਡਿੰਗ'}\n• ਸ਼੍ਰਮਸੇਤੂ ਤਸਦੀਕ: ${platformStatus === 'VERIFIED' ? 'ਤਸਦੀਕਸ਼ੁਦਾ' : 'ਪੈਂਡਿੰਗ'}`,
      };
    }

    if (
      q.includes('calc') ||
      q.includes('calculator') ||
      q.includes('cost') ||
      q.includes('tariff') ||
      q.includes('estimate') ||
      q.includes('kitna') ||
      q.includes('kharcha')
    ) {
      return {
        text: 'Cooperative Job Pricing Breakdown:\nTransparent upfront rates starting from ₹249 for Electrician, ₹220 for Plumber, ₹250 for Carpenter. 90% goes directly to the skilled worker with zero surge pricing!\n\nWould you like to estimate the job cost now?',
        hindiText:
          'सहकारी पारदर्शी कार्य दर गणक:\nपारदर्शी अग्रिम दरें (इलेक्ट्रीशियन ₹249 से, प्लंबर ₹220, बढ़ई ₹250)। 90% सीधी राशि कारीगर को मिलती है।\n\nक्या आप अभी कार्य शुल्क का अनुमान देखना चाहते हैं?',
        punjabiText:
          'ਸਹਿਕਾਰੀ ਵਾਜਬ ਦਰਾਂ:\nਸਰਕਾਰੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਤੈਅਸ਼ੁਦਾ ਦਰਾਂ ਹਨ (ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ ₹249, ਪਲੰਬਰ ₹220, ਤਰਖਾਣ ₹250)। 90% ਪੈਸੇ ਸਿੱਧੇ ਕਾਰੀਗਰ ਨੂੰ ਮਿਲਦੇ ਹਨ।',
        actionButton: {
          label: 'Estimate Job Fee',
          hindiLabel: 'कार्य शुल्क अनुमान देखें',
          punjabiLabel: 'ਦਰਾਂ ਦਾ ਹਿਸਾਬ ਲਗਾਓ',
          actionType: 'calc',
        },
      };
    }

    if (
      q.includes('book') ||
      q.includes('kaise') && (q.includes('kare') || q.includes('karein')) ||
      q.includes('electrician') ||
      q.includes('plumber') ||
      q.includes('carpenter') ||
      q.includes('mistri') ||
      q.includes('order')
    ) {
      return {
        text: 'To book a verified craftsman:\n1. Choose your required trade (Electrician, Plumber, Carpenter, etc.).\n2. Filter by your location.\n3. Click "Book Service" on any verified artisan.\n4. Select your preferred date & time. You will receive a 4-digit arrival safety PIN!',
        hindiText:
          'कारीगर बुक करने का आसान तरीका:\n1. अपनी जरूरत की ट्रेड चुनें।\n2. अपने इलाके के अनुसार फिल्टर करें।\n3. सत्यापित कारीगर के कार्ड पर "Book Service" दबाएं।\n4. अपनी सुविधानुसार समय चुनें। आपको 4-अंकों का सुरक्षा पिन भी मिलेगा!',
        punjabiText:
          'ਕਾਰੀਗਰ ਬੁੱਕ ਕਰਨ ਦਾ ਤਰੀਕਾ:\n1. ਆਪਣੀ ਲੋੜ ਮੁਤਾਬਕ ਕੰਮ ਚੁਣੋ (ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ ਆਦਿ)।\n2. ਆਪਣੇ ਸ਼ਹਿਰ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ।\n3. "Book Service" ਤੇ ਕਲਿਕ ਕਰੋ। ਤੁਹਾਨੂੰ 4-ਅੰਕਾਂ ਦਾ ਸੁਰੱਖਿਆ ਪਿੰਨ ਵੀ ਮਿਲੇਗਾ!',
        actionButton: {
          label: 'Search & Book Workers',
          hindiLabel: 'कारीगर खोजें और बुक करें',
          punjabiLabel: 'ਕਾਰੀਗਰ ਖੋਜੋ ਤੇ ਬੁੱਕ ਕਰੋ',
          actionType: 'explore',
        },
      };
    }

    if (
      q.includes('track') ||
      q.includes('gps') ||
      q.includes('location') ||
      q.includes('kaha') ||
      q.includes('live') ||
      q.includes('rasta') ||
      q.includes('map')
    ) {
      return {
        text: 'Live GPS Worker Tracking:\n• Click "Live Tracking" in the top bar to monitor your dispatch in real-time.\n• View live vehicle speed, animated road heading, turn-by-turn waypoint milestones, and share encrypted tracking links with family on WhatsApp.',
        hindiText:
          'लाइव जीपीएस ट्रैकिंग:\n• ऊपर "Live Tracking" पर क्लिक करके कारीगर की लाइव लोकेशन देखें।\n• वास्तविक गति, दिशा, टर्न-बाय-टर्न माइलस्टोन और व्हाट्सएप पर लाइव ट्रैकिंग शेयर करने की सुविधा उपलब्ध है।',
        punjabiText:
          'ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ:\n• ਉੱਪਰ ਦਿੱਤੇ "Live Tracking" ਬਟਨ ਤੇ ਕਲਿਕ ਕਰੋ।\n• ਤੁਸੀਂ ਲਾਈਵ ਨਕਸ਼ੇ ਤੇ ਕਾਰੀਗਰ ਦੀ ਸਪੀਡ ਅਤੇ ਰਸਤਾ ਵੇਖ ਸਕਦੇ ਹੋ।',
        actionButton: {
          label: 'Open Live GPS Tracking',
          hindiLabel: 'लाइव जीपीएस ट्रैकिंग खोलें',
          punjabiLabel: 'ਲਾਈਵ ਜੀਪੀਐਸ ਵੇਖੋ',
          actionType: 'tracking',
        },
      };
    }

    if (
      q.includes('emergency') ||
      q.includes('urgent') ||
      q.includes('sos') ||
      q.includes('jaldi') ||
      q.includes('leak') ||
      q.includes('shock') ||
      q.includes('spark')
    ) {
      return {
        text: '24x7 Emergency SOS Dispatch:\n• For urgent short circuits, water bursts, or gas leaks, click the red "24x7 Emergency" button.\n• Standby cooperative emergency technicians within a 5 km radius are dispatched for 15-30 minute rapid arrival.',
        hindiText:
          '24x7 आपातकालीन सहायता (Emergency SOS):\n• शॉर्ट सर्किट, पाइप फटने जैसी स्थिति में ऊपर लाल रंग के "24x7 Emergency" बटन पर क्लिक करें।\n• निकटतम ऑन-ड्यूटी कारीगर को 15-30 मिनट में त्वरित सहायता के लिए भेजा जाता है।',
        punjabiText:
          '24x7 ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ:\n• ਕਿਸੇ ਵੀ ਜ਼ਰੂਰੀ ਕੰਮ ਲਈ ਲਾਲ "24x7 Emergency" ਬਟਨ ਦਬਾਓ। 15-30 ਮਿੰਟਾਂ ਵਿੱਚ ਕਾਰੀਗਰ ਪਹੁੰਚੇਗਾ।',
        actionButton: {
          label: 'Open Emergency SOS Modal',
          hindiLabel: 'आपातकालीन सहायता खोलें',
          punjabiLabel: 'ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਖੋਲ੍ਹੋ',
          actionType: 'emergency',
        },
      };
    }

    if (
      q.includes('rate') ||
      q.includes('price') ||
      q.includes('commission') ||
      q.includes('fee') ||
      q.includes('charge')
    ) {
      return {
        text: 'Cooperative Transparent Pricing:\n• 90% goes directly to the worker as dignity of labor wages.\n• 8% funds the worker health, accident insurance, and children scholarship pool.\n• Only 2% covers government tax and admin. Zero corporate commission!',
        hindiText:
          'सहकारी पारदर्शी मूल्य निर्धारण:\n• 90% राशि सीधे कारीगर के खाते में सम्मानजनक वेतन के रूप में जाती है।\n• 8% राशि कारीगर स्वास्थ्य बीमा व बच्चों की छात्रवृत्ति में जाती है।\n• केवल 2% टैक्स/प्रशासनिक शुल्क है। कोई निजी कमीशन नहीं!',
        punjabiText:
          'ਸਹਿਕਾਰੀ ਪਾਰਦਰਸ਼ੀ ਨੀਤੀ:\n• 90% ਸਿੱਧੀ ਰਕਮ ਕਾਰੀਗਰ ਨੂੰ ਮਿਲਦੀ ਹੈ। 8% ਬੀਮਾ ਤੇ ਭਲਾਈ ਫੰਡ ਵਿੱਚ ਜਾਂਦੀ ਹੈ। ਨਿੱਜੀ ਐਪਸ ਵਾਂਗ ਕੋਈ ਵੱਡਾ ਕਮੀਸ਼ਨ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ।',
      };
    }

    if (
      q.includes('safety') ||
      q.includes('verified') ||
      q.includes('police') ||
      q.includes('suraksha') ||
      q.includes('trust')
    ) {
      return {
        text: '100% Police & Skill Verified:\nEvery artisan is registered under the Cooperative Societies Act, holds state police antecedent clearance, Aadhaar authentication, and recognized ITI trade certification.',
        hindiText:
          '100% पुलिस व कौशल सत्यापन:\nप्रत्येक कारीगर सहकारी समिति में पंजीकृत है, राज्य पुलिस सत्यापन, आधार प्रमाणीकरण तथा ITI प्रमाण पत्र की जांच के उपरांत ही सेवा प्रदान करता है।',
        punjabiText:
          '100% ਪੁਲਿਸ ਅਤੇ ਸਰਟੀਫਾਈਡ ਕਾਰੀਗਰ:\nਸਾਰੇ ਕਾਰੀਗਰ ਪੁਲਿਸ ਜਾਂਚ ਅਤੇ ਆਈ.ਟੀ.ਆਈ. ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਪ੍ਰਮਾਣਿਤ ਹਨ।',
      };
    }

    // Default Fallback
    return {
      text: 'I can assist you with:\n1. Booking certified electricians, plumbers, and carpenters.\n2. Live GPS worker tracking & safety PIN.\n3. Transparent cooperative tariff calculation.\n4. 24x7 Emergency SOS response.\n5. Filing complaints under the Cooperative Societies Act.\n\nChoose an option below or type your inquiry!',
      hindiText:
        'मैं इन कार्यों में आपकी सहायता कर सकता हूँ:\n1. प्रमाणित कारीगर बुक करना।\n2. लाइव जीपीएस ट्रैकिंग व सुरक्षा पिन।\n3. पारदर्शी सहकारी दर कैलकुलेटर।\n4. 24x7 आपातकालीन सहायता सेवा।\n5. आधिकारिक शिकायत दर्ज करना।\n\nनीचे दिए गए विकल्पों में से चुनें या अपना सवाल पूछें!',
      punjabiText:
        'ਮੈਂ ਤੁਹਾਡੀ ਇਹਨਾਂ ਕੰਮਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n1. ਪ੍ਰਮਾਣਿਤ ਕਾਰੀਗਰ ਬੁੱਕ ਕਰਨਾ।\n2. ਲਾਈਵ ਜੀਪੀਐਸ ਟਰੈਕਿੰਗ।\n3. ਵਾਜਬ ਦਰਾਂ ਦਾ ਅੰਦਾਜ਼ਾ।\n4. 24x7 ਐਮਰਜੈਂਸੀ ਸੇਵਾ।',
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botReply = getBotResponse(query);
    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: botReply.text,
      hindiText: botReply.hindiText,
      punjabiText: botReply.punjabiText,
      actionButton: botReply.actionButton,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!textToSend) setInputValue('');
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'bot',
        text: 'Namaste! Welcome to ShramSetu Help & Support. How can we assist you with our cooperative services, bookings, or worker verification today?',
        hindiText:
          'नमस्ते! श्रमसेतु सहायता केंद्र (Help & Support) में आपका स्वागत है। आज सेवाओं, बुकिंग या कारीगर सत्यापन में हम आपकी क्या मदद कर सकते हैं?',
        punjabiText:
          'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਸ਼੍ਰਮਸੇਤੂ ਸਹਾਇਤਾ ਕੇਂਦਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?',
        timestamp: 'Just now',
      },
    ]);
  };

  // Tariff calculator lookup
  const tradeTariffs: Record<string, number> = {
    Electrical: 249,
    Plumbing: 220,
    Carpentry: 250,
    Painting: 210,
    Technician: 249,
    Cleaning: 199,
  };

  const baseRate = tradeTariffs[selectedEstimatorTrade] || 249;
  const totalCost = baseRate * jobScopeLevel;
  const workerEarning = Math.round(totalCost * 0.9);
  const welfarePool = Math.round(totalCost * 0.08);
  const adminGst = totalCost - workerEarning - welfarePool;

  return (
    <aside aria-label="Customer Support Desk" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 font-sans max-w-[calc(100vw-2rem)]">
      {/* Fixed Support Button (? Help & Support) */}
      {!isOpen && (
        <button
          id="chatbot-trigger-btn"
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#17324D] hover:bg-[#112437] text-white shadow-md border border-[#224466] transition-all duration-150 cursor-pointer select-none"
          aria-label="Open customer help center"
        >
          <div className="w-5 h-5 rounded-md bg-[#167A5B] flex items-center justify-center text-white text-[11px] font-bold">
            ?
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span>Help &amp; Support</span>
            <Headphones className="w-3.5 h-3.5 text-slate-300" />
          </div>
          {hasUnread && (
            <span className="w-2 h-2 rounded-full bg-[#B42318] ml-0.5" />
          )}
        </button>
      )}

      {/* Floating Support Panel */}
      {isOpen && (
        <div
          id="chatbot-panel"
          className="w-[calc(100vw-2rem)] sm:w-[410px] max-w-[410px] h-[580px] max-h-[85vh] bg-white rounded-xl shadow-2xl border border-[#E4E7EC] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Institutional Header */}
          <div className="bg-[#17324D] text-white p-4 flex items-center justify-between border-b border-[#224466]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#224466] border border-[#2c5580] flex items-center justify-center text-[#167A5B]">
                <Headphones className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
                    Help &amp; Support Desk
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Toll-Free Helpline: 1800-419-2667
                </div>
              </div>
            </div>

            {/* Language Switcher & Controls */}
            <div className="flex items-center gap-1.5">
              {/* Language Toggle */}
              <div className="flex rounded-xl bg-neutral-800 p-0.5 border border-neutral-700 text-[10px] font-bold">
                <button
                  id="chatbot-lang-en"
                  onClick={() => setChatLang('en')}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    chatLang === 'en' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  id="chatbot-lang-hi"
                  onClick={() => setChatLang('hi')}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    chatLang === 'hi' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  HI
                </button>
                <button
                  id="chatbot-lang-pa"
                  onClick={() => setChatLang('pa')}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    chatLang === 'pa' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  PA
                </button>
              </div>

              {/* Reset Conversation */}
              <button
                id="chatbot-reset-btn"
                onClick={handleResetChat}
                title="Restart chat"
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                id="chatbot-close-btn"
                onClick={() => {
                  setIsOpen(false);
                  window.speechSynthesis?.cancel();
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Booking Live Transit Notification Banner */}
          {activeBooking && (
            <div className="bg-emerald-50 px-3.5 py-2 border-b border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate font-medium text-[11px]">
                  <strong>{activeBooking.workerName}</strong> {language === 'hi' ? 'रास्ते में हैं' : 'is en route'} ({activeBooking.bookingNumber})
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentTab('tracking');
                  setIsOpen(false);
                }}
                className="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold shrink-0 cursor-pointer shadow-2xs"
              >
                {language === 'hi' ? 'जीपीएस पर ट्रैक करें' : 'Track on GPS'}
              </button>
            </div>
          )}

          {/* In-Chat Interactive Tariff Calculator Modal Overlay */}
          {showCostEstimator && (
            <div className="bg-blue-950 text-white p-4 border-b border-blue-800 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Calculator className="w-4 h-4" />
                  <span>
                    {language === 'hi'
                      ? 'उचित दर एवं कारीगर आय गणक'
                      : 'Fair Tariff & Worker Earning Estimator'}
                  </span>
                </div>
                <button
                  onClick={() => setShowCostEstimator(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1">
                    {language === 'hi' ? 'ट्रेड चुनें' : 'Select Trade'}
                  </label>
                  <select
                    value={selectedEstimatorTrade}
                    onChange={(e) => setSelectedEstimatorTrade(e.target.value)}
                    className="w-full bg-blue-900 border border-blue-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                  >
                    {Object.keys(tradeTariffs).map((trade) => (
                      <option key={trade} value={trade}>
                        {t.categories[trade] || trade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1">
                    {language === 'hi' ? 'सेवा का दायरा' : 'Service Scope'}
                  </label>
                  <select
                    value={jobScopeLevel}
                    onChange={(e) => setJobScopeLevel(Number(e.target.value))}
                    className="w-full bg-blue-900 border border-blue-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value={1}>
                      {language === 'hi' ? `मानक निरीक्षण एवं प्रारंभिक कार्य (₹${baseRate})` : `Standard Inspection & Initial Work (₹${baseRate})`}
                    </option>
                    <option value={2}>
                      {language === 'hi' ? 'मानक मध्यम कार्य' : 'Standard Medium Job'}
                    </option>
                    <option value={3}>
                      {language === 'hi' ? 'विस्तृत सुधार एवं मरम्मत' : 'Comprehensive Extensive Repair'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-2.5 rounded-xl bg-blue-900/60 border border-blue-800 text-[11px] space-y-1">
                <div className="flex justify-between font-bold text-amber-300">
                  <span>{language === 'hi' ? 'ग्राहक द्वारा देय कुल राशि:' : 'Customer Settled Cost:'}</span>
                  <span>₹{totalCost}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>{language === 'hi' ? '90% कारीगर सीधा भुगतान:' : '90% Worker Direct Pay:'}</span>
                  <span>₹{workerEarning}</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>{language === 'hi' ? '8% कारीगर कल्याण एवं पेंशन फंड:' : '8% Worker Welfare & Pension Fund:'}</span>
                  <span>₹{welfarePool}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>{language === 'hi' ? '2% प्रशासनिक जीएसटी:' : '2% Administrative GST:'}</span>
                  <span>₹{adminGst}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory(selectedEstimatorTrade as any);
                  setShowCostEstimator(false);
                  setCurrentTab('explore');
                  setIsOpen(false);
                }}
                className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                {language === 'hi'
                  ? `उपलब्ध ${t.categories[selectedEstimatorTrade] || selectedEstimatorTrade} कारीगर खोजें`
                  : `Find Available ${selectedEstimatorTrade} Craftsmen`}
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              const displayText =
                chatLang === 'hi' && m.hindiText
                  ? m.hindiText
                  : chatLang === 'pa' && m.punjabiText
                  ? m.punjabiText
                  : m.text;

              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-xl bg-blue-900 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Headphones className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isBot ? '' : 'text-right'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                        isBot
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          : 'bg-blue-900 text-white rounded-tr-none'
                      }`}
                    >
                      {displayText}
                    </div>

                    {/* Bot Controls (Text-To-Speech & Quick Actions) */}
                    {isBot && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          onClick={() => speakText(displayText)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Listen to this message"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        {m.actionButton && (
                          <button
                            onClick={() => handleActionClick(m.actionButton!.actionType)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>
                              {chatLang === 'hi'
                                ? m.actionButton.hindiLabel
                                : chatLang === 'pa' && m.actionButton.punjabiLabel
                                ? m.actionButton.punjabiLabel
                                : m.actionButton.label}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="text-[9px] text-slate-400 px-1">{m.timestamp}</div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mb-0.5 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-slate-100/90 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#167A5B]" />
              <span>
                {chatLang === 'hi'
                  ? 'त्वरित सहायता विकल्प'
                  : chatLang === 'pa'
                  ? 'ਤੇਜ਼ ਸਹਾਇਤਾ ਵਿਕਲਪ'
                  : 'Instant Assistance Shortcuts'}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() =>
                    qp.action === 'calc'
                      ? setShowCostEstimator(true)
                      : handleSend(
                          chatLang === 'hi'
                            ? qp.labelHi
                            : chatLang === 'pa'
                            ? qp.labelPa
                            : qp.labelEn
                        )
                  }
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 hover:text-blue-900 text-[10px] font-bold whitespace-nowrap transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  {chatLang === 'hi' ? qp.labelHi : chatLang === 'pa' ? qp.labelPa : qp.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              id="chatbot-input-field"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                chatLang === 'hi'
                  ? 'अपना सवाल यहाँ लिखें (जैसे: इलेक्ट्रीशियन बुक करें)...'
                  : chatLang === 'pa'
                  ? 'ਸਵਾਲ ਪੁੱਛੋ (ਜਿਵੇਂ: ਕਾਰੀਗਰ ਕਿਵੇਂ ਬੁੱਕ ਕਰੀਏ)...'
                  : 'How can we help you today? (e.g. book electrician)...'
              }
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white text-slate-800 font-medium"
            />

            <button
              id="chatbot-send-btn"
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
