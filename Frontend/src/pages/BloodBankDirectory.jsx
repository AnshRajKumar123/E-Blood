import React, { useState, useRef, useEffect } from "react";
import { 
    MapPin, 
    Phone, 
    Share2, 
    Search, 
    Radio, 
    ChevronDown, 
    Check, 
    Navigation, 
    Building2, 
    Loader2, 
    RotateCcw 
} from "lucide-react";
import { apiGetBloodBanks } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/BloodBankDirectory.css";

// Precise coordinates for districts and cities
const CITY_COORDS = {
    "Mandi Gobindgarh": [30.6661, 76.3023],
    "Fatehgarh Sahib": [30.6435, 76.3983],
    "Sirhind": [30.6278, 76.3888],
    "Amloh": [30.6122, 76.2301],
    "Mohali": [30.7046, 76.7179],
    "SAS Nagar": [30.7046, 76.7179],
    "Kharar": [30.7483, 76.6433],
    "Chandigarh": [30.7333, 76.7794],
    "Panchkula": [30.6942, 76.8534],
    "Ludhiana": [30.9010, 75.8573],
    "Khanna": [30.7070, 76.2160],
    "Patiala": [30.3398, 76.3869],
    "Nabha": [30.3742, 76.1517],
    "Amritsar": [31.6340, 74.8723],
    "Jalandhar": [31.3260, 75.5762],
    "Bathinda": [30.2110, 74.9455],
    "Hoshiarpur": [31.5273, 75.9149],
    "Faridkot": [30.6769, 74.7583],
    "Ambala": [30.3782, 76.7767],
    "Delhi": [28.6139, 77.2090]
};

const HOSPITAL_SPECIFIC_COORDS = {
    "Desh Bhagat University Blood Centre": [30.6661, 76.3023],
    "Civil Hospital Blood Centre Fatehgarh Sahib": [30.6278, 76.3888],
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
    "Civil Hospital Blood Centre Khanna": [30.7070, 76.2160],
    "Civil Hospital Blood Centre Hoshiarpur": [31.5273, 75.9149],
    "Guru Gobind Singh Medical College & Hospital": [30.6769, 74.7583]
};

