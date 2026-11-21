import WebLogo from "./Image/WebLofo.png";
import MohfwLogo from "./Image/mohfw.svg";
import NhmLogo from "./Image/national-health-mission.svg";
import MyGovLogo from "./Image/mygov.svg";
import IndiaGovLogo from "./Image/india-gov-in.svg";
import CdacLogo from "./Image/cdac.svg";
import DigitalIndiaLogo from "./Image/digital-india.svg";
import AboutUsImage from "./Image/AboutUsImage.webp";

// Team Member Photos
import AnshRajLogo from "./Image/AnshRajLogo.jpeg";
import AbhishekLogo from "./Image/AbhishekLogo.jpeg";
import RanjitLogo from "./Image/RanjitLogo.jpeg";
import AnkitLogo from "./Image/AnkitLogo.jpeg";

// 1. Official Platform Emails
export const PLATFORM_EMAILS = {
    main: "ebloodorg.01@gmail.com",
    support: "supporteblood@gmail.com",
    report: "report@eblood.org",
    orgs: "orgs@eblood.org",
    grievance: "grievance@eblood.org"
};

// 2. Core Team Members
export const teamMembers = [
    {
        id: 1,
        name: "Ansh Raj",
        role: "Leader & Developer",
        bio: "Project Lead architecting the core emergency dispatch platform, live donor matching algorithm, and full-stack real-time services.",
        gradient: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
        initials: "AR",
        photo: AnshRajLogo,
        skills: ["System Architecture", "Full-Stack Development", "API Security", "Project Lead"]
    },
    {
        id: 2,
        name: "Abhishek Aarya",
        role: "UI / UX Designer",
        bio: "Crafting intuitive, human-centered emergency interfaces, accessible components, and seamless user experiences across mobile and web.",
        gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        initials: "AA",
        photo: AbhishekLogo,
        skills: ["UI/UX Design", "Wireframing", "Design Systems", "Prototyping"]
    },
    {
        id: 3,
        name: "Ranjit Kushwaha",
        role: "Backend Programmer & Code Contributor",
        bio: "Developing high-performance REST APIs, database schemas, and handling server reliability for rapid emergency blood matching.",
        gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        initials: "RK",
        photo: RanjitLogo,
        skills: ["Database Design", "Node.js & Express", "API Optimization", "Bug Fixing"]
    },
    {
        id: 4,
        name: "Ankit Harivanshi",
        role: "Researcher & Quick Thinker",
        bio: "Leading statutory compliance, Indian healthcare protocols, operational research, and quick problem-solving during critical workflows.",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
        initials: "AH",
        photo: AnkitLogo,
        skills: ["Statutory Compliance", "Healthcare Protocol", "Strategic Research", "Operational Logic"]
    }
];

// 3. Contact Us & Grievance Redressal
export const contactData = {
    title: "CONTACT US & GRIEVANCE REDRESSAL",
    sections: [
        {
            id: 1,
            heading: "1. EMERGENCY MEDICAL NOTICE",
            type: "emergency",
            content: "If you or your patient are facing an immediate, life-threatening medical emergency, please DO NOT wait for an email response. Immediately contact:\n• National Emergency Number (India): 112\n• Medical Ambulance Helpline: 108 / 102\n• National Health Helpline: 104\nOr use the \"Find Blood Now\" and \"Blood Bank Directory\" tools on our homepage to directly reach nearby verified donors and licensed blood banks."
        },
        {
            id: 2,
            heading: "2. GENERAL SUPPORT, CAMP & ORGANISATION QUERIES",
            type: "support",
            content: "For assistance with donor registration, updating your blood bank listing, or publishing an upcoming voluntary blood donation camp:\n• Support Email: supporteblood@gmail.com\n• Organisation & Camp Verification Desk: orgs@eblood.org\n• Operating Hours: Monday to Saturday, 9:00 AM – 6:00 PM IST"
        },
        {
            id: 3,
            heading: "3. REPORT ABUSE / REPORT ILLEGAL MONEY DEMANDS (24x7 PRIORITY)",
            type: "abuse",
            content: "E-Blood enforces a strict zero-tolerance policy against commercial blood touts and fake requests. If anyone contacted through E-Blood demands money for blood donation, or if you spot a fraudulent listing, please report their mobile number and screenshot immediately:\n• Abuse & Safety Desk: report@eblood.org"
        },
        {
            id: 4,
            heading: "4. DATA PRIVACY & GRIEVANCE OFFICER (DPDP ACT, 2023 & IT ACT, 2000)",
            type: "grievance",
            content: "For personal data removal requests, account deletion assistance, or legal/privacy grievances:\n• Grievance Officer: Ankit Harivanshi (Project Lead — E-Blood Initiative)\n• Email: grievance@eblood.org\n• Location: Punjab, India"
        }
    ]
};

