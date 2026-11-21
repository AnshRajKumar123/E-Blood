import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
    en: {
        // --- NAVBAR & FOOTER ---
        lookingForBlood: "Looking for Blood",
        findBloodNow: "Find Blood Now",
        bloodBankDirectory: "Blood Bank Directory",
        thalassemiaRequests: "Thalassemia & Recurring Requests",
        donateBlood: "Donate Blood",
        registerAsDonor: "Register as Donor",
        findCamp: "Find a Camp",
        aboutDonating: "About Donating",
        resources: "Resources",
        blog: "Blog",
        faqs: "FAQs",
        notifications: "Notifications",
        aboutUs: "About Us",
        signIn: "Sign In",
        donorUserLogin: "Donor / User Login",
        organisationLogin: "Organisation Login",
        bloodBanksAndCamps: "Blood banks & camps",
        soon: "Soon",
        home: "Home",
        donate: "Donate",
        banks: "Banks",
        profile: "Profile",
        account: "Account",
        org: "Org",
        quickActions: "Quick Actions",
        portalsAndLogin: "Portals & Login",
        donorPortal: "Donor / User Portal",

        // --- HERO & HOME ---
        heroTitle: "Connecting voluntary blood donors with patients in real-time.",
        heroSub: "Instant donor matches within your district radius. Zero delay, 100% voluntary.",
        searchBloodGroup: "Select Blood Group",
        bloodGroupRequired: "Blood Group Required",
        locationCity: "Location / City",
        enterCityDistrict: "Enter city or district...",
        findDonorsNow: "Find Donors Now",
        emergencyHelpline: "EMERGENCY BLOOD CONNECT NETWORK",
        response15m: "~15m Response",
        verified100: "100% Verified",
        freeDirect: "Free & Direct",
        wantToDonate: "Want to donate? Register as a donor ›",

        // Pledge Section
        pledgeFor: "Pledge for",
        voluntaryBloodDonation: "Voluntary Blood Donation",
        pledgeSub: "Join millions of citizens creating a national safety net for emergency surgeries and thalassemia patients.",
        allGroups: "ALL GROUPS",

        // Upcoming Camps
        upcomingBloodCamps: "Upcoming blood camps",
        showingNearYou: "• Showing near you",
        viewAllCamps: "View all camps",

        // For Organisations
        forOrganisations: "FOR ORGANISATIONS",
        runningBankOrCamp: "Running a blood bank or a camp?",
        organisationPortal: "Organisation portal",
        registerABloodBank: "Register a blood bank",
        listBankSub: "List your bank and publish live stock.",
        registerABloodCamp: "Register a blood camp",
        listCampSub: "List a voluntary donation drive.",
        getStarted: "Get started ›",

        // How E-Blood Works
        howEbloodWorks: "HOW E-BLOOD WORKS",
        howEbloodTitle: "One request, every real option nearby.",
        step1Title: "Share group & location",
        step1Desc: "One screen: the patient's blood group, and where — GPS or city/district.",
        step2Title: "We search live bank stock",
        step2Desc: "Real distance search against India's blood bank network, not a static directory.",
        step3Title: "Short on stock? We ask donors",
        step3Desc: "Falls back to nearby registered donors automatically — zero dead ends.",

        // Eligibility Questionnaire
        checkEligibility: "CHECK ELIGIBILITY",
        canYouDonate: "Can you donate blood?",
        eligibilityIntroDesc: "Donating blood is a simple, safe and life-saving act — but not everyone may be eligible. Answer a short questionnaire to get a general sense of your eligibility.",
        startQuickCheck: "Start the quick check",
        analysisDone: "Your donation analysis is done",
        doctorReverify: "A doctor will re-verify donor eligibility before actual blood donation at the camp or center.",
        startOver: "Start over",
        question: "Question",
        of: "of",
        yes: "Yes",
        no: "No",
        healthPercentage: "Health percentage",

        // Blog & Stories
        fromTheBlog: "FROM THE BLOG",
        storiesAndAwareness: "Stories & awareness",
        viewAllPosts: "View all posts",

        // --- DIRECTORY & SEARCH ---
        findNearbyBank: "Find a Nearby Blood Bank",
        searchLiveStock: "Search live stock at registered blood banks near you, by blood group and location.",
        filterByBloodGroup: "Filter by Blood group",
        allStates: "All States",
        allDistricts: "All Districts",
        hospitalSearchPlaceholder: "Hospital or bank name...",
        useCurrentLocation: "Use current location",
        detectingLocation: "Acquiring GPS...",
        detectLocationButton: "Use my current location",
        registeredBanksFound: "registered bank(s) found",
        verifiedVoluntaryDonors: "verified voluntary donors",
        noBanksFound: "No registered blood banks found",
        noDonorsFound: "No registered donors found",
        clearAllFilters: "Clear all search filters",
        callDonor: "Call Donor",
        callBank: "Call",
        unitsInStock: "units in stock",
        unitsAvailable: "units available",
        seePersonDetails: "See Person Details",
        searchButton: "Search",

        // --- REGISTER / EDIT DONOR ---
        registerDonorTitle: "Register as Donor",
        updateDonorTitle: "Update Donor Profile",
        donorSubhead: "Your details are shown to a requester only once you accept their request — never before.",
        contactVerification: "1. Contact & Verification",
        mobilePhoneLabel: "Mobile Phone Number (for blood emergency calls) *",
        aboutYou: "2. About you",
        fullName: "Full name *",
        dob: "Date of birth",
        gender: "Gender",
        weightKg: "Weight (kg)",
        heightCm: "Height (cm)",
        whereBased: "3. Where you're based (Full Address)",
        streetAddress: "House / Flat / Street Address *",
        landmark: "Landmark (Nearby building or spot)",
        pincode: "Pincode *",
        state: "State",
        districtCity: "District / City",
        eligibilityCheckTitle: "4. Eligibility check",
        noDoctorBan: "No doctor has told me I should not donate blood",
        noRegularMedicine: "I do not take regular medicine for a long-term condition",
        noSurgery12Months: "In the last 12 months I have not had surgery, a transfusion, a tattoo, or a piercing",
        availabilityConsent: "5. Availability & consent",
        preferredChannel: "Preferred contact channel",
        matchMeWithin: "Match me within",
        agreeTerms: "I agree E-Blood can share my name, blood group, distance, and chosen contact method(s) – and Terms & Conditions",
        confirmRegister: "Confirm & register",
        saveAndUpdate: "Save & Update Profile",
        backToProfile: "Back to Profile",

        // --- PROFILE PAGE ---
        yourProfile: "Your Profile",
        editProfile: "Edit Profile",
        pastRequests: "Past requests",
        savedLocations: "Saved locations",
        signOut: "Sign out",
        deleteAccount: "Delete account",
        readyToDonate: "Ready to Donate",
        activeVoluntaryDonor: "Active Voluntary Blood Donor",
        becomeADonor: "Become a donor",
        noLocationsSaved: "No locations saved yet.",
        addCurrentLocation: "+ Add current location",

        // --- ORGANISATION DASHBOARD ---
        organisationDashboard: "Organisation Dashboard",
        overview: "Overview",
        bloodCamps: "Blood Camps",
        donors: "Donors",
        settingsAndProfile: "Settings & Profile",
        addABloodCamp: "Add a Blood Camp",
        bulkUploadDonors: "Bulk upload donors",
        teamMembers: "Team members",
        contactNumbers: "Organisation contact numbers",
        saveOrgDetails: "Save Organisation Details",
        addTeammate: "+ Add teammate",
        addNumber: "+ Add number",

        pageNotFoundTitle: "Looks like you're lost",
        pageNotFoundSub: "The page you're searching for doesn't exist, has been relocated, or is temporarily offline.",
        backToSafety: "Back to Home",
        emergencyFindBloodPrompt: "Need urgent blood instead?",
        aboutUsTitle: "Saving Lives in Real Time",
        aboutUsMission: "E-Blood connects voluntary donors and verified blood banks directly with critical patients across India, eliminating hospital delays.",
        faqsTitle: "Frequently Asked Questions",
        faqsSub: "Everything you need to know about voluntary donation, medical screening, and hospital requests.",
        privacyTitle: "Privacy Policy & Terms of Service",
        privacySub: "Your trust and medical privacy are protected with strict encryption standards."
    },

    hi: {
        // --- NAVBAR & FOOTER ---
        lookingForBlood: "रक्त की खोज",
        findBloodNow: "रक्तदाता खोजें",
        bloodBankDirectory: "ब्लड बैंक निर्देशिका",
        thalassemiaRequests: "थैलेसीमिया व नियमित अनुरोध",
        donateBlood: "रक्तदान करें",
        registerAsDonor: "रक्तदाता बनें",
        findCamp: "रक्तदान शिविर खोजें",
        aboutDonating: "रक्तदान के बारे में",
        resources: "संसाधन",
        blog: "ब्लॉग",
        faqs: "अक्सर पूछे जाने वाले प्रश्न",
        notifications: "सूचनाएं",
        aboutUs: "हमारे बारे में",
        signIn: "साइन इन करें",
        donorUserLogin: "रक्तदाता / उपयोगकर्ता लॉगिन",
        organisationLogin: "संस्था लॉगिन",
        bloodBanksAndCamps: "ब्लड बैंक और शिविर",
        soon: "जल्द ही",
        home: "होम",
        donate: "दान करें",
        banks: "ब्लड बैंक",
        profile: "प्रोफ़ाइल",
        account: "खाता",
        org: "संस्था",
        quickActions: "त्वरित विकल्प",
        portalsAndLogin: "पोर्टल व लॉगिन",
        donorPortal: "रक्तदाता पोर्टल",

        // --- HERO & HOME ---
        heroTitle: "स्वैच्छिक रक्तदाताओं को मरीजों से सीधे जोड़ना।",
        heroSub: "आपके जिले के दायरे में तुरंत रक्तदाता उपलब्ध। शून्य देरी, 100% स्वैच्छिक।",
        searchBloodGroup: "रक्त समूह चुनें",
        bloodGroupRequired: "रक्त समूह की आवश्यकता",
        locationCity: "स्थान / शहर",
        enterCityDistrict: "शहर या जिला दर्ज करें...",
        findDonorsNow: "अभी रक्तदाता खोजें",
        emergencyHelpline: "आपातकालीन ब्लड कनेक्ट नेटवर्क",
        response15m: "~15 मिनट में प्रतिक्रिया",
        verified100: "100% सत्यापित",
        freeDirect: "मुफ़्त और सीधा संपर्क",
        wantToDonate: "रक्तदान करना चाहते हैं? रक्तदाता बनें ›",

        // Pledge Section
        pledgeFor: "संकल्प लें",
        voluntaryBloodDonation: "स्वैच्छिक रक्तदान",
        pledgeSub: "आपातकालीन सर्जरी और थैलेसीमिया रोगियों के लिए एक राष्ट्रीय जीवन रक्षा नेटवर्क बनाने में लाखों नागरिकों के साथ जुड़ें।",
        allGroups: "सभी समूह",

        // Upcoming Camps
        upcomingBloodCamps: "आगामी रक्तदान शिविर",
        showingNearYou: "• आपके नजदीकी शिविर",
        viewAllCamps: "सभी शिविर देखें",

        // For Organisations
        forOrganisations: "संस्थाओं के लिए",
        runningBankOrCamp: "ब्लड बैंक या शिविर चला रहे हैं?",
        organisationPortal: "संस्था पोर्टल",
        registerABloodBank: "ब्लड बैंक पंजीकृत करें",
        listBankSub: "अपने बैंक को सूचीबद्ध करें और लाइव स्टॉक दिखाएं।",
        registerABloodCamp: "रक्तदान शिविर पंजीकृत करें",
        listCampSub: "स्वैच्छिक रक्तदान अभियान सूचीबद्ध करें।",
        getStarted: "शुरू करें ›",

        // How E-Blood Works
        howEbloodWorks: "E-BLOOD कैसे काम करता है",
        howEbloodTitle: "एक अनुरोध, आपके नजदीकी सभी वास्तविक विकल्प।",
        step1Title: "रक्त समूह व स्थान साझा करें",
        step1Desc: "एक ही स्क्रीन: मरीज का रक्त समूह और स्थान — GPS या शहर/जिला।",
        step2Title: "हम ब्लड बैंक में लाइव स्टॉक खोजते हैं",
        step2Desc: "भारत के ब्लड बैंक नेटवर्क में वास्तविक दूरी आधारित खोज।",
        step3Title: "स्टॉक कम होने पर हम रक्तदाताओं से संपर्क करते हैं",
        step3Desc: "नजदीकी पंजीकृत स्वैच्छिक रक्तदाताओं को स्वतः अनुरोध भेजा जाता है।",

        // Eligibility Questionnaire
        checkEligibility: "पात्रता जांचें",
        canYouDonate: "क्या आप रक्तदान कर सकते हैं?",
        eligibilityIntroDesc: "रक्तदान एक सरल, सुरक्षित और जीवन बचाने वाला कार्य है — एक छोटी प्रश्नावली का उत्तर देकर अपनी पात्रता जानें।",
        startQuickCheck: "जांच शुरू करें",
        analysisDone: "आपका रक्तदान विश्लेषण पूरा हो गया है",
        doctorReverify: "शिविर या केंद्र पर रक्तदान से पहले डॉक्टर द्वारा पात्रता का पुनः सत्यापन किया जाएगा।",
        startOver: "पुनः प्रारंभ करें",
        question: "प्रश्न",
        of: "का",
        yes: "हाँ",
        no: "नहीं",
        healthPercentage: "स्वास्थ्य प्रतिशत",

        // Blog & Stories
        fromTheBlog: "ब्लॉग से",
        storiesAndAwareness: "कहानियां और जागरूकता",
        viewAllPosts: "सभी पोस्ट देखें",

        // --- DIRECTORY & SEARCH ---
        findNearbyBank: "नजदीकी ब्लड बैंक खोजें",
        searchLiveStock: "स्थान और रक्त समूह के आधार पर नजदीकी ब्लड बैंकों में लाइव स्टॉक खोजें।",
        filterByBloodGroup: "रक्त समूह चुनें",
        allStates: "सभी राज्य",
        allDistricts: "सभी जिले",
        hospitalSearchPlaceholder: "अस्पताल या बैंक का नाम खोजें...",
        useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
        detectingLocation: "स्थान खोजा जा रहा है...",
        detectLocationButton: "मेरा वर्तमान स्थान चुनें",
        registeredBanksFound: "पंजीकृत ब्लड बैंक मिले",
        verifiedVoluntaryDonors: "सत्यापित स्वैच्छिक रक्तदाता",
        noBanksFound: "कोई ब्लड बैंक नहीं मिला",
        noDonorsFound: "कोई पंजीकृत रक्तदाता नहीं मिला",
        clearAllFilters: "सभी फ़िल्टर हटाएं",
        callDonor: "कॉल करें",
        callBank: "कॉल करें",
        unitsInStock: "यूनिट स्टॉक में",
        unitsAvailable: "यूनिट उपलब्ध",
        seePersonDetails: "पूरी जानकारी देखें",
        searchButton: "खोजें",

        // --- REGISTER / EDIT DONOR ---
        registerDonorTitle: "रक्तदाता पंजीकरण",
        updateDonorTitle: "रक्तदाता विवरण अपडेट करें",
        donorSubhead: "आपका विवरण केवल तभी दिखाया जाता है जब आप अनुरोध स्वीकार करते हैं - उससे पहले कभी नहीं।",
        contactVerification: "1. संपर्क व सत्यापन",
        mobilePhoneLabel: "मोबाइल नंबर (रक्त आपातकालीन कॉल के लिए) *",
        aboutYou: "2. आपकी व्यक्तिगत जानकारी",
        fullName: "पूरा नाम *",
        dob: "जन्म तिथि",
        gender: "लिंग",
        weightKg: "वजन (किलोग्राम)",
        heightCm: "कद (सेमी)",
        whereBased: "3. आपका पता (पूरा पता)",
        streetAddress: "मकान / फ्लैट / गली का पता *",
        landmark: "लैंडमार्क (पहचान स्थल)",
        pincode: "पिनकोड *",
        state: "राज्य",
        districtCity: "जिला / शहर",
        eligibilityCheckTitle: "4. पात्रता जांच",
        noDoctorBan: "किसी डॉक्टर ने मुझे रक्तदान करने से मना नहीं किया है",
        noRegularMedicine: "मैं किसी दीर्घकालिक बीमारी के लिए नियमित दवा नहीं लेता हूँ",
        noSurgery12Months: "पिछले 12 महीनों में मेरी कोई सर्जरी, टैटू या रक्त आधान नहीं हुआ है",
        availabilityConsent: "5. उपलब्धता एवं सहमति",
        preferredChannel: "पसंदीदा संपर्क माध्यम",
        matchMeWithin: "इस दूरी के अंदर खोजें",
        agreeTerms: "मैं सहमत हूँ कि E-Blood मेरा नाम, रक्त समूह और संपर्क विवरण साझा कर सकता है",
        confirmRegister: "पुष्टि करें और पंजीकरण करें",
        saveAndUpdate: "सुरक्षित करें और अपडेट करें",
        backToProfile: "प्रोफ़ाइल पर वापस जाएं",

        // --- PROFILE PAGE ---
        yourProfile: "आपकी प्रोफ़ाइल",
        editProfile: "प्रोफ़ाइल संपादित करें",
        pastRequests: "पिछले अनुरोध",
        savedLocations: "सुरक्षित स्थान",
        signOut: "लॉग आउट",
        deleteAccount: "खाता हटाएं",
        readyToDonate: "रक्तदान के लिए तैयार",
        activeVoluntaryDonor: "सक्रिय स्वैच्छिक रक्तदाता",
        becomeADonor: "रक्तदाता बनें",
        noLocationsSaved: "अभी तक कोई स्थान सुरक्षित नहीं है।",
        addCurrentLocation: "+ वर्तमान स्थान जोड़ें",

        // --- ORGANISATION DASHBOARD ---
        organisationDashboard: "संस्था डैशबोर्ड",
        overview: "अवलोकन",
        bloodCamps: "रक्तदान शिविर",
        donors: "रक्तदाता",
        settingsAndProfile: "सेटिंग्स और प्रोफ़ाइल",
        addABloodCamp: "रक्तदान शिविर जोड़ें",
        bulkUploadDonors: "एक साथ रक्तदाता अपलोड करें",
        teamMembers: "टीम के सदस्य",
        contactNumbers: "संस्था के संपर्क नंबर",
        saveOrgDetails: "संस्था का विवरण सुरक्षित करें",
        addTeammate: "+ साथी जोड़ें",
        addNumber: "+ नंबर जोड़ें",

        pageNotFoundTitle: "लगता है आप रास्ता भटक गए हैं",
        pageNotFoundSub: "आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है, स्थानांतरित कर दिया गया है या अनुपलब्ध है।",
        backToSafety: "होम पेज पर लौटें",
        emergencyFindBloodPrompt: "क्या आपको तत्काल रक्त की आवश्यकता है?",
        aboutUsTitle: "समय पर जीवन की रक्षा",
        aboutUsMission: "E-Blood भारत भर में स्वैच्छिक रक्तदाताओं और अधिकृत ब्लड बैंकों को जरूरतमंद मरीजों से सीधे जोड़ता है।",
        faqsTitle: "अक्सर पूछे जाने वाले प्रश्न",
        faqsSub: "रक्तदान पात्रता, सुरक्षा मानकों और आपातकालीन अनुरोधों के बारे में पूरी जानकारी।",
        privacyTitle: "गोपनीयता नीति और सेवा की शर्तें",
        privacySub: "आपकी चिकित्सा और व्यक्तिगत जानकारी सख्त एन्क्रिप्शन मानकों द्वारा सुरक्षित है।"
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("eblood_lang") || "en";
    });

    useEffect(() => {
        localStorage.setItem("eblood_lang", language);
    }, [language]);

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    const t = (key) => {
        return translations[language]?.[key] || translations["en"]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);