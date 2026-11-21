import React, { useState, useEffect } from "react";
import { 
    Scale, 
    Shield, 
    Eye, 
    HelpCircle, 
    AlertTriangle, 
    Phone, 
    Mail, 
    Clock, 
    ShieldAlert, 
    Lock,
    ExternalLink
} from "lucide-react";
import { assets, PLATFORM_EMAILS } from "../assets/assets";
import { useLanguage } from "../context/LanguageContext";
import "../styles/PrivacyTermsPage.css";

export default function PrivacyTermsPage({ onGoToHome, initialTab = "terms", onNavigate }) {
    const { t } = useLanguage();
    // Sub-tabs: 'terms' | 'privacy' | 'accessibility' | 'contact'
    const [activeTab, setActiveTab] = useState(initialTab || "terms");

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const { termsAndConditions, privacyPolicy, accessibilityStatement } = assets.legalData;
    const { contactData } = assets;

    return (
        <div className="eb-legal-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home") || "Home"}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">Legal &amp; Statutory Compliance</span>
                </nav>

                <div className="eb-legal-hero">
                    <span className="eb-legal-badge">COMPLIANCE &amp; STATUTORY FRAMEWORK</span>
                    <h1 className="eb-legal-title">Legal, Privacy &amp; Grievance Redressal</h1>
                    <p className="eb-legal-subtitle">
                        Comprehensive legal rules under the IT Act 2000, DPDP Act 2023, NBTC Guidelines, and Supreme Court directives.
                    </p>
                </div>

                {/* 4 HORIZONTAL SWITCHER SUB-TABS */}
                <div className="eb-legal-nav-tabs">
                    <button
                        type="button"
                        className={`eb-legal-tab-btn ${activeTab === "terms" ? "active" : ""}`}
                        onClick={() => setActiveTab("terms")}
                    >
                        <Scale size={16} />
                        <span>Terms &amp; Conditions</span>
                    </button>

                    <button
                        type="button"
                        className={`eb-legal-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
                        onClick={() => setActiveTab("privacy")}
                    >
                        <Shield size={16} />
                        <span>Privacy Policy (DPDP Act)</span>
                    </button>

                    <button
                        type="button"
                        className={`eb-legal-tab-btn ${activeTab === "accessibility" ? "active" : ""}`}
                        onClick={() => setActiveTab("accessibility")}
                    >
                        <Eye size={16} />
                        <span>Accessibility Statement</span>
                    </button>

                    <button
                        type="button"
                        className={`eb-legal-tab-btn ${activeTab === "contact" ? "active" : ""}`}
                        onClick={() => setActiveTab("contact")}
                    >
                        <HelpCircle size={16} />
                        <span>Contact Us &amp; Grievance Officer</span>
                    </button>
                </div>

                {/* MAIN DOCUMENT READING PANE */}
                <div className="eb-legal-document-pane">
                    {/* TAB 1: TERMS & CONDITIONS */}
                    {activeTab === "terms" && (
                        <div>
                            <div className="eb-doc-header">
                                <h2>{termsAndConditions.title}</h2>
                                <span className="doc-meta">
                                    Effective Date: {termsAndConditions.effectiveDate} · {termsAndConditions.platformName}
                                </span>
                            </div>

                            {termsAndConditions.sections.map((sec) => (
                                <div key={sec.id} className="eb-doc-section">
                                    <h3>{sec.heading}</h3>
                                    {sec.content && <p>{sec.content}</p>}
                                    {sec.intro && <p>{sec.intro}</p>}

                                    {sec.subsections && (
                                        <div className="eb-doc-subsections">
                                            {sec.subsections.map((sub, sIdx) => (
                                                <div key={sIdx}>
                                                    <h4 className="eb-doc-subheading">{sub.subheading}</h4>
                                                    {sub.text && <p>{sub.text}</p>}
                                                    {sub.points && (
                                                        <ul className="eb-doc-list">
                                                            {sub.points.map((pt, pIdx) => (
                                                                <li key={pIdx}>{pt}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {sec.points && (
                                        <ul className="eb-doc-list">
                                            {sec.points.map((pt, pIdx) => (
                                                <li key={pIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {sec.conclusion && (
                                        <div className="eb-doc-conclusion-box">
                                            {sec.conclusion}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 2: PRIVACY POLICY */}
                    {activeTab === "privacy" && (
                        <div>
                            <div className="eb-doc-header">
                                <h2>{privacyPolicy.title}</h2>
                                <span className="doc-meta">
                                    Effective Date: {privacyPolicy.effectiveDate} · Compliance: {privacyPolicy.framework}
                                </span>
                            </div>

                            {privacyPolicy.sections.map((sec) => (
                                <div key={sec.id} className="eb-doc-section">
                                    <h3>{sec.heading}</h3>
                                    {sec.content && <p>{sec.content}</p>}
                                    {sec.intro && <p>{sec.intro}</p>}

                                    {sec.subsections && (
                                        <div className="eb-doc-subsections">
                                            {sec.subsections.map((sub, sIdx) => (
                                                <div key={sIdx}>
                                                    <h4 className="eb-doc-subheading">{sub.subheading}</h4>
                                                    {sub.text && <p>{sub.text}</p>}
                                                    {sub.points && (
                                                        <ul className="eb-doc-list">
                                                            {sub.points.map((pt, pIdx) => (
                                                                <li key={pIdx}>• {pt}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {sec.points && (
                                        <ul className="eb-doc-list">
                                            {sec.points.map((pt, pIdx) => (
                                                <li key={pIdx}>• {pt}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 3: ACCESSIBILITY STATEMENT */}
                    {activeTab === "accessibility" && (
                        <div>
                            <div className="eb-doc-header">
                                <h2>{accessibilityStatement.title}</h2>
                                <span className="doc-meta">
                                    Effective Date: {accessibilityStatement.effectiveDate} · Standard: {accessibilityStatement.standard}
                                </span>
                            </div>

                            {accessibilityStatement.sections.map((sec) => (
                                <div key={sec.id} className="eb-doc-section">
                                    <h3>{sec.heading}</h3>
                                    {sec.content && <p>{sec.content}</p>}
                                    {sec.intro && <p>{sec.intro}</p>}

                                    {sec.subsections && (
                                        <div className="eb-doc-subsections">
                                            {sec.subsections.map((sub, sIdx) => (
                                                <div key={sIdx}>
                                                    <h4 className="eb-doc-subheading">{sub.subheading}</h4>
                                                    {sub.text && <p>{sub.text}</p>}
                                                    {sub.points && (
                                                        <ul className="eb-doc-list">
                                                            {sub.points.map((pt, pIdx) => (
                                                                <li key={pIdx}>• {pt}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {sec.points && (
                                        <ul className="eb-doc-list">
                                            {sec.points.map((pt, pIdx) => (
                                                <li key={pIdx}>• {pt}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 4: CONTACT US & GRIEVANCE REDRESSAL */}
                    {activeTab === "contact" && (
                        <div className="eb-grievance-cards-stack">
                            <div className="eb-doc-header">
                                <h2>Contact Us &amp; Grievance Redressal</h2>
                                <span className="doc-meta">
                                    Official communication desks under Section 5(3) of the IT Rules &amp; Section 13 of the DPDP Act, 2023
                                </span>
                            </div>

                            {/* Section 1: Emergency Notice */}
                            <div className="eb-contact-panel emergency">
                                <div className="eb-panel-header-row">
                                    <div className="eb-panel-icon">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h3>1. EMERGENCY MEDICAL NOTICE</h3>
                                </div>
                                <div className="eb-panel-body">
                                    <p>
                                        If you or your patient are facing an immediate, life-threatening medical emergency, please DO NOT wait for an email response. Immediately contact:
                                        {"\n"}• National Emergency Number (India): <strong>112</strong>
                                        {"\n"}• Medical Ambulance Helpline: <strong>108 / 102</strong>
                                        {"\n"}• National Health Helpline: <strong>104</strong>
                                        {"\n"}Or use the "Find Blood Now" and "Blood Bank Directory" tools on our homepage to directly reach nearby verified donors and licensed blood banks.
                                    </p>
                                    <div className="eb-panel-quick-actions">
                                        <a href="tel:112" className="eb-btn-contact-action primary">Call 112 (National Emergency)</a>
                                        <a href="tel:108" className="eb-btn-contact-action outline">Call 108 (Ambulance)</a>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: General Support */}
                            <div className="eb-contact-panel support">
                                <div className="eb-panel-header-row">
                                    <div className="eb-panel-icon">
                                        <HelpCircle size={20} />
                                    </div>
                                    <h3>2. GENERAL SUPPORT, CAMP &amp; ORGANISATION QUERIES</h3>
                                </div>
                                <div className="eb-panel-body">
                                    <p>
                                        For assistance with donor registration, updating your blood bank listing, or publishing an upcoming voluntary blood donation camp:
                                        {"\n"}• Support Email: <strong>supporteblood@gmail.com</strong>
                                        {"\n"}• Organisation &amp; Camp Verification Desk: <strong>orgs@eblood.org</strong>
                                        {"\n"}• Operating Hours: <strong>Monday to Saturday, 9:00 AM – 6:00 PM IST</strong>
                                    </p>
                                    <div className="eb-panel-quick-actions">
                                        <a href={`mailto:${PLATFORM_EMAILS.support}`} className="eb-btn-contact-action primary">Email Support Desk</a>
                                        <a href={`mailto:${PLATFORM_EMAILS.orgs || "orgs@eblood.org"}`} className="eb-btn-contact-action outline">Contact Verification Team</a>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Report Abuse */}
                            <div className="eb-contact-panel abuse">
                                <div className="eb-panel-header-row">
                                    <div className="eb-panel-icon">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h3>3. REPORT ABUSE / REPORT ILLEGAL MONEY DEMANDS (24x7 PRIORITY)</h3>
                                </div>
                                <div className="eb-panel-body">
                                    <p>
                                        E-Blood enforces a strict zero-tolerance policy against commercial blood touts and fake requests. If anyone contacted through E-Blood demands money for blood donation, or if you spot a fraudulent listing, please report their mobile number and screenshot immediately:
                                        {"\n"}• Abuse &amp; Safety Desk: <strong>report@eblood.org</strong>
                                    </p>
                                    <div className="eb-panel-quick-actions">
                                        <a href={`mailto:${PLATFORM_EMAILS.report || "report@eblood.org"}?subject=Reporting%20Illegal%20Money%20Demand%20or%20Abuse`} className="eb-btn-contact-action primary">
                                            Report Violation (24x7)
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Grievance Officer */}
                            <div className="eb-contact-panel grievance">
                                <div className="eb-panel-header-row">
                                    <div className="eb-panel-icon">
                                        <Lock size={20} />
                                    </div>
                                    <h3>4. DATA PRIVACY &amp; GRIEVANCE OFFICER (DPDP ACT, 2023 &amp; IT ACT, 2000)</h3>
                                </div>
                                <div className="eb-panel-body">
                                    <p>
                                        For personal data removal requests, account deletion assistance, or legal/privacy grievances:
                                        {"\n"}• Grievance Officer: <strong>Ankit Harivanshi (Project Lead — E-Blood Initiative)</strong>
                                        {"\n"}• Email: <strong>grievance@eblood.org</strong>
                                        {"\n"}• Location: <strong>Punjab, India</strong>
                                    </p>
                                    <div className="eb-panel-quick-actions">
                                        <a href={`mailto:${PLATFORM_EMAILS.grievance || "grievance@eblood.org"}?subject=Data%20Privacy%20Grievance%20-%20DPDP%20Act`} className="eb-btn-contact-action primary">
                                            Contact Grievance Officer
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}