// 4. About Us Content
export const aboutData = {
    title: "About E-Blood — Verified Emergency Network",
    tagline: "Connecting Hope, One Drop at a Time"
};

// 5. Frequently Asked Questions (FAQs)
export const faqData = {
    title: "Frequently Asked Questions (FAQs)",
    sections: [
        {
            category: "SECTION A: FOR VOLUNTARY BLOOD DONORS",
            items: [
                {
                    q: "Who is eligible to donate blood in India according to official medical rules?",
                    a: "Under the National Blood Transfusion Council (NBTC) and Drugs & Cosmetics Act guidelines:\n• Age: Between 18 and 65 years (up to 60 years for first-time donors).\n• Weight: Minimum 45 kg (for 350 ml donation) or 50 kg (for 450 ml donation).\n• Hemoglobin (Hb): Minimum 12.5 g/dL.\n• General Health: Normal blood pressure (Systolic 100–140 mmHg, Diastolic 60–90 mmHg), pulse between 60–100 BPM, and free from acute infections or chronic cardiac/kidney/liver ailments."
                },
                {
                    q: "How much time gap is required between two blood donations?",
                    a: "• Whole Blood: Minimum 90 days (3 months) for Men, and 120 days (4 months) for Women.\n• Plateletpheresis (Single Donor Platelets / SDP): Minimum 48 hours between donations (maximum twice a week and 24 times a year)."
                },
                {
                    q: "How long does it take for my body to recover the donated blood?",
                    a: "An average healthy adult has 4.5 to 5.5 liters of blood. During a standard donation, only 350 ml to 450 ml is collected:\n• Fluid volume (Plasma) is completely replaced by your body within 24 to 48 hours.\n• Red Blood Cells (RBCs) are naturally replenished by your bone marrow within 4 to 8 weeks."
                },
                {
                    q: "When can I NOT donate blood (Temporary & Permanent Deferrals)?",
                    a: "Temporary Deferrals:\n• Tattoo, ear/body piercing, or acupuncture: Wait 6 to 12 months.\n• Dental extraction or minor surgery: Wait 1 month (6–12 months for major surgery).\n• Malaria recovery: Wait 3 months after full recovery.\n• Typhoid recovery: Wait 12 months after full recovery.\n• Pregnancy / Lactation: Defer during pregnancy and up to 12 months after delivery/childbirth.\n• Alcohol consumption: Wait at least 24 hours.\n\nPermanent Deferrals: Individuals who have ever tested positive for HIV-1/2, Hepatitis B, Hepatitis C, or suffer from severe heart disease, epilepsy, insulin-dependent diabetes, or cancer."
                },
                {
                    q: "Will my phone number be spammed if I register on E-Blood?",
                    a: "No. You have full control over your profile. Once you donate blood, you can mark your donation date on E-Blood, and our system will automatically pause your profile for the mandatory 90/120-day recovery window. You can also toggle your status to \"Unavailable\" or delete your account at any time."
                }
            ]
        },
        {
            category: "SECTION B: FOR PATIENTS & BLOOD SEEKERS",
            items: [
                {
                    q: "Does E-Blood charge any money to find a donor?",
                    a: "Never. E-Blood is 100% free for patients, donors, and hospitals. Furthermore, under Indian law, paying or asking for money from a blood donor is a punishable offense. If any user on E-Blood asks you for money, please report them immediately via our Contact Us page."
                },
                {
                    q: "Why do Blood Banks charge a \"Processing Fee\" even when blood donation is voluntary?",
                    a: "While the blood itself is donated free of cost by voluntary citizens, licensed Blood Centres are permitted by the National Blood Transfusion Council (NBTC) and State Blood Transfusion Councils (SBTC) to recover standard processing charges. This fee covers the cost of sterile blood collection bags, anticoagulants, cold-chain storage, blood grouping, cross-matching, and mandatory screening tests for HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria."
                },
                {
                    q: "How does \"Thalassemia & Recurring Requests\" work?",
                    a: "Patients with Thalassemia Major require lifelong red blood cell transfusions every 2 to 4 weeks. Our Thalassemia support module allows patients and their families to schedule recurring requests in advance and connect with dedicated voluntary donors who commit to donating once every 3 to 4 months to support a specific patient."
                }
            ]
        }
    ]
};

