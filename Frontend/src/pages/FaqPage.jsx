import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { assets, faqData as importedFaqData } from "../assets/assets";
import { useLanguage } from "../context/LanguageContext";
import "../styles/FaqPage.css";

export default function FaqPage({ onGoToHome, }) {
    const { t } = useLanguage();
    const [openIdx, setOpenIdx] = useState(0);

    // Safe fallback to either assets.faqData or direct importedFaqData
    const activeFaqData = assets?.faqData || importedFaqData || {
        title: "Frequently Asked Questions (FAQs)",
        sections: []
    };

    const toggleFaq = (idx) => {
        setOpenIdx((prev) => (prev === idx ? null : idx));
    };

    let overallIndex = 0;

    return (
        <div className="eb-faq-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home") || "Home"}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">
                        {activeFaqData?.title || "FAQs"}
                    </span>
                </nav>

                <div className="eb-faq-hero">
                    <span className="eb-faq-badge">KNOWLEDGE BASE</span>
                    <h1 className="eb-faq-title">
                        {activeFaqData?.title || "Frequently Asked Questions (FAQs)"}
                    </h1>
                    <p className="eb-faq-subtitle">
                        Official answers regarding eligibility, blood testing, inter-donation intervals, and voluntary donation safety.
                    </p>
                </div>

                <div className="eb-faq-accordion-stack">
                    {(activeFaqData?.sections || []).map((sec, secIdx) => (
                        <div key={secIdx} className="eb-faq-section-block">
                            <h3 className="eb-faq-category-header">
                                {sec.category}
                            </h3>

                            <div className="eb-faq-cards-group">
                                {(sec.items || []).map((item) => {
                                    const currentIndex = overallIndex++;
                                    const isOpen = openIdx === currentIndex;

                                    return (
                                        <div key={currentIndex} className={`eb-faq-card ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="eb-faq-trigger"
                                                onClick={() => toggleFaq(currentIndex)}
                                            >
                                                <span>{item.q}</span>
                                                <ChevronDown size={17} className={`faq-chevron ${isOpen ? "rotate" : ""}`} />
                                            </button>

                                            <div className={`eb-faq-collapse ${isOpen ? "expanded" : ""}`}>
                                                <div className="eb-faq-body">
                                                    <p style={{ whiteSpace: "pre-line" }}>{item.a}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="eb-faq-footer-cta">
                    <HelpCircle size={36} color="#e11d48" style={{ margin: "0 auto 8px" }} />
                    <h3>Still have questions or facing an emergency?</h3>
                    <p>Our volunteer network and emergency donors are here to assist you 24x7.</p>

                    <div className="eb-faq-cta-btn-row">
                        <button type="button" className="eb-faq-btn eb-faq-btn-primary">
                            supporteblood@gmail.com
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}