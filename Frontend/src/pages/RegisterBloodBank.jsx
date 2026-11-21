import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { apiRegisterBloodBank, apiUpdateBloodBank } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/RegisterBloodBank.css";

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
        <div className="eb-custom-select-container" ref={dropdownRef} style={{ width: "100%" }}>
            <button
                type="button"
                className={`eb-custom-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{ height: "42px", padding: "10px 14px", borderRadius: "10px", borderColor: "#cbd5e1" }}
            >
                <span className="selected-val" style={{ color: "#0f172a", fontSize: "13.5px" }}>
                    {selected.label}
                </span>
                <ChevronDown size={15} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-custom-dropdown-menu" style={{ zIndex: 120 }}>
                    {options.map((opt) => (
                        <div
                            key={opt.val}
                            className={`eb-custom-option ${value === opt.val ? "active" : ""}`}
                            onClick={() => {
                                onChange(opt.val);
                                setIsOpen(false);
                            }}
                        >
                            <span>{opt.label}</span>
                            {value === opt.val && <Check size={14} className="check-icon" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RegisterBloodBank({ 
    organisation, 
    initialData = null,
    onRegisterComplete, 
    onCancel, 
    onGoToHome 
}) {
    const { t } = useLanguage();
    const isEditMode = Boolean(initialData);

    const [bankName, setBankName] = useState(initialData?.name || "");
    const [category, setCategory] = useState(initialData?.category || "Private");
    const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || "");

    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState(initialData?.images || (initialData?.image ? [initialData.image] : []));
    const fileInputRef = useRef(null);

    const [stock, setStock] = useState(initialData?.stock || {
        "A+": 0, "A-": 0, "B+": 0, "B-": 0,
        "AB+": 0, "AB-": 0, "O+": 0, "O-": 0
    });

    const [address, setAddress] = useState(initialData?.address || "");
    const [state, setState] = useState(initialData?.state || "Punjab");
    const [district, setDistrict] = useState(initialData?.district || "Fatehgarh Sahib");
    const [city, setCity] = useState(initialData?.city || "Mandi Gobindgarh");
    const [pincode, setPincode] = useState(initialData?.pincode || "147301");
    const [mapsLink, setMapsLink] = useState(initialData?.mapsLink || "");

    const [phone, setPhone] = useState(initialData?.phone || "");
    const [altPhone, setAltPhone] = useState(initialData?.altPhone || "");
    const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "");
    const [email, setEmail] = useState(initialData?.email || organisation?.email || "");
    const [bookingLink, setBookingLink] = useState(initialData?.bookingLink || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setBankName(initialData.name || "");
            setCategory(initialData.category || "Private");
            setLicenseNumber(initialData.licenseNumber || "");
            setAddress(initialData.address || "");
            setState(initialData.state || "Punjab");
            setDistrict(initialData.district || "Fatehgarh Sahib");
            setCity(initialData.city || "Mandi Gobindgarh");
            setPincode(initialData.pincode || "147301");
            setPhone(initialData.phone || "");
            setAltPhone(initialData.altPhone || "");
            setWhatsapp(initialData.whatsapp || "");
            setEmail(initialData.email || "");
            setBookingLink(initialData.bookingLink || "");
            setMapsLink(initialData.mapsLink || "");
            if (initialData.stock) setStock(initialData.stock);
            setPreviewUrls(initialData.images || (initialData.image ? [initialData.image] : []));
        }
    }, [initialData]);

    const categoryOptions = [
        { label: "Govt.", val: "Govt." },
        { label: "Red Cross", val: "Red Cross" },
        { label: "Charitable / Trust", val: "Charitable / Trust" },
        { label: "Private", val: "Private" }
    ];

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

    const totalUnits = Object.values(stock).reduce((sum, val) => sum + val, 0);

    const handleStockChange = (group, value) => {
        const num = Math.max(0, parseInt(value, 10) || 0);
        setStock((prev) => ({ ...prev, [group]: num }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 4 - imageFiles.length;
        if (remainingSlots <= 0) {
            alert("Maximum 4 images allowed for your blood bank profile.");
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
        if (!bankName.trim()) {
            alert("Please enter the blood bank name");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("organisationId", organisation?.id || organisation?._id || "");
        formData.append("name", bankName.trim());
        formData.append("category", category);
        formData.append("licenseNumber", licenseNumber.trim());
        formData.append("address", address.trim());
        formData.append("state", state);
        formData.append("district", district);
        formData.append("city", city.trim());
        formData.append("pincode", pincode.trim());
        formData.append("phone", phone.trim() || "+91 1765 520000");
        formData.append("altPhone", altPhone.trim());
        formData.append("whatsapp", whatsapp.trim());
        formData.append("email", email.trim());
        formData.append("bookingLink", bookingLink.trim());
        formData.append("mapsLink", mapsLink.trim());
        formData.append("unitsInStock", totalUnits);
        formData.append("stock", JSON.stringify(stock));

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            let result;
            if (isEditMode) {
                result = await apiUpdateBloodBank(initialData._id || initialData.id, {
                    name: bankName.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    city: city.trim(),
                    district,
                    state,
                    unitsInStock: totalUnits,
                    stock
                });
            } else {
                result = await apiRegisterBloodBank(formData);
            }

            if (result && result.success) {
                alert(`Blood bank "${bankName}" ${isEditMode ? "updated" : "registered"} successfully!`);
                if (onRegisterComplete) onRegisterComplete();
            } else {
                alert(result?.message || "Failed to save blood bank.");
            }
        } catch (err) {
            alert("Failed to communicate with server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="eb-reg-bank-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-link" onClick={onCancel}>{t("organisationDashboard")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">
                        {isEditMode ? "Edit Blood Bank" : t("registerABloodBank")}
                    </span>
                </nav>

                <h1 className="eb-reg-bank-title">
                    {isEditMode ? `Edit "${bankName}"` : t("registerABloodBank")}
                </h1>

                <form onSubmit={handleSubmit} className="eb-reg-bank-container">
                    <div className="eb-reg-card">
                        <h3>Blood Bank Details</h3>

                        <div className="eb-form-field">
                            <label>Blood bank name *</label>
                            <input
                                type="text"
                                placeholder="e.g. City Care Blood Bank"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-duo-fields">
                            <div className="eb-form-field">
                                <label>Category *</label>
                                <CustomFormDropdown
                                    value={category}
                                    options={categoryOptions}
                                    onChange={(val) => setCategory(val)}
                                />
                            </div>

                            <div className="eb-form-field">
                                <label>License number (if applicable)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CH-12033-21"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="eb-form-field">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label>Upload photos</label>
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
                                    className="eb-upload-interactive-box"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={22} color="#e11d48" />
                                    <span>Click to select blood bank photos</span>
                                    <small>JPG, PNG, or WEBP up to 5MB each (Multer file storage)</small>
                                </div>
                            )}

                            {previewUrls.length > 0 && (
                                <div className="eb-image-previews-grid">
                                    {previewUrls.map((imgSrc, idx) => (
                                        <div key={idx} className="eb-preview-card">
                                            <img src={imgSrc} alt={`Blood bank preview ${idx + 1}`} />
                                            <button
                                                type="button"
                                                className="eb-remove-img-btn"
                                                onClick={() => handleRemoveImage(idx)}
                                                title="Delete this image"
                                            >
                                                <X size={13} />
                                            </button>
                                            <span className="eb-preview-badge">
                                                {idx === 0 ? "Cover Photo" : `Photo ${idx + 1}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="eb-reg-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Available Blood Stock (Units) *</h3>
                            <span className="eb-stock-total-badge">
                                Total: {totalUnits} Units
                            </span>
                        </div>

                        <div className="eb-stock-inputs-grid">
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                                <div key={group} className="eb-stock-field-box">
                                    <span className="eb-stock-group-label">{group}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={stock[group] === 0 ? "" : stock[group]}
                                        onChange={(e) => handleStockChange(group, e.target.value)}
                                        className="eb-stock-qty-input"
                                    />
                                    <small style={{ fontSize: "10.5px", color: "#94a3b8" }}>units</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="eb-reg-card">
                        <h3>Address</h3>

                        <div className="eb-form-field">
                            <label>Address *</label>
                            <input
                                type="text"
                                placeholder="Street, area / locality"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="eb-duo-fields">
                            <div className="eb-form-field">
                                <label>{t("state")} *</label>
                                <CustomFormDropdown
                                    value={state}
                                    options={stateOptions}
                                    onChange={(val) => setState(val)}
                                />
                            </div>

                            <div className="eb-form-field">
                                <label>District *</label>
                                <CustomFormDropdown
                                    value={district}
                                    options={districtOptions}
                                    onChange={(val) => setDistrict(val)}
                                />
                            </div>
                        </div>

                        <div className="eb-duo-fields">
                            <div className="eb-form-field">
                                <label>City *</label>
                                <input
                                    type="text"
                                    placeholder="City name"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="eb-form-field">
                                <label>{t("pincode")}</label>
                                <input
                                    type="text"
                                    placeholder="6-digit pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="eb-form-field">
                            <label>Google Maps link</label>
                            <input
                                type="url"
                                placeholder="https://maps.google.com/..."
                                value={mapsLink}
                                onChange={(e) => setMapsLink(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="eb-reg-card">
                        <h3>Contact</h3>

                        <div className="eb-duo-fields">
                            <div className="eb-form-field">
                                <label>Phone number *</label>
                                <input
                                    type="tel"
                                    placeholder="98XXXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="eb-form-field">
                                <label>Alternate number</label>
                                <input
                                    type="tel"
                                    placeholder="Optional"
                                    value={altPhone}
                                    onChange={(e) => setAltPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="eb-duo-fields">
                            <div className="eb-form-field">
                                <label>WhatsApp number</label>
                                <input
                                    type="tel"
                                    placeholder="Optional"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                />
                            </div>

                            <div className="eb-form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@bank.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="eb-form-field">
                            <label>Online registration / booking link</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={bookingLink}
                                onChange={(e) => setBookingLink(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="eb-reg-bank-actions">
                        <button type="submit" className="eb-btn-submit-review" disabled={isSubmitting}>
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
                        <button type="button" className="eb-btn-cancel-reg" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}