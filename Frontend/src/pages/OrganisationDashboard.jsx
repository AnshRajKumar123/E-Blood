import React, { useState, useRef, useEffect } from "react";
import { 
    Clock, 
    Building2, 
    Calendar, 
    Users, 
    Settings, 
    LogOut, 
    FileText, 
    Zap, 
    UploadCloud, 
    ChevronDown, 
    Check, 
    FileSpreadsheet, 
    UserCheck, 
    UserPlus, 
    X, 
    Trash2, 
    Phone, 
    MapPin, 
    Edit3, 
    Loader2
} from "lucide-react";
import { 
    apiGetBloodBanks, 
    apiGetCamps, 
    apiSaveOrgSettings,
    apiDeleteCamp,
    apiDeleteBloodBank,
    resolveImageUrl
} from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Organisation.css";

function CustomDashboardDropdown({ value, options, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find((o) => o.val === value) || { label: placeholder || "Select", val: value };

    return (
        <div className="eb-custom-select-container" ref={dropdownRef} style={{ width: "100%", position: "relative" }}>
            <button
                type="button"
                className={`eb-custom-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    height: "40px", 
                    padding: "8px 12px", 
                    borderRadius: "8px", 
                    border: "1.5px solid #cbd5e1", 
                    background: "#ffffff", 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    cursor: "pointer" 
                }}
            >
                <span className="selected-val" style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700" }}>
                    {selected.label}
                </span>
                <ChevronDown size={14} className={`chevron-icon ${isOpen ? "rotate" : ""}`} style={{ color: "#64748b" }} />
            </button>

            {isOpen && (
                <div 
                    className="eb-custom-dropdown-menu" 
                    style={{ 
                        position: "absolute", 
                        top: "calc(100% + 4px)", 
                        left: 0, 
                        width: "100%", 
                        background: "#ffffff", 
                        border: "1.5px solid #e2e8f0", 
                        borderRadius: "10px", 
                        boxShadow: "0 10px 25px rgba(0,0,0,0.12)", 
                        zIndex: 150, 
                        padding: "4px" 
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.val}
                            className={`eb-custom-option ${value === opt.val ? "active" : ""}`}
                            onClick={() => {
                                onChange(opt.val);
                                setIsOpen(false);
                            }}
                            style={{ 
                                padding: "8px 10px", 
                                fontSize: "13px", 
                                fontWeight: value === opt.val ? "800" : "600", 
                                color: value === opt.val ? "#e11d48" : "#334155", 
                                background: value === opt.val ? "#fff1f2" : "transparent", 
                                borderRadius: "6px", 
                                cursor: "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between" 
                            }}
                        >
                            <span>{opt.label}</span>
                            {value === opt.val && <Check size={14} color="#e11d48" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrganisationDashboard({ 
    organisation, 
    onGoToRegisterBank, 
    onGoToAddCamp, 
    onEditBank,
    onEditCamp,
    onSignOut, 
    onGoToHome 
}) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");

    const [orgBanks, setOrgBanks] = useState([]);
    const [orgCamps, setOrgCamps] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Bulk donors
    const [donorFile, setDonorFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedCount, setParsedCount] = useState(null);
    const bulkFileInputRef = useRef(null);

    const [orgData, setOrgData] = useState(organisation || {
        name: "DevNexus",
        email: "ankitorg@gmail.com",
        contactPerson: "Ankit Kumar",
        phone: "",
        address: "",
        city: "Mandi Gobindgarh",
        district: "Fatehgarh Sahib",
        state: "Punjab",
        licenseNumber: "",
        category: "Private"
    });

    // Profile & Address Fields
    const [profileName, setProfileName] = useState(orgData.name || "");
    const [profileContact, setProfileContact] = useState(orgData.contactPerson || "");
    const [profilePhone, setProfilePhone] = useState(orgData.phone || "");
    const [profileAddress, setProfileAddress] = useState(orgData.address || "");
    const [profileCity, setProfileCity] = useState(orgData.city || "Mandi Gobindgarh");
    const [profileDistrict, setProfileDistrict] = useState(orgData.district || "Fatehgarh Sahib");
    const [profileState, setProfileState] = useState(orgData.state || "Punjab");
    const [profileLicense, setProfileLicense] = useState(orgData.licenseNumber || "");
    const [profileCategory, setProfileCategory] = useState(orgData.category || "Private");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Extra Contact Numbers
    const [myRole, setMyRole] = useState(orgData?.myRole || "Admin");
    const [contactNumbers, setContactNumbers] = useState(orgData?.contactNumbers || []);
    const [teamMembers, setTeamMembers] = useState(orgData?.teamMembers || []);

    const [extraPhone, setExtraPhone] = useState("");
    const [phoneTag, setPhoneTag] = useState("Reception");
    const [teammateName, setTeammateName] = useState("");
    const [teammateEmail, setTeammateEmail] = useState("");
    const [teammateRole, setTeammateRole] = useState("Staff");

    useEffect(() => {
        if (organisation) {
            setOrgData(organisation);
            setProfileName(organisation.name || "");
            setProfileContact(organisation.contactPerson || "");
            setProfilePhone(organisation.phone || "");
            setProfileAddress(organisation.address || "");
            setProfileCity(organisation.city || "Mandi Gobindgarh");
            setProfileDistrict(organisation.district || "Fatehgarh Sahib");
            setProfileState(organisation.state || "Punjab");
            setProfileLicense(organisation.licenseNumber || "");
            setProfileCategory(organisation.category || "Private");
            setMyRole(organisation.myRole || "Admin");
            setContactNumbers(organisation.contactNumbers || []);
            setTeamMembers(organisation.teamMembers || []);
        }
    }, [organisation]);

    const categoryOptions = [
        { label: "Private", val: "Private" },
        { label: "Govt.", val: "Govt." },
        { label: "Red Cross", val: "Red Cross" },
        { label: "Charitable / Trust", val: "Charitable / Trust" }
    ];

    const stateOptions = [
        { label: "Punjab", val: "Punjab" },
        { label: "Chandigarh", val: "Chandigarh" },
        { label: "Haryana", val: "Haryana" },
        { label: "Delhi", val: "Delhi" }
    ];

    const phoneTagOptions = [
        { label: "Reception", val: "Reception" },
        { label: "WhatsApp", val: "WhatsApp" },
        { label: "Billing", val: "Billing" },
        { label: "Emergency Helpline", val: "Emergency Helpline" }
    ];

    const roleOptions = [
        { label: "Admin", val: "Admin" },
        { label: "Staff", val: "Staff" },
        { label: "Camp Coordinator", val: "Camp Coordinator" }
    ];

    const loadOrgData = async () => {
        setIsLoadingData(true);
        try {
            const banksRes = await apiGetBloodBanks();
            if (banksRes && banksRes.success && Array.isArray(banksRes.banks)) {
                setOrgBanks(banksRes.banks);
            }
        } catch (err) {
            console.error("Error loading banks:", err);
        }

        try {
            const campsRes = await apiGetCamps();
            if (campsRes && campsRes.success && Array.isArray(campsRes.camps)) {
                setOrgCamps(campsRes.camps);
            }
        } catch (err) {
            console.error("Error loading camps:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        loadOrgData();
    }, [activeTab]);

    const handleDeleteCamp = async (camp) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete camp "${camp.title}"?\n\nThis will permanently remove the camp and erase its images from the uploads folder.`
        );
        if (!confirmDelete) return;

        try {
            const res = await apiDeleteCamp(camp._id || camp.id);
            if (res && res.success) {
                alert("Blood camp and its uploaded files were deleted successfully.");
                setOrgCamps((prev) => prev.filter((c) => (c._id || c.id) !== (camp._id || camp.id)));
            } else {
                alert(res?.message || "Failed to delete camp.");
            }
        } catch (err) {
            alert("Error deleting camp.");
        }
    };

    const handleDeleteBank = async (bank) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete blood bank "${bank.name}"?\n\nThis will permanently remove the blood bank and erase its photos from the uploads folder.`
        );
        if (!confirmDelete) return;

        try {
            const res = await apiDeleteBloodBank(bank._id || bank.id);
            if (res && res.success) {
                alert("Blood bank and its uploaded files were deleted successfully.");
                setOrgBanks((prev) => prev.filter((b) => (b._id || b.id) !== (bank._id || bank.id)));
            } else {
                alert(res?.message || "Failed to delete blood bank.");
            }
        } catch (err) {
            alert("Error deleting blood bank.");
        }
    };

    const handleSaveProfileDetails = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const payload = {
                email: orgData.email,
                name: profileName.trim(),
                contactPerson: profileContact.trim(),
                phone: profilePhone.trim(),
                address: profileAddress.trim(),
                city: profileCity.trim(),
                district: profileDistrict.trim(),
                state: profileState.trim(),
                licenseNumber: profileLicense.trim(),
                category: profileCategory.trim()
            };

            const res = await apiSaveOrgSettings(payload);
            if (res && res.success && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
                alert("Organisation profile and address details saved successfully!");
            } else {
                alert(res?.message || "Failed to save profile.");
            }
        } catch (err) {
            alert("Error saving profile details.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleAddContact = async () => {
        const cleanDigits = extraPhone.replace(/[^0-9]/g, "");
        if (!cleanDigits || cleanDigits.length < 10) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }

        const newContact = {
            phone: extraPhone.trim(),
            tag: phoneTag || "General"
        };

        const updated = [...contactNumbers, newContact];
        setContactNumbers(updated);
        setExtraPhone("");

        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, contactNumbers: updated });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Contact save error:", err);
        }
    };

    const handleDeleteContact = async (indexToRemove) => {
        const updated = contactNumbers.filter((_, idx) => idx !== indexToRemove);
        setContactNumbers(updated);
        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, contactNumbers: updated });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Contact delete error:", err);
        }
    };

    const handleAddTeammate = async () => {
        if (!teammateName.trim()) {
            alert("Please enter teammate's name");
            return;
        }
        if (!teammateEmail.trim() || !teammateEmail.includes("@")) {
            alert("Please enter a valid teammate email address");
            return;
        }

        const newMember = {
            name: teammateName.trim(),
            email: teammateEmail.trim().toLowerCase(),
            role: teammateRole
        };

        const updated = [...teamMembers, newMember];
        setTeamMembers(updated);
        setTeammateName("");
        setTeammateEmail("");

        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, teamMembers: updated });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Teammate save error:", err);
        }
    };

    const handleUpdateMemberRole = async (index, newRole) => {
        const updated = teamMembers.map((m, idx) => (idx === index ? { ...m, role: newRole } : m));
        setTeamMembers(updated);
        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, teamMembers: updated });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Teammate role update error:", err);
        }
    };

    const handleDeleteMember = async (indexToRemove) => {
        const updated = teamMembers.filter((_, idx) => idx !== indexToRemove);
        setTeamMembers(updated);
        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, teamMembers: updated });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Teammate delete error:", err);
        }
    };

    const handleMyRoleChange = async (newRole) => {
        setMyRole(newRole);
        try {
            const res = await apiSaveOrgSettings({ email: orgData.email, myRole: newRole });
            if (res && res.organisation) {
                setOrgData(res.organisation);
                localStorage.setItem("eblood_org", JSON.stringify(res.organisation));
            }
        } catch (err) {
            console.error("Role update error:", err);
        }
    };

    return (
        <div className="eb-org-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-link" onClick={() => setActiveTab("overview")}>{t("organisationDashboard")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">{t("settingsAndProfile")}</span>
                </nav>

                <h1 className="eb-org-title">{t("organisationDashboard")}</h1>

                {/* Organisation Header Card */}
                <div className="eb-org-profile-card">
                    <div className="eb-org-profile-header">
                        <div className="eb-org-meta-block">
                            <small>SIGNED IN AS</small>
                            <h2>{orgData.name}</h2>
                            <div className="org-email-line">
                                <span>{orgData.contactPerson} · {orgData.email}</span>
                                {orgData.phone && <span>· {orgData.phone}</span>}
                                <span className="eb-admin-pill">{myRole}</span>
                            </div>
                            {orgData.address && (
                                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                                    <MapPin size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                    {orgData.address}, {orgData.city}, {orgData.district}
                                </p>
                            )}
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                                type="button"
                                className="eb-btn-action-pill"
                                style={{ padding: "8px 16px", fontSize: "12.5px" }}
                                onClick={() => setActiveTab("settings")}
                            >
                                <Edit3 size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                Edit Details
                            </button>
                            <button 
                                type="button" 
                                className="eb-btn-org-signout" 
                                onClick={onSignOut}
                            >
                                <LogOut size={15} />
                                <span>{t("signOut")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="eb-org-dash-grid">
                    <aside className="eb-org-nav-list">
                        <button
                            type="button"
                            className={`eb-org-nav-item ${activeTab === "overview" ? "active" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <Clock size={16} />
                            <span>{t("overview")}</span>
                        </button>

                        <button
                            type="button"
                            className={`eb-org-nav-item ${activeTab === "banks" ? "active" : ""}`}
                            onClick={() => setActiveTab("banks")}
                        >
                            <Building2 size={16} />
                            <span>{t("banks")}</span>
                        </button>

                        <button
                            type="button"
                            className={`eb-org-nav-item ${activeTab === "camps" ? "active" : ""}`}
                            onClick={() => setActiveTab("camps")}
                        >
                            <Calendar size={16} />
                            <span>{t("bloodCamps")}</span>
                        </button>

                        <button
                            type="button"
                            className={`eb-org-nav-item ${activeTab === "donors" ? "active" : ""}`}
                            onClick={() => setActiveTab("donors")}
                        >
                            <Users size={16} />
                            <span>{t("donors")}</span>
                        </button>

                        <button
                            type="button"
                            className={`eb-org-nav-item ${activeTab === "settings" ? "active" : ""}`}
                            onClick={() => setActiveTab("settings")}
                        >
                            <Settings size={16} />
                            <span>{t("settingsAndProfile")}</span>
                        </button>
                    </aside>

                    <main>
                        {/* 1. OVERVIEW TAB */}
                        {activeTab === "overview" && (
                            <div>
                                <div className="eb-org-action-grid">
                                    <div className="eb-action-card">
                                        <div>
                                            <div className="eb-action-icon-circle">
                                                <FileText size={18} />
                                            </div>
                                            <h3>{t("registerABloodBank")}</h3>
                                            <p>Add your blood bank's details, contact info, and manage its live units.</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="eb-action-link-btn"
                                            onClick={onGoToRegisterBank}
                                        >
                                            Start registration &rsaquo;
                                        </button>
                                    </div>

                                    <div className="eb-action-card">
                                        <div>
                                            <div className="eb-action-icon-circle">
                                                <Zap size={18} />
                                            </div>
                                            <h3>{t("addABloodCamp")}</h3>
                                            <p>Schedule an upcoming donation camp so donors can find it on E-Blood.</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="eb-action-link-btn"
                                            onClick={onGoToAddCamp}
                                        >
                                            Add camp details &rsaquo;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. BANKS TAB */}
                        {activeTab === "banks" && (
                            <div className="eb-dash-tab-card">
                                <div className="eb-dash-tab-header">
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "24px" }}>
                                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                                            Registered Blood Banks
                                        </h3>
                                        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                            {orgBanks.length} registered bank(s) found
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="eb-btn-action-pill"
                                        onClick={onGoToRegisterBank}
                                    >
                                        + {t("registerABloodBank")}
                                    </button>
                                </div>

                                {isLoadingData ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                                        <Loader2 size={24} className="spin-loader" style={{ margin: "0 auto 8px" }} />
                                        <p>Loading registered blood banks...</p>
                                    </div>
                                ) : orgBanks.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                                        <Building2 size={36} color="#cbd5e1" style={{ margin: "0 auto 8px" }} />
                                        <p>No blood banks registered yet under this organisation.</p>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {orgBanks.map((bank) => {
                                            const thumbSrc = (bank.images && bank.images.length > 0)
                                                ? bank.images[0]
                                                : "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80";

                                            return (
                                                <div key={bank._id || bank.id} className="eb-dash-item-row">
                                                    <div className="eb-dash-item-thumb">
                                                        <img 
                                                            src={resolveImageUrl(thumbSrc)} 
                                                            alt={bank.name} 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80";
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ flex: 1, minWidth: "180px" }}>
                                                        <strong style={{ fontSize: "14.5px", color: "#0f172a", display: "block" }}>
                                                            {bank.name}
                                                        </strong>
                                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                                            {bank.district || bank.city}, {bank.state} · Phone: {bank.phone}
                                                        </span>
                                                    </div>

                                                    <span className="eb-units-badge" style={{ fontSize: "11px", fontWeight: "800", color: "#166534", background: "#dcfce7", padding: "4px 10px", borderRadius: "9999px" }}>
                                                        {bank.unitsInStock || 0} units in stock
                                                    </span>

                                                    <div className="eb-dash-actions-cluster">
                                                        <button 
                                                            type="button" 
                                                            className="eb-btn-dash-edit"
                                                            onClick={() => onEditBank(bank)}
                                                            title="Edit Blood Bank on Full Page"
                                                        >
                                                            <Edit3 size={14} />
                                                            <span>Edit</span>
                                                        </button>

                                                        <button 
                                                            type="button" 
                                                            className="eb-btn-dash-delete"
                                                            onClick={() => handleDeleteBank(bank)}
                                                            title="Delete Blood Bank & Remove Photos"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. CAMPS TAB */}
                        {activeTab === "camps" && (
                            <div className="eb-dash-tab-card">
                                <div className="eb-dash-tab-header">
                                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                                        {t("campsOrganized")}
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0, flex: 1, textAlign: "right" }}>
                                        {orgCamps.length} scheduled blood drive(s)
                                    </p>
                                    <button
                                        type="button"
                                        className="eb-btn-action-pill"
                                        onClick={onGoToAddCamp}
                                        style={{ marginLeft: "20px" }}
                                    >
                                        + {t("addABloodCamp")}
                                    </button>
                                </div>

                                {isLoadingData ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                                        <Loader2 size={24} className="spin-loader" style={{ margin: "0 auto 8px" }} />
                                        <p>Loading scheduled blood drives...</p>
                                    </div>
                                ) : orgCamps.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                                        <Calendar size={36} color="#cbd5e1" style={{ margin: "0 auto 8px" }} />
                                        <p>No upcoming donation camps added yet.</p>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {orgCamps.map((camp) => {
                                            const campThumb = (camp.images && camp.images.length > 0)
                                                ? camp.images[0]
                                                : (camp.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80");

                                            return (
                                                <div key={camp._id || camp.id} className="eb-dash-item-row">
                                                    <div className="eb-dash-item-thumb">
                                                        <img 
                                                            src={resolveImageUrl(campThumb)} 
                                                            alt={camp.title} 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80";
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ flex: 1, minWidth: "180px" }}>
                                                        <strong style={{ fontSize: "14.5px", color: "#0f172a", display: "block" }}>
                                                            {camp.title}
                                                        </strong>
                                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                                            {camp.campDate} ({camp.startTime} – {camp.endTime}) · {camp.city || ""}, {camp.district || ""}
                                                        </span>
                                                    </div>

                                                    <span className="eb-admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>
                                                        Active Drive
                                                    </span>

                                                    <div className="eb-dash-actions-cluster">
                                                        <button 
                                                            type="button" 
                                                            className="eb-btn-dash-edit"
                                                            onClick={() => onEditCamp(camp)}
                                                            title="Edit Blood Camp on Full Page"
                                                        >
                                                            <Edit3 size={14} />
                                                            <span>Edit</span>
                                                        </button>

                                                        <button 
                                                            type="button" 
                                                            className="eb-btn-dash-delete"
                                                            onClick={() => handleDeleteCamp(camp)}
                                                            title="Delete Camp & Remove Images from Uploads"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. DONORS TAB */}
                        {activeTab === "donors" && (
                            <div className="eb-dash-tab-card" style={{ padding: "32px 28px" }}>
                                <div className="eb-action-icon-circle" style={{ marginBottom: "16px" }}>
                                    <UploadCloud size={20} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>
                                    {t("bulkUploadDonors")}
                                </h3>
                                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.6", maxWidth: "620px", margin: "0 0 16px" }}>
                                    Upload a CSV or XML file to bulk register blood donors under your organisation.
                                </p>

                                <input
                                    type="file"
                                    ref={bulkFileInputRef}
                                    accept=".csv,.txt,.xml,.xlsx"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setDonorFile(file);
                                            setParsedCount(12);
                                        }
                                    }}
                                />

                                <div 
                                    className="eb-bulk-dropzone"
                                    onClick={() => bulkFileInputRef.current?.click()}
                                >
                                    <FileSpreadsheet size={28} color="#e11d48" />
                                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                                        {donorFile ? donorFile.name : "Click to select a donor file"}
                                    </strong>
                                    <small style={{ color: "#64748b", fontSize: "11.5px" }}>
                                        Supports .CSV, .TXT, .XML files
                                    </small>
                                </div>
                            </div>
                        )}

                        {/* 5. FULL SETTINGS & PROFILE TAB */}
                        {activeTab === "settings" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {/* Section A: Organisation Details & Official Address */}
                                <div className="eb-dash-tab-card" style={{ padding: "26px" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                                        Organisation Details & Address
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px" }}>
                                        Update your organisation's official registration, mobile number, and address.
                                    </p>

                                    <form onSubmit={handleSaveProfileDetails}>
                                        <div className="eb-settings-inline-row">
                                            <div style={{ flex: 1.2 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    Organisation Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    className="eb-inline-input"
                                                    required
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    Contact Person *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileContact}
                                                    onChange={(e) => setProfileContact(e.target.value)}
                                                    className="eb-inline-input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="eb-settings-inline-row">
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    Official Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="98XXXXXXXX"
                                                    value={profilePhone}
                                                    onChange={(e) => setProfilePhone(e.target.value)}
                                                    className="eb-inline-input"
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    Category
                                                </label>
                                                <CustomDashboardDropdown
                                                    value={profileCategory}
                                                    options={categoryOptions}
                                                    onChange={(val) => setProfileCategory(val)}
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    License Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. DL-10928-PB"
                                                    value={profileLicense}
                                                    onChange={(e) => setProfileLicense(e.target.value)}
                                                    className="eb-inline-input"
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Address (HQ or Center)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Street, area, building"
                                                value={profileAddress}
                                                onChange={(e) => setProfileAddress(e.target.value)}
                                                className="eb-inline-input"
                                            />
                                        </div>

                                        <div className="eb-settings-inline-row">
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    {t("state")}
                                                </label>
                                                <CustomDashboardDropdown
                                                    value={profileState}
                                                    options={stateOptions}
                                                    onChange={(val) => setProfileState(val)}
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    District
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileDistrict}
                                                    onChange={(e) => setProfileDistrict(e.target.value)}
                                                    className="eb-inline-input"
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileCity}
                                                    onChange={(e) => setProfileCity(e.target.value)}
                                                    className="eb-inline-input"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="eb-btn-action-pill"
                                            disabled={isSavingProfile}
                                            style={{ marginTop: "12px" }}
                                        >
                                            {isSavingProfile ? "Saving Profile..." : t("saveOrgDetails")}
                                        </button>
                                    </form>
                                </div>

                                {/* Section B: Extra Contact Numbers */}
                                <div className="eb-dash-tab-card" style={{ padding: "26px" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                                        {t("contactNumbers")}
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px" }}>
                                        Extra phone numbers for reception, WhatsApp, billing, or emergency helplines.
                                    </p>

                                    {contactNumbers.length === 0 ? (
                                        <span style={{ fontSize: "12.5px", color: "#94a3b8", display: "block", marginBottom: "16px" }}>
                                            No extra contact numbers added yet.
                                        </span>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                                            {contactNumbers.map((c, idx) => (
                                                <div 
                                                    key={idx} 
                                                    style={{ 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        justifyContent: "space-between", 
                                                        padding: "10px 14px", 
                                                        background: "#ffffff", 
                                                        border: "1px solid #e2e8f0", 
                                                        borderRadius: "10px" 
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <Phone size={15} color="#e11d48" />
                                                        <strong style={{ fontSize: "13.5px", color: "#0f172a" }}>{c.phone}</strong>
                                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px" }}>
                                                            {c.tag}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteContact(idx)}
                                                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                                                        title="Delete contact number"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="eb-settings-inline-row">
                                        <div style={{ flex: 1.2 }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Phone number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Enter 10-digit phone number"
                                                value={extraPhone}
                                                onChange={(e) => setExtraPhone(e.target.value)}
                                                className="eb-inline-input"
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Tag
                                            </label>
                                            <CustomDashboardDropdown
                                                value={phoneTag}
                                                options={phoneTagOptions}
                                                onChange={(val) => setPhoneTag(val)}
                                                placeholder="Choose a tag"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="eb-settings-action-btn"
                                        onClick={handleAddContact}
                                    >
                                        {t("addNumber")}
                                    </button>
                                </div>

                                {/* Section C: Team Members & Access Roles */}
                                <div className="eb-dash-tab-card" style={{ padding: "26px" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                                        {t("teamMembers")}
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
                                        Add team members and assign dashboard roles (Admin, Staff, Camp Coordinator).
                                    </p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                                        {/* Current User */}
                                        <div className="eb-team-member-item">
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#fee2e2", color: "#e11d48", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <UserCheck size={16} />
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: "13.5px", color: "#0f172a" }}>{orgData.contactPerson} (you)</strong>
                                                    <small style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{orgData.email}</small>
                                                </div>
                                            </div>
                                            <div style={{ width: "160px" }}>
                                                <CustomDashboardDropdown
                                                    value={myRole}
                                                    options={roleOptions}
                                                    onChange={handleMyRoleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Added Teammates */}
                                        {teamMembers.map((member, idx) => (
                                            <div key={idx} className="eb-team-member-item">
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        <UserPlus size={16} />
                                                    </div>
                                                    <div>
                                                        <strong style={{ fontSize: "13.5px", color: "#0f172a" }}>{member.name}</strong>
                                                        <small style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{member.email}</small>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{ width: "160px" }}>
                                                        <CustomDashboardDropdown
                                                            value={member.role}
                                                            options={roleOptions}
                                                            onChange={(newRole) => handleUpdateMemberRole(idx, newRole)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMember(idx)}
                                                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "6px" }}
                                                        title="Remove team member"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Teammate Row */}
                                    <div className="eb-settings-inline-row">
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Teammate name"
                                                value={teammateName}
                                                onChange={(e) => setTeammateName(e.target.value)}
                                                className="eb-inline-input"
                                            />
                                        </div>

                                        <div style={{ flex: 1.2 }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="teammate@organisation.org"
                                                value={teammateEmail}
                                                onChange={(e) => setTeammateEmail(e.target.value)}
                                                className="eb-inline-input"
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                                                Role
                                            </label>
                                            <CustomDashboardDropdown
                                                value={teammateRole}
                                                options={roleOptions}
                                                onChange={(val) => setTeammateRole(val)}
                                                placeholder="Choose a role"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="eb-settings-action-btn"
                                        onClick={handleAddTeammate}
                                    >
                                        {t("addTeammate")}
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