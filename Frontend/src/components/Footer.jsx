import React, { useState } from "react";
import { 
    Mail, 
    Headset, 
    ShieldCheck, 
    Heart, 
    Home, 
    Search, 
    Calendar, 
    Building2, 
    Info, 
    HelpCircle, 
    Scale, 
    Shield, 
    Eye, 
    Lock, 
    FolderKanban, 
    X,
    ExternalLink
} from "lucide-react";
import { assets, PLATFORM_EMAILS } from "../assets/assets";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Footer.css";
import "../styles/PrivacyTermsPage.css";

export default function Footer({
    onGoToAbout,
    onGoToFaqs,
    onGoToTerms,
    onGoToSearch,
    onGoToDirectory,
    onGoToRegister,
    onGoToOrgLogin,
    onGoToRegisterBank,
    onGoToAddCamp,
    onGoToCamps,
    onGoToNotifications
}) {
    const { language } = useLanguage();
    const isHindi = language === "hi";

    const [showSitemapModal, setShowSitemapModal] = useState(false);
    const { sitemapData } = assets;

    const renderSitemapIcon = (catId) => {
        switch (catId) {
            case "core": return <Home size={15} />;
            case "looking": return <Search size={15} />;
            case "donate": return <Heart size={15} />;
            case "org": return <Building2 size={15} />;
            case "resources": return <Info size={15} />;
            case "legal": return <Scale size={15} />;
            default: return <FolderKanban size={15} />;
        }
    };

    const handleSitemapLinkClick = (item) => {
        setShowSitemapModal(false);
        if (item.subtab) {
            onGoToTerms(item.subtab);
        } else if (item.page === "home") {
            window.location.pathname === "/" || window.location.pathname === "/home" 
                ? window.scrollTo({ top: 0, behavior: "smooth" }) 
                : (window.location.href = "/");
        } else if (item.page === "search") {
            onGoToSearch();
        } else if (item.page === "directory") {
            onGoToDirectory();
        } else if (item.page === "camps") {
            onGoToCamps();
        } else if (item.page === "register") {
            onGoToRegister();
        } else if (item.page === "org-login") {
            onGoToOrgLogin();
        } else if (item.page === "org-register-bank") {
            onGoToRegisterBank();
        } else if (item.page === "org-add-camp") {
            onGoToAddCamp();
        } else if (item.page === "about") {
            onGoToAbout();
        } else if (item.page === "faqs") {
            onGoToFaqs();
        } else if (item.page === "terms") {
            onGoToTerms("terms");
        }
    };

    return (
        <footer className="eb-footer-root">
            {/* Government & Health Authority Accreditation Strip */}
            <div className="eb-gov-strip">
                <div className="eb-container eb-gov-logos">
                    <div className="gov-logo-item" title="Ministry of Health and Family Welfare">
                        <img src={assets.MohfwLogo} alt="MOHFW India" className="gov-logo-img" />
                    </div>

                    <div className="gov-logo-item" title="National Health Mission">
                        <img src={assets.NhmLogo} alt="National Health Mission" className="gov-logo-img" />
                    </div>

                    <div className="gov-logo-item" title="MyGov Portal">
                        <img src={assets.MyGovLogo} alt="MyGov" className="gov-logo-img" />
                    </div>

                    <div className="gov-logo-item" title="National Portal of India">
                        <img src={assets.IndiaGovLogo} alt="India Gov" className="gov-logo-img" />
                    </div>

                    <div className="gov-logo-item" title="Centre for Development of Advanced Computing (C-DAC)">
                        <img src={assets.CdacLogo} alt="CDAC" className="gov-logo-img" />
                    </div>

                    <div className="gov-logo-item" title="Digital India Initiative">
                        <img src={assets.DigitalIndiaLogo} alt="Digital India" className="gov-logo-img" />
                    </div>
                </div>
            </div>

            {/* Main Dark Footer */}
            <div className="eb-main-footer">
                <div className="eb-container eb-footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <div className="eb-footer-brand-header">
                            <img src={assets.WebLogo} alt="E-Blood Logo" className="eb-footer-logo-img" />
                            <span className="eb-brand-name">
                                E-Blood
                            </span>
                        </div>
                        <p>
                            {isHindi
                                ? "कुछ ही मिनटों में अपने नजदीकी स्वैच्छिक रक्तदाताओं और सत्यापित ब्लड बैंकों से सीधा संपर्क करें।"
                                : "Get in touch with voluntary blood donors and verified blood banks near you in minutes."}
                        </p>

                        {/* Official Support & Contact Emails */}
                        <div className="eb-footer-email-block">
                            <span className="eb-footer-email-heading">
                                {isHindi ? "आधिकारिक संपर्क एवं सहायता:" : "Official Contact & Support:"}
                            </span>
                            
                            <a 
                                href={`mailto:${PLATFORM_EMAILS.main}`} 
                                className="eb-footer-email-item"
                                title="Primary Inquiries & Verification"
                            >
                                <Mail size={14} className="email-icon" />
                                <div>
                                    <span className="email-label">{isHindi ? "मुख्य ईमेल" : "Main Desk"}</span>
                                    <strong>{PLATFORM_EMAILS.main}</strong>
                                </div>
                            </a>

                            <a 
                                href={`mailto:${PLATFORM_EMAILS.support}`} 
                                className="eb-footer-email-item"
                                title="Technical & Donor Support"
                            >
                                <Headset size={14} className="email-icon" />
                                <div>
                                    <span className="email-label">{isHindi ? "सहायता डेस्क" : "Support Desk"}</span>
                                    <strong>{PLATFORM_EMAILS.support}</strong>
                                </div>
                            </a>
                        </div>

                        {/* Social Icons including WhatsApp and YouTube */}
                        <div className="eb-footer-socials">
                            {/* WhatsApp Community / Helpdesk */}
                            <a 
                                href="https://whatsapp.com/channel/0029Vb9KNNoEQIafIIefeV3l" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-pill whatsapp-pill" 
                                title="WhatsApp" 
                                aria-label="WhatsApp"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.632.062-.988-.04-.54-.154-1.396-.466-2.39-1.353-.872-.78-1.424-1.748-1.637-2.095-.213-.348-.023-.538.152-.713.156-.156.349-.405.524-.607.175-.203.233-.348.349-.579.116-.232.058-.435-.029-.609-.087-.174-.784-1.884-1.074-2.58-.283-.679-.57-.587-.783-.598-.203-.01-.436-.013-.668-.013-.232 0-.61.087-.93.435-.319.348-1.22 1.192-1.22 2.909 0 1.717 1.249 3.376 1.424 3.608.175.232 2.457 3.752 5.952 5.26 2.052.885 2.86.953 3.882.802.622-.092 1.888-.772 2.155-1.517.267-.745.267-1.383.187-1.517-.079-.133-.29-.214-.639-.388zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.982-1.309A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.238-1.182l-.304-.18-2.956.776.789-2.883-.198-.314A8.169 8.169 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2s8.2 3.679 8.2 8.2-3.679 8.2-8.2 8.2z"/>
                                </svg>
                            </a>

                            {/* YouTube Official Channel */}
                            <a 
                                href="https://youtube.com/@e-bloodindia?si=P2_4OXgo_6ztCnPT" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-pill youtube-pill" 
                                title="YouTube" 
                                aria-label="YouTube"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>

                            <a href="https://www.instagram.com/eblood.in?exln=MTBobnNlbTF4OWlk" target="_blank" rel="noopener noreferrer" className="social-pill" title="Instagram" aria-label="Instagram">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>

                            <a href="https://x.com/ebloodin" target="_blank" rel="noopener noreferrer" className="social-pill" title="Twitter / X" aria-label="Twitter">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>

                            <a href="https://www.facebook.com/profile.php?id=61595636142729" target="_blank" rel="noopener noreferrer" className="social-pill" title="Facebook" aria-label="Facebook">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                                </svg>
                            </a>

                            <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="social-pill" title="LinkedIn" aria-label="LinkedIn">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect width="4" height="12" x="2" y="9"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        </div>

                        <p className="eb-copyright-text">
                            © 2026 E-Blood — Verified Emergency Network.
                        </p>
                    </div>

                    {/* Column 1: Looking for Blood */}
                    <div className="footer-col">
                        <h5>{isHindi ? "रक्त की खोज" : "LOOKING FOR BLOOD"}</h5>
                        <ul>
                            <li onClick={onGoToSearch}>
                                {isHindi ? "रक्तदाता खोजें" : "Find Blood Now"}
                            </li>
                            <li onClick={onGoToDirectory}>
                                {isHindi ? "ब्लड बैंक निर्देशिका" : "Blood Bank Directory"}
                            </li>
                            <li onClick={onGoToCamps}>
                                {isHindi ? "रक्तदान शिविर खोजें" : "Find a Blood Camp"}
                            </li>
                            <li onClick={() => onGoToSearch()}>
                                {isHindi ? "थैलेसीमिया व नियमित अनुरोध" : "Thalassemia & Recurring Requests"}
                            </li>
                        </ul>

                        <h5 style={{ marginTop: "24px" }}>{isHindi ? "रक्तदान करें" : "DONATE BLOOD"}</h5>
                        <ul>
                            <li onClick={onGoToRegister}>
                                {isHindi ? "रक्तदाता पंजीकरण" : "Become a Donor"}
                            </li>
                            <li onClick={onGoToCamps}>
                                {isHindi ? "आगामी शिविर" : "Upcoming Camps"}
                            </li>
                            <li onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                const eligEl = document.querySelector(".eb-eligibility-section");
                                if (eligEl) eligEl.scrollIntoView({ behavior: "smooth" });
                            }}>
                                {isHindi ? "रक्तदान पात्रता जांचें" : "Eligibility Checklist"}
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Organisation Portal & Community */}
                    <div className="footer-col">
                        <h5>{isHindi ? "संस्था पोर्टल" : "ORGANISATION"}</h5>
                        <ul>
                            <li onClick={onGoToOrgLogin}>
                                {isHindi ? "संस्था लॉगिन" : "Organisation Login"}
                            </li>
                            <li onClick={onGoToRegisterBank}>
                                {isHindi ? "ब्लड बैंक पंजीकृत करें" : "Register a Bank"}
                            </li>
                            <li onClick={onGoToAddCamp}>
                                {isHindi ? "रक्तदान शिविर जोड़ें" : "Register a Camp"}
                            </li>
                        </ul>

                        <h5 style={{ marginTop: "24px" }}>{isHindi ? "संसाधन व समुदाय" : "RESOURCES"}</h5>
                        <ul>
                            <li onClick={onGoToAbout}>
                                {isHindi ? "हमारे बारे में" : "About Us"}
                            </li>
                            <li onClick={onGoToFaqs}>
                                {isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "FAQs"}
                            </li>
                            <li onClick={onGoToNotifications}>
                                {isHindi ? "सूचनाएं व अलर्ट" : "Notifications Hub"}
                            </li>
                            <li onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                const blogEl = document.querySelector(".eb-blog-section");
                                if (blogEl) blogEl.scrollIntoView({ behavior: "smooth" });
                            }}>
                                {isHindi ? "ब्लॉग व कहानियां" : "Stories & Awareness"}
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Statutory Compliance */}
                    <div className="footer-col">
                        <h5>{isHindi ? "कानूनी एवं अनुपालन" : "LEGAL & COMPLIANCE"}</h5>
                        <ul>
                            <li onClick={() => onGoToTerms("terms")}>
                                {isHindi ? "नियम व शर्तें" : "Terms & Conditions"}
                            </li>
                            <li onClick={() => onGoToTerms("privacy")}>
                                {isHindi ? "गोपनीयता नीति (DPDP Act)" : "Privacy Policy (DPDP Act)"}
                            </li>
                            <li onClick={() => onGoToTerms("accessibility")}>
                                {isHindi ? "अभिगम्यता वक्तव्य" : "Accessibility Statement"}
                            </li>
                            <li onClick={() => onGoToTerms("contact")}>
                                {isHindi ? "संपर्क करें व शिकायत अधिकारी" : "Contact & Grievance Officer"}
                            </li>
                            <li onClick={() => setShowSitemapModal(true)}>
                                {isHindi ? "साइटमैप" : "Sitemap"}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Disclaimer Notice */}
            <div className="eb-footer-disclaimer-strip">
                <div className="eb-container">
                    <p>
                        {isHindi
                            ? "E-Blood एक स्वैच्छिक छात्र और सामुदायिक स्वास्थ्य पहल प्रोटोटाइप है। गंभीर चिकित्सा आपात स्थिति के लिए, कृपया सीधे 112 / 108 / 104 पर कॉल करें या अपने निकटतम अस्पताल के ब्लड बैंक से संपर्क करें।"
                            : "E-Blood is a voluntary student and community health initiative prototype. For critical medical emergencies, please reach out directly to emergency services (112 / 108 / 104) or your nearest hospital blood bank."}
                    </p>
                </div>
            </div>

            {/* Modern Visual Sitemap Modal */}
            {showSitemapModal && (
                <div className="eb-sitemap-modal-overlay" onClick={() => setShowSitemapModal(false)}>
                    <div className="eb-sitemap-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="eb-sitemap-modal-header">
                            <div className="eb-sitemap-title-group">
                                <h2>{sitemapData.title}</h2>
                                <p>{sitemapData.subtitle}</p>
                            </div>
                            <button 
                                type="button" 
                                className="eb-btn-close-sitemap"
                                onClick={() => setShowSitemapModal(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="eb-sitemap-modal-body">
                            {sitemapData.categories.map((cat) => (
                                <div key={cat.id} className="eb-sitemap-cat-card">
                                    <span className="eb-sitemap-cat-title">
                                        {renderSitemapIcon(cat.id)}
                                        <span>{cat.title}</span>
                                    </span>

                                    <div className="eb-sitemap-links-list">
                                        {cat.items.map((item, iIdx) => (
                                            <div 
                                                key={iIdx} 
                                                className="eb-sitemap-link-item"
                                                onClick={() => handleSitemapLinkClick(item)}
                                            >
                                                <div className="eb-sitemap-link-icon">
                                                    <ExternalLink size={14} />
                                                </div>
                                                <div className="eb-sitemap-link-text">
                                                    <div>
                                                        <strong>{item.name}</strong>
                                                        <span className="eb-sitemap-route-tag">{item.path}</span>
                                                    </div>
                                                    <small>{item.desc}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}