import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MapPin,
    Phone,
    PhoneOff,
    Navigation,
    ShieldCheck,
    Calendar,
    Heart,
    Activity,
    Check,
    ChevronDown,
    Loader2,
    Compass,
    Building2,
    Hash,
    MessageSquare,
    Smartphone,
    RotateCcw,
    X,
    Sliders,
    Award,
    Building,
    Tent,
    ArrowRight,
    Clock
} from "lucide-react";
import { State, City } from "country-state-city";
import { apiSearchDonors, apiGetBloodBanks, apiGetCamps } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/SearchDonorsPage.css";

// Geographic Coordinates for Radius & Distance Resolution
const KNOWN_COORDS = {
    "desh bhagat university": [30.6661, 76.3023],
    "desh bhagat": [30.6661, 76.3023],
    "dbu": [30.6661, 76.3023],
    "mandi gobindgarh": [30.6661, 76.3023],
    "sirhind": [30.6278, 76.3888],
    "fatehgarh sahib": [30.6435, 76.3983],
    "amloh": [30.6122, 76.2301],
    "khanna": [30.7070, 76.2160],
    "mohali": [30.7046, 76.7179],
    "sas nagar": [30.7046, 76.7179],
    "kharar": [30.7483, 76.6433],
    "chandigarh": [30.7333, 76.7794],
    "panchkula": [30.6942, 76.8534],
    "patiala": [30.3398, 76.3869],
    "nabha": [30.3742, 76.1517],
    "ludhiana": [30.9010, 75.8573],
    "jalandhar": [31.3260, 75.5762],
    "amritsar": [31.6340, 74.8723],
    "bathinda": [30.2110, 74.9455],
    "hoshiarpur": [31.5273, 75.9149]
};

const HOSPITAL_COORDS = {
    "Desh Bhagat University Blood Centre": [30.6661, 76.3023],
    "Civil Hospital Blood Centre Fatehgarh Sahib": [30.6278, 76.3888],
    "Civil Hospital Blood Centre Khanna": [30.7070, 76.2160],
    "Fortis Hospital Blood Bank Mohali": [30.6980, 76.7320],
    "Max Super Speciality Hospital Blood Bank": [30.7240, 76.7150],
    "Civil Hospital Blood Centre Mohali": [30.7200, 76.7130],
    "PGIMER Rotary Blood Bank Chandigarh": [30.7673, 76.7766],
    "GMCH Sector 32 Blood Centre": [30.7075, 76.7865],
    "GMSH Sector 16 Regional Blood Transfusion Centre": [30.7490, 76.7810],
    "Christian Medical College & Hospital Blood Bank": [30.9100, 75.8600],
    "Dayanand Medical College (DMCH) Blood Bank": [30.9010, 75.8573],
    "Civil Hospital Blood Centre Ludhiana": [30.9060, 75.8640],
    "Deepak Hospital Blood Centre": [30.8870, 75.8230],
    "Government Medical College & Rajindra Hospital": [30.3398, 76.3869],
    "Columbia Asia Hospital Blood Centre (Manipal)": [30.3470, 76.3750],
    "Civil Hospital Blood Centre Patiala": [30.3310, 76.3950],
    "Sri Guru Ram Das (SGRD) Charitable Hospital": [31.6100, 74.9200],
    "Government Medical College Blood Centre Amritsar": [31.6420, 74.8810],
    "Civil Hospital Blood Centre Jalandhar": [31.3260, 75.5762],
    "Tagore Hospital & Heart Care Centre Blood Bank": [31.3190, 75.5890],
    "Patel Hospital Blood Centre": [31.3120, 75.5810],
    "AIIMS Bathinda Blood Centre": [30.1980, 74.9320],
    "Civil Hospital Blood Centre Bathinda": [30.2110, 74.9455],
    "Civil Hospital Blood Centre Hoshiarpur": [31.5273, 75.9149],
    "Guru Gobind Singh Medical College & Hospital": [30.6769, 74.7583]
};

function getDistanceInKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

function resolveCoordinates(entity, nameKey = "name") {
    const name = entity[nameKey] || entity.title || "";
    if (HOSPITAL_COORDS[name]) return HOSPITAL_COORDS[name];

    if (entity.lat && entity.lng && Number.isFinite(Number(entity.lat)) && Number.isFinite(Number(entity.lng))) {
        return [Number(entity.lat), Number(entity.lng)];
    }

    const cityLower = (entity.city || "").toLowerCase().trim();
    if (cityLower && KNOWN_COORDS[cityLower]) return KNOWN_COORDS[cityLower];

    const distLower = (entity.district || "").toLowerCase().trim();
    if (distLower && KNOWN_COORDS[distLower]) return KNOWN_COORDS[distLower];

    const addressLower = (entity.address || entity.campAddress || "").toLowerCase();
    for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
        if (addressLower.includes(key)) return coords;
    }

    return [30.6661, 76.3023];
}