function getDistanceInKm(lat1, lon1, lat2, lon2) {
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

function resolveCoordinatesForBank(bank) {
    if (HOSPITAL_SPECIFIC_COORDS[bank.name]) {
        return HOSPITAL_SPECIFIC_COORDS[bank.name];
    }
    if (bank.lat && bank.lng && Number.isFinite(Number(bank.lat)) && Number.isFinite(Number(bank.lng))) {
        return [Number(bank.lat), Number(bank.lng)];
    }
    if (bank.city && CITY_COORDS[bank.city]) {
        return CITY_COORDS[bank.city];
    }
    if (bank.district && CITY_COORDS[bank.district]) {
        return CITY_COORDS[bank.district];
    }
    return [30.7046, 76.7179];
}

function CustomDirectoryDropdown({ value, options, onChange, placeholder }) {
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
        <div className="eb-custom-select-container" ref={dropdownRef}>
            <button
                type="button"
                className={`eb-custom-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="selected-val">{selected.label}</span>
                <ChevronDown size={15} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-custom-dropdown-menu">
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

export default function BloodBankDirectory({ onGoToHome, onGoToSearch }) {
    const { t } = useLanguage();
    const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [hospitalFilter, setHospitalFilter] = useState("");
    const [selectedRadius, setSelectedRadius] = useState(50);
    const [userCoords, setUserCoords] = useState([30.6435, 76.3983]); // Fatehgarh Sahib / Tri-City Origin
    const [hoveredBankId, setHoveredBankId] = useState(null);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [locationLabel, setLocationLabel] = useState("Fatehgarh Sahib Area");
    const [allBanks, setAllBanks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const userLocationMarkerRef = useRef(null);

    const bloodGroupOptions = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    const stateOptions = [
        { label: "All States", val: "" },
        { label: "Punjab", val: "Punjab" },
        { label: "Chandigarh", val: "Chandigarh" },
        { label: "Haryana", val: "Haryana" },
        { label: "Delhi", val: "Delhi" }
    ];

    const districtOptions = [
        { label: "All Districts", val: "" },
        { label: "Fatehgarh Sahib", val: "Fatehgarh Sahib" },
        { label: "Patiala", val: "Patiala" },
        { label: "Ludhiana", val: "Ludhiana" },
        { label: "SAS Nagar (Mohali)", val: "SAS Nagar" },
        { label: "Chandigarh", val: "Chandigarh" },
        { label: "Amritsar", val: "Amritsar" },
        { label: "Jalandhar", val: "Jalandhar" },
        { label: "Bathinda", val: "Bathinda" }
    ];

    // Fetch and resolve accurate bank coordinates
    const fetchBanks = async () => {
        setIsLoading(true);
        try {
            // Encode blood group safely (e.g. O+ to O%2B)
            const cleanBgParam = selectedBloodGroup ? encodeURIComponent(selectedBloodGroup) : "";
            const data = await apiGetBloodBanks({
                state: selectedState,
                district: selectedDistrict,
                bloodGroup: cleanBgParam,
                search: hospitalFilter
            });

            if (data && data.success && Array.isArray(data.banks)) {
                const banksWithDistance = data.banks.map((bank) => {
                    const [bLat, bLng] = resolveCoordinatesForBank(bank);
                    const distanceKm = getDistanceInKm(userCoords[0], userCoords[1], bLat, bLng);
                    
                    // Compute specific unit count for the active blood group if available
                    let unitsForSelectedGroup = bank.unitsInStock || 0;
                    if (selectedBloodGroup && bank.bloodStock && bank.bloodStock[selectedBloodGroup] !== undefined) {
                        unitsForSelectedGroup = bank.bloodStock[selectedBloodGroup];
                    }

                    return { 
                        ...bank, 
                        lat: bLat, 
                        lng: bLng, 
                        distanceKm,
                        groupUnits: unitsForSelectedGroup
                    };
                });

                banksWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
                setAllBanks(banksWithDistance);
            } else {
                setAllBanks([]);
            }
        } catch (err) {
            console.error("Error fetching banks:", err);
            setAllBanks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, [selectedState, selectedDistrict, selectedBloodGroup, hospitalFilter, userCoords]);

    // Robust client-side filtering: ensures units are actually in stock for the selected group
    const filteredBanks = allBanks.filter((bank) => {
        // 1. Radius Check
        if (selectedRadius > 0 && bank.distanceKm !== undefined) {
            if (bank.distanceKm > selectedRadius) return false;
        }

        // 2. Blood Group In-Stock Check
        if (selectedBloodGroup && bank.bloodStock) {
            const stockForGroup = bank.bloodStock[selectedBloodGroup];
            if (stockForGroup !== undefined) {
                return stockForGroup > 0;
            }
        }

        return true;
    });

    // 1. Initialize Leaflet Map
    useEffect(() => {
        let isCancelled = false;

        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        const startMap = () => {
            if (isCancelled || !mapContainerRef.current) return;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            if (mapContainerRef.current._leaflet_id) {
                mapContainerRef.current._leaflet_id = null;
            }

            const map = window.L.map(mapContainerRef.current, {
                center: userCoords,
                zoom: 10,
                zoomControl: true,
                preferCanvas: true
            });

            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            map.whenReady(() => {
                if (isCancelled) return;
                map.invalidateSize();
                mapInstanceRef.current = map;
                setMapReady(true);
            });
        };

        if (!window.L) {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = startMap;
            document.body.appendChild(script);
        } else {
            const timer = setTimeout(startMap, 80);
            return () => clearTimeout(timer);
        }

        return () => {
            isCancelled = true;
            setMapReady(false);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 2. Pan to district selection
    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;
        if (selectedDistrict && CITY_COORDS[selectedDistrict]) {
            const coords = CITY_COORDS[selectedDistrict];
            setUserCoords(coords);
            mapInstanceRef.current.panTo(coords);
        }
    }, [selectedDistrict, mapReady]);

    // 3. Render Custom SVG Pins and Crash-Proof Camera Zoom
    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current || !window.L) return;
        const map = mapInstanceRef.current;

        // Clear existing markers safely
        Object.values(markersRef.current).forEach((m) => {
            try { m.remove(); } catch (err) {}
        });
        markersRef.current = {};

        if (userLocationMarkerRef.current) {
            try { userLocationMarkerRef.current.remove(); } catch (err) {}
            userLocationMarkerRef.current = null;
        }

        // Render User Location Radar Beacon
        const userBeaconIcon = window.L.divIcon({
            className: "eb-custom-leaflet-container",
            html: `
                <div class="eb-user-beacon-pin">
                    <div class="beacon-pulse-wave"></div>
                    <div class="beacon-core-dot"></div>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        userLocationMarkerRef.current = window.L.marker(userCoords, { icon: userBeaconIcon })
            .addTo(map)
            .bindPopup(`<b style="font-size:12.5px;">Search Origin</b><br><span style="font-size:11px; color:#64748b;">${locationLabel}</span>`);

        // Render Blood Bank Teardrop SVG Pins
        filteredBanks.forEach((bank) => {
            const lat = Number(bank.lat);
            const lng = Number(bank.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            const unitsCount = selectedBloodGroup && bank.bloodStock && bank.bloodStock[selectedBloodGroup] !== undefined
                ? bank.bloodStock[selectedBloodGroup]
                : (bank.unitsInStock !== undefined ? bank.unitsInStock : (bank.totalUnits || 0));

            const isLowStock = unitsCount < 15;

            const customMarkerIcon = window.L.divIcon({
                className: "eb-custom-leaflet-container",
                html: `
                    <div class="eb-blood-svg-marker ${isLowStock ? 'low-stock' : 'good-stock'}">
                        <div class="marker-pin-bubble">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="#ffffff">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                            </svg>
                        </div>
                        <div class="marker-pin-tip"></div>
                    </div>
                `,
                iconSize: [34, 44],
                iconAnchor: [17, 44],
                popupAnchor: [0, -42]
            });

            const marker = window.L.marker([lat, lng], { icon: customMarkerIcon }).addTo(map);

            marker.bindPopup(`
                <div class="eb-map-card-popup">
                    <strong class="popup-title">${bank.name}</strong>
                    <span class="popup-units-badge ${isLowStock ? 'low' : ''}">
                        ${selectedBloodGroup ? `${selectedBloodGroup}: ` : ""}${unitsCount} Units in Stock
                    </span>
                    <span class="popup-address">
                        ${bank.city || bank.district || "Punjab"} (${bank.distanceKm !== undefined ? `${bank.distanceKm} km away` : "Nearby"})
                    </span>
                    ${bank.phone ? `<a href="tel:${bank.phone.replace(/\\s+/g, "")}" class="popup-call-link">Call: ${bank.phone}</a>` : ""}
                </div>
            `);

            markersRef.current[bank._id || bank.id || bank.name] = marker;
        });

        // Safe Map Camera Adjustment
        try {
            if (selectedRadius === 25) {
                map.flyTo(userCoords, 11, { duration: 0.6 });
            } else if (selectedRadius === 50) {
                map.flyTo(userCoords, 10, { duration: 0.6 });
            } else if (selectedRadius === 100) {
                map.flyTo(userCoords, 9, { duration: 0.6 });
            } else {
                const validPoints = filteredBanks
                    .map((b) => [Number(b.lat), Number(b.lng)])
                    .filter((pt) => Number.isFinite(pt[0]) && Number.isFinite(pt[1]));

                if (validPoints.length > 1) {
                    const lats = validPoints.map((p) => p[0]);
                    const lngs = validPoints.map((p) => p[1]);
                    const minLat = Math.min(...lats);
                    const maxLat = Math.max(...lats);
                    const minLng = Math.min(...lngs);
                    const maxLng = Math.max(...lngs);

                    if (maxLat - minLat > 0.01 && maxLng - minLng > 0.01) {
                        map.flyToBounds([[minLat, minLng], [maxLat, maxLng]], {
                            padding: [40, 40],
                            maxZoom: 12,
                            duration: 0.8
                        });
                    } else {
                        map.flyTo([minLat, minLng], 11, { duration: 0.6 });
                    }
                } else if (validPoints.length === 1) {
                    map.flyTo(validPoints[0], 11, { duration: 0.6 });
                } else {
                    map.flyTo(userCoords, 9, { duration: 0.6 });
                }
            }
        } catch (zoomErr) {
            map.flyTo(userCoords, 9, { duration: 0.5 });
        }
    }, [filteredBanks, selectedRadius, userCoords, mapReady, selectedBloodGroup]);

    const handleFocusBankOnMap = (bank) => {
        const id = bank._id || bank.id || bank.name;
        setHoveredBankId(id);
        const map = mapInstanceRef.current;
        const marker = markersRef.current[id];
        if (map && marker) {
            const [bLat, bLng] = resolveCoordinatesForBank(bank);
            map.flyTo([bLat, bLng], 13, { duration: 0.8 });
            marker.openPopup();
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Please select your district from the dropdown.");
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserCoords([latitude, longitude]);
                setLocationLabel(`Near You (${latitude.toFixed(2)}°N)`);
                setIsDetectingLocation(false);
            },
            () => {
                setUserCoords([30.6435, 76.3983]);
                setLocationLabel("Fatehgarh Sahib Area");
                setIsDetectingLocation(false);
            },
            { timeout: 7000 }
        );
    };

    const handleClearFilters = () => {
        setSelectedDistrict("");
        setSelectedState("");
        setHospitalFilter("");
        setSelectedBloodGroup("");
        setSelectedRadius(0);
    };

    return (
        <div className="eb-directory-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home") || "Home"}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">Blood Bank Directory</span>
                </nav>

                <div className="eb-directory-header">
                    <h1 className="eb-directory-title">Find Nearby Verified Blood Banks</h1>
                    <p className="eb-directory-sub">
                        Search live component inventory across government and licensed hospital blood centres within your radius.
                    </p>
                </div>

                {/* Filter Section */}
                <section className="eb-directory-filter-section">
                    <div className="filter-label-row">
                        <label>Filter by Blood Group Required</label>
                        {selectedBloodGroup && (
                            <span className="not-sure-link" onClick={() => setSelectedBloodGroup("")}>
                                Clear Filter ({selectedBloodGroup})
                            </span>
                        )}
                    </div>

                    <div className="eb-bg-pill-row">
                        {bloodGroupOptions.map((bg) => (
                            <button
                                key={bg}
                                type="button"
                                className={`eb-bg-select-btn ${selectedBloodGroup === bg ? "active" : ""}`}
                                onClick={() => {
                                    const nextBg = bg === selectedBloodGroup ? "" : bg;
                                    setSelectedBloodGroup(nextBg);
                                    // If at 25km radius and user clicks a rare blood group, expand to 50km or 100km to show available centres
                                    if (nextBg && selectedRadius === 25) {
                                        setSelectedRadius(50);
                                    }
                                }}
                            >
                                {bg}
                            </button>
                        ))}
                    </div>

                    <div className="eb-directory-location-row">
                        <div className="eb-filter-field">
                            <CustomDirectoryDropdown
                                value={selectedState}
                                options={stateOptions}
                                onChange={(val) => {
                                    setSelectedState(val);
                                    setSelectedDistrict("");
                                }}
                                placeholder="State"
                            />
                        </div>

                        <div className="eb-filter-field">
                            <CustomDirectoryDropdown
                                value={selectedDistrict}
                                options={districtOptions}
                                onChange={(val) => setSelectedDistrict(val)}
                                placeholder="District / City"
                            />
                        </div>

                        <div className="hospital-search-field">
                            <Search size={15} className="search-ico" />
                            <input
                                type="text"
                                placeholder="Search by hospital name or area..."
                                value={hospitalFilter}
                                onChange={(e) => setHospitalFilter(e.target.value)}
                            />
                        </div>

                        <div 
                            className="eb-loc-detected-pill" 
                            onClick={handleDetectLocation}
                            title="Click to detect current location"
                        >
                            {isDetectingLocation ? (
                                <Loader2 size={14} className="spin-loader" />
                            ) : (
                                <Navigation size={14} color="#e11d48" />
                            )}
                            <span>{locationLabel}</span>
                        </div>
                    </div>
                </section>

                {/* Split Layout: Directory Cards Left, Map Right */}
                <div className="eb-directory-split-layout">
                    <div className="eb-directory-list-col">
                        <div className="eb-radius-selector-bar">
                            <span className="radius-label">Search Radius:</span>
                            {[25, 50, 100].map((radius) => (
                                <button
                                    key={radius}
                                    type="button"
                                    className={`eb-radius-chip ${selectedRadius === radius ? "active" : ""}`}
                                    onClick={() => setSelectedRadius(radius)}
                                >
                                    {radius} km
                                </button>
                            ))}
                            <button
                                type="button"
                                className={`eb-radius-chip ${selectedRadius === 0 ? "active" : ""}`}
                                onClick={() => setSelectedRadius(0)}
                            >
                                100+ km (All)
                            </button>
                        </div>

                        <div className="eb-banks-counter-text">
                            <strong>{filteredBanks.length}</strong> Licensed Blood Bank(s) {selectedBloodGroup ? `with ${selectedBloodGroup} stock ` : ""}within {selectedRadius === 0 ? "all regions" : `${selectedRadius} km`}
                        </div>

                        <div className="eb-bank-cards-stack">
                            {isLoading ? (
                                <div className="eb-no-donors-box" style={{ padding: "40px 20px" }}>
                                    <Loader2 size={30} className="spin-loader" style={{ margin: "0 auto 8px", color: "#e11d48" }} />
                                    <p style={{ fontSize: "13px", color: "#64748b" }}>Loading blood bank records...</p>
                                </div>
                            ) : filteredBanks.length === 0 ? (
                                <div className="eb-no-donors-box" style={{ padding: "40px 20px" }}>
                                    <Building2 size={36} color="#e11d48" style={{ margin: "0 auto 8px" }} />
                                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                                        No Blood Banks Found within {selectedRadius} km
                                    </h4>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "6px 0 14px" }}>
                                        {selectedBloodGroup ? `No nearby centre has ${selectedBloodGroup} in stock within ${selectedRadius} km. ` : ""}
                                        Try expanding your radius to <strong>50 km</strong>, <strong>100 km</strong>, or resetting filters.
                                    </p>
                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                                        <button 
                                            type="button" 
                                            className="eb-pill-btn eb-pill-btn-primary"
                                            onClick={() => setSelectedRadius(100)}
                                            style={{ fontSize: "12px", padding: "8px 14px" }}
                                        >
                                            Expand to 100 km
                                        </button>
                                        <button 
                                            type="button" 
                                            className="eb-pill-btn eb-pill-btn-outline"
                                            onClick={handleClearFilters}
                                            style={{ fontSize: "12px", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                        >
                                            <RotateCcw size={13} /> Reset Filters
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                filteredBanks.map((bank) => {
                                    const totalUnits = selectedBloodGroup && bank.bloodStock && bank.bloodStock[selectedBloodGroup] !== undefined
                                        ? bank.bloodStock[selectedBloodGroup]
                                        : (bank.unitsInStock !== undefined ? bank.unitsInStock : (bank.totalUnits || 0));

                                    return (
                                        <div
                                            key={bank._id || bank.id || bank.name}
                                            className={`eb-bank-item-card ${hoveredBankId === (bank._id || bank.id || bank.name) ? "highlighted" : ""}`}
                                            onClick={() => handleFocusBankOnMap(bank)}
                                        >
                                            <div className="eb-bank-card-header">
                                                <h4>{bank.name}</h4>
                                                <span className={`eb-units-badge ${totalUnits < 15 ? "low" : ""}`}>
                                                    {selectedBloodGroup ? `${selectedBloodGroup}: ` : ""}{totalUnits} Units
                                                </span>
                                            </div>

                                            <p className="eb-bank-subtext">
                                                {bank.address ? `${bank.address}, ` : ""}{bank.district || bank.city}, {bank.state}
                                                <strong style={{ color: "#e11d48", marginLeft: "6px" }}>
                                                    {bank.distanceKm !== undefined ? `(~${bank.distanceKm} km away)` : ""}
                                                </strong>
                                            </p>

                                            <div className="eb-bank-action-row">
                                                <button 
                                                    type="button" 
                                                    className="btn-icon-sq" 
                                                    title="Share contact"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard?.writeText(`${bank.name} - Phone: ${bank.phone}`);
                                                        alert(`Copied details for ${bank.name}!`);
                                                    }}
                                                >
                                                    <Share2 size={15} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn-icon-sq" 
                                                    title="Focus on map"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFocusBankOnMap(bank);
                                                    }}
                                                >
                                                    <MapPin size={15} />
                                                </button>
                                                {bank.phone ? (
                                                    <a 
                                                        href={`tel:${bank.phone.replace(/\s+/g, "")}`} 
                                                        className="btn-bank-call"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Phone size={14} />
                                                        <span>Call {bank.phone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="btn-bank-call" style={{ opacity: 0.6 }}>No Phone</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Leaflet Map Frame */}
                    <div className="eb-directory-map-container">
                        <div 
                            ref={mapContainerRef} 
                            style={{ width: "100%", height: "100%", position: "absolute", inset: 0, zIndex: 1 }}
                        />
                    </div>
                </div>

                {/* Bottom Emergency Callout */}
                <div className="eb-not-enough-stock-card">
                    <div>
                        <h4>Not finding enough units in nearby blood banks?</h4>
                        <p>Submit an emergency request to search verified voluntary donors in your district immediately.</p>
                    </div>
                    <button type="button" className="btn-emergency-find" onClick={onGoToSearch}>
                        <Radio size={15} />
                        <span>Find Donors Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}