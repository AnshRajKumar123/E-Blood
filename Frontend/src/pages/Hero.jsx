import React, { useState, useEffect } from "react";
import {
    Heart,
    ShieldCheck,
    Clock,
    Calendar,
    ArrowRight,
    Building2,
    Database,
    Users,
    ChevronRight,
    Sparkles,
    Loader2,
    PlusCircle,
    Search
} from "lucide-react";
import CheckEligibility from "../components/CheckEligibility";
import { apiGetCamps, resolveImageUrl } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Hero.css";
import "../styles/FindCamp.css";

// Auto-advances through uploaded images horizontally every 3s
function CampImageCarousel({ images, title }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const validImages = Array.isArray(images) && images.length > 0 ? images : [];

    useEffect(() => {
        if (validImages.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % validImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [validImages.length]);

    if (validImages.length === 0) {
        return (
            <div 
                className="eb-camp-carousel-wrapper" 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    background: "#f1f5f9", 
                    color: "#94a3b8" 
                }}
            >
                <span>No photo provided</span>
            </div>
        );
    }

    return (
        <div className="eb-camp-carousel-wrapper">
            <div 
                className="eb-camp-carousel-track"
                style={{ transform: `translateX(-${activeIdx * 100}%)` }}
            >
                {validImages.map((src, idx) => (
                    <div key={idx} className="eb-camp-carousel-slide">
                        <img 
                            src={resolveImageUrl(src)} 
                            alt={`${title} photo ${idx + 1}`} 
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {validImages.length > 1 && (
                <div className="eb-carousel-indicators">
                    {validImages.map((_, dotIdx) => (
                        <span 
                            key={dotIdx} 
                            className={`eb-dot ${dotIdx === activeIdx ? "active" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIdx(dotIdx);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Hero({ 
    onFindBlood, 
    onRegisterDonor, 
    onGoToOrgLogin, 
    onGoToRegisterBank, 
    onGoToAddCamp, 
    onGoToCamps,
    organisation,
    user 
}) {
    const { language, t } = useLanguage();
    const isHindi = language === "hi";

    // Real Live Camps from MongoDB
    const [liveCamps, setLiveCamps] = useState([]);
    const [loadingCamps, setLoadingCamps] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchRealCamps = async () => {
            try {
                const res = await apiGetCamps();
                if (res && res.success && Array.isArray(res.camps)) {
                    if (isMounted) setLiveCamps(res.camps);
                } else {
                    if (isMounted) setLiveCamps([]);
                }
            } catch (err) {
                console.error("Error loading camps from database:", err);
                if (isMounted) setLiveCamps([]);
            } finally {
                if (isMounted) setLoadingCamps(false);
            }
        };

        fetchRealCamps();
        return () => { isMounted = false; };
    }, []);

    // Handles authentication check before navigating to search
    const handleFindDonorsClick = () => {
        if (!user && !organisation) {
            alert(
                isHindi 
                    ? "रक्तदाताओं के सत्यापित संपर्क विवरण देखने के लिए कृपया पहले साइन इन करें।" 
                    : "Please sign in to view and contact verified voluntary blood donors."
            );
            if (onRegisterDonor) {
                onRegisterDonor(); // Redirects to Login/Auth page
            }
            return;
        }

        onFindBlood();
    };

    const blogPosts = isHindi ? [
        {
            id: 1,
            category: "पात्रता",
            title: "रक्तदान कौन कर सकता है? एक सरल चेकलिस्ट",
            desc: "उम्र, वजन, हीमोग्लोबिन और अंतिम रक्तदान के बाद का अंतर — भारतीय ब्लड बैंकों के वास्तविक नियम।",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            category: "जागरूकता",
            title: "नियमित रक्तदान के स्वास्थ्य लाभ",
            desc: "रक्तदान करने से हृदय स्वास्थ्य बेहतर रहता है और शरीर में नई रक्त कोशिकाओं का निर्माण होता है।",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            category: "मार्गदर्शिका",
            title: "रक्तदान से पहले और बाद में क्या खाएं?",
            desc: "उचित हाइड्रेशन और स्वस्थ आहार के साथ रक्तदान प्रक्रिया को आसान और सुरक्षित बनाएं।",
            image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80"
        }
    ] : [
        {
            id: 1,
            category: "ELIGIBILITY",
            title: "Who can donate blood? A simple checklist",
            desc: "Age, weight, hemoglobin, and the gap since your last donation — the actual rules Indian blood banks use.",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            category: "HEALTH",
            title: "Key health benefits of regular blood donation",
            desc: "Regular donation helps stimulate production of fresh blood cells and maintains iron balance.",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            category: "GUIDE",
            title: "What to eat before and after donating blood",
            desc: "Essential hydration and iron-rich dietary recommendations for voluntary donors.",
            image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80"
        }
    ];

    return (
        <div className="eb-landing-root">
            {/* 1. HERO CALL-TO-ACTION STAGE */}
            <section className="eb-hero-stage">
                <div className="eb-container eb-hero-content">
                    <div className="eb-badge-pill">
                        <span className="live-dot"></span>
                        <span>{t("emergencyHelpline") || "EMERGENCY BLOOD CONNECT NETWORK"}</span>
                    </div>

                    <h1 className="eb-hero-title">
                        {t("heroTitle") || "Connecting voluntary blood donors with patients in real-time."}
                    </h1>

                    <p className="eb-hero-subtitle">
                        {t("heroSub") || "Instant donor matches within your district radius. Zero delay, 100% voluntary."}
                    </p>

                    {/* Standalone 'Find Donors Now!!' Button */}
                    <div className="eb-hero-cta-wrap">
                        <button
                            type="button"
                            className="eb-find-donors-big-btn"
                            onClick={handleFindDonorsClick}
                        >
                            <span className="btn-pulse-glow" />
                            <Search size={22} className="btn-search-ico" />
                            <span className="btn-text">Find Donors Now!!</span>
                        </button>
                    </div>

                    <div className="eb-hero-bottom-deck">
                        <div className="eb-compact-stats-bar">
                            <div className="stat-chip">
                                <Clock size={14} className="stat-icon" />
                                <span><strong>{t("response15m") || "~15m Response"}</strong></span>
                            </div>
                            <span className="stat-sep">•</span>
                            <div className="stat-chip">
                                <ShieldCheck size={14} className="stat-icon" />
                                <span><strong>{t("verified100") || "100% Verified"}</strong></span>
                            </div>
                            <span className="stat-sep">•</span>
                            <div className="stat-chip">
                                <Sparkles size={14} className="stat-icon" />
                                <span><strong>{t("freeDirect") || "Free & Direct"}</strong></span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="eb-donor-link-pill"
                            onClick={onRegisterDonor}
                        >
                            <Heart size={14} />
                            <span>{t("wantToDonate") || "Want to donate? Register as a donor ›"}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. PLEDGE PROMOTION HERO BANNER */}
            <section className="eb-pledge-banner-section">
                <div className="eb-container">
                    <div className="eb-pledge-card">
                        <div className="pledge-text-col">
                            <h2>{t("pledgeFor") || "Pledge for"}</h2>
                            <h1><strong>{t("voluntaryBloodDonation") || "Voluntary Blood Donation"}</strong></h1>
                            <p>{t("pledgeSub") || "Join millions of citizens creating a national safety net for emergency surgeries and thalassemia patients."}</p>
                        </div>
                        <div className="pledge-graphic-col">
                            <div className="blood-bag-mock">
                                <span className="drop-icon">🩸</span>
                                <small>{t("allGroups") || "ALL GROUPS"}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. REAL LIVE BLOOD CAMPS FROM DATABASE ONLY */}
            <section className="eb-camps-section">
                <div className="eb-container">
                    <div className="eb-section-header-row">
                        <div className="eb-heading-block">
                            <h2>{t("upcomingBloodCamps") || "Upcoming blood camps"}</h2>
                            <span className="eb-local-badge">{t("showingNearYou") || "Showing near you"}</span>
                        </div>
                        <button 
                            type="button" 
                            className="eb-view-all-link"
                            onClick={onGoToCamps}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <span>{t("viewAllCamps") || "View all camps"}</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {loadingCamps ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                            <Loader2 size={28} className="spin-loader" style={{ margin: "0 auto 8px", color: "#e11d48" }} />
                            <p>{isHindi ? "शिविर लोड हो रहे हैं..." : "Loading blood donation camps..."}</p>
                        </div>
                    ) : liveCamps.length === 0 ? (
                        <div style={{ 
                            background: "#ffffff", 
                            border: "1.5px dashed #cbd5e1", 
                            borderRadius: "16px", 
                            padding: "36px 20px", 
                            textAlign: "center" 
                        }}>
                            <Calendar size={36} color="#94a3b8" style={{ margin: "0 auto 10px" }} />
                            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>
                                {isHindi ? "वर्तमान में कोई आगामी शिविर निर्धारित नहीं है" : "No Scheduled Blood Camps Yet"}
                            </h3>
                            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
                                {isHindi 
                                    ? "क्या आप एक संस्था या अस्पताल हैं? रक्तदान अभियान का आयोजन करें और उसे यहाँ सूचीबद्ध करें।" 
                                    : "Are you an organisation or hospital? Schedule a voluntary blood drive to list it here."}
                            </p>
                            <button
                                type="button"
                                className="eb-pill-btn eb-pill-btn-primary"
                                onClick={onGoToAddCamp}
                                style={{ padding: "8px 18px", fontSize: "13px" }}
                            >
                                <PlusCircle size={14} style={{ marginRight: "6px" }} />
                                {isHindi ? "शिविर जोड़ें" : "Schedule a Blood Camp"}
                            </button>
                        </div>
                    ) : (
                        <div className="eb-camps-grid">
                            {liveCamps.slice(0, 6).map((camp) => {
                                const campImages = (camp.images && camp.images.length > 0) 
                                    ? camp.images 
                                    : (camp.image ? [camp.image] : []);

                                return (
                                    <div 
                                        key={camp._id || camp.id} 
                                        className="eb-camp-ca"
                                        onClick={onGoToCamps}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="eb-camp-media">
                                            <CampImageCarousel images={campImages} title={camp.title} />
                                            <div className="eb-camp-overlay">
                                                <h4>{camp.title}</h4>
                                                <div className="camp-meta-line">
                                                    <span>{camp.campAddress || `${camp.city || ""}, ${camp.district || ""}`}</span>
                                                </div>
                                                <div className="camp-meta-line">
                                                    <span>
                                                        {camp.campDate} ({camp.startTime || "09:00"} – {camp.endTime || "17:00"})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. FOR ORGANISATIONS SECTION */}
            <section className="eb-org-section">
                <div className="eb-container">
                    <div className="eb-section-header-row">
                        <div>
                            <span className="eb-category-pretitle">{t("forOrganisations") || "FOR ORGANISATIONS"}</span>
                            <h2 style={{ fontSize: "21px", fontWeight: "800", color: "#0f172a" }}>
                                {t("runningBankOrCamp") || "Running a blood bank or organizing a blood camp?"}
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="eb-view-all-link"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            onClick={() => (organisation ? onGoToRegisterBank() : onGoToOrgLogin())}
                        >
                            <span>{t("organisationPortal") || "Organisation portal"}</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="eb-org-cards-row">
                        <div 
                            className="eb-org-action-card" 
                            onClick={onGoToRegisterBank}
                        >
                            <div className="org-card-content">
                                <div className="org-icon-sq"><Building2 size={18} /></div>
                                <h3>{t("registerABloodBank") || "Register a blood bank"}</h3>
                                <p>{t("listBankSub") || "List your licensed blood centre, update live inventory, and respond to local needs."}</p>
                                <span className="org-cta-link">{t("getStarted") || "Get started"}</span>
                            </div>
                            <div className="org-card-thumb">
                                <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80" alt="Blood bank" />
                            </div>
                        </div>

                        <div 
                            className="eb-org-action-card" 
                            onClick={onGoToAddCamp}
                        >
                            <div className="org-card-content">
                                <div className="org-icon-sq"><Calendar size={18} /></div>
                                <h3>{t("registerABloodCamp") || "Register a blood camp"}</h3>
                                <p>{t("listCampSub") || "Publish upcoming voluntary donation drives and notify nearby registered donors."}</p>
                                <span className="org-cta-link">{t("getStarted") || "Get started"}</span>
                            </div>
                            <div className="org-card-thumb">
                                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80" alt="Blood drive" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="eb-how-it-works-section">
                <div className="eb-container">
                    <span className="eb-category-pretitle">{t("howEbloodWorks") || "HOW E-BLOOD WORKS"}</span>
                    <h2 className="eb-how-title">{t("howEbloodTitle") || "Connecting donors and seekers in 3 simple steps"}</h2>

                    <div className="eb-how-steps-grid">
                        <div className="eb-step-card">
                            <div className="step-icon-bubble"><Clock size={18} /></div>
                            <h4>{t("step1Title") || "Search or register"}</h4>
                            <p>{t("step1Desc") || "Patients search by blood group and locality. Citizens register with basic eligibility self-declaration."}</p>
                        </div>

                        <div className="eb-step-card">
                            <div className="step-icon-bubble"><Database size={18} /></div>
                            <h4>{t("step2Title") || "Direct connection"}</h4>
                            <p>{t("step2Desc") || "Direct contact between patient attendants and nearby verified voluntary donors."}</p>
                        </div>

                        <div className="eb-step-card">
                            <div className="step-icon-bubble"><Users size={18} /></div>
                            <h4>{t("step3Title") || "Safe donation"}</h4>
                            <p>{t("step3Desc") || "Donation happens at licensed blood banks or accredited hospitals under standard medical protocols."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. INTERACTIVE CHECK ELIGIBILITY */}
            <CheckEligibility onRegisterDonor={onRegisterDonor} />

            {/* 7. STORIES & BLOG */}
            <section className="eb-blog-section">
                <div className="eb-container">
                    <div className="eb-section-header-row">
                        <div className="eb-heading-block">
                            <span className="eb-category-pretitle">{t("fromTheBlog") || "FROM THE BLOG"}</span>
                            <h2 style={{ fontSize: "21px", fontWeight: "800", color: "#0f172a" }}>{t("storiesAndAwareness") || "Stories & awareness"}</h2>
                        </div>
                        <a href="#view-posts" className="eb-view-all-link">
                            {t("viewAllPosts") || "View all posts"} <ChevronRight size={14} />
                        </a>
                    </div>

                    <div className="eb-blog-grid">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="eb-blog-card">
                                <div className="eb-blog-thumb">
                                    <img src={post.image} alt={post.title} loading="lazy" />
                                </div>
                                <div className="eb-blog-body">
                                    <span className="eb-blog-category">{post.category}</span>
                                    <h4>{post.title}</h4>
                                    <p>{post.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}