// 6. Sitemap Data
export const sitemapData = {
    title: "SITEMAP — E-BLOOD DIRECTORY STRUCTURE",
    subtitle: "Complete architecture of available routes and modules across the platform.",
    categories: [
        {
            id: "core",
            title: "1. CORE PLATFORM",
            items: [
                { name: "Home", path: "/", page: "home", desc: "Landing hero, quick search, live camps, and mission details" },
                { name: "Emergency Search", path: "/find-blood", page: "search", desc: "4-parameter donor search engine with interactive range radius" }
            ]
        },
        {
            id: "looking",
            title: "2. LOOKING FOR BLOOD",
            items: [
                { name: "Find Blood Now", path: "/find-blood", page: "search", desc: "Locate verified voluntary donors in real-time" },
                { name: "Blood Bank Directory", path: "/blood-banks", page: "directory", desc: "State & district filtered directory of licensed blood centres" },
                { name: "Thalassemia & Recurring Requests", path: "/thalassemia-requests", page: "search", desc: "Recurring donation schedules for chronic blood disorders" }
            ]
        },
        {
            id: "donate",
            title: "3. DONATE BLOOD",
            items: [
                { name: "Become a Donor", path: "/register-donor", page: "register", desc: "Join as a voluntary donor with medical self-declaration" },
                { name: "Upcoming Camps", path: "/upcoming-camps", page: "camps", desc: "Calendar of scheduled community and college blood drives" },
                { name: "About Donating & Eligibility Checklist", path: "/about-donating", page: "home", desc: "Interactive weight, age, and cool-off eligibility checker" }
            ]
        },
        {
            id: "org",
            title: "4. ORGANISATION PORTAL",
            items: [
                { name: "Organisation Login", path: "/org-login", page: "org-login", desc: "Official gateway for blood centres and camp organizers" },
                { name: "Register a Blood Bank", path: "/register-bank", page: "org-register-bank", desc: "List licensed blood centre and inventory management" },
                { name: "Register a Blood Donation Camp", path: "/register-camp", page: "org-add-camp", desc: "Publish upcoming drives with venue details and photos" }
            ]
        },
        {
            id: "resources",
            title: "5. RESOURCES & COMMUNITY",
            items: [
                { name: "About Us", path: "/about-us", page: "about", desc: "Initiative origins, core team creators, and user query desk" },
                { name: "Frequently Asked Questions", path: "/faqs", page: "faqs", desc: "Official medical rules, donation intervals, and seeker guidance" },
                { name: "Stories & Awareness Blog", path: "/stories", page: "home", desc: "Educational articles on iron balance and donor nutrition" }
            ]
        },
        {
            id: "legal",
            title: "6. LEGAL & COMPLIANCE",
            items: [
                { name: "Terms & Conditions", path: "/terms-and-conditions", page: "terms", subtab: "terms", desc: "Intermediary safe harbour status under the IT Act 2000" },
                { name: "Privacy Policy", path: "/privacy-policy", page: "terms", subtab: "privacy", desc: "Data fiduciary principles under DPDP Act 2023" },
                { name: "Accessibility Statement", path: "/accessibility-statement", page: "terms", subtab: "accessibility", desc: "WCAG 2.1 Level AA compliance guidelines" },
                { name: "Contact Us & Grievance Officer", path: "/contact-us", page: "terms", subtab: "contact", desc: "Statutory DPDP grievance escalation channel" },
                { name: "Sitemap", path: "/sitemap", page: "sitemap", desc: "Index of all platform interfaces" }
            ]
        }
    ]
};

