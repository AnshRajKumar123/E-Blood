import React, { useState, useEffect } from "react";
import { 
    Heart, 
    ShieldCheck, 
    Clock, 
    Users, 
    AlertCircle, 
    Award, 
    Sparkles, 
    Target, 
    Search,
    UserPlus,
    Activity,
    Send,
    HelpCircle,
    CheckCircle2,
    MessageSquare,
    Info
} from "lucide-react";
import { assets, PLATFORM_EMAILS } from "../assets/assets";
import { useLanguage } from "../context/LanguageContext";
import "../styles/StaticPages.css";

export default function AboutUsPage({ 
    onGoToHome, 
    onGoToSearch, 
    onGoToRegister, 
    onGoToLogin, 
    user, 
    organisation 
}) {
    const { language, t } = useLanguage();
    const isHindi = language === "hi";
    const { aboutData, AboutUsImage, teamMembers } = assets;

    // Support Query Form States
    const [senderName, setSenderName] = useState(user?.name || organisation?.name || "");
    const [senderEmail, setSenderEmail] = useState(user?.email || organisation?.email || "");
    const [queryCategory, setQueryCategory] = useState("General Question");
    const [userComments, setUserComments] = useState("");
    const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
    const [querySubmittedSuccess, setQuerySubmittedSuccess] = useState(false);

    useEffect(() => {
        if (user?.name) setSenderName(user.name);
        if (user?.email) setSenderEmail(user.email);
        if (organisation?.name) setSenderName(organisation.name);
        if (organisation?.email) setSenderEmail(organisation.email);
    }, [user, organisation]);

    // Authentication Guard for Finding Blood
    const handleFindBloodClick = () => {
        if (user || organisation) {
            onGoToSearch();
        } else {
            alert(
                isHindi 
                    ? "रक्तदाताओं के सत्यापित संपर्क विवरण देखने के लिए कृपया पहले साइन इन करें।" 
                    : "Please sign in to view and contact verified voluntary blood donors."
            );
            if (onGoToLogin) {
                onGoToLogin();
            } else if (onGoToRegister) {
                onGoToRegister();
            }
        }
    };

    // Query Submission Handler
    const handleSendSupportQuery = (e) => {
        e.preventDefault();
        if (!senderName.trim() || !senderEmail.trim() || !userComments.trim()) {
            alert("Please fill out your Name, Email, and your detailed issue or question.");
            return;
        }

        setIsSubmittingQuery(true);

        const emailSubject = encodeURIComponent(`[E-Blood Query] ${queryCategory} from ${senderName.trim()}`);
        const emailBody = encodeURIComponent(
            `Name: ${senderName.trim()}\n` +
            `Sender Email: ${senderEmail.trim()}\n` +
            `Category: ${queryCategory}\n\n` +
            `Message / Problem Details:\n${userComments.trim()}\n\n` +
            `--\nDispatched from E-Blood Verified Network Portal`
        );

        const mailtoUrl = `mailto:${PLATFORM_EMAILS.support}?subject=${emailSubject}&body=${emailBody}`;

        setTimeout(() => {
            window.location.href = mailtoUrl;
            setIsSubmittingQuery(false);
            setQuerySubmittedSuccess(true);
            setUserComments("");
        }, 600);
    };

    return (
        <div className="eb-about-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home") || "Home"}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">About Us</span>
                </nav>

                {/* 1. HERO SECTION */}
                <div className="eb-about-hero-header">
                    <span className="eb-about-kicker">
                        <Sparkles size={13} />
                        <span>VERIFIED NATIONAL EMERGENCY NETWORK</span>
                    </span>
                    <h1 className="eb-about-hero-title">
                        Saving Lives Through Ethical Technology &amp; Voluntary Courage
                    </h1>
                    <p className="eb-about-hero-sub">
                        E-Blood is a voluntary student and community health initiative built to bridge the critical time gap between patients needing urgent blood transfusions and voluntary blood donors across India.
                    </p>
                </div>

                {/* 2. 3-CARD METRICS BAR */}
                <div className="eb-about-metrics-bar">
                    <div className="eb-about-metric-cell">
                        <Clock size={24} color="#e11d48" style={{ marginBottom: "6px" }} />
                        <span className="metric-num">~15 Mins</span>
                        <span className="metric-lbl">Target Response Window</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="eb-about-metric-cell">
                        <ShieldCheck size={24} color="#16a34a" style={{ marginBottom: "6px" }} />
                        <span className="metric-num">100%</span>
                        <span className="metric-lbl">Non-Remunerated &amp; Voluntary</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="eb-about-metric-cell">
                        <Users size={24} color="#0284c7" style={{ marginBottom: "6px" }} />
                        <span className="metric-num">Zero</span>
                        <span className="metric-lbl">Middlemen, Touts or Service Fees</span>
                    </div>
                </div>

                {/* 3. CORE STORY & HERO IMAGE */}
                <div className="eb-about-story-grid">
                    <div className="eb-story-content-col">
                        <div className="eb-story-badge">
                            <Target size={13} />
                            <span>THE PROBLEM WE SOLVE</span>
                        </div>
                        <h2>Replacing Midnight Panic with Immediate Digital Hope</h2>
                        <p>
                            While India has a massive population of eligible youth, critical delays still occur during medical emergencies—such as road accidents, maternal childbirth complications, major surgeries, and chronic conditions like Thalassemia and Sickle Cell Anemia—not because donors do not want to help, but because patients' families do not know whom to call at 2:00 AM.
                        </p>
                        <p>
                            Families often resort to unverified social media forwards on WhatsApp or fall prey to illegal commercial touts outside hospitals. E-Blood replaces panic with an instant, privacy-conscious digital directory connecting patients directly with eligible, voluntary donors.
                        </p>

                        <div className="eb-story-cta-group">
                            <button type="button" className="eb-btn-story-primary" onClick={handleFindBloodClick}>
                                <Search size={15} />
                                <span>Find Blood Now</span>
                            </button>
                            <button type="button" className="eb-btn-story-secondary" onClick={onGoToRegister}>
                                <UserPlus size={15} />
                                <span>Become a Donor</span>
                            </button>
                        </div>
                    </div>

                    <div className="eb-story-visual-col">
                        <div className="eb-story-img-frame">
                            <img 
                                src={AboutUsImage} 
                                alt="E-Blood Emergency Mission" 
                                className="eb-story-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div className="eb-story-overlay-pill">
                                <Activity size={16} color="#e11d48" />
                                <div>
                                    <strong>100% Verified Community</strong>
                                    <small>OTP &amp; Clinical Screening Standards</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. COMPREHENSIVE E-BLOOD PORTAL SECTIONS */}
                <div className="eb-about-sections-container">
                    {/* SECTION 1: WHO WE ARE */}
                    <div className="eb-about-content-card">
                        <div className="eb-section-title-tag">
                            <Info size={14} />
                            <span>1. WHO WE ARE</span>
                        </div>
                        <h3>A Rapid-Response Community Lifeline</h3>
                        <p>
                            E-Blood is a voluntary student and community health initiative built to bridge the critical time gap between patients needing urgent blood transfusions and voluntary blood donors across India. Designed as a rapid-response digital network, E-Blood connects blood seekers, voluntary citizens, Thalassemia warriors, and verified blood banks on a single, unified, zero-cost platform.
                        </p>
                    </div>

                    {/* SECTION 3: WHAT E-BLOOD OFFERS */}
                    <div className="eb-about-content-card">
                        <div className="eb-section-title-tag">
                            <Sparkles size={14} />
                            <span>3. WHAT E-BLOOD OFFERS</span>
                        </div>
                        <h3>Core Features Built for Emergency Healthcare</h3>
                        <div className="eb-offers-grid">
                            <div className="eb-offer-item">
                                <div className="offer-bullet-ico">🩸</div>
                                <div>
                                    <strong>Real-Time Voluntary Donor Discovery ("Find Blood Now")</strong>
                                    <p>Connects patient attendants with eligible voluntary donors in their district or PIN code within minutes.</p>
                                </div>
                            </div>
                            <div className="eb-offer-item">
                                <div className="offer-bullet-ico">🏥</div>
                                <div>
                                    <strong>Verified Blood Bank Directory</strong>
                                    <p>Provides quick access to contact details and locations of licensed hospital and community blood centres.</p>
                                </div>
                            </div>
                            <div className="eb-offer-item">
                                <div className="offer-bullet-ico">🎗️</div>
                                <div>
                                    <strong>Thalassemia &amp; Recurring Request Support</strong>
                                    <p>A dedicated channel for patients requiring regular packed red cell transfusions every 15 to 21 days, helping them build a reliable circle of repeat voluntary donors.</p>
                                </div>
                            </div>
                            <div className="eb-offer-item">
                                <div className="offer-bullet-ico">🎪</div>
                                <div>
                                    <strong>Camp Discovery &amp; Registration ("Upcoming Camps")</strong>
                                    <p>Enables colleges, NGOs, and licensed blood banks to publish upcoming voluntary blood donation drives so citizens can easily participate.</p>
                                </div>
                            </div>
                            <div className="eb-offer-item">
                                <div className="offer-bullet-ico">📖</div>
                                <div>
                                    <strong>Awareness &amp; Eligibility Education</strong>
                                    <p>Simplifies official Indian medical guidelines (age, weight, hemoglobin, and inter-donation gaps) so first-time donors can donate with confidence and zero fear.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: OUR CORE PRINCIPLES */}
                    <div className="eb-about-content-card">
                        <div className="eb-section-title-tag">
                            <ShieldCheck size={14} />
                            <span>4. OUR CORE PRINCIPLES</span>
                        </div>
                        <h3>Ethical Standards &amp; Statutory Compliance</h3>
                        <div className="eb-pillars-grid">
                            <div className="eb-pillar-card">
                                <div className="eb-pillar-icon-box">
                                    <Heart size={20} color="#e11d48" />
                                </div>
                                <h4>100% Voluntary &amp; Non-Remunerated</h4>
                                <p>We strictly uphold the Supreme Court of India's mandate and National Blood Policy. Blood is a gift of life—never a commodity for sale.</p>
                            </div>

                            <div className="eb-pillar-card">
                                <div className="eb-pillar-icon-box">
                                    <ShieldCheck size={20} color="#0284c7" />
                                </div>
                                <h4>Privacy First (DPDP Act, 2023)</h4>
                                <p>We protect our donors' personal data under the Digital Personal Data Protection Act, 2023, giving donors full control over availability status.</p>
                            </div>

                            <div className="eb-pillar-card">
                                <div className="eb-pillar-icon-box">
                                    <Users size={20} color="#059669" />
                                </div>
                                <h4>Community Driven &amp; Ad-Free</h4>
                                <p>Built as an ethical technology initiative for public good, free of advertisements, middlemen, commercial agencies, or hidden charges.</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: IMPORTANT PROTOTYPE & MEDICAL NOTICE */}
                    <div className="eb-medical-disclaimer-box">
                        <AlertCircle size={22} className="alert-ico" />
                        <div>
                            <h4>5. Important Prototype &amp; Medical Notice</h4>
                            <p>
                                E-Blood operates as a voluntary student and community health technology initiative. We do not collect, test, or store blood. All blood collection, infectious disease screening, and cross-matching must strictly take place inside licensed hospitals and government-approved Blood Centres.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5. MEET THE TEAM SECTION */}
                <div className="eb-team-showcase-section">
                    <div className="eb-team-header-center">
                        <div className="eb-team-kicker-pill">
                            <Award size={13} />
                            <span>THE CREATIVE &amp; ENGINEERING MINDS</span>
                        </div>
                        <h2 className="eb-team-headline">Meet the Team Behind E-Blood</h2>
                        <p className="eb-team-subline">
                            Built with passion and technical rigor by students committed to revolutionizing emergency medical access through ethical innovation.
                        </p>
                    </div>

                    <div className="eb-team-cards-grid">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="eb-member-card">
                                <div className="eb-member-card-top">
                                    <div className="eb-member-photo-frame">
                                        {member.photo ? (
                                            <img 
                                                src={member.photo} 
                                                alt={member.name} 
                                                className="eb-member-photo"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            className="eb-member-monogram"
                                            style={{ 
                                                background: member.gradient,
                                                display: member.photo ? 'none' : 'flex'
                                            }}
                                        >
                                            {member.initials}
                                        </div>
                                    </div>

                                    <div className="eb-member-role-badge">
                                        <Award size={12} />
                                        <span>Core Contributor</span>
                                    </div>
                                </div>

                                <div className="eb-member-body">
                                    <h3 className="eb-member-name">{member.name}</h3>
                                    <span className="eb-member-title">{member.role}</span>
                                    <p className="eb-member-bio">{member.bio}</p>

                                    {member.skills && (
                                        <div className="eb-member-skills-row">
                                            {member.skills.map((skill, sIdx) => (
                                                <span key={sIdx} className="eb-skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. USER QUERY / QUESTIONS / ISSUES SUBMISSION DESK */}
                <div className="eb-support-query-section">
                    <div className="eb-query-card">
                        <div className="eb-query-header">
                            <div className="eb-query-icon-badge">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h2>Have a Question, Problem, or Feedback?</h2>
                                <p>
                                    Submit your issues, bug reports, fake donor complaints, or questions directly to our technical and donor support desk at <strong>{PLATFORM_EMAILS.support}</strong>.
                                </p>
                            </div>
                        </div>

                        {querySubmittedSuccess && (
                            <div className="eb-query-success-alert">
                                <CheckCircle2 size={18} />
                                <span>Thank you! Your email client has been prepared. Please click Send in your email to submit to {PLATFORM_EMAILS.support}.</span>
                            </div>
                        )}

                        <form onSubmit={handleSendSupportQuery} className="eb-query-form">
                            <div className="eb-query-row">
                                <div className="eb-query-input-col">
                                    <label>Your Name *</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name" 
                                        value={senderName} 
                                        onChange={(e) => setSenderName(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="eb-query-input-col">
                                    <label>Your Email Address *</label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={senderEmail} 
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="eb-query-row">
                                <div className="eb-query-input-col">
                                    <label>Query Topic / Category *</label>
                                    <select 
                                        value={queryCategory} 
                                        onChange={(e) => setQueryCategory(e.target.value)}
                                        className="eb-query-select"
                                    >
                                        <option value="General Question">General Question</option>
                                        <option value="Technical Problem / Bug">Technical Problem / Bug</option>
                                        <option value="Report Fake Donor / Money Demand">Report Fake Donor / Money Demand</option>
                                        <option value="Blood Camp Scheduling Help">Blood Camp Scheduling Help</option>
                                        <option value="Blood Bank Onboarding">Blood Bank Onboarding</option>
                                        <option value="Data Privacy & Profile Deletion">Data Privacy &amp; Profile Deletion</option>
                                    </select>
                                </div>
                            </div>

                            <div className="eb-query-row">
                                <div className="eb-query-input-col">
                                    <label>Your Comments / Problem Details *</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Describe your issue, feedback, or question in detail..."
                                        value={userComments}
                                        onChange={(e) => setUserComments(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="eb-query-submit-bar">
                                <span className="eb-query-note">
                                    <HelpCircle size={14} />
                                    <span>Directly dispatched to <strong>{PLATFORM_EMAILS.support}</strong></span>
                                </span>

                                <button 
                                    type="submit" 
                                    className="eb-btn-send-query"
                                    disabled={isSubmittingQuery}
                                >
                                    <Send size={16} />
                                    <span>{isSubmittingQuery ? "Preparing..." : "Send to Support"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}