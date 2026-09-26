/**
 * Internationalization (i18n) Translation Dictionaries
 *
 * Complete translations for English (en), Tamil (ta), and Hindi (hi)
 * covering all safety instructions, clinical first aid, risk tiers,
 * emergency protocols, data provenance, and UI navigation.
 */

export type Language = 'en' | 'ta' | 'hi';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ta: 'தமிழ்',
  hi: 'हिन्दी',
};

export const translations = {
  // ══════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════════════════════════════════
  en: {
    nav: {
      dashboard: 'Dashboard',
      liveMap: 'Live Map',
      learn: 'Learn THERMOS',
      about: 'About',
      govPortal: 'Gov Portal',
      safety: 'Safety Guidelines',
      switchToUser: 'Switch to User',
      switchToGov: 'Switch to Gov',
      logout: 'Logout',
      skipToContent: 'Skip to main content',
      lowBandwidth: 'Low Bandwidth Mode',
      highContrast: 'High Contrast',
    },
    banner: {
      emergencyHelplines: 'Emergency Helplines',
      preDeployment: 'Pre-Deployment Version',
      pilot: 'Pilot Version',
      official: 'Official Government Portal',
      language: 'Language',
    },
    risk: {
      low: 'Low Risk',
      moderate: 'Moderate Risk',
      high: 'High Risk',
      extreme: 'Extreme Risk',
      unavailable: 'Data Unavailable',
    },
    safety: {
      title: 'Public Health Safety Guidelines',
      subtitle: 'Official heat safety actions for each risk level',
      lowTitle: 'Low Risk — Normal Precautions',
      lowActions: [
        'Stay hydrated — drink water regularly throughout the day.',
        'Continue normal activities with standard precautions.',
        'Monitor weather conditions for any changes.',
      ],
      moderateTitle: 'Moderate Risk — Increased Caution',
      moderateActions: [
        'Drink water regularly, even if you do not feel thirsty.',
        'Reduce unnecessary outdoor activity during peak heat hours (12 PM – 3 PM).',
        'Take breaks in shaded or cool areas when outdoors.',
        'Wear loose, light-colored clothing and a hat.',
      ],
      highTitle: 'High Risk — Danger',
      highActions: [
        'Avoid prolonged outdoor exposure, especially during midday hours.',
        'Keep children and elderly people cool and well-hydrated.',
        'Outdoor workers should take mandatory shade breaks every 30 minutes.',
        'Watch for signs of heat exhaustion: heavy sweating, weakness, nausea, dizziness.',
        'Move to a cool place immediately if you feel unwell.',
      ],
      extremeTitle: 'Extreme Risk — Life-Threatening',
      extremeActions: [
        'Avoid all unnecessary outdoor activity.',
        'Stay in a cool or air-conditioned location whenever possible.',
        'Check on vulnerable family members, neighbours, and elderly relatives frequently.',
        'Seek medical help immediately if symptoms of heatstroke appear.',
        'Do not leave children, elderly, or pets in parked vehicles.',
        'Drink water continuously — do not wait until you are thirsty.',
      ],
    },
    vulnerable: {
      title: 'Vulnerable Groups',
      subtitle: 'People at higher risk during heat events',
      groups: [
        { name: 'Infants and young children (under 5 years)', reason: 'Cannot regulate body temperature effectively.' },
        { name: 'Elderly (over 65 years)', reason: 'Reduced ability to thermoregulate and sense thirst.' },
        { name: 'Outdoor workers (construction, farming, delivery)', reason: 'Prolonged heat exposure during physical labor.' },
        { name: 'Pregnant women', reason: 'Increased metabolic heat and dehydration risk.' },
        { name: 'People with chronic illness (heart disease, diabetes, kidney disease)', reason: 'Impaired thermoregulation and medication interactions.' },
        { name: 'People without access to cool shelter or clean water', reason: 'Unable to escape heat exposure.' },
      ],
    },
    symptoms: {
      title: 'Recognizing Heat Illness',
      exhaustionTitle: 'Heat Exhaustion',
      exhaustionSymptoms: ['Heavy sweating', 'Cold, pale, and clammy skin', 'Fast, weak pulse', 'Nausea or vomiting', 'Muscle cramps', 'Tiredness or weakness', 'Dizziness', 'Headache', 'Fainting'],
      heatstrokeTitle: 'Heatstroke (Medical Emergency)',
      heatstrokeSymptoms: ['Body temperature above 40°C (104°F)', 'Hot, red, dry, or damp skin', 'Fast, strong pulse', 'Headache', 'Dizziness', 'Nausea', 'Confusion or altered mental state', 'Loss of consciousness'],
      heatstrokeWarning: 'Heatstroke is a life-threatening emergency. Call 112 or 108 immediately.',
    },
    firstAid: {
      title: 'Heatstroke First Aid',
      subtitle: 'Immediate actions while waiting for emergency services',
      steps: [
        'Call emergency services immediately (112 or 108).',
        'Move the person to a cool, shaded place.',
        'Remove excess clothing.',
        'Cool the person rapidly — apply cold, wet cloths or pour cool water on the body.',
        'Place ice packs on the neck, armpits, and groin.',
        'Fan the person while misting with cool water.',
        'If conscious, give small sips of cool water — do not force fluids.',
        'Place the person in the recovery position if unconscious.',
        'Monitor breathing and consciousness until emergency services arrive.',
      ],
      doNotDo: [
        'Do NOT give very cold or ice water to drink — this can cause stomach cramps.',
        'Do NOT give any fluids to an unconscious person.',
        'Do NOT leave the person alone.',
        'Do NOT use alcohol-based products to cool the skin.',
      ],
    },
    emergency: {
      title: 'Emergency Information',
      subtitle: 'Important helpline numbers',
      callImmediately: 'Call immediately if you or someone shows symptoms of heatstroke.',
      seekMedical: 'When to seek medical attention',
      seekMedicalConditions: [
        'Body temperature above 40°C (104°F)',
        'Confusion, slurred speech, or altered consciousness',
        'Hot, dry skin without sweating',
        'Seizures',
        'Loss of consciousness',
        'Persistent vomiting',
        'Symptoms of heat exhaustion that do not improve within 30 minutes of rest and cooling',
      ],
    },
    provenance: {
      liveData: 'Live Data',
      delayedData: 'Delayed Data',
      historicalData: 'Historical Data',
      unavailableData: 'Data Unavailable',
      source: 'Source',
      lastUpdated: 'Last Updated',
      refreshRate: 'Refresh Rate',
      minutes: 'minutes',
      liveWeatherUnavailable: 'Live weather data is currently unavailable. Showing last verified update.',
      staleWarning: 'This data may be outdated. Please check official sources for the latest information.',
    },
    ai: {
      title: 'AI Risk Assessment — Transparency',
      whatItDoes: 'What the AI does',
      whatItDoesDesc: 'THERMOS uses published biometeorological formulas to calculate a Heat Thermal Stress Score (HTSS) based on real-time weather data. It estimates the physiological heat stress risk for a given location.',
      whatDataItUses: 'What data the AI uses',
      whatDataItUsesDesc: 'Air temperature, relative humidity, wind speed, and solar radiation from the Open-Meteo weather API (GFS/ECMWF models).',
      whatItCalculates: 'What the AI calculates',
      whatItCalculatesDesc: 'Wet Bulb Globe Temperature (WBGT), Universal Thermal Climate Index (UTCI), Heat Index, and a composite Heat Thermal Stress Score (HTSS) from 10 to 99.',
      howOften: 'How frequently it updates',
      howOftenDesc: 'Every 15 minutes when live weather data is available.',
      limitations: 'Limitations',
      disclaimer: 'Important Disclaimer',
      disclaimerText: 'The THERMOS HTSS risk score is an AI-assisted estimation tool. It does NOT replace official government advisories from the India Meteorological Department (IMD), National Disaster Management Authority (NDMA), or medical advice from healthcare professionals. Always follow official government warnings during heat events.',
      officialVsAi: 'Official Warning vs. AI Score',
      officialWarning: 'Official IMD Warning',
      officialWarningDesc: 'Based on air temperature thresholds set by the India Meteorological Department. This is the statutory, authoritative heatwave determination.',
      aiScore: 'THERMOS AI Score (HTSS)',
      aiScoreDesc: 'A supplementary multi-factor physiological stress index that considers temperature, humidity, wind, and solar radiation together. It is an auxiliary early-warning tool.',
    },
    privacy: {
      title: 'Privacy Policy',
      content: [
        'THERMOS uses your device\'s location (GPS or network) solely to display weather and heat risk data for your area. Location data is processed entirely within your browser and is not transmitted to any server, stored, or shared with third parties.',
        'No personal information, IP addresses, browsing history, or location history is collected, stored, or sold.',
        'Cookies are used only for saving your language preference and display settings. No tracking or advertising cookies are used.',
        'Weather data is fetched from the Open-Meteo API using your coordinates. Open-Meteo does not receive any personal identifiers beyond the latitude and longitude necessary for the weather query.',
        'If this portal is officially adopted by a government department, this privacy policy will be updated to reflect the data practices of the hosting authority.',
      ],
    },
    terms: {
      title: 'Terms of Use',
      content: [
        'THERMOS is a public-interest heat safety information tool. It is provided free of charge for emergency preparedness and public health awareness.',
        'The heat risk scores, weather data, and safety information are provided for informational purposes only. They do not constitute official meteorological forecasts or medical advice.',
        'Users must always follow official government warnings issued by the India Meteorological Department (IMD) and the National Disaster Management Authority (NDMA) during heat events.',
        'The system operators are not liable for actions taken or not taken based on information provided by this tool.',
        'Health and safety content is prepared for review by medical and public health professionals. Users experiencing heat illness symptoms should contact emergency services (112 / 108) immediately.',
        'This portal is not yet officially endorsed by any government department. Official deployment requires formal authorization.',
      ],
    },
    accessibility: {
      title: 'Accessibility Statement',
      content: [
        'THERMOS is designed to meet WCAG 2.1 Level AA accessibility standards.',
        'Keyboard navigation: All interactive elements are accessible via keyboard. Use Tab to navigate, Enter or Space to activate, and Escape to close modals.',
        'Screen readers: The interface uses proper ARIA labels, landmarks, and roles for screen reader compatibility.',
        'Color and text: Risk levels are communicated using both color and text labels. The interface does not rely on color alone.',
        'Text contrast: All text meets the WCAG 2.1 AA minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.',
        'Low-bandwidth mode: A lightweight mode is available for users on slow connections or low-end devices.',
        'If you experience any accessibility issues, please report them through the contact information provided in this portal.',
      ],
    },
    governance: {
      title: 'Governance & Accountability',
      subtitle: 'Responsibility assignments for official deployment',
      pending: 'To be assigned upon official deployment',
      areas: [
        { name: 'System Ownership', desc: 'Responsible government body / department' },
        { name: 'Content Updates', desc: 'Content management and editorial review team' },
        { name: 'Data Management', desc: 'Data governance and quality assurance officer' },
        { name: 'AI / Model Management', desc: 'AI/ML technical team for model updates and monitoring' },
        { name: 'Security', desc: 'Cybersecurity team / CERT-In coordination' },
        { name: 'Infrastructure', desc: 'Cloud / hosting infrastructure operations team' },
        { name: 'Emergency Alerts', desc: 'Emergency alert operations center' },
        { name: 'Citizen Complaints', desc: 'Public grievance redressal mechanism' },
        { name: 'Incorrect Data Correction', desc: 'Data quality assurance and correction process' },
        { name: 'Medical Review', desc: 'Medical / public health advisory board' },
      ],
    },
    footer: {
      lastUpdated: 'Last Updated',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      accessibilityStatement: 'Accessibility Statement',
      aiTransparency: 'AI Transparency',
      governanceContact: 'Governance & Contact',
      developers: "DEVELOPER'S",
      dataSources: 'Data Sources',
      disclaimer: 'This tool supplements but does not replace official government advisories or medical advice.',
    },
    threshold: {
      title: 'Official Warnings vs. THERMOS AI',
      imdTitle: 'Official IMD Heatwave Warning',
      imdDesc: 'Statutory determination by the India Meteorological Department based on air temperature thresholds.',
      htssTitle: 'THERMOS Heat Stress Score (HTSS)',
      htssDesc: 'Auxiliary AI-assisted multi-factor physiological stress index. Supplements but does not replace IMD warnings.',
      imdPriority: 'Official IMD warnings always take priority.',
      plains: 'Plains',
      coastal: 'Coastal',
      heatwave: 'Heatwave',
      severeHeatwave: 'Severe Heatwave',
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // TAMIL (தமிழ்)
  // ══════════════════════════════════════════════════════════════════════
  ta: {
    nav: {
      dashboard: 'டாஷ்போர்டு',
      liveMap: 'நேரடி வரைபடம்',
      learn: 'THERMOS கற்றுக்கொள்ளுங்கள்',
      about: 'பற்றி',
      govPortal: 'அரசு போர்ட்டல்',
      safety: 'பாதுகாப்பு வழிகாட்டுதல்கள்',
      switchToUser: 'பயனருக்கு மாறு',
      switchToGov: 'அரசுக்கு மாறு',
      logout: 'வெளியேறு',
      skipToContent: 'முக்கிய உள்ளடக்கத்திற்கு செல்லவும்',
      lowBandwidth: 'குறைந்த அலைவரிசை பயன்முறை',
      highContrast: 'உயர் மாறுபாடு',
    },
    banner: {
      emergencyHelplines: 'அவசர உதவி எண்கள்',
      preDeployment: 'முன்-பயன்பாட்டு பதிப்பு',
      pilot: 'சோதனை பதிப்பு',
      official: 'அதிகாரப்பூர்வ அரசு போர்ட்டல்',
      language: 'மொழி',
    },
    risk: {
      low: 'குறைந்த ஆபத்து',
      moderate: 'மிதமான ஆபத்து',
      high: 'அதிக ஆபத்து',
      extreme: 'தீவிர ஆபத்து',
      unavailable: 'தரவு கிடைக்கவில்லை',
    },
    safety: {
      title: 'பொது சுகாதார பாதுகாப்பு வழிகாட்டுதல்கள்',
      subtitle: 'ஒவ்வொரு ஆபத்து நிலைக்கும் வெப்ப பாதுகாப்பு நடவடிக்கைகள்',
      lowTitle: 'குறைந்த ஆபத்து — இயல்பான முன்னெச்சரிக்கைகள்',
      lowActions: ['நீரேற்றமாக இருங்கள் — நாள் முழுவதும் தண்ணீர் குடியுங்கள்.', 'இயல்பான செயல்பாடுகளை தொடருங்கள்.', 'வானிலை மாற்றங்களை கண்காணியுங்கள்.'],
      moderateTitle: 'மிதமான ஆபத்து — அதிக எச்சரிக்கை',
      moderateActions: ['தாகம் இல்லாவிட்டாலும் தண்ணீர் குடியுங்கள்.', 'உச்ச வெப்ப நேரங்களில் (12 – 3 PM) வெளிப்புற செயல்பாடுகளை குறைக்கவும்.', 'நிழலான பகுதிகளில் ஓய்வு எடுங்கள்.', 'தளர்வான, வெளிர் நிற ஆடைகள் அணியுங்கள்.'],
      highTitle: 'அதிக ஆபத்து — ஆபத்து',
      highActions: ['நீண்ட நேர வெளிப்புற வெப்பத்தை தவிர்க்கவும்.', 'குழந்தைகள் மற்றும் முதியோரை குளிர்ச்சியாக வைக்கவும்.', 'தொழிலாளர்கள் ஒவ்வொரு 30 நிமிடங்களுக்கும் ஓய்வு எடுக்க வேண்டும்.', 'வெப்ப சோர்வு அறிகுறிகளை கவனியுங்கள்.', 'உடல்நிலை சரியில்லை என்றால் குளிர்ச்சியான இடத்திற்கு செல்லுங்கள்.'],
      extremeTitle: 'தீவிர ஆபத்து — உயிருக்கு ஆபத்தானது',
      extremeActions: ['தேவையற்ற வெளிப்புற செயல்பாடுகளை தவிர்க்கவும்.', 'குளிர்ச்சியான இடத்தில் இருங்கள்.', 'பாதிக்கப்படக்கூடிய குடும்பத்தினரை சோதிக்கவும்.', 'வெப்ப அடி அறிகுறிகள் தோன்றினால் மருத்துவ உதவி பெறுங்கள்.', 'குழந்தைகளை நிறுத்தப்பட்ட வாகனங்களில் விடாதீர்கள்.', 'தொடர்ந்து தண்ணீர் குடியுங்கள்.'],
    },
    vulnerable: {
      title: 'பாதிக்கப்படக்கூடிய குழுக்கள்',
      subtitle: 'வெப்ப நிகழ்வுகளின் போது அதிக ஆபத்தில் உள்ளவர்கள்',
      groups: [
        { name: 'குழந்தைகள் (5 வயதுக்குக் கீழ்)', reason: 'உடல் வெப்பநிலையை கட்டுப்படுத்த இயலாது.' },
        { name: 'முதியோர் (65 வயதுக்கு மேல்)', reason: 'வெப்பநிலை கட்டுப்பாடு குறைவு.' },
        { name: 'வெளிப்புற தொழிலாளர்கள்', reason: 'நீண்ட நேர வெப்ப வெளிப்பாடு.' },
        { name: 'கர்ப்பிணிப் பெண்கள்', reason: 'நீரிழப்பு ஆபத்து அதிகம்.' },
        { name: 'நாட்பட்ட நோய் உள்ளவர்கள்', reason: 'பலவீனமான வெப்பநிலை கட்டுப்பாடு.' },
        { name: 'குளிர்ச்சியான தங்குமிடம் இல்லாதவர்கள்', reason: 'வெப்பத்திலிருந்து தப்ப இயலாது.' },
      ],
    },
    symptoms: {
      title: 'வெப்ப நோயை அடையாளம் காணுதல்',
      exhaustionTitle: 'வெப்ப சோர்வு',
      exhaustionSymptoms: ['அதிக வியர்வை', 'குளிர்ச்சியான, வெளிர் தோல்', 'வேகமான, பலவீனமான துடிப்பு', 'குமட்டல்', 'தசைப்பிடிப்பு', 'சோர்வு', 'தலைசுற்றல்', 'தலைவலி', 'மயக்கம்'],
      heatstrokeTitle: 'வெப்ப அடி (மருத்துவ அவசரநிலை)',
      heatstrokeSymptoms: ['உடல் வெப்பநிலை 40°C க்கு மேல்', 'சூடான, சிவப்பான தோல்', 'வேகமான, வலுவான துடிப்பு', 'தலைவலி', 'தலைசுற்றல்', 'குமட்டல்', 'குழப்பம்', 'நினைவிழப்பு'],
      heatstrokeWarning: 'வெப்ப அடி உயிருக்கு ஆபத்தான அவசரநிலை. உடனடியாக 112 அல்லது 108 ஐ அழைக்கவும்.',
    },
    firstAid: {
      title: 'வெப்ப அடி முதலுதவி',
      subtitle: 'அவசர சேவைகளுக்காக காத்திருக்கும் போது நடவடிக்கைகள்',
      steps: ['உடனடியாக 112 அல்லது 108 ஐ அழைக்கவும்.', 'குளிர்ச்சியான இடத்திற்கு நகர்த்தவும்.', 'அதிகப்படியான ஆடைகளை அகற்றவும்.', 'குளிர்ந்த நீரால் உடலை குளிர்விக்கவும்.', 'கழுத்து, அக்குள் பகுதியில் பனிக்கட்டி வைக்கவும்.', 'விசிறி வீசவும்.', 'நினைவு இருந்தால் சிறிது நீர் கொடுக்கவும்.', 'நினைவற்ற நிலையில் மீட்பு நிலையில் வைக்கவும்.', 'சுவாசம் கண்காணியுங்கள்.'],
      doNotDo: ['மிகவும் குளிர்ந்த நீர் கொடுக்காதீர்கள்.', 'நினைவற்ற நபருக்கு திரவங்கள் கொடுக்காதீர்கள்.', 'தனியாக விடாதீர்கள்.', 'மது சார்ந்த பொருட்களை பயன்படுத்தாதீர்கள்.'],
    },
    emergency: {
      title: 'அவசர தகவல்',
      subtitle: 'முக்கிய உதவி எண்கள்',
      callImmediately: 'வெப்ப அடி அறிகுறிகள் தோன்றினால் உடனடியாக அழைக்கவும்.',
      seekMedical: 'மருத்துவ கவனிப்பை எப்போது பெற வேண்டும்',
      seekMedicalConditions: ['உடல் வெப்பநிலை 40°C க்கு மேல்', 'குழப்பம் அல்லது மாற்றப்பட்ட நினைவு', 'வியர்வை இல்லாமல் சூடான தோல்', 'வலிப்புத்தாக்கங்கள்', 'நினைவிழப்பு', 'தொடர்ச்சியான வாந்தி', '30 நிமிடங்களுக்குப் பிறகும் அறிகுறிகள் மேம்படவில்லை'],
    },
    provenance: {
      liveData: 'நேரடி தரவு', delayedData: 'தாமதமான தரவு', historicalData: 'வரலாற்று தரவு', unavailableData: 'தரவு கிடைக்கவில்லை',
      source: 'ஆதாரம்', lastUpdated: 'கடைசி புதுப்பிப்பு', refreshRate: 'புதுப்பிப்பு விகிதம்', minutes: 'நிமிடங்கள்',
      liveWeatherUnavailable: 'நேரடி வானிலை தரவு தற்போது கிடைக்கவில்லை.', staleWarning: 'இந்தத் தரவு காலாவதியாகிருக்கலாம்.',
    },
    ai: {
      title: 'AI ஆபத்து மதிப்பீடு — வெளிப்படைத்தன்மை',
      whatItDoes: 'AI என்ன செய்கிறது', whatItDoesDesc: 'THERMOS நிகழ்நேர வானிலைத் தரவின் அடிப்படையில் வெப்ப அழுத்த மதிப்பெண்ணை (HTSS) கணக்கிடுகிறது.',
      whatDataItUses: 'AI எந்த தரவைப் பயன்படுத்துகிறது', whatDataItUsesDesc: 'Open-Meteo API இலிருந்து காற்று வெப்பநிலை, ஈரப்பதம், காற்று வேகம் மற்றும் சூரிய கதிர்வீச்சு.',
      whatItCalculates: 'AI என்ன கணக்கிடுகிறது', whatItCalculatesDesc: 'WBGT, UTCI, வெப்ப குறியீடு, மற்றும் 10 முதல் 99 வரையிலான HTSS.',
      howOften: 'எவ்வளவு அடிக்கடி புதுப்பிக்கப்படுகிறது', howOftenDesc: 'ஒவ்வொரு 15 நிமிடங்களுக்கும்.',
      limitations: 'வரம்புகள்',
      disclaimer: 'முக்கியமான மறுப்பு',
      disclaimerText: 'THERMOS HTSS ஆபத்து மதிப்பெண் AI-உதவி மதிப்பீடு கருவி. இது IMD, NDMA அல்லது மருத்துவ ஆலோசனையை மாற்றாது.',
      officialVsAi: 'அதிகாரப்பூர்வ எச்சரிக்கை vs AI மதிப்பெண்',
      officialWarning: 'அதிகாரப்பூர்வ IMD எச்சரிக்கை', officialWarningDesc: 'IMD நிர்ணயித்த காற்று வெப்பநிலை வரம்புகளின் அடிப்படையில்.',
      aiScore: 'THERMOS AI மதிப்பெண் (HTSS)', aiScoreDesc: 'துணை பல்காரணி உடலியல் அழுத்த குறியீடு.',
    },
    privacy: { title: 'தனியுரிமைக் கொள்கை', content: ['இருப்பிடத் தரவு உங்கள் உலாவியில் மட்டுமே செயலாக்கப்படுகிறது.', 'தனிப்பட்ட தகவல்கள் சேகரிக்கப்படவோ விற்கப்படவோ இல்லை.', 'குக்கீகள் மொழி விருப்பத்திற்கு மட்டுமே.'] },
    terms: { title: 'பயன்பாட்டு விதிமுறைகள்', content: ['THERMOS இலவச பொது நலன் கருவி.', 'வெப்ப ஆபத்து மதிப்பெண்கள் தகவல் நோக்கங்களுக்காக மட்டுமே.', 'IMD மற்றும் NDMA எச்சரிக்கைகளை பின்பற்றுங்கள்.'] },
    accessibility: { title: 'அணுகல் அறிக்கை', content: ['WCAG 2.1 நிலை AA தரங்களை பூர்த்தி செய்ய வடிவமைக்கப்பட்டுள்ளது.', 'விசைப்பலகை வழிசெலுத்தல் ஆதரிக்கப்படுகிறது.', 'ஆபத்து நிலைகள் நிறம் மற்றும் உரை இரண்டையும் பயன்படுத்துகின்றன.'] },
    governance: {
      title: 'நிர்வாகம் மற்றும் பொறுப்புணர்வு', subtitle: 'அதிகாரப்பூர்வ பயன்பாட்டிற்கான பொறுப்பு நியமனங்கள்', pending: 'அதிகாரப்பூர்வ பயன்பாட்டின் போது நியமிக்கப்படும்',
      areas: [
        { name: 'அமைப்பு உரிமை', desc: 'பொறுப்பான அரசு அமைப்பு' }, { name: 'உள்ளடக்க புதுப்பிப்புகள்', desc: 'உள்ளடக்க குழு' },
        { name: 'தரவு மேலாண்மை', desc: 'தரவு அதிகாரி' }, { name: 'AI மேலாண்மை', desc: 'AI/ML குழு' },
        { name: 'பாதுகாப்பு', desc: 'இணைய பாதுகாப்பு குழு' }, { name: 'உள்கட்டமைப்பு', desc: 'ஹோஸ்டிங் குழு' },
        { name: 'அவசர எச்சரிக்கைகள்', desc: 'அவசர மையம்' }, { name: 'குடிமக்கள் புகார்கள்', desc: 'குறை தீர்வு பொறிமுறை' },
        { name: 'தரவு திருத்தம்', desc: 'தர உறுதி செயல்முறை' }, { name: 'மருத்துவ மதிப்பாய்வு', desc: 'சுகாதார ஆலோசனை குழு' },
      ],
    },
    footer: {
      lastUpdated: 'கடைசி புதுப்பிப்பு', privacyPolicy: 'தனியுரிமைக் கொள்கை', termsOfUse: 'பயன்பாட்டு விதிமுறைகள்',
      accessibilityStatement: 'அணுகல் அறிக்கை', aiTransparency: 'AI வெளிப்படைத்தன்மை', governanceContact: 'நிர்வாகம் & தொடர்பு',
      developers: "DEVELOPER'S",
      dataSources: 'தரவு ஆதாரங்கள்', disclaimer: 'இந்தக் கருவி அரசு ஆலோசனைகள் அல்லது மருத்துவ ஆலோசனையை மாற்றாது.',
    },
    threshold: {
      title: 'அதிகாரப்பூர்வ எச்சரிக்கைகள் vs THERMOS AI', imdTitle: 'அதிகாரப்பூர்வ IMD வெப்ப அலை எச்சரிக்கை',
      imdDesc: 'IMD சட்டப்படி தீர்மானம்.', htssTitle: 'THERMOS வெப்ப அழுத்த மதிப்பெண் (HTSS)',
      htssDesc: 'துணை AI குறியீடு. IMD எச்சரிக்கைகளை மாற்றாது.', imdPriority: 'IMD எச்சரிக்கைகள் முன்னுரிமை பெறும்.',
      plains: 'சமவெளிகள்', coastal: 'கடலோர', heatwave: 'வெப்ப அலை', severeHeatwave: 'கடுமையான வெப்ப அலை',
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  // HINDI (हिन्दी)
  // ══════════════════════════════════════════════════════════════════════
  hi: {
    nav: {
      dashboard: 'डैशबोर्ड', liveMap: 'लाइव मानचित्र', learn: 'THERMOS सीखें', about: 'परिचय',
      govPortal: 'सरकारी पोर्टल', safety: 'सुरक्षा दिशानिर्देश', switchToUser: 'उपयोगकर्ता मोड',
      switchToGov: 'सरकारी मोड', logout: 'लॉगआउट', skipToContent: 'मुख्य सामग्री पर जाएँ',
      lowBandwidth: 'कम बैंडविड्थ मोड', highContrast: 'उच्च कंट्रास्ट',
    },
    banner: { emergencyHelplines: 'आपातकालीन हेल्पलाइन', preDeployment: 'प्रारंभिक संस्करण', pilot: 'पायलट संस्करण', official: 'आधिकारिक सरकारी पोर्टल', language: 'भाषा' },
    risk: { low: 'कम जोखिम', moderate: 'मध्यम जोखिम', high: 'उच्च जोखिम', extreme: 'अत्यधिक जोखिम', unavailable: 'डेटा अनुपलब्ध' },
    safety: {
      title: 'सार्वजनिक स्वास्थ्य सुरक्षा दिशानिर्देश', subtitle: 'प्रत्येक जोखिम स्तर के लिए गर्मी सुरक्षा कार्रवाई',
      lowTitle: 'कम जोखिम — सामान्य सावधानी',
      lowActions: ['हाइड्रेटेड रहें — नियमित रूप से पानी पिएं।', 'सामान्य गतिविधियाँ जारी रखें।', 'मौसम की निगरानी करें।'],
      moderateTitle: 'मध्यम जोखिम — बढ़ी हुई सावधानी',
      moderateActions: ['नियमित रूप से पानी पिएं।', 'चरम गर्मी (12 – 3 PM) में बाहरी गतिविधि कम करें।', 'छायादार क्षेत्रों में आराम करें।', 'ढीले, हल्के कपड़े पहनें।'],
      highTitle: 'उच्च जोखिम — खतरा',
      highActions: ['लंबे समय तक बाहर रहने से बचें।', 'बच्चों और बुजुर्गों को ठंडा रखें।', 'श्रमिक हर 30 मिनट में विश्राम करें।', 'गर्मी की थकान के लक्षणों पर ध्यान दें।', 'अगर तबीयत खराब लगे तो ठंडी जगह जाएं।'],
      extremeTitle: 'अत्यधिक जोखिम — जानलेवा',
      extremeActions: ['सभी अनावश्यक बाहरी गतिविधियों से बचें।', 'ठंडे स्थान पर रहें।', 'कमज़ोर परिवार सदस्यों की जाँच करें।', 'हीटस्ट्रोक के लक्षण दिखने पर चिकित्सा सहायता लें।', 'बच्चों को खड़े वाहनों में न छोड़ें।', 'लगातार पानी पिएं।'],
    },
    vulnerable: {
      title: 'कमज़ोर समूह', subtitle: 'गर्मी में अधिक जोखिम वाले लोग',
      groups: [
        { name: 'शिशु और छोटे बच्चे (5 वर्ष से कम)', reason: 'शरीर तापमान नियंत्रित नहीं कर सकते।' },
        { name: 'बुजुर्ग (65 वर्ष से अधिक)', reason: 'तापमान नियंत्रण क्षमता कम।' },
        { name: 'बाहरी श्रमिक', reason: 'लंबे समय तक गर्मी का संपर्क।' },
        { name: 'गर्भवती महिलाएं', reason: 'निर्जलीकरण का खतरा अधिक।' },
        { name: 'पुरानी बीमारी वाले लोग', reason: 'कमज़ोर तापमान नियंत्रण।' },
        { name: 'ठंडे आश्रय तक पहुँच न रखने वाले', reason: 'गर्मी से बचने में असमर्थ।' },
      ],
    },
    symptoms: {
      title: 'गर्मी की बीमारी की पहचान',
      exhaustionTitle: 'गर्मी की थकान',
      exhaustionSymptoms: ['अधिक पसीना', 'ठंडी, पीली त्वचा', 'तेज़, कमज़ोर नाड़ी', 'मतली', 'मांसपेशियों में ऐंठन', 'थकान', 'चक्कर', 'सिरदर्द', 'बेहोशी'],
      heatstrokeTitle: 'हीटस्ट्रोक (चिकित्सा आपातकाल)',
      heatstrokeSymptoms: ['शरीर तापमान 40°C से ऊपर', 'गर्म, लाल, सूखी त्वचा', 'तेज़ नाड़ी', 'सिरदर्द', 'चक्कर', 'मतली', 'भ्रम', 'बेहोशी'],
      heatstrokeWarning: 'हीटस्ट्रोक जानलेवा आपातकाल है। तुरंत 112 या 108 पर कॉल करें।',
    },
    firstAid: {
      title: 'हीटस्ट्रोक प्राथमिक चिकित्सा', subtitle: 'आपातकालीन सेवाओं की प्रतीक्षा करते समय',
      steps: ['तुरंत 112 या 108 पर कॉल करें।', 'ठंडी जगह पर ले जाएं।', 'अतिरिक्त कपड़े हटाएं।', 'ठंडे पानी से शरीर ठंडा करें।', 'गर्दन, बगल पर बर्फ रखें।', 'पंखा करें।', 'होश में हो तो थोड़ा पानी दें।', 'बेहोश हो तो रिकवरी पोज़िशन में रखें।', 'सांस की निगरानी करें।'],
      doNotDo: ['बहुत ठंडा पानी न दें।', 'बेहोश व्यक्ति को तरल न दें।', 'अकेला न छोड़ें।', 'अल्कोहल उत्पाद उपयोग न करें।'],
    },
    emergency: {
      title: 'आपातकालीन जानकारी', subtitle: 'महत्वपूर्ण हेल्पलाइन',
      callImmediately: 'हीटस्ट्रोक के लक्षण दिखने पर तुरंत कॉल करें।',
      seekMedical: 'चिकित्सा सहायता कब लें',
      seekMedicalConditions: ['तापमान 40°C से ऊपर', 'भ्रम या बदली चेतना', 'पसीने बिना गर्म त्वचा', 'दौरे', 'बेहोशी', 'लगातार उल्टी', '30 मिनट बाद भी सुधार नहीं'],
    },
    provenance: {
      liveData: 'लाइव डेटा', delayedData: 'विलंबित डेटा', historicalData: 'ऐतिहासिक डेटा', unavailableData: 'डेटा अनुपलब्ध',
      source: 'स्रोत', lastUpdated: 'अंतिम अपडेट', refreshRate: 'रिफ्रेश दर', minutes: 'मिनट',
      liveWeatherUnavailable: 'लाइव मौसम डेटा अनुपलब्ध है।', staleWarning: 'यह डेटा पुराना हो सकता है।',
    },
    ai: {
      title: 'AI जोखिम मूल्यांकन — पारदर्शिता',
      whatItDoes: 'AI क्या करता है', whatItDoesDesc: 'THERMOS वास्तविक समय मौसम डेटा से ताप तनाव स्कोर (HTSS) गणना करता है।',
      whatDataItUses: 'AI किस डेटा का उपयोग करता है', whatDataItUsesDesc: 'Open-Meteo API से वायु तापमान, आर्द्रता, हवा गति और सौर विकिरण।',
      whatItCalculates: 'AI क्या गणना करता है', whatItCalculatesDesc: 'WBGT, UTCI, हीट इंडेक्स, और 10 से 99 तक HTSS।',
      howOften: 'कितनी बार अपडेट', howOftenDesc: 'हर 15 मिनट में।',
      limitations: 'सीमाएं', disclaimer: 'महत्वपूर्ण अस्वीकरण',
      disclaimerText: 'THERMOS HTSS AI-सहायित अनुमान उपकरण है। यह IMD, NDMA या चिकित्सा सलाह का विकल्प नहीं है।',
      officialVsAi: 'आधिकारिक चेतावनी vs AI स्कोर',
      officialWarning: 'आधिकारिक IMD चेतावनी', officialWarningDesc: 'IMD द्वारा निर्धारित वायु तापमान सीमाओं पर आधारित।',
      aiScore: 'THERMOS AI स्कोर (HTSS)', aiScoreDesc: 'पूरक बहु-कारक शारीरिक तनाव सूचकांक।',
    },
    privacy: { title: 'गोपनीयता नीति', content: ['स्थान डेटा केवल ब्राउज़र में संसाधित होता है।', 'कोई व्यक्तिगत जानकारी एकत्र नहीं की जाती।', 'कुकीज़ केवल भाषा सेटिंग के लिए।'] },
    terms: { title: 'उपयोग की शर्तें', content: ['THERMOS निःशुल्क सार्वजनिक कल्याण उपकरण है।', 'जोखिम स्कोर केवल सूचनात्मक हैं।', 'IMD और NDMA चेतावनियों का पालन करें।'] },
    accessibility: { title: 'पहुँच विवरण', content: ['WCAG 2.1 AA मानकों के अनुसार।', 'कीबोर्ड नेविगेशन समर्थित।', 'जोखिम स्तर रंग और टेक्स्ट दोनों से दर्शाए जाते हैं।'] },
    governance: {
      title: 'शासन और जवाबदेही', subtitle: 'आधिकारिक तैनाती के लिए जिम्मेदारी', pending: 'आधिकारिक तैनाती पर नियुक्त होगा',
      areas: [
        { name: 'सिस्टम स्वामित्व', desc: 'सरकारी निकाय' }, { name: 'सामग्री अपडेट', desc: 'सामग्री टीम' },
        { name: 'डेटा प्रबंधन', desc: 'डेटा अधिकारी' }, { name: 'AI प्रबंधन', desc: 'AI/ML टीम' },
        { name: 'सुरक्षा', desc: 'साइबर सुरक्षा टीम' }, { name: 'इन्फ्रास्ट्रक्चर', desc: 'होस्टिंग टीम' },
        { name: 'आपातकालीन अलर्ट', desc: 'अलर्ट केंद्र' }, { name: 'नागरिक शिकायतें', desc: 'शिकायत निवारण' },
        { name: 'डेटा सुधार', desc: 'गुणवत्ता प्रक्रिया' }, { name: 'चिकित्सा समीक्षा', desc: 'स्वास्थ्य सलाहकार बोर्ड' },
      ],
    },
    footer: {
      lastUpdated: 'अंतिम अपडेट', privacyPolicy: 'गोपनीयता नीति', termsOfUse: 'उपयोग की शर्तें',
      accessibilityStatement: 'पहुँच विवरण', aiTransparency: 'AI पारदर्शिता', governanceContact: 'शासन और संपर्क',
      developers: "DEVELOPER'S",
      dataSources: 'डेटा स्रोत', disclaimer: 'यह उपकरण आधिकारिक सलाह या चिकित्सा सलाह का विकल्प नहीं है।',
    },
    threshold: {
      title: 'आधिकारिक चेतावनियाँ vs THERMOS AI', imdTitle: 'आधिकारिक IMD ताप लहर चेतावनी',
      imdDesc: 'IMD द्वारा वैधानिक निर्धारण।', htssTitle: 'THERMOS ताप तनाव स्कोर (HTSS)',
      htssDesc: 'पूरक AI सूचकांक। IMD का विकल्प नहीं।', imdPriority: 'IMD चेतावनियाँ प्राथमिकता लेती हैं।',
      plains: 'मैदानी क्षेत्र', coastal: 'तटीय', heatwave: 'ताप लहर', severeHeatwave: 'गंभीर ताप लहर',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export function t(lang: Language): TranslationKeys {
  return translations[lang] as unknown as TranslationKeys;
}

export const TRANSLATIONS = translations;
export type Translations = TranslationKeys;