// 7. Legal Text
export const legalData = {
    termsAndConditions: {
        title: "Terms and Conditions of Use",
        effectiveDate: "October 21, 2026",
        platformName: "E-Blood — Verified Emergency Network",
        sections: [
            {
                id: 1,
                heading: "1. Acceptance of Terms",
                content:
                    "Welcome to E-Blood (\"Platform\", \"Website\", \"We\", \"Us\", or \"Our\"). E-Blood is a voluntary student and community health initiative operating as a digital communication bridge connecting patients and healthcare seekers with voluntary blood donors, registered blood banks, and voluntary blood donation camp organizers across India.\n\nBy accessing, browsing, registering on, or using any feature of the E-Blood Platform—including \"Find Blood Now\", \"Blood Bank Directory\", \"Thalassemia & Recurring Requests\", \"Become a Donor\", \"Upcoming Camps\", \"Organisation Login\", \"Register a Bank\", or \"Register a Camp\"—you (\"User\", \"Donor\", \"Seeker\", or \"Organisation\") acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these Terms, you must immediately discontinue use of the Platform."
            },
            {
                id: 2,
                heading: "2. Legal Status of E-Blood (Intermediary under the IT Act, 2000)",
                subsections: [
                    {
                        subheading: "2.1. Technological Bridge Only",
                        text: "E-Blood is strictly an information technology platform and community directory. E-Blood is NOT a hospital, medical clinic, pathology laboratory, diagnostic center, or a licensed Blood Centre under the Drugs and Cosmetics Act, 1940."
                    },
                    {
                        subheading: "2.2. No Handling of Biological Material",
                        text: "E-Blood does not collect, draw, test, screen, process, store, cross-match, or transport whole human blood or any blood components (such as Packed Red Blood Cells, Fresh Frozen Plasma, Platelets, or Cryoprecipitate)."
                    },
                    {
                        subheading: "2.3. Safe Harbour Intermediary Status",
                        text: "In accordance with Section 2(1)(w) and Section 79 of the Information Technology Act, 2000, read with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, E-Blood functions solely as an \"Intermediary.\" All profiles, blood requests, camp listings, and blood bank directory records are user-generated or third-party submissions. E-Blood assumes no legal liability for the accuracy, completeness, or medical validity of user-submitted information."
                    }
                ]
            },
            {
                id: 3,
                heading: "3. Strict Prohibition of Commercial Blood Trading",
                subsections: [
                    {
                        subheading: "3.1. Statutory Mandate",
                        text: "Under the landmark judgment of the Hon'ble Supreme Court of India in Common Cause v. Union of India & Others (1996) 1 SCC 753, the National Blood Policy (2002), and the Drugs and Cosmetics (Second Amendment) Rules, 2020, professional blood donation and the commercial sale, purchase, or trading of human blood or blood components for monetary consideration or profiteering is strictly illegal in India."
                    },
                    {
                        subheading: "3.2. 100% Voluntary & Non-Remunerated Donations",
                        text: "Every blood donation facilitated through E-Blood must be strictly voluntary and non-remunerated."
                    },
                    {
                        subheading: "3.3. Zero Tolerance for Solicitation",
                        points: [
                            "(a) No Registered Donor may demand, solicit, or accept cash, digital transfers, gifts, or any financial favor in exchange for donating blood.",
                            "(b) No Seeker, patient attendant, or third-party agent may offer money to induce a donor listed on E-Blood.",
                            "(c) Legitimate processing and testing charges may ONLY be levied by licensed Blood Centres strictly in accordance with the ceiling rates notified by the National Blood Transfusion Council (NBTC) / State Blood Transfusion Councils (SBTC)."
                        ]
                    },
                    {
                        subheading: "3.4. Enforcement",
                        text: "Any user found demanding or offering money for blood will have their account permanently terminated without notice, their details blacklisted, and their identity and IP logs reported to law enforcement authorities and the respective State Drug Controller."
                    }
                ]
            },
            {
                id: 4,
                heading: "4. Donor Eligibility and Self-Declaration (NBTC & NACO Standards)",
                intro: "By registering under \"Become a Donor\", you represent, warrant, and self-declare under Indian medical guidelines (National Blood Transfusion Council & Directorate General of Health Services, Ministry of Health and Family Welfare) that:",
                subsections: [
                    {
                        subheading: "4.1. Age Criteria",
                        text: "You are between 18 and 65 years of age (first-time donors must not be over 60 years of age)."
                    },
                    {
                        subheading: "4.2. Weight & Physiological Standards",
                        text: "Your body weight is at least 45 kg (for a 350 ml donation) or 50 kg (for a 450 ml donation), your Hemoglobin (Hb) level is at least 12.5 g/dL, your pulse rate is regular (between 60 and 100 beats per minute), and your blood pressure is within normal clinical limits (Systolic 100–140 mmHg, Diastolic 60–90 mmHg)."
                    },
                    {
                        subheading: "4.3. Mandatory Inter-Donation Interval",
                        points: [
                            "(a) For Whole Blood: At least 90 days (3 months) have elapsed since your last donation if you are male, and at least 120 days (4 months) if you are female.",
                            "(b) For Apheresis (Plateletpheresis/Plasmapheresis): At least 48 hours have elapsed since your last apheresis sitting (not exceeding twice a week or 24 times a year)."
                        ]
                    },
                    {
                        subheading: "4.4. Medical Exclusions & Transfusion Transmissible Infections (TTIs)",
                        text: "You are free from HIV-1 & HIV-2, Hepatitis B (HBsAg), Hepatitis C (HCV), Syphilis (VDRL), and Malaria, and you do not suffer from chronic cardiac, renal, hepatic, epileptic, or bleeding disorders, nor have you undergone tattooing, ear/body piercing, or major surgery within the preceding 6 to 12 months as stipulated by NBTC screening criteria."
                    }
                ]
            },
            {
                id: 5,
                heading: "5. Blood Seeker and Thalassemia / Recurring Request Obligations",
                subsections: [
                    {
                        subheading: "5.1. Verification of Need",
                        text: "Requests must only be raised for genuine patients admitted to or undergoing treatment at a recognized hospital or medical facility, backed by a valid Doctor's Blood Requisition Slip."
                    },
                    {
                        subheading: "5.2. Respect for Donor Privacy & Safety",
                        text: "Seekers must communicate respectfully with voluntary donors, refrain from harassing or spamming donors who decline or are unavailable, and never pressurize a donor to donate outside a licensed Blood Centre or accredited hospital."
                    },
                    {
                        subheading: "5.3. Cancellation/Fulfillment Update",
                        text: "Once the required units of blood are arranged, the Seeker must immediately close or mark the request as fulfilled on the Platform to prevent unnecessary calls to voluntary donors."
                    }
                ]
            },
            {
                id: 6,
                heading: "6. Organisation, Blood Bank & Camp Registration Rules",
                subsections: [
                    {
                        subheading: "6.1. Valid Licensing (Form 27-C / Form 28-C)",
                        text: "Any entity registering as a Blood Bank/Blood Centre must hold an active, valid license issued by the Central Licence Approving Authority (CLAA) / State Licensing Authority under the Drugs and Cosmetics Act, 1940 (Rules 122-EA to 122-P)."
                    },
                    {
                        subheading: "6.2. Voluntary Blood Donation Camps",
                        text: "Any NGO, college, corporate body, or hospital registering a blood donation camp under \"Register a Camp\" must ensure that actual blood collection is conducted exclusively by a licensed Regional Blood Transfusion Centre (RBTC) or licensed Blood Centre possessing a valid SBTC/Drug Controller permission for outdoor camps."
                    }
                ]
            },
            {
                id: 7,
                heading: "7. Medical Disclaimer and Limitation of Liability",
                subsections: [
                    {
                        subheading: "7.1. No Medical Guarantee",
                        text: "E-Blood does NOT medically examine, test, or certify any donor listed on the Platform. Listing a user as a \"Verified Donor\" refers solely to OTP/phone or identity verification on the website, and NEVER constitutes a certification of medical fitness or blood safety."
                    },
                    {
                        subheading: "7.2. Mandatory Clinical Screening",
                        text: "It is the absolute legal and clinical responsibility of the attending physician, hospital, and licensed Blood Centre to perform mandatory pre-donation medical examination, blood group typing (ABO and RhD), antibody screening, cross-matching, and mandatory testing for HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria prior to any transfusion."
                    },
                    {
                        subheading: "7.3. Emergency Disclaimer",
                        text: "E-Blood is a voluntary community initiative and does NOT guarantee that a donor or blood unit will be found within a specific timeframe. In critical or life-threatening medical emergencies, patients and attendants must immediately contact emergency medical services (108 / 112 / 104) or their nearest licensed hospital blood bank."
                    },
                    {
                        subheading: "7.4. Release of Liability",
                        text: "Under no circumstances shall E-Blood, its student creators, developers, maintainers, or community volunteers be held liable for any direct, indirect, incidental, or consequential damages, medical complications, adverse transfusion reactions, delays, or loss of life arising out of the use or inability to use the Platform."
                    }
                ]
            },
            {
                id: 8,
                heading: "8. Prohibited Conduct & Account Termination",
                intro: "Users are strictly prohibited from:",
                points: [
                    "(a) Scraping, harvesting, or downloading donor phone numbers or personal data for telemarketing, commercial databases, political campaigns, or spam.",
                    "(b) Creating fake donor profiles, submitting bogus emergency requests, or impersonating licensed blood banks or government agencies.",
                    "(c) Attempting to bypass security controls, execute SQL injection, DDoS attacks, or reverse-engineer the Platform."
                ],
                conclusion:
                    "Violation of these rules will result in immediate account suspension and legal action under Section 43 and Section 66 of the Information Technology Act, 2000, and relevant provisions of the Bharatiya Nyaya Sanhita (BNS), 2023."
            },
            {
                id: 9,
                heading: "9. Governing Law and Jurisdiction",
                content:
                    "These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with this Platform shall be subject to the exclusive jurisdiction of the competent courts in India."
            }
        ]
    },

    privacyPolicy: {
        title: "Privacy Policy",
        effectiveDate: "October 21, 2026",
        framework: "Digital Personal Data Protection Act, 2023 (India) & IT Act, 2000",
        sections: [
            {
                id: 1,
                heading: "1. Overview and Commitment to Privacy",
                content:
                    "E-Blood (\"We\", \"Us\", \"Platform\") respects the privacy of every voluntary blood donor, patient, seeker, and organisation using our network. Because facilitating blood donation requires handling contact details and health-related attributes (such as Blood Group and eligibility dates), we process all personal data strictly in compliance with the Digital Personal Data Protection Act, 2023 (\"DPDP Act\") and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (\"SPDI Rules\").\n\nIn the terminology of the DPDP Act, 2023:\n- You (the Donor or Seeker) are the \"Data Principal.\"\n- E-Blood acts as the \"Data Fiduciary\" solely to the extent of facilitating voluntary blood donation connections."
            },
            {
                id: 2,
                heading: "2. Categories of Personal Data We Collect",
                intro: "We collect only the minimum data necessary (\"Data Minimization\") to fulfill our life-saving community objective:",
                subsections: [
                    {
                        subheading: "2.1. From Voluntary Donors (\"Become a Donor\")",
                        points: [
                            "Full Name, Age / Date of Birth, and Gender.",
                            "ABO and Rh Blood Group (e.g., A+, O-, AB+).",
                            "Contact Information: Mobile Number (verified via OTP) and Email Address.",
                            "Geographical Location: State, District, City, and PIN Code (to match you with nearby emergency requests).",
                            "Donation History & Eligibility Status: Date of last blood donation and self-declared availability status (Available / Temporarily Unavailable)."
                        ]
                    },
                    {
                        subheading: "2.2. From Blood Seekers & Thalassemia Requestors (\"Find Blood Now\" / \"Thalassemia & Recurring Requests\")",
                        points: [
                            "Patient Name, Age, Blood Group Required, and Component Required (Whole Blood, Platelets, Plasma, etc.).",
                            "Hospital Name, City/Location, and Attending Contact Person's Name and Mobile Number.",
                            "Optional/Verification Details: Hospital Requisition Slip reference (if uploaded for verification)."
                        ]
                    },
                    {
                        subheading: "2.3. From Organisations (\"Register a Bank\" / \"Register a Camp\")",
                        points: [
                            "Organisation/Blood Bank Name, Drug License / SBTC Registration Number, Official Address, Nodal Officer Name, Official Email, and Helpline Numbers."
                        ]
                    },
                    {
                        subheading: "2.4. Automated Technical Logs",
                        points: [
                            "IP address, browser type, device metadata, and session cookies used strictly for security, rate-limiting, fraud prevention, and keeping you logged in."
                        ]
                    }
                ]
            },
            {
                id: 3,
                heading: "3. Purpose and Lawful Basis of Processing (Section 4 & 6 of DPDP Act, 2023)",
                intro: "Your personal data is processed strictly based on your free, specific, informed, unconditional, and unambiguous consent for the following specified purposes:",
                points: [
                    "3.1. Matching voluntary blood donors with patients and hospitals requiring blood within the same geographical area.",
                    "3.2. Managing recurring blood support schedules for Thalassemia, Hemophilia, and chronic anemia patients.",
                    "3.3. Displaying verified Blood Banks and Upcoming Voluntary Blood Donation Camps in our public directory.",
                    "3.4. Enforcing the mandatory 90-day / 120-day safety cool-off period after a recorded donation so donors are not disturbed while recovering.",
                    "3.5. Preventing spam, commercial blood touting, and fraudulent requests."
                ]
            },
            {
                id: 4,
                heading: "4. Strict Non-Commercialization & Data Sharing Policy",
                subsections: [
                    {
                        subheading: "4.1. Zero Sale of Data",
                        text: "E-Blood NEVER sells, rents, trades, or licenses your personal data, phone number, or blood group information to any third-party marketing agency, insurance company, pharmaceutical firm, data broker, or advertiser."
                    },
                    {
                        subheading: "4.2. Controlled Visibility of Donor Contact Details",
                        points: [
                            "Your donor profile is used exclusively for emergency blood matching.",
                            "If you switch your profile status to \"Unavailable\" or if you are within your post-donation recovery window, your contact details are automatically hidden from search results."
                        ]
                    },
                    {
                        subheading: "4.3. Law Enforcement & Legal Disclosures",
                        text: "We may disclose user records only if required by a lawful order issued by a court of competent jurisdiction or an authorized government agency under Section 69 of the IT Act, 2000 (e.g., investigating illegal blood trafficking or cybercrime)."
                    }
                ]
            },
            {
                id: 5,
                heading: "5. Your Rights as a Data Principal (Sections 11 to 14 of DPDP Act, 2023)",
                intro: "As a user of E-Blood, you have the following statutory rights under Indian law:",
                subsections: [
                    {
                        subheading: "5.1. Right to Access Information",
                        text: "You can view all personal data and donation logs associated with your account at any time via your dashboard."
                    },
                    {
                        subheading: "5.2. Right to Correction and Updation",
                        text: "You may update your location, phone number, last donation date, or availability toggle at any time."
                    },
                    {
                        subheading: "5.3. Right to Withdraw Consent & Erasure (Account Deletion)",
                        text: "You have the absolute right to withdraw your consent and delete your donor profile at any time. Upon clicking \"Delete Account\" or emailing a deletion request to our Grievance Officer, your personal data will be permanently erased from our active directory within 72 hours, unless retention is legally mandated due to an ongoing abuse investigation."
                    },
                    {
                        subheading: "5.4. Right of Grievance Redressal",
                        text: "You have the right to register a complaint regarding data privacy or misuse with our designated Grievance Officer."
                    },
                    {
                        subheading: "5.5. Right to Nominate",
                        text: "Under Section 14 of the DPDP Act, you may nominate another individual to exercise your data rights in the event of death or incapacity."
                    }
                ]
            },
            {
                id: 6,
                heading: "6. Data Security Safeguards",
                intro: "We implement industry-standard technical and organizational security measures under Rule 8 of the IT (SPDI) Rules, 2011, including:",
                points: [
                    "HTTPS / TLS encryption for all data in transit.",
                    "Cryptographic hashing (bcrypt/Argon2) of account passwords.",
                    "Role-based access control (RBAC) and database firewall rules.",
                    "Rate-limiting and anti-scraping mechanisms to prevent automated bots from harvesting donor phone numbers."
                ]
            },
            {
                id: 7,
                heading: "7. Children's Privacy (Section 9 of DPDP Act, 2023)",
                content:
                    "In accordance with Indian medical law (which restricts blood donation to individuals aged 18 and above) and the DPDP Act, 2023, E-Blood does not permit individuals under the age of 18 to register as blood donors. If a minor requires blood (such as a pediatric Thalassemia patient), the blood request must be submitted by the child's parent, legal guardian, or adult attendant."
            },
            {
                id: 8,
                heading: "8. Data Retention Policy",
                points: [
                    "Active Donor Accounts: Retained for as long as you choose to remain a registered voluntary donor on the Platform.",
                    "Emergency Blood Requests: Fulfilled or expired blood requests are archived and anonymized after 30 days so patient attendant numbers are no longer publicly visible.",
                    "Deleted Accounts: Purged from active databases within 72 hours of a verified deletion request."
                ]
            },
            {
                id: 9,
                heading: "9. Grievance Officer / Data Protection Contact",
                content:
                    `In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, if you have any questions, concerns, or requests regarding your privacy or data removal, please contact our Grievance Officer:\n\nDesignation: Grievance & Privacy Officer — E-Blood Network\nPrimary Email: ${PLATFORM_EMAILS.main}\nSupport Desk: ${PLATFORM_EMAILS.support}\nResponse Timeline: We acknowledge all privacy grievances within 24 hours and resolve them within 15 days of receipt.`
            }
        ]
    },

    accessibilityStatement: {
        title: "Accessibility Statement",
        effectiveDate: "October 21, 2026",
        standard: "WCAG 2.1 Level AA & Rights of Persons with Disabilities Act, 2016 (India)",
        sections: [
            {
                id: 1,
                heading: "1. Our Commitment to Digital Accessibility",
                content:
                    "E-Blood is committed to ensuring that our emergency blood donor network, blood bank directory, and awareness resources are accessible to all citizens, including persons with visual, auditory, motor, or cognitive disabilities. Because medical emergencies affect everyone equally, we strive to ensure that no user faces digital barriers when searching for life-saving blood or registering as a voluntary donor."
            },
            {
                id: 2,
                heading: "2. Conformance Standards",
                intro: "We have designed and developed the E-Blood Platform in alignment with:",
                points: [
                    "The Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA, published by the World Wide Web Consortium (W3C).",
                    "Relevant ICT accessibility provisions under the Rights of Persons with Disabilities (RPwD) Act, 2016 (Government of India) and Guidelines for Indian Government Websites and Apps (GIGW 3.0) best practices."
                ]
            },
            {
                id: 3,
                heading: "3. Key Accessibility Features Implemented on E-Blood",
                subsections: [
                    {
                        subheading: "3.1. Semantic HTML5 & Screen Reader Compatibility",
                        text: "Proper heading hierarchies (H1, H2, H3), ARIA landmarks, and descriptive labels on all form inputs (\"Find Blood Now\", Blood Group dropdowns, PIN Code search fields) so users relying on NVDA, JAWS, VoiceOver, or TalkBack can navigate seamlessly."
                    },
                    {
                        subheading: "3.2. High Contrast & Visual Clarity",
                        points: [
                            "High contrast ratios between text and background elements across both light content cards and our dark footer/navigation sections to assist users with low vision or color blindness.",
                            "Blood group badges and status indicators use explicit text labels (e.g., \"O+ Available\", \"Urgent\") rather than relying on color alone."
                        ]
                    },
                    {
                        subheading: "3.3. Full Keyboard Navigation",
                        text: "All interactive menus, donor search filters, modal dialogs, and emergency forms can be operated entirely using a standard keyboard (Tab, Shift+Tab, Enter, and Escape keys) without requiring a mouse."
                    },
                    {
                        subheading: "3.4. Responsive & Zoom-Friendly Layout",
                        text: "The interface scales smoothly up to 200% browser zoom without horizontal scrolling or text truncation across mobile phones, tablets, and desktop screens."
                    },
                    {
                        subheading: "3.5. Alternative Text for Media",
                        text: "Meaningful alt-text attributes are provided for informational images and awareness blog illustrations."
                    }
                ]
            },
            {
                id: 4,
                heading: "4. Continuous Improvement & Known Limitations",
                content:
                    "As a voluntary student and community health initiative prototype, we continuously audit our codebase to improve accessibility. While all core blood search and donor registration flows are built to be fully accessible, certain third-party embedded maps or external hospital links may not fully conform to WCAG 2.1 standards."
            },
            {
                id: 5,
                heading: "5. Accessibility Feedback and Assistance",
                content:
                    `If you experience any difficulty accessing information on E-Blood, or if you need immediate assistance finding a blood bank or submitting a request due to an accessibility barrier, please reach out to us:\n- Email: ${PLATFORM_EMAILS.support}\n- Primary: ${PLATFORM_EMAILS.main}\n- Subject Line: "Accessibility Assistance - E-Blood"\nWe review all accessibility feedback seriously and aim to resolve reported UI barriers within 7 working days.`
            }
        ]
    }
};

