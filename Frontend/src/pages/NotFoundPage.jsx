import React, { useState } from "react";
import { 
    Home, 
    Search, 
    Building2, 
    Heart, 
    PhoneCall, 
    Compass, 
    ArrowRight,
    MapPin,
    AlertCircle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/NotFoundPage.css";

export default function NotFoundPage({ 
    onGoToHome, 
    onGoToSearch, 
    onGoToDirectory, 
    onGoToRegister 
}) {
    const { language, t } = useLanguage();
    const isHindi = language === "hi";
    const [quickPincode, setQuickPincode] = useState("");

    const handleQuickSearchSubmit = (e) => {
        e.preventDefault();
        if (onGoToSearch) {
            onGoToSearch();
        }
    };

    return (
        <div className="eb-404-canvas">
            <div className="eb-container eb-404-inner">
                {/* Status Pill */}
                <div className="eb-404-tag-pill">
                    <span className="eb-tag-dot"></span>
                    <span>{isHindi ? "पेज नहीं मिला · त्रुटि 404" : "PAGE NOT LOCATED · CODE 404"}</span>
                </div>

                {/* Hero 404 Display with ECG Wave & Suspended Heart Droplet */}
                <div className="eb-hero-ecg-stage">
                    <div className="eb-ecg-svg-wrap">
                        <svg viewBox="0 0 500 120" className="eb-ecg-line" preserveAspectRatio="none">
                            <path d="M0,60 L140,60 L155,20 L170,105 L185,45 L198,75 L210,60 L500,60" />
                        </svg>
                    </div>

                    <div className="eb-glitch-digit-deck">
                        <span className="eb-digit">4</span>
                        
                        {/* Center Glowing Donor Droplet Icon */}
                        <div className="eb-droplet-beacon">
                            <div className="eb-beacon-pulse-ring"></div>
                            <div className="eb-beacon-droplet">
                                <svg 
                                    width="42" 
                                    height="42" 
                                    viewBox="0 0 24 24" 
                                    fill="url(#dropletGradient)" 
                                    stroke="#e11d48" 
                                    strokeWidth="1.2"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <defs>
                                        <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#fb7185" />
                                            <stop offset="60%" stopColor="#e11d48" />
                                            <stop offset="100%" stopColor="#9f1239" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                            </div>
                        </div>

                        <span className="eb-digit">4</span>
                    </div>
                </div>

                {/* Headings */}
                <h1 className="eb-404-headline">
                    {isHindi ? "लगता है आप रास्ता भटक गए हैं" : "Lost in the network?"}
                </h1>
                <p className="eb-404-description">
                    {isHindi
                        ? "यह वेबपेज मौजूद नहीं है या इसका पता बदल दिया गया है। लेकिन परेशान न हों, आप नीचे दिए गए विकल्पों से जीवनरक्षक सहायता तुरंत पा सकते हैं।"
                        : "The link you followed may be broken or the page was moved. Don't worry—vital medical help is always just one click away."}
                </p>

                {/* Main Action Group */}
                <div className="eb-404-primary-actions">
                    <button 
                        type="button" 
                        className="eb-btn-404 eb-btn-crimson"
                        onClick={onGoToHome}
                    >
                        <Home size={17} />
                        <span>{isHindi ? "होम पेज पर लौटें" : "Back to Home"}</span>
                    </button>

                    <button 
                        type="button" 
                        className="eb-btn-404 eb-btn-glass"
                        onClick={onGoToSearch}
                    >
                        <Search size={17} />
                        <span>{isHindi ? "रक्तदाता खोजें" : "Find Blood Now"}</span>
                    </button>
                </div>

                {/* Quick Emergency In-Page Search Widget */}
                <form onSubmit={handleQuickSearchSubmit} className="eb-404-quick-search-dock">
                    <div className="eb-search-dock-icon">
                        <MapPin size={18} color="#e11d48" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={isHindi ? "पिनकोड, जिला या शहर दर्ज करें..." : "Enter city, district or 6-digit pincode..."}
                        value={quickPincode}
                        onChange={(e) => setQuickPincode(e.target.value)}
                        className="eb-dock-search-input"
                    />
                    <button type="submit" className="eb-dock-search-submit">
                        <span>{isHindi ? "खोजें" : "Quick Search"}</span>
                        <ArrowRight size={15} />
                    </button>
                </form>

                {/* Network Shortcuts Grid */}
                <div className="eb-404-shortcuts-matrix">
                    <div className="eb-matrix-item" onClick={onGoToSearch}>
                        <div className="eb-matrix-icon-box">
                            <Compass size={18} color="#e11d48" />
                        </div>
                        <div>
                            <h4>{isHindi ? "स्वैच्छिक रक्तदाता" : "Voluntary Donors"}</h4>
                            <p>{isHindi ? "जिले के दायरे में सक्रिय रक्तदाता" : "Screened local donors on standby"}</p>
                        </div>
                    </div>

                    <div className="eb-matrix-item" onClick={onGoToDirectory}>
                        <div className="eb-matrix-icon-box">
                            <Building2 size={18} color="#0284c7" />
                        </div>
                        <div>
                            <h4>{isHindi ? "ब्लड बैंक स्टॉक" : "Blood Bank Stock"}</h4>
                            <p>{isHindi ? "अधिकृत अस्पतालों में लाइव यूनिट्स" : "Live inventory across licensed banks"}</p>
                        </div>
                    </div>

                    <div className="eb-matrix-item" onClick={onGoToRegister}>
                        <div className="eb-matrix-icon-box">
                            <Heart size={18} color="#16a34a" />
                        </div>
                        <div>
                            <h4>{isHindi ? "रक्तदाता बनें" : "Become a Donor"}</h4>
                            <p>{isHindi ? "5 मिनट में स्वैच्छिक पंजीकरण करें" : "Save up to 3 lives in emergency"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}