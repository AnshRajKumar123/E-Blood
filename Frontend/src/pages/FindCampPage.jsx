import React, { useState, useEffect } from "react";
import { 
    Calendar, 
    MapPin, 
    Phone, 
    Search, 
    Users, 
    Loader2, 
    CheckCircle2,
    MessageSquare,
    Plus,
    Clock,
    Sparkles,
    ChevronDown
} from "lucide-react";
import { apiGetCamps, resolveImageUrl } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/FindCamp.css";

// Realistic medical/donation drive imagery for camps that don't upload custom photos
const DEFAULT_CAMP_IMAGES = [
    "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
];

// Reusable 3-second Auto-sliding Carousel for Directory Cards
function DirectoryCampCarousel({ images, title, seedIndex = 0 }) {
    const [activeIdx, setActiveIdx] = useState(0);

    const fallbackImg = DEFAULT_CAMP_IMAGES[seedIndex % DEFAULT_CAMP_IMAGES.length];
    const validImages = Array.isArray(images) && images.length > 0
        ? images
        : [fallbackImg];

    useEffect(() => {
        if (validImages.length <= 1) return;
        const timer = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % validImages.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [validImages.length]);

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
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImg;
                            }}
                        />
                    </div>
                ))}
            </div>

            {validImages.length > 1 && (
                <div className="eb-carousel-indicators">
                    {validImages.map((_, i) => (
                        <span key={i} className={`eb-dot ${i === activeIdx ? "active" : ""}`} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FindCampPage({ onGoToHome, onGoToAddCamp }) {
    const { language, t } = useLanguage();
    const isHindi = language === "hi";

    const [camps, setCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const fetchCamps = async () => {
        setIsLoading(true);
        try {
            const res = await apiGetCamps();
            if (res && res.success && Array.isArray(res.camps)) {
                setCamps(res.camps);
            } else {
                setCamps([]);
            }
        } catch (err) {
            console.error("Error fetching camps:", err);
            setCamps([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    const filteredCamps = camps.filter((c) => {
        const matchesSearch = searchTerm === "" || 
            (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.campAddress || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.city || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDistrict = selectedDistrict === "" || 
            (c.district || "").toLowerCase() === selectedDistrict.toLowerCase();

        return matchesSearch && matchesDistrict;
    });

    return (
        <div className="eb-camps-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home") || "Home"}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">{isHindi ? "रक्तदान शिविर खोजें" : "Find a Blood Camp"}</span>
                </nav>

                <div className="eb-camps-hero">
                    <span className="eb-camps-badge">
                        <Sparkles size={13} /> {isHindi ? "सामुदायिक रक्तदान पहल" : "COMMUNITY BLOOD DRIVES"}
                    </span>
                    <h1 className="eb-camps-title">
                        {isHindi ? "आगामी स्वैच्छिक रक्तदान शिविर" : "Upcoming Blood Donation Camps"}
                    </h1>
                    <p className="eb-camps-subtitle">
                        {isHindi 
                            ? "अपने नजदीकी कॉलेज, अस्पताल या सामुदायिक केंद्र में आयोजित रक्तदान शिविर खोजें और जीवन बचाएं।" 
                            : "Find scheduled donation drives across verified districts and donate blood voluntarily."}
                    </p>
                </div>

                {/* Filter and Register Dock Card */}
                <div className="eb-camp-filter-dock">
                    {/* Search Field */}
                    <div className="dock-unit search-unit">
                        <label>{isHindi ? "शिविर का नाम या स्थान खोजें" : "Search Camp or Venue"}</label>
                        <div className="dock-input-inner">
                            <Search size={16} />
                            <input 
                                type="text"
                                placeholder={isHindi ? "कॉलेज, अस्पताल, शहर दर्ज करें..." : "Search by venue, organiser, or city..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* District Dropdown */}
                    <div className="dock-unit district-unit">
                        <label>{isHindi ? "जिला चुनें" : "Select District"}</label>
                        <div className="dock-select-wrap">
                            <select 
                                value={selectedDistrict} 
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option value="">{isHindi ? "सभी जिले" : "All Districts"}</option>
                                <option value="Fatehgarh Sahib">Fatehgarh Sahib</option>
                                <option value="Patiala">Patiala</option>
                                <option value="Ludhiana">Ludhiana</option>
                                <option value="SAS Nagar">SAS Nagar (Mohali)</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Amritsar">Amritsar</option>
                                <option value="Jalandhar">Jalandhar</option>
                                <option value="Bathinda">Bathinda</option>
                            </select>
                            <ChevronDown size={14} className="select-chevron" />
                        </div>
                    </div>

                    {/* Register Camp Button */}
                    <div className="dock-action-unit">
                        <label>&nbsp;</label>
                        <button 
                            type="button" 
                            className="eb-btn-dock-register"
                            onClick={onGoToAddCamp}
                        >
                            <Plus size={16} />
                            <span>{isHindi ? "नया शिविर जोड़ें" : "Register Camp"}</span>
                        </button>
                    </div>
                </div>

                {/* Results Count Meta Bar */}
                <div className="eb-camps-meta-bar">
                    <span className="camps-count-label">
                        <strong>{filteredCamps.length}</strong> {isHindi ? "सत्यापित रक्तदान शिविर उपलब्ध" : "Scheduled Blood Camp(s) Found"}
                    </span>
                    {(searchTerm || selectedDistrict) && (
                        <button 
                            type="button" 
                            className="btn-clear-camp-filter"
                            onClick={() => { setSearchTerm(""); setSelectedDistrict(""); }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Camps Grid */}
                {isLoading ? (
                    <div className="eb-camp-empty-box">
                        <Loader2 size={36} className="spin-loader" style={{ margin: "0 auto 12px", color: "#e11d48" }} />
                        <p>{isHindi ? "शिविर लोड हो रहे हैं..." : "Loading scheduled blood donation drives..."}</p>
                    </div>
                ) : filteredCamps.length === 0 ? (
                    <div className="eb-camp-empty-box">
                        <div className="empty-ico-ring">
                            <Calendar size={32} />
                        </div>
                        <h3>{isHindi ? "कोई शिविर नहीं मिला" : "No Scheduled Camps Found"}</h3>
                        <p>{isHindi ? "फ़िल्टर साफ़ करें या अपनी संस्था का नया रक्तदान शिविर जोड़ें।" : "Try clearing filters or schedule your organization's blood donation drive."}</p>
                        <button 
                            type="button"
                            className="eb-btn-dock-register"
                            onClick={onGoToAddCamp}
                            style={{ margin: "16px auto 0", width: "fit-content" }}
                        >
                            <Plus size={16} />
                            <span>{isHindi ? "शिविर पंजीकृत करें" : "Schedule a Blood Camp"}</span>
                        </button>
                    </div>
                ) : (
                    <div className="eb-camps-cards-grid">
                        {filteredCamps.map((camp, idx) => {
                            const campImgs = (camp.images && camp.images.length > 0)
                                ? camp.images
                                : [camp.image || DEFAULT_CAMP_IMAGES[idx % DEFAULT_CAMP_IMAGES.length]];

                            const phoneNum = camp.contactNumber || camp.organiserMobile || "9470824173";
                            const cleanPhone = phoneNum.replace(/\s+/g, "");

                            return (
                                <article key={camp._id || camp.id} className="eb-camp-card">
                                    <DirectoryCampCarousel images={campImgs} title={camp.title} seedIndex={idx} />

                                    <div className="eb-camp-card-body">
                                        <div className="camp-top-badge-row">
                                            <span className="camp-district-pill">
                                                {camp.district || camp.city || "Punjab"}
                                            </span>
                                            <span className="camp-status-pill">
                                                <span className="pulse-dot" /> Active Drive
                                            </span>
                                        </div>

                                        <h3 className="camp-title" title={camp.title}>
                                            {camp.title}
                                        </h3>

                                        <div className="camp-specs-list">
                                            <div className="spec-line">
                                                <MapPin size={14} className="spec-ico red" />
                                                <span>{camp.campAddress || `${camp.city || ""}, ${camp.district || "Punjab"}`}</span>
                                            </div>

                                            <div className="spec-line">
                                                <Clock size={14} className="spec-ico black" />
                                                <span>
                                                    Date: <strong>{camp.campDate}</strong> ({camp.startTime || "09:00"} – {camp.endTime || "17:00"})
                                                </span>
                                            </div>

                                            <div className="spec-line">
                                                <Users size={14} className="spec-ico gray" />
                                                <span>
                                                    Organiser: <strong>{camp.organizer || camp.organiserName || "Official Team"}</strong>
                                                </span>
                                            </div>

                                            {camp.targetUnits && (
                                                <div className="spec-line target-units">
                                                    <CheckCircle2 size={14} className="spec-ico green" />
                                                    <span>Target: <strong>{camp.targetUnits} Units</strong></span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons with active telephone & whatsapp */}
                                        <div className="camp-card-actions">
                                            <a 
                                                href={`tel:${cleanPhone}`}
                                                className="btn-camp-call"
                                                title={`Call ${camp.contactPerson || "Organiser"}`}
                                            >
                                                <Phone size={13} />
                                                <span>Call</span>
                                            </a>

                                            <a 
                                                href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                                    `Hello, I would like more details about the blood camp: "${camp.title}" scheduled on ${camp.campDate}.`
                                                )}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-camp-whatsapp"
                                                title="WhatsApp Organiser"
                                            >
                                                <MessageSquare size={13} />
                                                <span>WhatsApp</span>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}