// Check if current time falls within donor's allowed call window
function checkCallAvailability(notifications) {
    if (!notifications || notifications.allowCall !== true) {
        return { isAllowed: false, reason: "Calls Restricted" };
    }

    const start = notifications.callStartTime || "09:00";
    const end = notifications.callEndTime || "20:00";

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startTotal = startH * 60 + (startM || 0);
    const endTotal = endH * 60 + (endM || 0);

    if (currentMins >= startTotal && currentMins <= endTotal) {
        return { isAllowed: true, hoursText: `${start} - ${end}` };
    }

    return { 
        isAllowed: false, 
        reason: `Calls Closed (${start} - ${end})`,
        hoursText: `${start} - ${end}`
    };
}

// Custom Search Dropdown Component
function CustomSearchSelect({
    value,
    options,
    onChange,
    placeholder = "Select Option",
    hasSearch = false,
    searchPlaceholder = "Search..."
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = hasSearch && searchTerm.trim() !== ""
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    const selectedOption = options.find((opt) => opt.val === value);

    return (
        <div className="eb-custom-search-select" ref={dropdownRef}>
            <button
                type="button"
                className={`eb-custom-search-trigger ${isOpen ? "open" : ""}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchTerm("");
                }}
            >
                <span className={`trigger-text ${!selectedOption?.val ? "muted" : ""}`}>
                    {selectedOption && selectedOption.val ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={15} className={`chevron-arrow ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-custom-search-menu">
                    {hasSearch && (
                        <div className="dropdown-search-wrap">
                            <input
                                type="text"
                                className="dropdown-search-input"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    <div className="dropdown-options-scroll">
                        {filteredOptions.length === 0 ? (
                            <div className="dropdown-empty-row">No options found</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.val || "all"}
                                    className={`eb-custom-search-item ${value === opt.val ? "active" : ""}`}
                                    onClick={() => {
                                        onChange(opt.val, opt.label);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    {value === opt.val && <Check size={14} className="check-indicator" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchDonorsPage({ initialQuery, onGoToHome }) {
    const { t } = useLanguage();

    const indianStates = State.getStatesOfCountry("IN");
    const [selectedStateCode, setSelectedStateCode] = useState("");
    const [selectedStateName, setSelectedStateName] = useState("");
    const [availableCities, setAvailableCities] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState(initialQuery?.bloodGroup || "");
    const [searchCity, setSearchCity] = useState(initialQuery?.city || "");
    const [searchPincode, setSearchPincode] = useState(initialQuery?.pincode || "");
    const [searchLandmark, setSearchLandmark] = useState(initialQuery?.landmark || "");
    const [searchRadius, setSearchRadius] = useState(100);
    const [userCoordinates, setUserCoordinates] = useState(null);

    const [hasSearched, setHasSearched] = useState(false);
    const [activeResultTab, setActiveResultTab] = useState("donors");
    const [donors, setDonors] = useState([]);
    const [banks, setBanks] = useState([]);
    const [camps, setCamps] = useState([]);

    const [isLocating, setIsLocating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDonorForModal, setSelectedDonorForModal] = useState(null);

    useEffect(() => {
        if (selectedStateCode) {
            const cities = City.getCitiesOfState("IN", selectedStateCode);
            setAvailableCities(cities);
        } else {
            setAvailableCities([]);
        }
    }, [selectedStateCode]);

    const stateDropdownOptions = [
        { label: "All States (India)", val: "" },
        ...indianStates.map((s) => ({ label: s.name, val: s.isoCode }))
    ];

    const bloodGroupOptions = [
        { label: "All Blood Groups", val: "" },
        { label: "A+", val: "A+" },
        { label: "A-", val: "A-" },
        { label: "B+", val: "B+" },
        { label: "B-", val: "B-" },
        { label: "AB+", val: "AB+" },
        { label: "AB-", val: "AB-" },
        { label: "O+", val: "O+" },
        { label: "O-", val: "O-" }
    ];

    const handleStateSelect = (code, name) => {
        setSelectedStateCode(code);
        setSelectedStateName(code ? name : "");
        setSearchCity("");
    };

    const resolveSearchOrigin = () => {
        if (userCoordinates && Array.isArray(userCoordinates)) {
            return userCoordinates;
        }

        const landmarkLower = searchLandmark.trim().toLowerCase();
        if (landmarkLower) {
            for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
                if (landmarkLower.includes(key)) return coords;
            }
        }

        const cityLower = searchCity.trim().toLowerCase();
        if (cityLower) {
            for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
                if (cityLower.includes(key)) return coords;
            }
        }

        if (searchPincode.trim() === "147301") {
            return [30.6661, 76.3023];
        }

        return [30.6661, 76.3023];
    };

    const performSearch = async () => {
        setIsLoading(true);
        setHasSearched(true);

        const cleanGroup = selectedGroup === "All Blood Groups" ? "" : selectedGroup;
        const cleanCity = searchCity.trim();
        const cleanState = selectedStateName.trim();
        const cleanLandmark = searchLandmark.trim();
        const cleanPincode = searchPincode.trim();

        const [originLat, originLng] = resolveSearchOrigin();

        try {
            const donorPayload = {
                bloodGroup: cleanGroup,
                state: cleanState,
                city: cleanCity,
                pincode: cleanPincode,
                landmark: cleanLandmark,
                radius: searchRadius,
                lat: originLat,
                lng: originLng
            };

            const [donorRes, bankRes, campRes] = await Promise.all([
                apiSearchDonors(donorPayload),
                apiGetBloodBanks({ state: cleanState, bloodGroup: cleanGroup }),
                apiGetCamps()
            ]);

            if (donorRes && donorRes.success && Array.isArray(donorRes.donors)) {
                setDonors(donorRes.donors);
            } else {
                setDonors([]);
            }

            if (bankRes && bankRes.success && Array.isArray(bankRes.banks)) {
                const processedBanks = bankRes.banks.map((bank) => {
                    const [bLat, bLng] = resolveCoordinates(bank, "name");
                    const distanceKm = getDistanceInKm(originLat, originLng, bLat, bLng);

                    let groupUnits = bank.unitsInStock !== undefined ? bank.unitsInStock : (bank.totalUnits || 0);
                    if (cleanGroup && bank.bloodStock && bank.bloodStock[cleanGroup] !== undefined) {
                        groupUnits = bank.bloodStock[cleanGroup];
                    }

                    return { ...bank, lat: bLat, lng: bLng, distanceKm, groupUnits };
                });

                const filteredBanks = processedBanks.filter((b) => {
                    if (cleanGroup && b.groupUnits <= 0) return false;
                    if (searchRadius < 100) return b.distanceKm <= searchRadius;
                    return true;
                });

                filteredBanks.sort((a, b) => a.distanceKm - b.distanceKm);
                setBanks(filteredBanks);
            } else {
                setBanks([]);
            }

            if (campRes && campRes.success && Array.isArray(campRes.camps)) {
                const processedCamps = campRes.camps.map((camp) => {
                    const [cLat, cLng] = resolveCoordinates(camp, "title");
                    const distanceKm = getDistanceInKm(originLat, originLng, cLat, cLng);
                    return { ...camp, lat: cLat, lng: cLng, distanceKm };
                });

                const filteredCamps = processedCamps.filter((c) => {
                    if (searchRadius < 100 && c.distanceKm > searchRadius) return false;
                    if (cleanCity) {
                        const locText = `${c.title} ${c.city || ""} ${c.district || ""} ${c.campAddress || ""}`.toLowerCase();
                        if (!locText.includes(cleanCity.toLowerCase())) {
                            if (c.distanceKm > (searchRadius < 100 ? searchRadius : 50)) return false;
                        }
                    }
                    return true;
                });

                filteredCamps.sort((a, b) => a.distanceKm - b.distanceKm);
                setCamps(filteredCamps);
            } else {
                setCamps([]);
            }

            if ((!donorRes?.donors || donorRes.donors.length === 0) && bankRes?.banks && bankRes.banks.length > 0) {
                setActiveResultTab("donors");
            }
        } catch (err) {
            console.error("Unified search execution error:", err);
            setDonors([]);
            setBanks([]);
            setCamps([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserCoordinates([latitude, longitude]);
                setIsLocating(false);
                performSearch();
            },
            () => {
                alert("Could not access live GPS. Please enter your city or PIN code manually.");
                setIsLocating(false);
            },
            { timeout: 8000 }
        );
    };

    const handleClearFilters = () => {
        setSelectedGroup("");
        setSelectedStateCode("");
        setSelectedStateName("");
        setSearchCity("");
        setSearchPincode("");
        setSearchLandmark("");
        setSearchRadius(50);
        setUserCoordinates(null);
        setHasSearched(false);
        setDonors([]);
        setBanks([]);
        setCamps([]);
        setActiveResultTab("donors");
    };

    const handleSendWhatsAppNotification = (donor) => {
        if (donor.notifications?.whatsapp === false) {
            alert("This donor has disabled WhatsApp emergency notifications.");
            return;
        }

        const cleanPhone = donor.phone ? donor.phone.replace(/[^0-9]/g, "") : "";
        if (!cleanPhone || cleanPhone.length < 10) {
            alert("This donor does not have an active phone number registered.");
            return;
        }

        const messageText = encodeURIComponent(
            `🚨 *URGENT BLOOD REQUIREMENT ALERT (E-Blood)*\n\nHello ${donor.name},\nWe found your voluntary donor profile on E-Blood. We have an urgent patient requirement for blood group *${donor.bloodGroup || "Emergency"}* near ${donor.city || donor.district || "your area"}.\n\nAre you available to donate? Please reply or call back as soon as possible.`
        );

        window.open(`https://wa.me/${cleanPhone.slice(-10)}?text=${messageText}`, "_blank");
    };

    const handleSendSmsNotification = (donor) => {
        if (donor.notifications?.sms === false) {
            alert("This donor has disabled SMS cellular alerts.");
            return;
        }

        const cleanPhone = donor.phone ? donor.phone.replace(/[^0-9]/g, "") : "";
        if (!cleanPhone || cleanPhone.length < 10) {
            alert("This donor does not have an active phone number registered.");
            return;
        }

        const messageBody = encodeURIComponent(
            `URGENT BLOOD ALERT: Hello ${donor.name}, urgent requirement for ${donor.bloodGroup || "blood"} near ${donor.city || donor.district || "your area"} on E-Blood network. Please reply if you are available to donate.`
        );

        window.location.href = `sms:${cleanPhone.slice(-10)}?body=${messageBody}`;
    };

    return (
        <div className="eb-search-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home") || "Home"}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">{t("findBloodNow") || "Find Blood Now"}</span>
                </nav>

                <div className="eb-search-page-header">
                    <h1 className="eb-search-page-title">{t("findBloodNow") || "Find Blood Now"}</h1>
                    <p className="eb-search-page-sub">
                        Search verified voluntary donors, hospital blood banks, and live donation drives across India.
                    </p>
                </div>

                {/* 2-Row Search Dock Card with Zero Defaults */}
                <div className="eb-search-dock-card">
                    {/* Row 1: Primary Dropdowns */}
                    <div className="eb-search-dock-row row-top">
                        <div className="eb-search-field-cell cell-blood">
                            <label>{t("filterByBloodGroup") || "Filter by Blood Group"}</label>
                            <CustomSearchSelect
                                value={selectedGroup}
                                options={bloodGroupOptions}
                                onChange={(val) => setSelectedGroup(val)}
                                placeholder="Select Blood Group"
                            />
                        </div>

                        {/* State Dropdown with Search */}
                        <div className="eb-search-field-cell">
                            <label>State</label>
                            <CustomSearchSelect
                                value={selectedStateCode}
                                options={stateDropdownOptions}
                                onChange={handleStateSelect}
                                placeholder="Select State"
                                hasSearch={true}
                                searchPlaceholder="Type to filter state..."
                            />
                        </div>

                        {/* City / District Input */}
                        <div className="eb-search-field-cell">
                            <label>City / District</label>
                            <div className="input-with-pin">
                                <MapPin size={16} />
                                <input
                                    type="text"
                                    list="indian-cities-list"
                                    placeholder="Type your city (e.g. Mandi Gobindgarh)..."
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && performSearch()}
                                />
                                <datalist id="indian-cities-list">
                                    <option value="Desh Bhagat University" />
                                    {availableCities.slice(0, 50).map((c) => (
                                        <option key={c.name} value={c.name} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Secondary Location + Range Slider + Actions */}
                    <div className="eb-search-dock-row row-bottom">
                        <div className="eb-search-field-cell cell-pin">
                            <label>PIN Code</label>
                            <div className="input-with-pin">
                                <Hash size={16} />
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter pin code"
                                    value={searchPincode}
                                    onChange={(e) => setSearchPincode(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && performSearch()}
                                />
                            </div>
                        </div>

                        <div className="eb-search-field-cell cell-landmark">
                            <label>Landmark / Hospital</label>
                            <div className="input-with-pin">
                                <Compass size={16} />
                                <input
                                    type="text"
                                    placeholder="e.g. Desh Bhagat University, Civil Hospital..."
                                    value={searchLandmark}
                                    onChange={(e) => setSearchLandmark(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && performSearch()}
                                />
                            </div>
                        </div>

                        {/* Match Distance Radius Slider */}
                        <div className="eb-search-field-cell cell-range-slider">
                            <div className="range-label-row">
                                <label className="range-title">
                                    <Sliders size={13} />
                                    <span>Match Within</span>
                                </label>
                                <span className="range-badge">
                                    {searchRadius >= 100 ? "100+ km (All)" : `${searchRadius} km`}
                                </span>
                            </div>
                            <div className="range-slider-wrapper">
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                                    className="eb-range-slider-input"
                                />
                                <div className="range-steps-marks">
                                    <span>5 km</span>
                                    <span>25 km</span>
                                    <span>50 km</span>
                                    <span>100+ km</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions: GPS, Reset, and Search */}
                        <div className="eb-search-dock-actions">
                            <button
                                type="button"
                                className="eb-btn-use-location"
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                                title="Auto-detect via GPS"
                            >
                                {isLocating ? <Loader2 size={15} className="spin-loader" /> : <Navigation size={15} />}
                                <span>{isLocating ? "Locating..." : "GPS"}</span>
                            </button>

                            <button
                                type="button"
                                className="eb-btn-clear-filters"
                                onClick={handleClearFilters}
                                title="Reset all search parameters"
                            >
                                <RotateCcw size={15} />
                                <span>Reset</span>
                            </button>

                            <button
                                type="button"
                                className="eb-btn-search-trigger"
                                onClick={performSearch}
                            >
                                <Search size={16} />
                                <span>{t("searchButton") || "Search"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Initial Placeholder Before First Search */}
                {!hasSearched && !isLoading && (
                    <div className="eb-search-initial-placeholder">
                        <div className="placeholder-icon-circle">
                            <Search size={32} />
                        </div>
                        <h3>Search Voluntary Donors, Blood Banks &amp; Drives</h3>
                        <p>
                            Select a blood group or enter your city / PIN code above and click <strong>Search</strong> to query live verified matches across the network.
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="eb-no-donors-box">
                        <Loader2 size={36} className="spin-loader" style={{ margin: "0 auto 10px", color: "#e11d48" }} />
                        <p>Scanning donors, hospital inventory, and donation camps...</p>
                    </div>
                )}

                {/* Results Section */}
                {hasSearched && !isLoading && (
                    <div className="eb-search-results-section animate-fade-in">
                        {/* Segmented Category Switcher */}
                        <div className="eb-results-tabs-wrapper">
                            <div className="eb-results-tabs-strip">
                                <button
                                    type="button"
                                    className={`result-tab-btn ${activeResultTab === "donors" ? "active" : ""}`}
                                    onClick={() => setActiveResultTab("donors")}
                                >
                                    <Heart size={15} />
                                    <span>Voluntary Donors ({donors.length})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`result-tab-btn ${activeResultTab === "banks" ? "active" : ""}`}
                                    onClick={() => setActiveResultTab("banks")}
                                >
                                    <Building size={15} />
                                    <span>Blood Banks ({banks.length})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`result-tab-btn ${activeResultTab === "camps" ? "active" : ""}`}
                                    onClick={() => setActiveResultTab("camps")}
                                >
                                    <Tent size={15} />
                                    <span>Donation Camps ({camps.length})</span>
                                </button>
                            </div>

                            <span className="eb-results-meta-counter">
                                Showing matches within {searchRadius >= 100 ? "all ranges" : `${searchRadius} km`}
                            </span>
                        </div>

                        {/* TAB 1: VOLUNTARY DONORS */}
                        {activeResultTab === "donors" && (
                            <div className="tab-pane-content">
                                {donors.length === 0 ? (
                                    <div className="eb-donor-not-found-fallback-card animate-fade-in">
                                        <div className="fallback-card-header">
                                            <div className="fallback-badge-icon">
                                                <Building2 size={24} color="#e11d48" />
                                            </div>
                                            <div>
                                                <h3>No Individual Donors Found Nearby</h3>
                                                <p>
                                                    {selectedGroup ? `Zero voluntary ${selectedGroup} donors are currently available within ${searchRadius} km. ` : "No individual donors match your current radius. "}
                                                    You can check registered <strong>Blood Banks &amp; Hospitals</strong> nearby that store blood units in stock!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fallback-card-actions">
                                            <button
                                                type="button"
                                                className="btn-fallback-action primary-red"
                                                onClick={() => setActiveResultTab("banks")}
                                            >
                                                <Building size={16} />
                                                <span>View Available Blood Banks ({banks.length} Found)</span>
                                                <ArrowRight size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-fallback-action secondary-outline"
                                                onClick={() => {
                                                    setSearchRadius(100);
                                                    performSearch();
                                                }}
                                            >
                                                Expand Radius to 100+ km
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="eb-donors-grid">
                                        {donors.map((donor) => {
                                            const cleanWeight = donor.weight
                                                ? (donor.weight.toLowerCase().includes("kg") ? donor.weight : `${donor.weight} kg`)
                                                : "Standard";

                                            // Determine live call availability status
                                            const callInfo = checkCallAvailability(donor.notifications);
                                            const isWhatsappEnabled = donor.notifications?.whatsapp !== false;
                                            const isSmsEnabled = donor.notifications?.sms !== false;

                                            return (
                                                <article key={donor._id || donor.id} className="eb-donor-card">
                                                    <div className="eb-card-top-row">
                                                        <div className="eb-donor-avatar-cluster">
                                                            <div className="eb-donor-avatar">
                                                                {(donor.name || "D").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h3 className="eb-donor-name">{donor.name}</h3>
                                                                <span className="eb-donor-verified-badge">
                                                                    <ShieldCheck size={13} /> Ready to Donate
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="eb-blood-group-badge">{donor.bloodGroup}</span>
                                                    </div>

                                                    <div className="eb-donor-details-list">
                                                        <div className="eb-detail-line">
                                                            <MapPin size={14} style={{ flexShrink: 0 }} />
                                                            <span>
                                                                {donor.city || donor.district || "Punjab"}, {donor.state || "India"}
                                                                {donor.pincode ? ` (${donor.pincode})` : ""}
                                                                {donor.distanceKm !== undefined && donor.distanceKm !== null && (
                                                                    <strong style={{ color: "#e11d48", marginLeft: "6px" }}>
                                                                        (~{donor.distanceKm} km)
                                                                    </strong>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {donor.landmark && (
                                                            <div className="eb-detail-line" style={{ fontSize: "11.5px", color: "#475569" }}>
                                                                <Compass size={14} style={{ flexShrink: 0 }} />
                                                                <span>Landmark: <strong>{donor.landmark}</strong></span>
                                                            </div>
                                                        )}

                                                        <div className="eb-detail-line">
                                                            <Calendar size={14} />
                                                            <span>Availability: <strong>Active &amp; Verified</strong></span>
                                                        </div>

                                                        <div className="eb-detail-line">
                                                            <Activity size={14} />
                                                            <span>Weight: <strong>{cleanWeight}</strong></span>
                                                        </div>

                                                        {/* Call Timer Window Display */}
                                                        {donor.notifications?.allowCall && (
                                                            <div className="eb-detail-line" style={{ color: "#0369a1", fontSize: "11.5px" }}>
                                                                <Clock size={13} />
                                                                <span>Calling Hours: <strong>{donor.notifications?.callStartTime || "09:00"} - {donor.notifications?.callEndTime || "20:00"}</strong></span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Alert Action Buttons Enforcing Donor Permissions */}
                                                    <div className="eb-donor-alert-actions">
                                                        {isWhatsappEnabled ? (
                                                            <button
                                                                type="button"
                                                                className="eb-btn-alert-whatsapp"
                                                                onClick={() => handleSendWhatsAppNotification(donor)}
                                                                title="Send WhatsApp Emergency Alert"
                                                            >
                                                                <MessageSquare size={14} />
                                                                <span>WhatsApp Alert</span>
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className="eb-btn-alert-whatsapp disabled"
                                                                title="Donor has disabled WhatsApp alerts"
                                                            >
                                                                <MessageSquare size={14} />
                                                                <span>WhatsApp Off</span>
                                                            </span>
                                                        )}

                                                        {isSmsEnabled ? (
                                                            <button
                                                                type="button"
                                                                className="eb-btn-alert-sms"
                                                                onClick={() => handleSendSmsNotification(donor)}
                                                                title="Send Cellular SMS Alert"
                                                            >
                                                                <Smartphone size={14} />
                                                                <span>SMS Alert</span>
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className="eb-btn-alert-sms disabled"
                                                                title="Donor has disabled SMS alerts"
                                                            >
                                                                <Smartphone size={14} />
                                                                <span>SMS Off</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Call Button Enforcing allowCall and Timer Window */}
                                                    <div className="eb-donor-card-actions">
                                                        {donor.phone && callInfo.isAllowed ? (
                                                            <a
                                                                href={`tel:${donor.phone.replace(/\s+/g, "")}`}
                                                                className="eb-btn-call-donor"
                                                                title={`Calls open: ${callInfo.hoursText}`}
                                                            >
                                                                <Phone size={14} />
                                                                <span>Call Donor</span>
                                                            </a>
                                                        ) : (
                                                            <span
                                                                className="eb-btn-call-donor disabled"
                                                                title={!donor.phone ? "Phone unavailable" : callInfo.reason}
                                                            >
                                                                <PhoneOff size={14} />
                                                                <span>{callInfo.reason || "Call Unavailable"}</span>
                                                            </span>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="eb-btn-see-details"
                                                            onClick={() => setSelectedDonorForModal(donor)}
                                                        >
                                                            See Details
                                                        </button>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: BLOOD BANKS */}
                        {activeResultTab === "banks" && (
                            <div className="tab-pane-content">
                                {banks.length === 0 ? (
                                    <div className="eb-no-donors-box">
                                        <Building2 size={40} color="#e11d48" style={{ margin: "0 auto 10px" }} />
                                        <h3>No Blood Banks Match Your Criteria</h3>
                                        <p>Try expanding the radius slider or clearing the blood group filter.</p>
                                    </div>
                                ) : (
                                    <div className="eb-banks-cards-deck">
                                        {banks.map((bank) => {
                                            const units = selectedGroup && bank.groupUnits !== undefined
                                                ? bank.groupUnits
                                                : (bank.unitsInStock !== undefined ? bank.unitsInStock : (bank.totalUnits || 0));

                                            return (
                                                <div key={bank._id || bank.id} className="eb-bank-search-card">
                                                    <div className="bank-search-card-top">
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "6px" }}>
                                                            <h4>{bank.name}</h4>
                                                            <span className={`units-badge ${units < 20 ? "low" : ""}`}>
                                                                {selectedGroup ? `${selectedGroup}: ` : ""}{units} Units in Stock
                                                            </span>
                                                        </div>
                                                        <span className="bank-card-address">
                                                            <MapPin size={13} color="#e11d48" style={{ flexShrink: 0 }} />
                                                            <span>
                                                                {bank.address ? `${bank.address}, ` : ""}{bank.district || bank.city}, {bank.state}
                                                                {bank.distanceKm !== undefined && (
                                                                    <strong style={{ color: "#e11d48", marginLeft: "6px" }}>
                                                                        (~{bank.distanceKm} km away)
                                                                    </strong>
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="bank-search-card-actions">
                                                        {bank.phone ? (
                                                            <a href={`tel:${bank.phone.replace(/\s+/g, "")}`} className="btn-call-bank-solid">
                                                                <Phone size={14} />
                                                                <span>Call {bank.phone}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="btn-call-bank-solid disabled">Phone Unavailable</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: BLOOD CAMPS */}
                        {activeResultTab === "camps" && (
                            <div className="tab-pane-content">
                                {camps.length === 0 ? (
                                    <div className="eb-no-donors-box">
                                        <Tent size={40} color="#e11d48" style={{ margin: "0 auto 10px" }} />
                                        <h3>No Scheduled Blood Camps Within {searchRadius} km</h3>
                                        <p>No active donation drives found within this radius. Try expanding the slider to 100+ km.</p>
                                    </div>
                                ) : (
                                    <div className="eb-camps-cards-deck">
                                        {camps.map((camp) => (
                                            <div key={camp._id || camp.id} className="eb-camp-search-card">
                                                <div className="camp-header-badge-row">
                                                    <span className="camp-state-pill">{camp.district || camp.city || "Punjab"}</span>
                                                    <span className="camp-active-dot">● Active Drive</span>
                                                </div>
                                                <h4>{camp.title}</h4>
                                                <div className="camp-specs-stack">
                                                    <div className="camp-spec-row">
                                                        <MapPin size={13} color="#e11d48" style={{ flexShrink: 0 }} />
                                                        <span>
                                                            {camp.campAddress || `${camp.city || ""}, ${camp.district || ""}`}
                                                            {camp.distanceKm !== undefined && (
                                                                <strong style={{ color: "#e11d48", marginLeft: "6px" }}>
                                                                    (~{camp.distanceKm} km away)
                                                                </strong>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="camp-spec-row">
                                                        <Calendar size={13} color="#0284c7" style={{ flexShrink: 0 }} />
                                                        <span>Date: <strong>{camp.campDate}</strong> ({camp.startTime || "09:00"} - {camp.endTime || "17:00"})</span>
                                                    </div>
                                                </div>
                                                {camp.contactNumber && (
                                                    <a href={`tel:${camp.contactNumber.replace(/\s+/g, "")}`} className="btn-call-camp-solid">
                                                        <Phone size={13} />
                                                        <span>Call Organiser: {camp.contactNumber}</span>
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Detail Popup with Enforced Call Hours & Permissions */}
            {selectedDonorForModal && (() => {
                const modalCallInfo = checkCallAvailability(selectedDonorForModal.notifications);
                const isModalWhatsapp = selectedDonorForModal.notifications?.whatsapp !== false;
                const isModalSms = selectedDonorForModal.notifications?.sms !== false;

                return (
                    <div
                        className="eb-modal-backdrop"
                        onClick={() => setSelectedDonorForModal(null)}
                    >
                        <div
                            className="eb-donor-detail-modal-card"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="eb-donor-modal-header">
                                <div className="eb-modal-profile-strip">
                                    <div className="eb-modal-avatar">
                                        {(selectedDonorForModal.name || "D").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="eb-modal-name-cluster">
                                        <h3>{selectedDonorForModal.name}</h3>
                                        <div className="eb-modal-status-badge">
                                            <ShieldCheck size={13} />
                                            <span>Verified Voluntary Donor</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="eb-modal-top-right">
                                    <div className="eb-modal-blood-badge">
                                        {selectedDonorForModal.bloodGroup}
                                    </div>
                                    <button
                                        type="button"
                                        className="eb-modal-close-btn"
                                        onClick={() => setSelectedDonorForModal(null)}
                                        title="Close Modal"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="eb-donor-modal-body">
                                <div className="eb-modal-section">
                                    <span className="eb-modal-section-title">
                                        <MapPin size={14} />
                                        <span>REGISTERED LOCATION &amp; ADDRESS</span>
                                    </span>
                                    <div className="eb-modal-info-box">
                                        <strong className="eb-modal-address">
                                            {selectedDonorForModal.address || "Address available on direct verification"}
                                        </strong>
                                        <span className="eb-modal-subaddress">
                                            {selectedDonorForModal.landmark ? `Landmark: ${selectedDonorForModal.landmark} · ` : ""}
                                            {selectedDonorForModal.city || selectedDonorForModal.district}, {selectedDonorForModal.state || "Punjab"}
                                            {selectedDonorForModal.pincode ? ` - ${selectedDonorForModal.pincode}` : ""}
                                        </span>
                                        {selectedDonorForModal.distanceKm !== undefined && selectedDonorForModal.distanceKm !== null && (
                                            <span className="eb-modal-distance-pill">
                                                Approx. {selectedDonorForModal.distanceKm} km from search location
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="eb-modal-section">
                                    <span className="eb-modal-section-title">
                                        <Award size={14} />
                                        <span>VOLUNTARY ELIGIBILITY STATUS</span>
                                    </span>
                                    <div className="eb-modal-attributes-grid">
                                        <div className="eb-attr-chip">
                                            <small>Weight</small>
                                            <strong>
                                                {selectedDonorForModal.weight?.toLowerCase().includes("kg")
                                                    ? selectedDonorForModal.weight
                                                    : `${selectedDonorForModal.weight || "Standard"} kg`}
                                            </strong>
                                        </div>
                                        <div className="eb-attr-chip">
                                            <small>Calling Hours</small>
                                            <strong>
                                                {selectedDonorForModal.notifications?.allowCall 
                                                    ? `${selectedDonorForModal.notifications?.callStartTime || "09:00"} - ${selectedDonorForModal.notifications?.callEndTime || "20:00"}`
                                                    : "Private"}
                                            </strong>
                                        </div>
                                        <div className="eb-attr-chip">
                                            <small>Consent Type</small>
                                            <strong>100% Voluntary</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="eb-modal-section">
                                    <span className="eb-modal-section-title">
                                        <MessageSquare size={14} />
                                        <span>SEND INSTANT EMERGENCY NOTIFICATION</span>
                                    </span>
                                    <div className="eb-modal-dispatch-row">
                                        {isModalWhatsapp ? (
                                            <button
                                                type="button"
                                                className="eb-modal-btn-whatsapp"
                                                onClick={() => handleSendWhatsAppNotification(selectedDonorForModal)}
                                            >
                                                <MessageSquare size={16} />
                                                <span>Notify via WhatsApp</span>
                                            </button>
                                        ) : (
                                            <span className="eb-modal-btn-whatsapp disabled">
                                                <MessageSquare size={16} />
                                                <span>WhatsApp Disabled</span>
                                            </span>
                                        )}

                                        {isModalSms ? (
                                            <button
                                                type="button"
                                                className="eb-modal-btn-sms"
                                                onClick={() => handleSendSmsNotification(selectedDonorForModal)}
                                            >
                                                <Smartphone size={16} />
                                                <span>Notify via SMS</span>
                                            </button>
                                        ) : (
                                            <span className="eb-modal-btn-sms disabled">
                                                <Smartphone size={16} />
                                                <span>SMS Disabled</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="eb-modal-actions">
                                    {selectedDonorForModal.phone && modalCallInfo.isAllowed ? (
                                        <a
                                            href={`tel:${selectedDonorForModal.phone.replace(/\s+/g, "")}`}
                                            className="eb-modal-btn-call"
                                        >
                                            <Phone size={17} />
                                            <span>Call {selectedDonorForModal.phone}</span>
                                        </a>
                                    ) : (
                                        <button type="button" className="eb-modal-btn-call disabled" disabled>
                                            <PhoneOff size={17} />
                                            <span>{modalCallInfo.reason || "Phone Calls Restricted by Donor"}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}