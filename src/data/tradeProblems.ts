import { ServiceCategory, DiagnosedProblem } from '../types';

export const TRADE_PROBLEMS: Record<ServiceCategory, DiagnosedProblem[]> = {
  Electrical: [
    {
      id: 'elec-mcb-tripping',
      trade: 'Electrical',
      title: 'MCB Tripping / Burnt Circuit Breaker Fix',
      description: 'Isolate circuit load, replace faulty 16A/32A MCB, tighten distributor terminal busbars.',
      standardTariff: 299,
      complexity: 'Moderate',
      icon: '⚡',
    },
    {
      id: 'elec-fan-rewire',
      trade: 'Electrical',
      title: 'Ceiling Fan Capacitor & Winding Overhaul',
      description: 'Dismantle fan, replace dry running capacitor (2.5mfd/3.15mfd), test coil continuity, grease bearings.',
      standardTariff: 280,
      complexity: 'Standard',
      icon: '🌀',
    },
    {
      id: 'elec-short-circuit',
      trade: 'Electrical',
      title: 'Concealed Conduit Short Circuit Tracing',
      description: 'Diagnostic megger insulation test, trace burnt neutral/phase wires inside wall conduit, pull fresh copper run.',
      standardTariff: 450,
      complexity: 'Major',
      icon: '🔥',
    },
    {
      id: 'elec-switchboard-replace',
      trade: 'Electrical',
      title: 'Modular Switchboard & Power Socket Replacement',
      description: 'Replace up to 4 burnt/sparking switches, 16A power point socket, and modular front plate.',
      standardTariff: 220,
      complexity: 'Standard',
      icon: '🔌',
    },
    {
      id: 'elec-inverter-wiring',
      trade: 'Electrical',
      title: 'Inverter & Battery Charging Circuit Fix',
      description: 'Inspect output relay, clean lead-acid terminal oxidation, rebalance home backup bypass circuit.',
      standardTariff: 350,
      complexity: 'Moderate',
      icon: '🔋',
    },
    {
      id: 'elec-earthing-leakage',
      trade: 'Electrical',
      title: 'Earth Leakage & Shock Elimination',
      description: 'Measure earth pit electrode resistance, connect bonding wire to distribution board, fix residual shock on appliances.',
      standardTariff: 399,
      complexity: 'Moderate',
      icon: '🛡️',
    },
  ],

  Plumbing: [
    {
      id: 'plumb-leak-concealed',
      trade: 'Plumbing',
      title: 'Concealed Wall Seepage & Joint Repair',
      description: 'Pressure test pipeline, chisel small cavity to access ruptured CPVC/GI elbow, install slip socket joint.',
      standardTariff: 420,
      complexity: 'Major',
      icon: '💧',
    },
    {
      id: 'plumb-drain-clog',
      trade: 'Plumbing',
      title: 'Kitchen Sink / Floor Drain Heavy De-Clogging',
      description: 'Use mechanical spiral spring snake & non-acidic solvent to clear grease trap, kitchen waste line, or nahani trap.',
      standardTariff: 260,
      complexity: 'Standard',
      icon: '🚿',
    },
    {
      id: 'plumb-tap-cartridge',
      trade: 'Plumbing',
      title: 'Dripping Brass Tap & Mixer Cartridge Replacement',
      description: 'Extract jammed quarter-turn ceramic spindle cartridge, replace rubber O-rings, and seal mixer seat.',
      standardTariff: 180,
      complexity: 'Standard',
      icon: '🚰',
    },
    {
      id: 'plumb-flush-tank',
      trade: 'Plumbing',
      title: 'Toilet Cistern & Flush Valve Overhaul',
      description: 'Replace faulty dual-flush siphon mechanism, inlet float ballcock valve, and overflow prevention seals.',
      standardTariff: 250,
      complexity: 'Standard',
      icon: '🚽',
    },
    {
      id: 'plumb-geyser-pipe',
      trade: 'Plumbing',
      title: 'Geyser Hot-Cold Braided Connection & PRV Valve Fix',
      description: 'Replace hardened braided SS flexible hoses, clean inline non-return valve, and eliminate hot water drips.',
      standardTariff: 220,
      complexity: 'Standard',
      icon: '♨️',
    },
    {
      id: 'plumb-tank-float',
      trade: 'Plumbing',
      title: 'Rooftop Water Tank Float Valve Overflow Fix',
      description: 'Install heavy-duty brass mechanical float valve on overhead water tank, re-clamp inlet supply pipe.',
      standardTariff: 310,
      complexity: 'Moderate',
      icon: '🏗️',
    },
  ],

  Carpentry: [
    {
      id: 'carp-door-lock',
      trade: 'Carpentry',
      title: 'Main Door Mortise Lock & Latch Jam Fix',
      description: 'Disassemble jammed brass lock cylinder, re-chisel wooden jamb striker plate, lubricate internal tumblers.',
      standardTariff: 270,
      complexity: 'Standard',
      icon: '🔐',
    },
    {
      id: 'carp-hinge-realign',
      trade: 'Carpentry',
      title: 'Cabinet / Wardrobe Soft-Close Hinge Re-anchoring',
      description: 'Drill wooden dowel plugs for stripped screw holes, re-mount 3D hydraulic concealed hinges, align door gap.',
      standardTariff: 220,
      complexity: 'Standard',
      icon: '🚪',
    },
    {
      id: 'carp-drawer-channel',
      trade: 'Carpentry',
      title: 'Telescopic Kitchen Drawer Ball-Bearing Channel Replacement',
      description: 'Remove jammed sliding rail, mount 45mm heavy-duty zinc-plated telescopic slide pair, calibrate smooth glide.',
      standardTariff: 320,
      complexity: 'Moderate',
      icon: '🗄️',
    },
    {
      id: 'carp-wood-planing',
      trade: 'Carpentry',
      title: 'Door Sagging & Floor Scraping Planing',
      description: 'Unmount swollen wooden door, plane bottom edge by 5-8mm, apply edge seal coat, and re-hang with balanced pins.',
      standardTariff: 290,
      complexity: 'Moderate',
      icon: '🪚',
    },
    {
      id: 'carp-bed-reinforce',
      trade: 'Carpentry',
      title: 'Bed Frame & Hydraulic Storage Support Reinforcement',
      description: 'Add seasoned hardwood center battens, bolt corner L-brackets, calibrate gas spring piston lift rods.',
      standardTariff: 380,
      complexity: 'Moderate',
      icon: '🛏️',
    },
  ],

  Technician: [
    {
      id: 'tech-ac-cool',
      trade: 'Technician',
      title: 'Split AC Poor Cooling & Coil Deep Jet Wash',
      description: 'Measure suction pressure (R32/R410A), wash indoor evaporator coils & cross-flow blower with jet pump, check capillary choke.',
      standardTariff: 499,
      complexity: 'Major',
      icon: '❄️',
    },
    {
      id: 'tech-washing-drain',
      trade: 'Technician',
      title: 'Washing Machine Not Draining / Spinning Error',
      description: 'Inspect drain pump motor impeller, clean coin lint filter, test optical water level pressure switch.',
      standardTariff: 380,
      complexity: 'Moderate',
      icon: '🌀',
    },
    {
      id: 'tech-fridge-defrost',
      trade: 'Technician',
      title: 'Refrigerator Frost Build-up & Thermostat Fix',
      description: 'Test bimetal defrost sensor, thermal fuse, and replace mechanical thermostat or defrost heating element.',
      standardTariff: 390,
      complexity: 'Moderate',
      icon: '🧊',
    },
    {
      id: 'tech-ro-membrane',
      trade: 'Technician',
      title: 'Water Purifier RO Membrane & Pre-Filter Overhaul',
      description: 'Check booster pump PSI, test raw vs pure TDS, flush sediment/carbon block filters, replace RO filter membrane.',
      standardTariff: 350,
      complexity: 'Moderate',
      icon: '🧪',
    },
    {
      id: 'tech-micro-heat',
      trade: 'Technician',
      title: 'Microwave Running But Not Heating Repair',
      description: 'Discharge high-voltage capacitor safely, test magnetron filament continuity, and replace faulty HV diode.',
      standardTariff: 420,
      complexity: 'Major',
      icon: '📻',
    },
  ],

  Painting: [
    {
      id: 'paint-damp-seal',
      trade: 'Painting',
      title: 'Waterproofing Barrier & Anti-Efflorescence Treatment',
      description: 'Scrape salt efflorescence/blistered plaster down to brick, apply 2 coats of elastomeric polymer waterproof barrier.',
      standardTariff: 450,
      complexity: 'Major',
      icon: '🧱',
    },
    {
      id: 'paint-patch-putty',
      trade: 'Painting',
      title: 'Ceiling / Wall Crack Filling & Putty Leveling',
      description: 'V-groove wall cracks, pack fiber mesh tape with crack-filler compound, apply 2 coats of acrylic wall putty.',
      standardTariff: 320,
      complexity: 'Moderate',
      icon: '🖌️',
    },
    {
      id: 'paint-wood-polish',
      trade: 'Painting',
      title: 'Single Room Accent Wall & Touch-Up Emulsion',
      description: 'Sand smooth with 220-grit paper, mask electrical points, apply primer and 2 coats of premium luster acrylic emulsion.',
      standardTariff: 390,
      complexity: 'Moderate',
      icon: '🎨',
    },
    {
      id: 'paint-pu-polish',
      trade: 'Painting',
      title: 'Wooden Door Melamine / PU Polish Refresh',
      description: 'Strip oxidized varnish, grain fill with walnut paste, wipe coat of sealer and high-gloss polyurethane clear finish.',
      standardTariff: 420,
      complexity: 'Moderate',
      icon: '🪵',
    },
  ],

  Cleaning: [
    {
      id: 'clean-deep-kitchen',
      trade: 'Cleaning',
      title: 'Deep Kitchen Degreasing & Exhaust Hood Clean',
      description: 'Eco-alkaline degreaser on ceramic tiles, stainless steel chimney baffle filters, gas hob burners, and cabinet exterior.',
      standardTariff: 380,
      complexity: 'Moderate',
      icon: '🍳',
    },
    {
      id: 'clean-bath-descale',
      trade: 'Cleaning',
      title: 'Intensive Bathroom Hard-Water Scale & Tile Descaling',
      description: 'Remove stubborn yellow mineral deposits on sanitaryware, glass shower partitions, chrome CP fittings, and floor grouting.',
      standardTariff: 320,
      complexity: 'Standard',
      icon: '🚿',
    },
    {
      id: 'clean-sofa-shampoo',
      trade: 'Cleaning',
      title: 'Fabric Sofa & Carpet Injection-Extraction Shampoo',
      description: 'High-suction vacuum, enzyme spray agitation to lift body oil/pet stains, hot-water extraction sanitization.',
      standardTariff: 410,
      complexity: 'Moderate',
      icon: '🛋️',
    },
    {
      id: 'clean-balcony-floor',
      trade: 'Cleaning',
      title: 'Balcony & Terrace Jet Washing & Moss Eradication',
      description: 'High pressure rotary jet wash of outdoor anti-skid tiles, railing wipe-down, drain point clearing.',
      standardTariff: 250,
      complexity: 'Standard',
      icon: '🧹',
    },
  ],

  Gardening: [
    {
      id: 'garden-hedge-trim',
      trade: 'Gardening',
      title: 'Hedge Sculpting, Shrub Pruning & Deadheading',
      description: 'Trim overgrown boundary hedges, deadhead rose bushes, contour ornamental topiaries with shear blades.',
      standardTariff: 280,
      complexity: 'Standard',
      icon: '✂️',
    },
    {
      id: 'garden-soil-enrich',
      trade: 'Gardening',
      title: 'Soil Aeration (Gudai), Vermicompost & Pot Repotting',
      description: 'Aerate compacted root zones across 15-20 pots, blend organic neem cake and vermicompost, repot root-bound plants.',
      standardTariff: 340,
      complexity: 'Moderate',
      icon: '🪴',
    },
    {
      id: 'garden-pest-spray',
      trade: 'Gardening',
      title: 'Organic Neem Oil Bio-Pesticide Spray & Fungus Cure',
      description: 'Treat mealybug/aphid infestations with emulsified cold-pressed neem spray and trichoderma bio-fungicide drench.',
      standardTariff: 220,
      complexity: 'Standard',
      icon: '🐛',
    },
    {
      id: 'garden-drip-repair',
      trade: 'Gardening',
      title: 'Terrace Drip Irrigation Micro-Emitter Calibration',
      description: 'Clean clogged 4mm drip emitters, repair punctured mainline LDPE tubing, calibrate programmable water timer.',
      standardTariff: 310,
      complexity: 'Moderate',
      icon: '💧',
    },
  ],

  Driving: [
    {
      id: 'drive-city-trip',
      trade: 'Driving',
      title: 'City Inter-Zone Personal Chauffeur Duty',
      description: 'Licensed professional chauffeur for manual/automatic vehicles, airport transit, family event run (up to 4 hours).',
      standardTariff: 450,
      complexity: 'Moderate',
      icon: '🚗',
    },
    {
      id: 'drive-outstation',
      trade: 'Driving',
      title: 'Highway / NCR Outstation Driving Shift',
      description: 'Interstate expressway transit (Delhi-Jaipur / Delhi-Chandigarh) with verified police antecedent verification.',
      standardTariff: 750,
      complexity: 'Major',
      icon: '🛣️',
    },
  ],

  'Domestic Help': [
    {
      id: 'dom-meal-prep',
      trade: 'Domestic Help',
      title: 'Nutritious Family Meal Preparation Service',
      description: 'Hygienic prep of fresh home-style regional dishes (3 courses + flatbreads) with clean prep station sanitization.',
      standardTariff: 320,
      complexity: 'Standard',
      icon: '🍲',
    },
    {
      id: 'dom-organize',
      trade: 'Domestic Help',
      title: 'Pantry, Wardrobe & Kitchen Organization Assistance',
      description: 'Systematic decluttering, storage jar labeling, seasonal clothing folding, and cupboard surface wipe down.',
      standardTariff: 280,
      complexity: 'Standard',
      icon: '🧺',
    },
  ],

  Other: [
    {
      id: 'other-general-repair',
      trade: 'Other',
      title: 'General Household Multi-Task Maintenance',
      description: 'Miscellaneous fix-it checklist: curtain rod mounting, mirror anchoring, minor silicone grouting, doorbell test.',
      standardTariff: 250,
      complexity: 'Standard',
      icon: '🔨',
    },
    {
      id: 'other-appliance-mount',
      trade: 'Other',
      title: 'Heavy Wall Mounting & Concrete Anchor Drilling',
      description: 'Precision laser level drilling with heavy-duty steel expansion wedge anchors for TV unit or wall vanity.',
      standardTariff: 320,
      complexity: 'Moderate',
      icon: '🧱',
    },
  ],
};

