import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { apiRegisterCamp, apiUpdateCamp } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/AddBloodCamp.css";

function CustomFormDropdown({ value, options, onChange, placeholder }) {
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
                    height: "44px", 
                    padding: "10px 14px", 
                    borderRadius: "10px", 
                    border: "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    cursor: "pointer"
                }}
            >
                <span className="selected-val" style={{ color: "#0f172a", fontSize: "13.5px", fontWeight: "600" }}>
                    {selected.label}
                </span>
                <ChevronDown size={15} className={`chevron-icon ${isOpen ? "rotate" : ""}`} style={{ color: "#64748b" }} />
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
                        zIndex: 120,
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
                                padding: "8px 12px",
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

export default function AddBloodCamp({ 
    organisation, 
    initialData = null, 
    onCampCreated, 
    onCancel, 
    onGoToHome 
}) {
    const { t } = useLanguage();
    const isEditMode = Boolean(initialData);

    const [organiserName, setOrganiserName] = useState(initialData?.organiserName || organisation?.contactPerson || "");
    const [organiserMobile, setOrganiserMobile] = useState(initialData?.organiserMobile || "");
    const [organiserEmail, setOrganiserEmail] = useState(initialData?.organiserEmail || organisation?.email || "");
    const [coOrganiserName, setCoOrganiserName] = useState(initialData?.coOrganiserName || "");
    const [coOrganiserMobile, setCoOrganiserMobile] = useState(initialData?.coOrganiserMobile || "");

    const [campName, setCampName] = useState(initialData?.title || "");
    const [campAddress, setCampAddress] = useState(initialData?.campAddress || "");
    const [state, setState] = useState(initialData?.state || "Punjab");
    const [district, setDistrict] = useState(initialData?.district || "Fatehgarh Sahib");
    const [city, setCity] = useState(initialData?.city || "Mandi Gobindgarh");
    const [associatedBank, setAssociatedBank] = useState(initialData?.associatedBank || "");
    const [mapsLink, setMapsLink] = useState(initialData?.mapsLink || "");

    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState(initialData?.images || (initialData?.image ? [initialData.image] : []));
    const fileInputRef = useRef(null);

    const [campDate, setCampDate] = useState(initialData?.campDate || "");
    const [startTime, setStartTime] = useState(initialData?.startTime || "09:00");
    const [endTime, setEndTime] = useState(initialData?.endTime || "17:00");
    const [estimatedParticipants, setEstimatedParticipants] = useState(initialData?.estimatedParticipants || "");
    const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsappNumber || "");
    const [supporter, setSupporter] = useState(initialData?.supporter || "");
    const [remarks, setRemarks] = useState(initialData?.remarks || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setCampName(initialData.title || "");
            setOrganiserName(initialData.organiserName || "");
            setOrganiserMobile(initialData.organiserMobile || "");
            setCampAddress(initialData.campAddress || "");
            setState(initialData.state || "Punjab");
            setDistrict(initialData.district || "Fatehgarh Sahib");
            setCity(initialData.city || "Mandi Gobindgarh");
            setCampDate(initialData.campDate || "");
            setStartTime(initialData.startTime || "09:00");
            setEndTime(initialData.endTime || "17:00");
            setEstimatedParticipants(initialData.estimatedParticipants || "");
            setWhatsappNumber(initialData.whatsappNumber || "");
            setSupporter(initialData.supporter || "");
            setPreviewUrls(initialData.images || (initialData.image ? [initialData.image] : []));
        }
    }, [initialData]);

    const stateOptions = [
        { label: "Punjab", val: "Punjab" },
        { label: "Chandigarh", val: "Chandigarh" },
        { label: "Haryana", val: "Haryana" },
        { label: "Delhi", val: "Delhi" }
    ];

    const districtOptions = [
        { label: "Fatehgarh Sahib", val: "Fatehgarh Sahib" },
        { label: "Patiala", val: "Patiala" },
        { label: "Ludhiana", val: "Ludhiana" },
        { label: "SAS Nagar (Mohali)", val: "SAS Nagar" },
        { label: "Chandigarh", val: "Chandigarh" }
    ];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 4 - imageFiles.length;
        if (remainingSlots <= 0) {
            alert("Maximum 4 images allowed for your blood camp.");
            return;
        }

        const validFiles = files.slice(0, remainingSlots).filter((f) => f.type.startsWith("image/"));
        setImageFiles((prev) => [...prev, ...validFiles]);
        
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
        e.target.value = "";
    };

    const handleRemoveImage = (indexToRemove) => {
        setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!campName.trim() || !organiserName.trim()) {
            alert("Please complete required camp fields.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("organisationId", organisation?.id || organisation?._id || "");
        formData.append("title", campName.trim());
        formData.append("organiserName", organiserName.trim());
        formData.append("organiserMobile", organiserMobile.trim());
        formData.append("organiserEmail", organiserEmail.trim());
        formData.append("campAddress", campAddress.trim());
        formData.append("state", state);
        formData.append("district", district);
        formData.append("city", city.trim());
        formData.append("campDate", campDate || "Upcoming");
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        formData.append("estimatedParticipants", Number(estimatedParticipants) || 100);
        formData.append("whatsappNumber", whatsappNumber.trim());
        formData.append("mapsLink", mapsLink.trim());
        formData.append("supporter", supporter.trim());
        formData.append("remarks", remarks.trim());

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            let result;
            if (isEditMode) {
                result = await apiUpdateCamp(initialData._id || initialData.id, formData);
            } else {
                result = await apiRegisterCamp(formData);
            }

            if (result && result.success) {
                alert(`Blood Camp "${campName}" ${isEditMode ? "updated" : "registered"} successfully!`);
                if (onCampCreated) onCampCreated();
            } else {
                alert(result?.message || "Failed to save camp.");
            }
        } catch (err) {
            alert("Network error: check that your backend server is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="eb-camp-form-root">
            <div className="eb-camp-header-wrap">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-link" onClick={onCancel}>{t("organisationDashboard")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">
                        {isEditMode ? "Edit Blood Camp" : t("addABloodCamp")}
                    </span>
                </nav>

                <h1 className="eb-camp-form-title">
                    {isEditMode ? `Edit "${campName}"` : t("addABloodCamp")}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="eb-camp-form-container">
                <div className="eb-camp-card">
                    <h3>Organiser Details</h3>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>Organiser name *</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={organiserName}
                                onChange={(e) => setOrganiserName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>Organiser mobile *</label>
                            <input
                                type="tel"
                                placeholder="98XXXXXXXX"
                                value={organiserMobile}
                                onChange={(e) => setOrganiserMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="eb-camp-field">
                        <label>Organiser email</label>
                        <input
                            type="email"
                            placeholder="name@organisation.org"
                            value={organiserEmail}
                            onChange={(e) => setOrganiserEmail(e.target.value)}
                        />
                    </div>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>Co-organiser name</label>
                            <input
                                type="text"
                                placeholder="Optional"
                                value={coOrganiserName}
                                onChange={(e) => setCoOrganiserName(e.target.value)}
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>Co-organiser mobile</label>
                            <input
                                type="tel"
                                placeholder="Optional"
                                value={coOrganiserMobile}
                                onChange={(e) => setCoOrganiserMobile(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="eb-camp-card">
                    <h3>Camp Details</h3>

                    <div className="eb-camp-field">
                        <label>Camp name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Independence Day Blood Drive"
                            value={campName}
                            onChange={(e) => setCampName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="eb-camp-field">
                        <label>Camp address *</label>
                        <input
                            type="text"
                            placeholder="Venue, street, area"
                            value={campAddress}
                            onChange={(e) => setCampAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>State *</label>
                            <CustomFormDropdown
                                value={state}
                                options={stateOptions}
                                onChange={(val) => setState(val)}
                                placeholder="Select state"
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>District *</label>
                            <CustomFormDropdown
                                value={district}
                                options={districtOptions}
                                onChange={(val) => setDistrict(val)}
                                placeholder="Select district"
                            />
                        </div>
                    </div>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>City *</label>
                            <input
                                type="text"
                                placeholder="City name"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>Associated blood bank (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. City Care Blood Bank"
                                value={associatedBank}
                                onChange={(e) => setAssociatedBank(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="eb-camp-field">
                        <label>Google Maps link</label>
                        <input
                            type="url"
                            placeholder="https://maps.google.com/..."
                            value={mapsLink}
                            onChange={(e) => setMapsLink(e.target.value)}
                        />
                    </div>

                    <div className="eb-camp-field">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label>Camp Photos (Upload up to 4 images) *</label>
                            <span style={{ fontSize: "11px", color: imageFiles.length >= 4 ? "#e11d48" : "#64748b", fontWeight: "700" }}>
                                {previewUrls.length}/4 selected
                            </span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/png, image/jpeg, image/webp"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                        {previewUrls.length < 4 && (
                            <div 
                                className="eb-camp-upload-box"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={22} color="#e11d48" />
                                <span>Click to select camp photos</span>
                                <small>JPG, PNG, or WEBP up to 5MB each (Multer file storage)</small>
                            </div>
                        )}

                        {previewUrls.length > 0 && (
                            <div className="eb-camp-img-grid">
                                {previewUrls.map((imgSrc, idx) => (
                                    <div key={idx} className="eb-camp-preview-card">
                                        <img src={imgSrc} alt={`Camp preview ${idx + 1}`} />
                                        <button
                                            type="button"
                                            className="eb-camp-remove-btn"
                                            onClick={() => handleRemoveImage(idx)}
                                            title="Delete photo"
                                        >
                                            <X size={13} />
                                        </button>
                                        <span className="eb-camp-badge">
                                            {idx === 0 ? "Cover Photo" : `Slide ${idx + 1}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="eb-camp-card">
                    <h3>Schedule & Reach</h3>

                    <div className="eb-camp-field">
                        <label>Camp date *</label>
                        <input
                            type="date"
                            value={campDate}
                            onChange={(e) => setCampDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>Start time *</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>End time *</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="eb-camp-duo">
                        <div className="eb-camp-field">
                            <label>Estimated participants *</label>
                            <input
                                type="number"
                                placeholder="e.g. 150"
                                value={estimatedParticipants}
                                onChange={(e) => setEstimatedParticipants(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-camp-field">
                            <label>WhatsApp number</label>
                            <input
                                type="tel"
                                placeholder="98XXXXXXXX"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="eb-camp-field">
                        <label>Reference / camp supporter</label>
                        <input
                            type="text"
                            placeholder="e.g. Lions Club / Rotary"
                            value={supporter}
                            onChange={(e) => setSupporter(e.target.value)}
                        />
                    </div>

                    <div className="eb-camp-field">
                        <label>Remarks</label>
                        <input
                            type="text"
                            placeholder="Additional instructions or notes"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </div>

                <div className="eb-camp-actions">
                    <button type="submit" className="eb-btn-submit-camp" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <Loader2 size={16} className="spin-loader" /> Saving...
                            </span>
                        ) : isEditMode ? (
                            "Save Changes"
                        ) : (
                            "Submit for review"
                        )}
                    </button>
                    <button type="button" className="eb-btn-cancel-camp" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}