export const donorAvailabilityConfig = {
    step2: {
        heading: "Donation Availability & Contact Preferences",
        description: "Choose when and how you'd like to receive blood donation requests. You can update your preferences anytime. Accepting a request is always your choice, and the blood bank will confirm your eligibility."
    },
    question1: {
        id: "q1_availability",
        label: "What is your current availability for blood donation requests?",
        supportText: "Receiving a request does not commit you to donating blood. You can accept or decline each request.",
        options: [
            { id: "open", label: "I'm open to suitable requests", desc: "Receive requests matching your blood group and distance preference." },
            { id: "urgent_only", label: "Urgent requests only", desc: "Receive only verified critical emergencies." },
            { id: "temporarily_unavailable", label: "I'm temporarily unavailable", desc: "Busy with exams, work, recovery, or travel." },
            { id: "paused", label: "Pause all requests until I reactivate my availability", desc: "Stop all requests without deleting your profile or history." }
        ]
    },
    question2: {
        id: "q2_previous_donation",
        label: "When did you last donate blood?",
        options: [
            { id: "never", label: "I have never donated blood" },
            { id: "donated_before", label: "I have donated blood before" },
            { id: "dont_remember", label: "I don't remember my last donation date" }
        ],
        donationTypes: [
            { id: "whole_blood", label: "Whole blood (Standard 90–120 days interval)" },
            { id: "platelets", label: "Platelets (apheresis - min. 48 hours interval)" },
            { id: "plasma", label: "Plasma (apheresis)" },
            { id: "other", label: "Other / Not sure" }
        ],
        dontRememberNotice: "That's okay. Your previous donation details may need to be confirmed by a blood bank before the system can assess your next donation timing."
    },
    question3: {
        id: "q3_travel_distance",
        label: "How far are you willing to travel for a blood donation?",
        supportText: "Your exact home address and coordinates are never shared publicly.",
        options: [
            { id: "up_to_5km", label: "Up to 5 km" },
            { id: "5_to_15km", label: "5–15 km" },
            { id: "15_to_30km", label: "15–30 km" },
            { id: "more_than_30km", label: "More than 30 km" },
            { id: "no_preference", label: "No particular distance preference" }
        ]
    },
    question4: {
        directoryVisibility: {
            heading: "Show my profile in the donor directory",
            description: "Allow matching users to discover your donor profile. Your phone number and exact location will not be displayed publicly."
        },
        contactPreferences: {
            heading: "Who can contact you about a donation request?",
            options: [
                { id: "after_accept", label: "Share my phone number only after I accept a request", desc: "Recommended for highest privacy. Requesters can only contact you once you review and accept." },
                { id: "direct_blood_banks", label: "Allow verified blood banks to contact me directly", desc: "Authorised hospital blood centres can reach you directly for critical emergencies." }
            ]
        }
    }
};

export const assets = {
    WebLogo,
    MohfwLogo,
    NhmLogo,
    MyGovLogo,
    IndiaGovLogo,
    CdacLogo,
    DigitalIndiaLogo,
    AboutUsImage,
    PLATFORM_EMAILS,
    teamMembers,
    aboutData,
    contactData,
    faqData,
    sitemapData,
    legalData,
    donorAvailabilityConfig
};

export default assets;