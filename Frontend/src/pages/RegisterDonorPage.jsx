import React, { useState, useRef, useEffect } from "react";
import { Check, MapPin, Navigation, Loader2, ChevronDown, Phone, Mail, ArrowLeft, AlertCircle, Calendar, Search } from "lucide-react";
import { State, City } from "country-state-city";
import { useLanguage } from "../context/LanguageContext";
import "../styles/RegisterDonorPage.css";

// Accessible Custom Dropdown with zero default selections and optional search
function CustomDonorSelect({ 
    value, 
    options, 
    onChange, 
    placeholder = "Select an option", 
    hasSearch = false, 
    searchPlaceholder = "Search..." 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredOptions = hasSearch && searchTerm.trim() !== ""
        ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    const selected = options.find((o) => o.val === value);

    return (
        <div className="eb-custom-select-container" ref={dropdownRef} style={{ width: "100%" }}>
            <button
                type="button"
                className={`eb-custom-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchTerm("");
                }}
            >
                <span className={`selected-val ${!selected ? "placeholder-text" : ""}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown size={15} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-custom-dropdown-menu" style={{ zIndex: 120 }}>
                    {hasSearch && (
                        <div className="eb-dropdown-search-wrap">
                            <Search size={14} className="eb-dropdown-search-ico" />
                            <input
                                type="text"
                                className="eb-dropdown-search-field"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="eb-dropdown-items-scroll">
                        {filteredOptions.length === 0 ? (
                            <div className="eb-dropdown-empty-row">No matching results</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.val}
                                    className={`eb-custom-option ${value === opt.val ? "active" : ""}`}
                                    onClick={() => {
                                        onChange(opt.val, opt.label);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    {value === opt.val && <Check size={14} className="check-icon" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RegisterDonorPage({ user, onRegisterComplete, onGoToLogin, onGoToHome }) {
    const { t } = useLanguage();
    const [isLocating, setIsLocating] = useState(false);
    const [validationError, setValidationError] = useState("");
    const isEditing = Boolean(user?.isDonor && user?.phone);

    // Initial Coordinates (Only if already saved, otherwise defaults to center)
    const [coords, setCoords] = useState(
        user?.coordinates || { lat: 30.6661, lng: 76.3023 }
    );

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstanceRef = useRef(null);

    // Dynamic Country-State-City lists with ZERO default selections
    const allIndianStates = State.getStatesOfCountry("IN").map((s) => ({
        label: s.name,
        val: s.isoCode,
        fullName: s.name
    }));

    const [selectedStateCode, setSelectedStateCode] = useState("");
    const [availableCityOptions, setAvailableCityOptions] = useState([]);

    // Custom Date of Birth selection states (Zero default selection)
    const [dobDay, setDobDay] = useState("");
    const [dobMonth, setDobMonth] = useState("");
    const [dobYear, setDobYear] = useState("");

    // Initialize DOB if editing an existing profile (Format: YYYY-MM-DD)
    useEffect(() => {
        if (user?.dob && user.dob.includes("-")) {
            const parts = user.dob.split("-");
            if (parts.length === 3) {
                setDobYear(parts[0]);
                setDobMonth(parts[1]);
                setDobDay(parts[2]);
            }
        }
    }, [user?.dob]);

    const [phone, setPhone] = useState(
        user?.phone && !user.phone.includes("98XXXXXXXX") 
            ? user.phone.replace(/[^0-9]/g, "").slice(-10) 
            : ""
    );

    // Strictly NO default selections for any field
    const [formData, setFormData] = useState({
        fullName: user?.name && user.name !== "User" ? user.name : "",
        gender: user?.gender || "",
        bloodGroup: user?.bloodGroup || "",
        weight: user?.weight && user.weight !== "Standard" ? String(user.weight).replace(/[^0-9]/g, "") : "",
        height: user?.height ? String(user.height).replace(/[^0-9]/g, "") : "",
        address: user?.address || "",
        landmark: user?.landmark || "",
        pincode: user?.pincode || "",
        state: user?.state || "",
        city: user?.city || "",
        district: user?.district || "",
        noDoctorBan: user?.noDoctorBan ?? true,
        noRegularMedicine: user?.noRegularMedicine ?? true,
        noSurgery12Months: user?.noSurgery12Months ?? true,
        reachChannel: user?.reachChannel || "WhatsApp",
        matchDistance: user?.matchDistance || 25,
        agreeTerms: user?.isDonor ? true : false
    });

    // Populate cities dynamically when a state is selected
    useEffect(() => {
        if (selectedStateCode) {
            const cities = City.getCitiesOfState("IN", selectedStateCode);
            setAvailableCityOptions(
                cities.map((c) => ({ label: c.name, val: c.name }))
            );
        } else {
            setAvailableCityOptions([]);
        }
    }, [selectedStateCode]);

    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
    const genders = ["Male", "Female", "Other"];

    // Date of Birth Dropdown options
    const daysOptions = Array.from({ length: 31 }, (_, i) => {
        const val = String(i + 1).padStart(2, "0");
        return { label: val, val };
    });

    const monthsOptions = [
        { label: "01 - January", val: "01" },
        { label: "02 - February", val: "02" },
        { label: "03 - March", val: "03" },
        { label: "04 - April", val: "04" },
        { label: "05 - May", val: "05" },
        { label: "06 - June", val: "06" },
        { label: "07 - July", val: "07" },
        { label: "08 - August", val: "08" },
        { label: "09 - September", val: "09" },
        { label: "10 - October", val: "10" },
        { label: "11 - November", val: "11" },
        { label: "12 - December", val: "12" }
    ];

    // Allowed years: current year (2026) minus 45 years up to minus 18 years
    const currentYear = 2026;
    const yearsOptions = Array.from({ length: 45 - 18 + 1 }, (_, i) => {
        const yr = String(currentYear - 18 - i);
        return { label: yr, val: yr };
    });

    // Precise Age Validator (Between 18 and 45)
    const validateAgeLimit = (year, month, day) => {
        if (!year || !month || !day) return { isValid: false, message: "Please complete your full Date of Birth." };

        const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return {
                isValid: false,
                age,
                message: `Age verification failed: You are ${age} years old. Medical guidelines mandate donors must be at least 18 years of age.`
            };
        }

        if (age > 45) {
            return {
                isValid: false,
                age,
                message: `Age verification failed: You are ${age} years old. Eligible donor registration on E-Blood is restricted to persons up to 45 years of age.`
            };
        }

        return { isValid: true, age };
    };

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            if (data && data.address) {
                const addr = data.address;
                const streetOrSub = [
                    addr.house_number,
                    addr.building,
                    addr.road,
                    addr.suburb || addr.neighbourhood || addr.residential
                ].filter(Boolean).join(", ");

                const landmarkFound = addr.amenity || addr.leisure || addr.commercial || addr.shop || "";
                const districtOrCity = addr.city || addr.town || addr.city_district || addr.county || addr.state_district || "";
                const stateFound = addr.state || "";
                const postCodeFound = addr.postcode ? addr.postcode.replace(/[^0-9]/g, "").slice(0, 6) : "";

                // Find state match in country-state-city
                const matchedState = allIndianStates.find(
                    (s) => s.label.toLowerCase() === stateFound.toLowerCase()
                );

                if (matchedState) {
                    setSelectedStateCode(matchedState.val);
                }

                setFormData((prev) => ({
                    ...prev,
                    address: streetOrSub || prev.address || data.display_name.split(",").slice(0, 2).join(","),
                    landmark: landmarkFound || prev.landmark,
                    pincode: postCodeFound || prev.pincode,
                    district: districtOrCity || prev.district,
                    city: districtOrCity || prev.city,
                    state: matchedState ? matchedState.label : prev.state
                }));
            }
        } catch (err) {
            console.warn("Reverse geocode warning:", err);
        }
    };

    const getPinIcon = () => {
        if (!window.L) return null;
        return window.L.divIcon({
            className: "custom-donor-pin",
            html: `<div class="eb-donor-map-marker"><span>🩸</span></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });
    };

    const updateMarkerPosition = (latitude, longitude, shouldReverseGeocode = false) => {
        const roundedLat = parseFloat(latitude.toFixed(4));
        const roundedLng = parseFloat(longitude.toFixed(4));
        setCoords({ lat: roundedLat, lng: roundedLng });

        if (markerInstanceRef.current) {
            markerInstanceRef.current.setLatLng([roundedLat, roundedLng]);
        }

        if (shouldReverseGeocode) {
            reverseGeocode(roundedLat, roundedLng);
        }
    };

    useEffect(() => {
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        if (!window.L) {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => initLeafletMap();
            document.body.appendChild(script);
        } else {
            initLeafletMap();
        }

        function initLeafletMap() {
            if (!mapContainerRef.current) return;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
                return;
            }

            const initialLat = coords.lat || 30.6661;
            const initialLng = coords.lng || 76.3023;

            const map = window.L.map(mapContainerRef.current, {
                center: [initialLat, initialLng],
                zoom: 13,
                zoomControl: true,
                scrollWheelZoom: true
            });

            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const marker = window.L.marker([initialLat, initialLng], {
                icon: getPinIcon(),
                draggable: true
            }).addTo(map);

            marker.on("dragend", (e) => {
                const pos = e.target.getLatLng();
                updateMarkerPosition(pos.lat, pos.lng, true);
            });

            map.on("click", (e) => {
                updateMarkerPosition(e.latlng.lat, e.latlng.lng, true);
            });

            mapInstanceRef.current = map;
            markerInstanceRef.current = marker;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerInstanceRef.current = null;
            }
        };
    }, []);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const newLat = parseFloat(latitude.toFixed(4));
                const newLng = parseFloat(longitude.toFixed(4));

                setCoords({ lat: newLat, lng: newLng });

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([newLat, newLng], 15, { duration: 1.2 });
                }

                if (markerInstanceRef.current) {
                    markerInstanceRef.current.setLatLng([newLat, newLng]);
                }

                await reverseGeocode(newLat, newLng);
                setIsLocating(false);
            },
            () => {
                alert("Location permission denied. Please enter your address manually.");
                setIsLocating(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    // Strict validation: age between 18-45 and all inputs must be filled
    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError("");

        const cleanPhoneDigits = phone.replace(/[^0-9]/g, "");

        if (!cleanPhoneDigits || cleanPhoneDigits.length !== 10) {
            setValidationError("A valid 10-digit mobile number is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.fullName.trim()) {
            setValidationError("Full Name is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // 1. Age Validation
        const ageCheck = validateAgeLimit(dobYear, dobMonth, dobDay);
        if (!ageCheck.isValid) {
            setValidationError(ageCheck.message);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.gender) {
            setValidationError("Please select your Gender.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.bloodGroup) {
            setValidationError("Please select your Blood Group.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.weight || Number(formData.weight) < 45) {
            setValidationError("Weight is required (minimum 45 kg required to donate blood).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.height) {
            setValidationError("Height (in cm) is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.address.trim()) {
            setValidationError("Street Address is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.landmark.trim()) {
            setValidationError("Nearby Landmark is required to facilitate donor dispatch.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.pincode.trim() || formData.pincode.trim().length !== 6) {
            setValidationError("A valid 6-digit PIN Code is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.state) {
            setValidationError("Please select your State.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.city.trim() && !formData.district.trim()) {
            setValidationError("City / District is required. Please select or enter your city.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.agreeTerms) {
            setValidationError("You must review and agree to the voluntary donor consent terms.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const formattedPhone = `+91 ${cleanPhoneDigits}`;
        const assembledDob = `${dobYear}-${dobMonth}-${dobDay}`;

        onRegisterComplete({
            userId: user?._id || user?.id,
            email: user?.email ? user.email.trim().toLowerCase() : undefined,
            name: formData.fullName.trim(),
            dob: assembledDob,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
            phone: formattedPhone,
            address: formData.address.trim(),
            landmark: formData.landmark.trim(),
            pincode: formData.pincode.trim(),
            city: formData.city.trim() || formData.district.trim(),
            district: formData.district.trim() || formData.city.trim(),
            state: formData.state,
            weight: `${formData.weight} kg`,
            height: `${formData.height} cm`,
            reachChannel: formData.reachChannel,
            matchDistance: formData.matchDistance,
            noDoctorBan: formData.noDoctorBan,
            noRegularMedicine: formData.noRegularMedicine,
            noSurgery12Months: formData.noSurgery12Months,
            isDonor: true,
            wantsToBeDonor: true,
            showInDonorList: true,
            lastDonation: user?.lastDonation || "Available Now",
            coordinates: coords
        });
    };

    return (
        <div className="eb-donor-register-page">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home")}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    {user && (
                        <>
                            <span className="breadcrumb-link" onClick={() => onRegisterComplete(user)}>
                                {t("profile")}
                            </span>
                            <span className="breadcrumb-sep">&rsaquo;</span>
                        </>
                    )}
                    <span className="breadcrumb-current">
                        {isEditing ? t("updateDonorTitle") : t("registerDonorTitle")}
                    </span>
                </nav>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h1 className="eb-page-heading" style={{ margin: 0 }}>
                        {isEditing ? t("updateDonorTitle") : t("registerDonorTitle")}
                    </h1>
                    {user && (
                        <button
                            type="button"
                            className="eb-pill-btn eb-pill-btn-outline"
                            onClick={() => onRegisterComplete(user)}
                            style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        >
                            <ArrowLeft size={13} style={{ marginRight: "4px" }} /> {t("backToProfile")}
                        </button>
                    )}
                </div>

                <p className="eb-donor-subhead">
                    Clinical Eligibility Notice: Donor must be between <strong>18 and 45 years of age</strong> and weight at least <strong>45 kg</strong>. All fields are required.
                </p>

                {validationError && (
                    <div className="eb-validation-error-alert animate-fade-in">
                        <AlertCircle size={20} className="error-ico" />
                        <div>
                            <strong>Registration Incomplete</strong>
                            <p>{validationError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="eb-donor-form-layout" autoComplete="off">
                    <div className="eb-donor-main-flow">
                        {/* Section 1: Contact */}
                        <div className="eb-flow-card">
                            <h3 className="flow-card-num">{t("contactVerification")} *</h3>
                            
                            {user?.email && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", padding: "8px 12px", background: "#f1f5f9", borderRadius: "10px" }}>
                                    <Mail size={16} color="#64748b" />
                                    <span style={{ fontSize: "13px", color: "#334155" }}>
                                        Account email: <strong>{user.email}</strong>
                                    </span>
                                </div>
                            )}

                            <div className="flow-input-group">
                                <label>{t("mobilePhoneLabel")} * (10 Digits)</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Phone size={16} color="#94a3b8" style={{ position: "absolute", left: "12px" }} />
                                    <input
                                        type="tel"
                                        placeholder="Enter 10-digit mobile number"
                                        value={phone}
                                        maxLength={10}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                                        style={{ paddingLeft: "36px" }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal Details with Custom DOB */}
                        <div className="eb-flow-card">
                            <h3 className="flow-card-num">{t("aboutYou")} *</h3>

                            <div className="flow-input-group">
                                <label>{t("fullName")} *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full legal name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            {/* CUSTOM DATE OF BIRTH PICKER (18 to 45 Years Old) */}
                            <div className="flow-input-group">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                    <label style={{ margin: 0 }}>Date of Birth * (Must be between 18 and 45 years)</label>
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#e11d48" }}>
                                        {dobYear && dobMonth && dobDay ? `${dobDay}/${dobMonth}/${dobYear}` : "Select Day, Month & Year"}
                                    </span>
                                </div>
                                <div className="dob-custom-selectors-grid">
                                    <CustomDonorSelect
                                        value={dobDay}
                                        options={daysOptions}
                                        onChange={(val) => setDobDay(val)}
                                        placeholder="Day"
                                    />

                                    <CustomDonorSelect
                                        value={dobMonth}
                                        options={monthsOptions}
                                        onChange={(val) => setDobMonth(val)}
                                        placeholder="Month"
                                    />

                                    <CustomDonorSelect
                                        value={dobYear}
                                        options={yearsOptions}
                                        onChange={(val) => setDobYear(val)}
                                        placeholder="Year"
                                    />
                                </div>
                            </div>

                            {/* Gender Choice with Zero Default Selection */}
                            <div className="flow-input-group">
                                <label>{t("gender")} *</label>
                                <div className="pill-choice-row">
                                    {genders.map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            className={`choice-pill ${formData.gender === g ? "selected" : ""}`}
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Blood Group Choice with Zero Default Selection */}
                            <div className="flow-input-group">
                                <label>{t("filterByBloodGroup")} *</label>
                                <div className="blood-group-selector-grid">
                                    {bloodGroups.map((bg) => (
                                        <button
                                            key={bg}
                                            type="button"
                                            className={`bg-card-pill ${formData.bloodGroup === bg ? "selected" : ""}`}
                                            onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                                        >
                                            {bg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flow-duo-row">
                                <div className="flow-input-group">
                                    <label>{t("weightKg")} * (Min. 45 kg required)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 62"
                                        min="45"
                                        max="160"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flow-input-group">
                                    <label>{t("heightCm")} *</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 172"
                                        min="100"
                                        max="230"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Location with All States & Dynamic Cities */}
                        <div className="eb-flow-card">
                            <h3 className="flow-card-num">{t("whereBased")} *</h3>

                            <div
                                className="location-auto-box"
                                onClick={handleDetectLocation}
                                style={{ cursor: isLocating ? "wait" : "pointer" }}
                            >
                                <div className="loc-icon-bubble">
                                    {isLocating ? <Loader2 size={18} className="spin-loader" /> : <Navigation size={18} />}
                                </div>
                                <div>
                                    <strong>{isLocating ? t("detectingLocation") : t("detectLocationButton")}</strong>
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                                        {coords ? `GPS: ${coords.lat}° N, ${coords.lng}° E` : "Faster and more accurate"}
                                    </p>
                                </div>
                            </div>

                            <div className="flow-input-group" style={{ marginTop: "14px" }}>
                                <label>{t("streetAddress")} *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. House #24B, Sector 14, Urban Estate"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flow-duo-row">
                                <div className="flow-input-group">
                                    <label>{t("landmark")} *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Near Desh Bhagat University / Bus Stand"
                                        value={formData.landmark}
                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flow-input-group">
                                    <label>{t("pincode")} * (6 Digits)</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="e.g. 147301"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, "") })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* ALL INDIAN STATES & OFFICIAL DYNAMIC CITIES */}
                            <div className="flow-duo-row">
                                <div className="flow-input-group">
                                    <label>{t("state")} * (All Regions)</label>
                                    <CustomDonorSelect
                                        value={selectedStateCode}
                                        options={allIndianStates}
                                        onChange={(code, name) => {
                                            setSelectedStateCode(code);
                                            setFormData({ ...formData, state: name, city: "", district: "" });
                                        }}
                                        placeholder="Select State"
                                        hasSearch={true}
                                        searchPlaceholder="Type state name..."
                                    />
                                </div>

                                <div className="flow-input-group">
                                    <label>{t("districtCity")} *</label>
                                    {availableCityOptions.length > 0 ? (
                                        <CustomDonorSelect
                                            value={formData.city}
                                            options={availableCityOptions}
                                            onChange={(val) => setFormData({ ...formData, city: val, district: val })}
                                            placeholder="Select City"
                                            hasSearch={true}
                                            searchPlaceholder="Type city name..."
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={selectedStateCode ? "Type city name..." : "Select state first"}
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value, district: e.target.value })}
                                            required
                                        />
                                    )}
                                </div>
                            </div>

                            <span className="map-helper-label" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Interactive GPS Pin (Drag pin to exact house/hostel)</span>
                                <span style={{ color: "var(--eb-crimson)", fontWeight: "700" }}>Lat: {coords.lat}, Lng: {coords.lng}</span>
                            </span>

                            <div className="eb-donor-leaflet-container" style={{ position: "relative", height: "260px", width: "100%", overflow: "hidden", borderRadius: "14px" }}>
                                <div 
                                    ref={mapContainerRef} 
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </div>

                        {/* Section 4: Eligibility Check */}
                        <div className="eb-flow-card">
                            <h3 className="flow-card-num">{t("eligibilityCheck")} *</h3>

                            <div className="checklist-stack">
                                <label className="checkbox-pill-box">
                                    <input
                                        type="checkbox"
                                        checked={formData.noDoctorBan}
                                        onChange={(e) => setFormData({ ...formData, noDoctorBan: e.target.checked })}
                                    />
                                    <span>{t("noDoctorBan")}</span>
                                </label>

                                <label className="checkbox-pill-box">
                                    <input
                                        type="checkbox"
                                        checked={formData.noRegularMedicine}
                                        onChange={(e) => setFormData({ ...formData, noRegularMedicine: e.target.checked })}
                                    />
                                    <span>{t("noRegularMedicine")}</span>
                                </label>

                                <label className="checkbox-pill-box">
                                    <input
                                        type="checkbox"
                                        checked={formData.noSurgery12Months}
                                        onChange={(e) => setFormData({ ...formData, noSurgery12Months: e.target.checked })}
                                    />
                                    <span>{t("noSurgery12Months")}</span>
                                </label>
                            </div>
                        </div>

                        {/* Section 5: Availability & Consent */}
                        <div className="eb-flow-card">
                            <h3 className="flow-card-num">{t("availabilityConsent")} *</h3>
                            <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                                {t("preferredChannel")}
                            </label>

                            <div className="pill-choice-row" style={{ marginBottom: "20px" }}>
                                {["Call", "SMS", "WhatsApp"].map((ch) => (
                                    <button
                                        key={ch}
                                        type="button"
                                        className={`choice-pill ${formData.reachChannel === ch ? "selected" : ""}`}
                                        onClick={() => setFormData({ ...formData, reachChannel: ch })}
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>

                            <div className="slider-range-box">
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                                    <span>{t("matchMeWithin")}</span>
                                    <span style={{ color: "var(--eb-crimson)" }}>{formData.matchDistance} km</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={formData.matchDistance}
                                    onChange={(e) => setFormData({ ...formData, matchDistance: Number(e.target.value) })}
                                    className="eb-range-slider"
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                                    <span>5 km</span>
                                    <span>50 km</span>
                                </div>
                            </div>

                            <label className="checkbox-pill-box" style={{ marginTop: "18px" }}>
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                    required
                                />
                                <span>
                                    {t("agreeTerms")} *
                                </span>
                            </label>
                        </div>
                    </div>

                    <aside className="eb-donor-sidebar">
                        <div className="sidebar-sticky-box">
                            <h4>{isEditing ? t("saveAndUpdate") : t("confirmRegister")}</h4>
                            <ul className="submit-guidelines-list">
                                <li>• Age strictly between 18 and 45</li>
                                <li>• Weight must be at least 45 kg</li>
                                <li>• All fields marked * are required</li>
                                <li>• Active 10-digit mobile number</li>
                                <li>• Street address, landmark &amp; pincode</li>
                            </ul>

                            <button
                                type="submit"
                                className="eb-confirm-register-btn"
                            >
                                {isEditing ? t("saveAndUpdate") : t("confirmRegister")}
                            </button>

                            {!isEditing && (
                                <div className="already-reg-prompt">
                                    <button type="button" onClick={onGoToLogin}>{t("signIn")}</button>
                                </div>
                            )}
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
}