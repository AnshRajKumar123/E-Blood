import React, { useState, useEffect, useRef } from "react";
import {
    User, ChevronDown, Building2, Home, Search, Heart, Menu, X, FolderKanban, HelpCircle, Info, Calendar, Bell
} from "lucide-react";
import { assets } from "../assets/assets";
import { apiGetNotifications } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Navbar.css";

export default function Navbar({ activePage, setActivePage, user, organisation }) {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [unreadNotifs, setUnreadNotifs] = useState(2);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const navRef = useRef(null);

    const { language, toggleLanguage, t } = useLanguage();
    const isHindi = language === "hi";

    useEffect(() => {
        const fetchBadgeCount = async () => {
            try {
                const res = await apiGetNotifications();
                if (res && res.success) {
                    setUnreadNotifs(res.unreadCount ?? 0);
                }
            } catch (err) {
                // Keep default
            }
        };
        fetchBadgeCount();
    }, [activePage]);

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (currentScrollY <= 70) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                ticking.current = false;
                return;
            }

            const diff = currentScrollY - lastScrollY.current;

            if (diff > 10) {
                setIsVisible(false);
                setOpenMenu(null);
            } else if (diff < -10) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateNavbarVisibility);
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (mobileDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [mobileDrawerOpen]);

    const toggleMenu = (menuName) => {
        setOpenMenu((prev) => (prev === menuName ? null : menuName));
    };

    const handleSelectOption = (action) => {
        setOpenMenu(null);
        setMobileDrawerOpen(false);
        if (typeof action === "function") {
            action();
        }
    };

    // Auth gate for finding blood donors
    const handleFindBloodClick = () => {
        if (user || organisation) {
            setActivePage("search");
        } else {
            alert(
                isHindi
                    ? "रक्तदाताओं के सत्यापित संपर्क विवरण देखने के लिए कृपया पहले साइन इन करें।"
                    : "Please sign in to view and contact verified voluntary blood donors."
            );
            setActivePage("login");
        }
    };

    const handleAccountClick = () => {
        if (organisation) {
            setActivePage("org-dashboard");
        } else if (user) {
            setActivePage("profile");
        } else {
            setActivePage("login");
        }
    };

    return (
        <>
            <header
                className={`eb-navbar-root ${!isVisible ? "eb-navbar-hidden" : ""}`}
                ref={navRef}
            >
                <div className="eb-container eb-navbar-container">
                    {/* Brand Logo */}
                    <div
                        className="eb-brand-block"
                        onClick={() => handleSelectOption(() => setActivePage("home"))}
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            src={assets.WebLogo}
                            alt="E-Blood Logo"
                            className="eb-brand-logo-img"
                        />
                        <span className="eb-brand-name">E-Blood</span>
                    </div>

                    {/* Desktop Center Dropdowns */}
                    <nav className="eb-center-nav">
                        {/* Looking for Blood */}
                        <div className="eb-nav-dropdown-wrapper">
                            <button
                                type="button"
                                className={`eb-nav-dropdown-trigger ${openMenu === "looking" || activePage === "search" || activePage === "directory" ? "active" : ""}`}
                                onClick={() => toggleMenu("looking")}
                            >
                                <span>{isHindi ? "रक्त की खोज" : (t("lookingForBlood") || "Looking for Blood")}</span>
                                <ChevronDown size={14} className={`eb-chevron ${openMenu === "looking" ? "rotate" : ""}`} />
                            </button>

                            {openMenu === "looking" && (
                                <div className="eb-nav-custom-menu">
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(handleFindBloodClick)}
                                    >
                                        <span>{isHindi ? "रक्तदाता खोजें" : (t("findBloodNow") || "Find Blood Now")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("directory"))}
                                    >
                                        <span>{isHindi ? "ब्लड बैंक निर्देशिका" : (t("bloodBankDirectory") || "Blood Bank Directory")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item disabled-item"
                                        onClick={() => handleSelectOption(() => alert(isHindi ? "थैलेसीमिया व नियमित अनुरोध मॉड्यूल जल्द आ रहा है!" : "Thalassemia & recurring requests module is coming soon!"))}
                                    >
                                        <div className="item-text-cluster">
                                            <span>{isHindi ? "थैलेसीमिया व नियमित अनुरोध" : (t("thalassemiaRequests") || "Thalassemia & Recurring Requests")}</span>
                                            <span className="eb-soon-pill">{isHindi ? "जल्द ही" : (t("soon") || "Soon")}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Donate Blood */}
                        <div className="eb-nav-dropdown-wrapper">
                            <button
                                type="button"
                                className={`eb-nav-dropdown-trigger ${openMenu === "donate" || activePage === "register" || activePage === "camps" ? "active" : ""}`}
                                onClick={() => toggleMenu("donate")}
                            >
                                <span>{isHindi ? "रक्तदान करें" : (t("donateBlood") || "Donate Blood")}</span>
                                <ChevronDown size={14} className={`eb-chevron ${openMenu === "donate" ? "rotate" : ""}`} />
                            </button>

                            {openMenu === "donate" && (
                                <div className="eb-nav-custom-menu">
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("register"))}
                                    >
                                        <span>{isHindi ? "रक्तदाता पंजीकरण" : (t("registerAsDonor") || "Register as Donor")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("camps"))}
                                    >
                                        <span>{isHindi ? "रक्तदान शिविर खोजें" : (t("findCamp") || "Find a Camp")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => {
                                            setActivePage("home");
                                            setTimeout(() => {
                                                const eligEl = document.querySelector(".eb-eligibility-section");
                                                if (eligEl) eligEl.scrollIntoView({ behavior: "smooth" });
                                            }, 100);
                                        })}
                                    >
                                        <span>{isHindi ? "रक्तदान पात्रता जांचें" : (t("aboutDonating") || "Check Eligibility")}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resources */}
                        <div className="eb-nav-dropdown-wrapper">
                            <button
                                type="button"
                                className={`eb-nav-dropdown-trigger ${openMenu === "resources" || activePage === "about" || activePage === "faqs" || activePage === "notifications" ? "active" : ""}`}
                                onClick={() => toggleMenu("resources")}
                            >
                                <span>{isHindi ? "संसाधन" : (t("resources") || "Resources")}</span>
                                <ChevronDown size={14} className={`eb-chevron ${openMenu === "resources" ? "rotate" : ""}`} />
                            </button>

                            {openMenu === "resources" && (
                                <div className="eb-nav-custom-menu">
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("notifications"))}
                                    >
                                        <span>{isHindi ? "सूचनाएं व अलर्ट" : "Notifications"}</span>
                                        {unreadNotifs > 0 && (
                                            <span style={{ background: "#e11d48", color: "#fff", fontSize: "10px", padding: "1px 6px", borderRadius: "9999px", fontWeight: "800" }}>
                                                {unreadNotifs}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("about"))}
                                    >
                                        <span>{isHindi ? "हमारे बारे में" : (t("aboutUs") || "About Us")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => setActivePage("faqs"))}
                                    >
                                        <span>{isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : (t("faqs") || "FAQs")}</span>
                                    </div>
                                    <div
                                        className="eb-nav-custom-item"
                                        onClick={() => handleSelectOption(() => {
                                            setActivePage("home");
                                            setTimeout(() => {
                                                const blogEl = document.querySelector(".eb-blog-section");
                                                if (blogEl) blogEl.scrollIntoView({ behavior: "smooth" });
                                            }, 100);
                                        })}
                                    >
                                        <span>{isHindi ? "ब्लॉग व कहानियां" : (t("blog") || "Blog & Stories")}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Controls */}
                    <div className="eb-nav-actions">
                        <button
                            type="button"
                            className={`eb-notif-bell-btn ${activePage === "notifications" ? "active" : ""}`}
                            onClick={() => handleSelectOption(() => setActivePage("notifications"))}
                            title="Notifications & Alerts"
                            style={{
                                background: "transparent",
                                border: "none",
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px",
                                cursor: "pointer",
                                color: activePage === "notifications" ? "#e11d48" : "#334155"
                            }}
                        >
                            <Bell size={20} />
                            {unreadNotifs > 0 && (
                                <span style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    minWidth: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                    background: "#e11d48",
                                    color: "#ffffff",
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #ffffff",
                                    padding: "1px"
                                }}>
                                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                                </span>
                            )}
                        </button>

                        <div className="eb-lang-toggle" title="Switch Language / भाषा बदलें">
                            <span
                                className={!isHindi ? "active" : ""}
                                onClick={() => toggleLanguage("en")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                            >
                                EN
                            </span>
                            <span
                                className={isHindi ? "active" : ""}
                                onClick={() => toggleLanguage("hi")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                            >
                                हिं
                            </span>
                        </div>

                        {organisation ? (
                            <button
                                type="button"
                                className={`eb-user-profile-badge ${activePage === "org-dashboard" ? "active-profile" : ""}`}
                                onClick={() => handleSelectOption(() => setActivePage("org-dashboard"))}
                                title={isHindi ? "संस्था डैशबोर्ड" : "Organisation Dashboard"}
                            >
                                <div className="eb-user-avatar-bubble" style={{ background: "#0284c7" }}>
                                    <Building2 size={15} />
                                </div>
                                <span className="user-name-text">{organisation.name || (isHindi ? "संस्था" : "Organisation")}</span>
                            </button>
                        ) : user ? (
                            <button
                                type="button"
                                className={`eb-user-profile-badge ${activePage === "profile" ? "active-profile" : ""}`}
                                onClick={() => handleSelectOption(() => setActivePage("profile"))}
                            >
                                <div className="eb-user-avatar-bubble">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name-text">{user.name || (isHindi ? "उपयोगकर्ता" : "User")}</span>
                            </button>
                        ) : (
                            <div className="eb-nav-dropdown-wrapper desktop-only">
                                <button
                                    type="button"
                                    className={`eb-guest-login-btn ${openMenu === "login" || activePage === "login" || activePage === "org-login" ? "active" : ""}`}
                                    onClick={() => toggleMenu("login")}
                                >
                                    <User size={15} />
                                    <span>{isHindi ? "साइन इन" : (t("signIn") || "Sign In")}</span>
                                </button>

                                {openMenu === "login" && (
                                    <div className="eb-nav-custom-menu eb-login-menu-align">
                                        <div
                                            className="eb-nav-custom-item"
                                            onClick={() => handleSelectOption(() => setActivePage("login"))}
                                        >
                                            <span>{isHindi ? "रक्तदाता / उपयोगकर्ता लॉगिन" : (t("donorUserLogin") || "Donor / User Login")}</span>
                                        </div>
                                        <div
                                            className="eb-nav-custom-item org-login-item"
                                            onClick={() => handleSelectOption(() => setActivePage("org-login"))}
                                        >
                                            <div className="org-text-stack">
                                                <strong>{isHindi ? "संस्था लॉगिन" : (t("organisationLogin") || "Organisation Login")}</strong>
                                                <small>{isHindi ? "ब्लड बैंक व शिविर" : (t("bloodBanksAndCamps") || "Blood banks & camps")}</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            className="eb-mobile-menu-trigger mobile-only"
                            onClick={() => setMobileDrawerOpen((prev) => !prev)}
                            aria-label="Open navigation menu"
                        >
                            {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileDrawerOpen && (
                    <div className="eb-mobile-drawer">
                        <div className="eb-mobile-drawer-inner">
                            <div className="eb-drawer-section">
                                <span className="eb-drawer-heading">{isHindi ? "त्वरित विकल्प" : "Quick Actions"}</span>
                                <button
                                    className={`eb-drawer-btn ${activePage === "notifications" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("notifications"))}
                                >
                                    <Bell size={16} /> {isHindi ? "सूचनाएं व अलर्ट" : "Notifications & Alerts"}
                                    {unreadNotifs > 0 && (
                                        <span style={{ marginLeft: "auto", background: "#e11d48", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "9999px" }}>
                                            {unreadNotifs}
                                        </span>
                                    )}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "search" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(handleFindBloodClick)}
                                >
                                    <Search size={16} /> {isHindi ? "रक्तदाता खोजें" : "Find Blood Now"}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "camps" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("camps"))}
                                >
                                    <Calendar size={16} /> {isHindi ? "रक्तदान शिविर खोजें" : "Find a Blood Camp"}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "register" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("register"))}
                                >
                                    <Heart size={16} /> {isHindi ? "रक्तदाता पंजीकरण" : "Register as Blood Donor"}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "directory" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("directory"))}
                                >
                                    <FolderKanban size={16} /> {isHindi ? "ब्लड बैंक निर्देशिका" : "Blood Bank Directory"}
                                </button>
                            </div>

                            <div className="eb-drawer-section">
                                <span className="eb-drawer-heading">{isHindi ? "जानकारी व सहायता" : "Information & Support"}</span>
                                <button
                                    className={`eb-drawer-btn ${activePage === "about" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("about"))}
                                >
                                    <Info size={16} /> {isHindi ? "हमारे बारे में" : "About Us"}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "faqs" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("faqs"))}
                                >
                                    <HelpCircle size={16} /> {isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "FAQs"}
                                </button>
                            </div>

                            <div className="eb-drawer-section">
                                <span className="eb-drawer-heading">{isHindi ? "पोर्टल व लॉगिन" : "Portals & Login"}</span>
                                <button
                                    className={`eb-drawer-btn ${activePage === "login" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("login"))}
                                >
                                    <User size={16} /> {isHindi ? "रक्तदाता पोर्टल" : "Donor / User Portal"}
                                </button>
                                <button
                                    className={`eb-drawer-btn ${activePage === "org-login" ? "active" : ""}`}
                                    onClick={() => handleSelectOption(() => setActivePage("org-login"))}
                                >
                                    <Building2 size={16} /> {isHindi ? "संस्था लॉगिन" : "Organisation Login"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Bottom Mobile Navigation Bar */}
            <nav className="eb-bottom-nav mobile-only">
                <button
                    type="button"
                    className={`eb-bottom-nav-item ${activePage === "home" ? "active" : ""}`}
                    onClick={() => handleSelectOption(() => setActivePage("home"))}
                >
                    <Home size={20} />
                    <span>{isHindi ? "होम" : "Home"}</span>
                </button>

                <button
                    type="button"
                    className={`eb-bottom-nav-item ${activePage === "search" ? "active" : ""}`}
                    onClick={() => handleSelectOption(handleFindBloodClick)}
                >
                    <Search size={20} />
                    <span>{isHindi ? "रक्त खोजें" : "Find Blood"}</span>
                </button>

                <button
                    type="button"
                    className={`eb-bottom-nav-item center-fab ${activePage === "register" ? "active" : ""}`}
                    onClick={() => handleSelectOption(() => setActivePage(user ? "register" : "login"))}
                    title={isHindi ? "रक्तदान करें" : "Donate Blood"}
                >
                    <div className="fab-inner">
                        <Heart size={20} color="#ffffff" fill="#ffffff" />
                    </div>
                    <span>{isHindi ? "दान करें" : "Donate"}</span>
                </button>

                <button
                    type="button"
                    className={`eb-bottom-nav-item ${activePage === "notifications" ? "active" : ""}`}
                    onClick={() => handleSelectOption(() => setActivePage("notifications"))}
                >
                    <Bell size={20} />
                    <span>{isHindi ? "सूचनाएं" : "Alerts"}</span>
                </button>

                <button
                    type="button"
                    className={`eb-bottom-nav-item ${activePage === "profile" || activePage === "login" || activePage === "org-dashboard" ? "active" : ""}`}
                    onClick={handleAccountClick}
                >
                    <User size={20} />
                    <span>{organisation ? (isHindi ? "संस्था" : "Org") : user ? (isHindi ? "प्रोफ़ाइल" : "Profile") : (isHindi ? "खाता" : "Account")}</span>
                </button>
            </nav>
        </>
    );
}