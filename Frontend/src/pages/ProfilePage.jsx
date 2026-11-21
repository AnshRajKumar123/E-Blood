import React, { useState, useEffect } from "react";
import {
    Clock,
    Droplet,
    MapPin,
    Bell,
    User,
    Edit3,
    Heart,
    Plus,
    LogOut,
    Trash2,
    Loader2,
    MessageSquare,
    Smartphone,
    CheckCircle2,
    Calendar,
    Eye,
    EyeOff,
    ArrowRight,
    Save,
    Shield,
    AlertCircle,
    Info,
    Check,
    Phone,
    PhoneCall,
    PhoneOff
} from "lucide-react";
import { 
    apiAddUserLocation, 
    apiDeleteUserLocation,
    apiUpdateUserNotifications,
    apiUpdateDonorQuestionnaire
} from "../services/api";
import { donorAvailabilityConfig as configImport } from "../assets/assets";
import { useLanguage } from "../context/LanguageContext";
import "../styles/ProfilePage.css";

const fallbackConfig = {
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

const donorAvailabilityConfig = configImport || fallbackConfig;

export default function ProfilePage({
    user,
    onGoToRegister,
    onSignOut,
    onDeleteAccount,
    onGoToHome,
    onUpdateUser
}) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");

    const userData = user || {};
    const [savedLocations, setSavedLocations] = useState(userData.savedLocations || []);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // ==========================================
    // STEP 2 PREFERENCE STATES
    // ==========================================
    const [availability, setAvailability] = useState(userData.donationAvailability || "open");
    const [resumeDate, setResumeDate] = useState(userData.resumeAvailabilityDate || "");
    const [lastDonationType, setLastDonationType] = useState(userData.lastDonationHistoryType || "never");
    const [lastDonationDate, setLastDonationDate] = useState(userData.lastDonationDate || "");
    const [donationKind, setDonationKind] = useState(userData.donationType || "whole_blood");
    const [distancePref, setDistancePref] = useState(userData.travelDistancePreference || "no_preference");
    const [showInDirectory, setShowInDirectory] = useState(userData.showInDonorList !== undefined ? userData.showInDonorList : true);
    const [contactPref, setContactPref] = useState(userData.contactSharingPreference || "after_accept");

    // UI Feedback States
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    // ==========================================
    // NOTIFICATION CENTER STATES
    // ==========================================
    const [notifications, setNotifications] = useState({
        whatsapp: userData.notifications?.whatsapp ?? true,
        sms: userData.notifications?.sms ?? true,
        push: userData.notifications?.push ?? false,
        allowCall: userData.notifications?.allowCall ?? false, // NO by default
        callStartTime: userData.notifications?.callStartTime || "09:00",
        callEndTime: userData.notifications?.callEndTime || "20:00"
    });

    const [notifMessage, setNotifMessage] = useState("");
    const [isSavingNotif, setIsSavingNotif] = useState(false);

    const markDirty = () => {
        if (!isDirty) setIsDirty(true);
    };

    // Save Preferences to Backend
    const handleSavePreferences = async () => {
        const activeEmail = userData.email || user?.email;
        if (!activeEmail) {
            alert("No user session active. Please sign in again.");
            return;
        }

        if (lastDonationType === "donated_before" && lastDonationDate) {
            const todayStr = new Date().toISOString().split("T")[0];
            if (lastDonationDate > todayStr) {
                setSaveStatus("error");
                setStatusMessage("Date of most recent donation cannot be in the future.");
                return;
            }
        }

        setIsSaving(true);
        setSaveStatus(null);
        setStatusMessage("");

        const payload = {
            email: activeEmail,
            donationAvailability: availability,
            resumeAvailabilityDate: availability === "temporarily_unavailable" ? resumeDate : "",
            lastDonationHistoryType: lastDonationType,
            lastDonationDate: lastDonationType === "donated_before" ? lastDonationDate : "",
            donationType: lastDonationType === "donated_before" ? donationKind : "",
            travelDistancePreference: distancePref,
            showInDonorList: Boolean(showInDirectory),
            contactSharingPreference: contactPref
        };

        try {
            const res = await apiUpdateDonorQuestionnaire(payload);
            if (res && res.success && res.user) {
                if (onUpdateUser) onUpdateUser(res.user);
                setSaveStatus("success");
                setStatusMessage("Your preferences have been updated successfully.");
                setIsDirty(false);
                setTimeout(() => setSaveStatus(null), 5000);
            } else {
                setSaveStatus("error");
                setStatusMessage(res?.message || "We couldn't save your changes. Please try again.");
            }
        } catch (err) {
            setSaveStatus("error");
            setStatusMessage("We couldn't save your changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Save Notifications & Call Permissions directly to MongoDB
    const saveUpdatedNotifications = async (updated) => {
        setIsSavingNotif(true);
        try {
            const res = await apiUpdateUserNotifications({
                email: userData.email,
                phone: userData.phone,
                notifications: updated
            });
            if (res && res.success && res.user) {
                if (onUpdateUser) onUpdateUser(res.user);
                setNotifMessage("Notification & call preferences saved successfully.");
                setTimeout(() => setNotifMessage(""), 3500);
            }
        } catch (err) {
            console.error("Failed to update notification settings:", err);
        } finally {
            setIsSavingNotif(false);
        }
    };

    const handleToggleNotification = (key) => {
        const updated = { ...notifications, [key]: !notifications[key] };
        setNotifications(updated);
        saveUpdatedNotifications(updated);
    };

    const handleCallPermissionChange = (allow) => {
        const updated = { ...notifications, allowCall: allow };
        setNotifications(updated);
        saveUpdatedNotifications(updated);
    };

    const handleCallTimerChange = (startTime, endTime) => {
        const updated = {
            ...notifications,
            callStartTime: startTime,
            callEndTime: endTime
        };
        setNotifications(updated);
        saveUpdatedNotifications(updated);
    };

    const handleAddCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const newLoc = {
                    title: `Current GPS (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
                    address: `Lat ${latitude.toFixed(4)}°, Lng ${longitude.toFixed(4)}° (Punjab Region)`,
                    lat: latitude,
                    lng: longitude
                };

                if (userData.email) {
                    const res = await apiAddUserLocation(userData.email, newLoc);
                    if (res && res.success && res.user) {
                        setSavedLocations(res.user.savedLocations || []);
                    } else {
                        setSavedLocations((prev) => [newLoc, ...prev]);
                    }
                }
                setIsGettingLocation(false);
            },
            async () => {
                alert("Location permission timed out. Added manual checkpoint.");
                const fallbackLoc = { 
                    title: "Manual Checkpoint", 
                    address: "Mandi Gobindgarh, Punjab", 
                    lat: 30.6661, 
                    lng: 76.3023 
                };
                if (userData.email) {
                    const res = await apiAddUserLocation(userData.email, fallbackLoc);
                    if (res && res.success && res.user) {
                        setSavedLocations(res.user.savedLocations || []);
                    }
                }
                setIsGettingLocation(false);
            },
            { timeout: 8000 }
        );
    };

    const handleDeleteLocation = async (id) => {
        if (userData.email) {
            const res = await apiDeleteUserLocation(userData.email, id);
            if (res && res.success && res.user) {
                setSavedLocations(res.user.savedLocations || []);
                return;
            }
        }
        setSavedLocations((prev) => prev.filter((loc) => (loc._id || loc.id) !== id));
    };

    const hasCompletedProfile = Boolean(userData.bloodGroup && userData.phone && userData.address);
    const todayMaxStr = new Date().toISOString().split("T")[0];
    const displayWeight = userData.weight 
        ? (String(userData.weight).toLowerCase().includes("kg") ? userData.weight : `${userData.weight} kg`)
        : "Standard";

    return (
        <div className="eb-profile-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">{t("profile")}</span>
                </nav>
                <h1 className="eb-page-heading">{t("yourProfile")}</h1>

                {/* Profile Hero Card */}
                <div className="eb-profile-hero-card">
                    <div className="eb-hero-avatar-bubble">
                        {(userData.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="eb-hero-user-meta" style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <h2>{userData.name || "User"}</h2>
                            <button
                                type="button"
                                className="eb-edit-profile-btn"
                                onClick={onGoToRegister}
                            >
                                <Edit3 size={13} />
                                <span>{t("editProfile")}</span>
                            </button>
                        </div>
                        <span>
                            {userData.phone || "No phone registered"} · {userData.email || "Verified User"}
                        </span>
                    </div>
                </div>

                <div className="eb-profile-grid-stage">
                    {/* Left Sidebar Nav */}
                    <aside className="eb-profile-sidebar-nav">
                        <button
                            type="button"
                            className={`nav-tab-row ${activeTab === "overview" ? "active" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <Clock size={16} />
                            <span>{t("overview")}</span>
                        </button>

                        <button
                            type="button"
                            className={`nav-tab-row ${activeTab === "requests" ? "active" : ""}`}
                            onClick={() => setActiveTab("requests")}
                        >
                            <Droplet size={16} />
                            <span>{t("pastRequests")}</span>
                        </button>

                        <button
                            type="button"
                            className={`nav-tab-row ${activeTab === "locations" ? "active" : ""}`}
                            onClick={() => setActiveTab("locations")}
                        >
                            <MapPin size={16} />
                            <span>{t("savedLocations")}</span>
                        </button>

                        <button
                            type="button"
                            className={`nav-tab-row ${activeTab === "notifications" ? "active" : ""}`}
                            onClick={() => setActiveTab("notifications")}
                        >
                            <Bell size={16} />
                            <span>{t("notifications")}</span>
                        </button>

                        <button
                            type="button"
                            className={`nav-tab-row ${activeTab === "account" ? "active" : ""}`}
                            onClick={() => setActiveTab("account")}
                        >
                            <User size={16} />
                            <span>{t("account")}</span>
                        </button>
                    </aside>

                    {/* Right-Side Content Column */}
                    <main className="eb-profile-tab-content">
                        {/* ============================================================== */}
                        {/* 1. OVERVIEW: 2-STEP ROADMAP & AVAILABILITY PREFERENCES         */}
                        {/* ============================================================== */}
                        {activeTab === "overview" && (
                            <div className="tab-pane-container">
                                <div className="overview-header-strip">
                                    <h4 className="tab-section-tag">DONOR PROFILE & AVAILABILITY</h4>
                                    {saveStatus === "success" && (
                                        <span className="save-status-toast success animate-fade-in">
                                            <CheckCircle2 size={14} /> {statusMessage}
                                        </span>
                                    )}
                                    {saveStatus === "error" && (
                                        <span className="save-status-toast error animate-fade-in">
                                            <AlertCircle size={14} /> {statusMessage}
                                        </span>
                                    )}
                                </div>

                                <div className="eb-profile-two-step-stack">
                                    {/* STEP 1: CLINICAL & ADDRESS DETAILS */}
                                    <div className={`eb-card-step ${hasCompletedProfile ? "step-completed" : "step-pending"}`}>
                                        <div className="card-step-header">
                                            <div className="step-badge-group">
                                                <span className="step-number-tag">STEP 1</span>
                                                <span className={`status-pill ${hasCompletedProfile ? "done" : "action"}`}>
                                                    {hasCompletedProfile ? "Profile Details Complete" : "Action Required"}
                                                </span>
                                                {userData.phoneVerified && (
                                                    <span className="status-pill verified">
                                                        <Shield size={11} /> Phone Verified
                                                    </span>
                                                )}
                                            </div>
                                            <h3>Register Your Clinical &amp; Address Details</h3>
                                            <p className="step-explainer">
                                                Keep your clinical data (Blood Group, Weight ≥ 45 kg, Mobile Number, and Registered Address) up to date.
                                            </p>
                                        </div>

                                        {!hasCompletedProfile ? (
                                            <button
                                                type="button"
                                                className="eb-btn-action-primary"
                                                onClick={onGoToRegister}
                                            >
                                                <Heart size={15} />
                                                <span>Become a Donor (Fill Required Details)</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        ) : (
                                            <div className="profile-chips-summary">
                                                <div className="summary-chip">
                                                    <small>Blood Group</small>
                                                    <strong>{userData.bloodGroup || "Not specified"}</strong>
                                                </div>
                                                <div className="summary-chip">
                                                    <small>Registered City</small>
                                                    <strong>{userData.city || userData.district || "Punjab"}</strong>
                                                </div>
                                                <div className="summary-chip">
                                                    <small>Weight</small>
                                                    <strong>{displayWeight}</strong>
                                                </div>
                                                <div className="summary-chip">
                                                    <small>Contact Phone</small>
                                                    <strong>{userData.phone || "None"}</strong>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-edit-text-link"
                                                    onClick={onGoToRegister}
                                                >
                                                    Edit Details
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* STEP 2: DONATION AVAILABILITY & CONTACT PREFERENCES */}
                                    <div className="eb-card-step">
                                        <div className="card-step-header">
                                            <div className="step-badge-group">
                                                <span className="step-number-tag">STEP 2</span>
                                                <span className="status-pill active-stage">
                                                    Donation Preferences
                                                </span>
                                            </div>
                                            <h3>{donorAvailabilityConfig.step2.heading}</h3>
                                            <p className="step-explainer">
                                                {donorAvailabilityConfig.step2.description}
                                            </p>
                                        </div>

                                        {/* SECTION A: Current Donation Availability */}
                                        <section className="pref-question-group">
                                            <div className="pref-question-title-row">
                                                <span className="q-index-pill">A</span>
                                                <div>
                                                    <h4 className="q-heading">{donorAvailabilityConfig.question1.label}</h4>
                                                    <p className="q-support-text">{donorAvailabilityConfig.question1.supportText}</p>
                                                </div>
                                            </div>

                                            <div className="selectable-card-grid">
                                                {donorAvailabilityConfig.question1.options.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        className={`selectable-card-option ${availability === opt.id ? "selected" : ""}`}
                                                        onClick={() => {
                                                            setAvailability(opt.id);
                                                            markDirty();
                                                        }}
                                                    >
                                                        <div className="radio-circle">
                                                            {availability === opt.id && <div className="radio-dot" />}
                                                        </div>
                                                        <div className="card-option-body">
                                                            <strong>{opt.label}</strong>
                                                            <small>{opt.desc}</small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {availability === "temporarily_unavailable" && (
                                                <div className="conditional-resume-dock animate-fade-in">
                                                    <div className="dock-label-group">
                                                        <Calendar size={16} className="text-crimson" />
                                                        <label>When would you like to become available again?</label>
                                                    </div>
                                                    <p className="dock-hint">
                                                        Optional. If this date passes, the system will ask you to confirm availability again rather than assuming you are ready.
                                                    </p>
                                                    <input
                                                        type="date"
                                                        className="eb-standard-date-input"
                                                        value={resumeDate}
                                                        min={todayMaxStr}
                                                        onChange={(e) => {
                                                            setResumeDate(e.target.value);
                                                            markDirty();
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </section>

                                        {/* SECTION B: Previous Donation Details */}
                                        <section className="pref-question-group">
                                            <div className="pref-question-title-row">
                                                <span className="q-index-pill">B</span>
                                                <div>
                                                    <h4 className="q-heading">{donorAvailabilityConfig.question2.label}</h4>
                                                    <p className="q-support-text">
                                                        Helps estimate clinical intervals (90–120 days for whole blood). Final eligibility is always verified on-site by medical staff.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="selectable-card-grid three-col">
                                                {donorAvailabilityConfig.question2.options.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        className={`selectable-card-option ${lastDonationType === opt.id ? "selected" : ""}`}
                                                        onClick={() => {
                                                            setLastDonationType(opt.id);
                                                            markDirty();
                                                        }}
                                                    >
                                                        <div className="radio-circle">
                                                            {lastDonationType === opt.id && <div className="radio-dot" />}
                                                        </div>
                                                        <div className="card-option-body">
                                                            <strong>{opt.label}</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {lastDonationType === "donated_before" && (
                                                <div className="conditional-donation-fields animate-fade-in">
                                                    <div className="form-duo-dock">
                                                        <div className="form-unit">
                                                            <label>Date of your most recent donation *</label>
                                                            <input
                                                                type="date"
                                                                className="eb-standard-date-input"
                                                                max={todayMaxStr}
                                                                value={lastDonationDate}
                                                                onChange={(e) => {
                                                                    setLastDonationDate(e.target.value);
                                                                    markDirty();
                                                                }}
                                                            />
                                                            <span className="field-micro-note">Future dates are not permitted.</span>
                                                        </div>

                                                        <div className="form-unit">
                                                            <label>What type of donation was it? *</label>
                                                            <select
                                                                className="eb-standard-select-input"
                                                                value={donationKind}
                                                                onChange={(e) => {
                                                                    setDonationKind(e.target.value);
                                                                    markDirty();
                                                                }}
                                                            >
                                                                {donorAvailabilityConfig.question2.donationTypes.map((typeOption) => (
                                                                    <option key={typeOption.id} value={typeOption.id}>
                                                                        {typeOption.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {lastDonationType === "dont_remember" && (
                                                <div className="informational-callout-box animate-fade-in">
                                                    <Info size={18} className="callout-icon" />
                                                    <span>{donorAvailabilityConfig.question2.dontRememberNotice}</span>
                                                </div>
                                            )}
                                        </section>

                                        {/* SECTION C: Preferred Travel Distance */}
                                        <section className="pref-question-group">
                                            <div className="pref-question-title-row">
                                                <span className="q-index-pill">C</span>
                                                <div>
                                                    <h4 className="q-heading">{donorAvailabilityConfig.question3.label}</h4>
                                                    <p className="q-support-text">{donorAvailabilityConfig.question3.supportText}</p>
                                                </div>
                                            </div>

                                            <div className="pill-selection-cluster">
                                                {donorAvailabilityConfig.question3.options.map((dist) => (
                                                    <button
                                                        key={dist.id}
                                                        type="button"
                                                        className={`distance-pill-btn ${distancePref === dist.id ? "selected" : ""}`}
                                                        onClick={() => {
                                                            setDistancePref(dist.id);
                                                            markDirty();
                                                        }}
                                                    >
                                                        {distancePref === dist.id && <Check size={13} style={{ marginRight: "4px" }} />}
                                                        <span>{dist.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        {/* SECTION D: Profile Visibility & Contact Permissions */}
                                        <section className="pref-question-group">
                                            <div className="pref-question-title-row">
                                                <span className="q-index-pill">D</span>
                                                <div>
                                                    <h4 className="q-heading">Profile Visibility &amp; Contact Privacy</h4>
                                                    <p className="q-support-text">
                                                        Directory discoverability and contact permissions are maintained separately for your privacy.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="privacy-toggle-card">
                                                <div className="toggle-card-meta">
                                                    <div className="meta-icon-bubble">
                                                        {showInDirectory ? <Eye size={18} color="#15803d" /> : <EyeOff size={18} color="#64748b" />}
                                                    </div>
                                                    <div>
                                                        <strong>{donorAvailabilityConfig.question4.directoryVisibility.heading}</strong>
                                                        <p>{donorAvailabilityConfig.question4.directoryVisibility.description}</p>
                                                    </div>
                                                </div>

                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={showInDirectory}
                                                        onChange={() => {
                                                            setShowInDirectory(!showInDirectory);
                                                            markDirty();
                                                        }}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>

                                            <div className="contact-permission-card">
                                                <h5 className="sub-heading-tight">{donorAvailabilityConfig.question4.contactPreferences.heading}</h5>
                                                <div className="selectable-card-grid">
                                                    {donorAvailabilityConfig.question4.contactPreferences.options.map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            className={`selectable-card-option ${contactPref === opt.id ? "selected" : ""}`}
                                                            onClick={() => {
                                                                setContactPref(opt.id);
                                                                markDirty();
                                                            }}
                                                        >
                                                            <div className="radio-circle">
                                                                {contactPref === opt.id && <div className="radio-dot" />}
                                                            </div>
                                                            <div className="card-option-body">
                                                                <strong>{opt.label}</strong>
                                                                <small>{opt.desc}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        {/* Save Preferences Button */}
                                        <div className="step-save-footer">
                                            {isDirty && (
                                                <span className="unsaved-hint animate-fade-in">
                                                    You have unsaved changes
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                className="btn-save-preferences-primary"
                                                onClick={handleSavePreferences}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 size={16} className="spin-loader" />
                                                        <span>Saving to Account...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} />
                                                        <span>Save Preferences</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Past Requests Tab */}
                        {activeTab === "requests" && (
                            <div className="tab-pane-container">
                                <h4 className="tab-section-tag">{t("pastRequests").toUpperCase()}</h4>
                                <div className="requests-empty-state">
                                    <p>No historical requests recorded yet. Verified emergency alerts will display here.</p>
                                </div>
                            </div>
                        )}

                        {/* Saved Locations Tab */}
                        {activeTab === "locations" && (
                            <div className="tab-pane-container">
                                <h4 className="tab-section-tag">{t("savedLocations").toUpperCase()}</h4>
                                <button
                                    type="button"
                                    className="btn-add-location-dashed"
                                    onClick={handleAddCurrentLocation}
                                    disabled={isGettingLocation}
                                >
                                    {isGettingLocation ? <Loader2 size={16} className="spin-loader" /> : <Plus size={16} />}
                                    <span>{isGettingLocation ? t("detectingLocation") : t("addCurrentLocation")}</span>
                                </button>

                                <div className="saved-locations-stack">
                                    {savedLocations.length === 0 ? (
                                        <div className="requests-empty-state">
                                            <p>{t("noLocationsSaved")}</p>
                                        </div>
                                    ) : (
                                        savedLocations.map((loc, idx) => (
                                            <div key={loc._id || idx} className="eb-saved-location-item">
                                                <div className="loc-flex-row">
                                                    <MapPin size={18} color="#e11d48" style={{ flexShrink: 0 }} />
                                                    <div>
                                                        <strong className="loc-title">{loc.title}</strong>
                                                        <span className="loc-address">{loc.address}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="eb-btn-delete-location"
                                                    title="Delete this location"
                                                    onClick={() => handleDeleteLocation(loc._id || idx)}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============================================================== */}
                        {/* 4. NOTIFICATIONS TAB WITH ADVANCED CALL TIMER UI               */}
                        {/* ============================================================== */}
                        {activeTab === "notifications" && (
                            <div className="tab-pane-container">
                                <div className="overview-header-strip">
                                    <h4 className="tab-section-tag" style={{ margin: 0 }}>
                                        {t("notifications").toUpperCase()} PREFERENCES
                                    </h4>
                                    {isSavingNotif && (
                                        <span className="save-status-toast saving">
                                            <Loader2 size={13} className="spin-loader" /> Saving preferences...
                                        </span>
                                    )}
                                </div>

                                {notifMessage && (
                                    <div className="save-status-toast success" style={{ marginBottom: "16px" }}>
                                        <CheckCircle2 size={15} />
                                        <span>{notifMessage}</span>
                                    </div>
                                )}

                                <div className="notif-toggle-list">
                                    {/* --- NEW FEATURE: SHOW PHONE NUMBER FOR DIRECT CALLS --- */}
                                    <div className="eb-notif-card-active call-privacy-card">
                                        <div className="flex-between">
                                            <div className="notif-label-wrap">
                                                <div className="notif-icon-circle crimson">
                                                    {notifications.allowCall ? <PhoneCall size={16} /> : <PhoneOff size={16} />}
                                                </div>
                                                <div>
                                                    <strong>Show Your Number for Calls to Donor</strong>
                                                    <span>Permit seekers &amp; hospitals to call your phone directly for urgent blood matching.</span>
                                                </div>
                                            </div>

                                            {/* YES / NO BUTTON SELECTOR (NO by default) */}
                                            <div className="eb-yes-no-toggle-group">
                                                <button
                                                    type="button"
                                                    className={`yes-no-btn ${!notifications.allowCall ? "active-no" : ""}`}
                                                    onClick={() => handleCallPermissionChange(false)}
                                                >
                                                    No
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`yes-no-btn ${notifications.allowCall ? "active-yes" : ""}`}
                                                    onClick={() => handleCallPermissionChange(true)}
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        </div>

                                        {/* ADVANCED CALL TIMER UI: Appears only when user selects YES */}
                                        {notifications.allowCall && (
                                            <div className="eb-call-timer-advanced-dock animate-fade-in">
                                                <div className="timer-dock-header">
                                                    <Clock size={16} className="text-crimson" />
                                                    <div>
                                                        <strong>Preferred Calling Hours (When to When)</strong>
                                                        <p>Specify the exact time window when you are available to take phone calls.</p>
                                                    </div>
                                                </div>

                                                {/* Quick Preset Buttons */}
                                                <div className="timer-presets-row">
                                                    <button
                                                        type="button"
                                                        className={`timer-preset-chip ${notifications.callStartTime === "00:00" && notifications.callEndTime === "23:59" ? "active" : ""}`}
                                                        onClick={() => handleCallTimerChange("00:00", "23:59")}
                                                    >
                                                        Anytime (24x7)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`timer-preset-chip ${notifications.callStartTime === "08:00" && notifications.callEndTime === "12:00" ? "active" : ""}`}
                                                        onClick={() => handleCallTimerChange("08:00", "12:00")}
                                                    >
                                                        Morning (8 AM - 12 PM)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`timer-preset-chip ${notifications.callStartTime === "09:00" && notifications.callEndTime === "18:00" ? "active" : ""}`}
                                                        onClick={() => handleCallTimerChange("09:00", "18:00")}
                                                    >
                                                        Daytime (9 AM - 6 PM)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`timer-preset-chip ${notifications.callStartTime === "17:00" && notifications.callEndTime === "21:00" ? "active" : ""}`}
                                                        onClick={() => handleCallTimerChange("17:00", "21:00")}
                                                    >
                                                        Evening (5 PM - 9 PM)
                                                    </button>
                                                </div>

                                                {/* Custom Time Pickers */}
                                                <div className="custom-timer-inputs-grid">
                                                    <div className="time-field-box">
                                                        <label>Receive Calls From:</label>
                                                        <input
                                                            type="time"
                                                            className="eb-time-picker-input"
                                                            value={notifications.callStartTime}
                                                            onChange={(e) => handleCallTimerChange(e.target.value, notifications.callEndTime)}
                                                        />
                                                    </div>

                                                    <div className="time-field-box">
                                                        <label>Receive Calls Until:</label>
                                                        <input
                                                            type="time"
                                                            className="eb-time-picker-input"
                                                            value={notifications.callEndTime}
                                                            onChange={(e) => handleCallTimerChange(notifications.callStartTime, e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="timer-explainer-pill">
                                                    <Info size={14} />
                                                    <span>
                                                        Calls outside this window (before {notifications.callStartTime} or after {notifications.callEndTime}) will show as restricted on the search page.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* WhatsApp Alerts Switch */}
                                    <div className="eb-notif-card-active">
                                        <div className="flex-between">
                                            <div className="notif-label-wrap">
                                                <div className="notif-icon-circle green">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <div>
                                                    <strong>WhatsApp Emergency Alerts</strong>
                                                    <span>Permit verified hospitals &amp; patients to send urgent WhatsApp coordination alerts.</span>
                                                </div>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.whatsapp}
                                                    onChange={() => handleToggleNotification("whatsapp")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cellular SMS Alerts Switch */}
                                    <div className="eb-notif-card-active">
                                        <div className="flex-between">
                                            <div className="notif-label-wrap">
                                                <div className="notif-icon-circle blue">
                                                    <Smartphone size={16} />
                                                </div>
                                                <div>
                                                    <strong>Cellular SMS Alerts</strong>
                                                    <span>Direct SMS notifications when offline or away from the web portal.</span>
                                                </div>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.sms}
                                                    onChange={() => handleToggleNotification("sms")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Browser Push Notifications Switch */}
                                    <div className="eb-notif-card-active">
                                        <div className="flex-between">
                                            <div className="notif-label-wrap">
                                                <div className="notif-icon-circle">
                                                    <Bell size={16} />
                                                </div>
                                                <div>
                                                    <strong>Browser Push Notifications</strong>
                                                    <span>Real-time alerts for local blood drives and verified nearby camps.</span>
                                                </div>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.push}
                                                    onChange={() => handleToggleNotification("push")}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Actions */}
                        {activeTab === "account" && (
                            <div className="tab-pane-container">
                                <h4 className="tab-section-tag">{t("account").toUpperCase()}</h4>
                                <div className="account-actions-deck">
                                    <button type="button" className="btn-sign-out-card" onClick={onSignOut}>
                                        <LogOut size={16} />
                                        <span>{t("signOut")}</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-delete-account"
                                        onClick={onDeleteAccount}
                                    >
                                        <Trash2 size={15} />
                                        <span>{t("deleteAccount")}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}