export const getProblemsForTrade = (trade: ServiceCategory): DiagnosedProblem[] => {
  return TRADE_PROBLEMS[trade] || TRADE_PROBLEMS.Electrical;
};

export const TRADE_PROBLEMS_HI: Record<string, { title: string; description: string }> = {
  'elec-mcb-tripping': {
    title: 'एमसीबी ट्रिपिंग / जले हुए सर्किट ब्रेकर की मरम्मत',
    description: 'सर्किट लोड अलग करें, खराब 16A/32A एमसीबी बदलें, डिस्ट्रीब्यूटर बसबार कसें।',
  },
  'elec-fan-rewire': {
    title: 'सीलिंग फैन कैपेसिटर व वाइंडिंग ओवरहाल',
    description: 'पंखा खोलना, सूखा कैपेसिटर (2.5mfd/3.15mfd) बदलना, कॉइल व बेयरिंग ग्रीसिंग।',
  },
  'elec-short-circuit': {
    title: 'दीवार के अंदर शॉर्ट सर्किट ट्रेसिंग',
    description: 'मेगर इंसुलेशन टेस्ट, दीवार के अंदर जली हुई तारों को ढूंढना व नया कॉपर वायर डालना।',
  },
  'elec-switchboard-replace': {
    title: 'मॉड्यूलर स्विचबोर्ड व सॉकेट प्रतिस्थापन',
    description: '4 तक जले/स्पार्क करते स्विच, 16A पावर सॉकेट और फ्रंट प्लेट बदलना।',
  },
  'elec-inverter-wiring': {
    title: 'इन्वर्टर व बैटरी चार्जिंग सर्किट मरम्मत',
    description: 'आउटपुट रिले जांच, बैटरी टर्मिनल का कार्बन साफ करना, बैकअप बाईपास सर्किट ठीक करना।',
  },
  'elec-earthing-leakage': {
    title: 'अर्थ लीकेज व करंट झटका निवारण',
    description: 'अर्थिंग प्रतिरोध मापना, डिस्ट्रीब्यूशन बोर्ड में बॉन्डिंग तार जोड़ना, उपकरणों से करंट झटका रोकना।',
  },
  'plumb-leak-concealed': {
    title: 'दीवार के अंदर पाइप रिसाव व जोड़ मरम्मत',
    description: 'पाइपलाइन प्रेशर टेस्ट, टूटे सीपीवीसी/जीआई एल्बो तक पहुंचना, स्लिप सॉकेट जोड़ लगाना।',
  },
  'plumb-drain-clog': {
    title: 'किचन सिंक / नाली की गहरी सफाई व अनक्लॉगिंग',
    description: 'मैकेनिकल स्प्रिंग स्नेक और सुरक्षित विलायक से कचरा और जमी चिकनाई साफ करना।',
  },
  'plumb-tap-cartridge': {
    title: 'टपकती पीतल की टोंटी व मिक्सर कार्ट्रिज बदलना',
    description: 'जाम सिरेमिक स्पिंडल कार्ट्रिज निकालना, रबर ओ-रिंग बदलना, मिक्सर सीट सील करना।',
  },
  'plumb-flush-tank': {
    title: 'टॉयलेट सिस्टर्न व फ्लश वाल्व ओवरहाल',
    description: 'खराब डुअल-फ्लश साइफन, फ्लोट बॉल कॉक वाल्व और ओवरफ्लो सील बदलना।',
  },
  'carp-door-alignment': {
    title: 'दरवाजे का जाम होना, फ्रेम रगड़ व लॉक रिपेयर',
    description: 'लकड़ी की रंदाई, स्टेनलेस स्टील भारी कब्जे बदलना, मोर्टिज़ लॉक अलाइनमेंट।',
  },
  'carp-drawer-channel': {
    title: 'मॉड्यूलर दराज टेलीस्कोपिक चैनल प्रतिस्थापन',
    description: 'झुकी हुई दराज निकालना, 45 किग्रा सॉफ्ट-क्लोज बॉल बेयरिंग रनर चैनल लगाना।',
  },
  'paint-waterproofing-touchup': {
    title: 'नमीयुक्त दीवार पुट्टी व वाटरप्रूफ प्राइमर',
    description: 'पपड़ी वाली पेंट खुरचना, एंटी-फंगल सिलिकॉन सीलेंट लगाना, वाटरप्रूफ प्राइमर कोट।',
  },
  'clean-deep-sanitization': {
    title: 'गहन स्वच्छता, कीटाणुशोधन व फर्श स्क्रबिंग',
    description: 'उच्च-दबाव वैक्यूम, एसिड-मुक्त टाइल स्क्रबिंग, रसोई ग्रीस हटाना व सैनिटाइजेशन।',
  },
  'garden-trim-pruning': {
    title: 'पौधों की छंटाई, लॉन कटाई व जैविक खाद',
    description: 'झाड़ियों की छंटाई, लॉन घास काटना, जैविक वर्मीकम्पੋਸਟ डालना व कीट नियंत्रण।',
  },
  'driver-daily-shift': {
    title: 'अनुभवी पेशेवर चालक (मैनुअल/ऑटोमैटिक)',
    description: 'सत्यापित कमर्शियल लाइसेंस धारक, सुरक्षित शहर व हाईवे ड्राइविंग, वाहन सुरक्षा जांच।',
  },
  'tech-ac-service': {
    title: 'एसी डीप जेट सर्विस व गैस लीकेज जांच',
    description: 'कूलिंग कॉइल जेट वॉश, ड्रेन ट्रे सफाई, कंप्रेसर एम्पीयर व रेफ्रिजरेंट गैस प्रेशर जांच।',
  },
  'dom-kitchen-prep': {
    title: 'घरेलू व रसोई सहायक (दैनिक कार्य)',
    description: 'सब्जी काटना, रसोई काउंटर सैनिटाइजेशन, बर्तन सफाई व पेंट्री व्यवस्था।',
  },
  'other-general-repair': {
    title: 'सामान्य घरेलू बहु-कार्य मरम्मत',
    description: 'पर्दा रॉड लगाना, दर्पण ड्रिलिंग, सिलिकॉन ग्राउटिंग व विविध घरेलू मरम्मत।',
  },
};

export const getLocalizedProblem = (problem: DiagnosedProblem, language: string): DiagnosedProblem => {
  if (language === 'hi' && TRADE_PROBLEMS_HI[problem.id]) {
    return {
      ...problem,
      title: TRADE_PROBLEMS_HI[problem.id].title,
      description: TRADE_PROBLEMS_HI[problem.id].description,
    };
  }
  return problem;
};


