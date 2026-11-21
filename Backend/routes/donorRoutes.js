import express from "express";
import User from "../models/User.js";

const router = express.Router();

const KNOWN_CENTROIDS = {
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
    "ludhiana": [30.9010, 75.8573],
    "jalandhar": [31.3260, 75.5762],
    "amritsar": [31.6340, 74.8723],
    "bathinda": [30.2110, 74.9455],
    "hoshiarpur": [31.5273, 75.9149]
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

// GET /api/donors/search
router.get("/search", async (req, res) => {
    try {
        const { 
            bloodGroup, 
            state, 
            city, 
            district, 
            pincode, 
            landmark, 
            radius, 
            lat, 
            lng 
        } = req.query;

        const maxRadius = radius !== undefined && radius !== "" ? Number(radius) : 100;
        
        // Critical: Only display donors who are active and haven't hidden their profile
        const conditions = [
            { isDonor: true },
            { showInDonorList: { $ne: false } }
        ];

        // 1. Blood Group Filtering
        if (bloodGroup && bloodGroup.trim() !== "" && bloodGroup.trim() !== "All Blood Groups") {
            const cleanBg = bloodGroup.trim().replace(/\s+/g, "+");
            conditions.push({ bloodGroup: cleanBg });
        }

        // 2. State Filtering
        if (state && state.trim() !== "" && state.trim().toLowerCase() !== "all") {
            conditions.push({ state: new RegExp(`^${state.trim()}$`, "i") });
        }

        // 3. Resolve Target Origin Coordinates
        const rawSearchInput = (city || district || landmark || "").trim().toLowerCase();
        let originLat = lat && !isNaN(Number(lat)) ? Number(lat) : null;
        let originLng = lng && !isNaN(Number(lng)) ? Number(lng) : null;

        if (!originLat || !originLng) {
            for (const [key, coords] of Object.entries(KNOWN_CENTROIDS)) {
                if (rawSearchInput.includes(key) || key.includes(rawSearchInput)) {
                    originLat = coords[0];
                    originLng = coords[1];
                    break;
                }
            }
        }

        originLat = originLat || 30.6661;
        originLng = originLng || 76.3023;

        // 4. Multi-Field Text Filter
        if (rawSearchInput && rawSearchInput !== "") {
            const escaped = rawSearchInput.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            const termRegex = new RegExp(escaped, "i");
            conditions.push({
                $or: [
                    { address: termRegex },
                    { landmark: termRegex },
                    { pickupPoint: termRegex },
                    { city: termRegex },
                    { district: termRegex }
                ]
            });
        }

        // 5. PIN Code Filter
        if (pincode && pincode.trim() !== "") {
            conditions.push({ pincode: pincode.trim() });
        }

        // 6. Landmark Filter
        if (landmark && landmark.trim() !== "") {
            const lRegex = new RegExp(landmark.trim(), "i");
            conditions.push({
                $or: [
                    { landmark: lRegex },
                    { address: lRegex },
                    { pickupPoint: lRegex }
                ]
            });
        }

        const query = { $and: conditions };
        let donors = await User.find(query).lean();

        // 7. Calculate distance & prioritize exact landmark mentions
        const formattedDonors = donors.map((d) => {
            const dLat = (d.coordinates && Number(d.coordinates.lat)) || 30.6661;
            const dLng = (d.coordinates && Number(d.coordinates.lng)) || 76.3023;
            const dist = getDistanceInKm(originLat, originLng, dLat, dLng);

            const fullText = `${d.address || ""} ${d.landmark || ""} ${d.pickupPoint || ""} ${d.city || ""}`.toLowerCase();
            const hasExactMention = rawSearchInput && fullText.includes(rawSearchInput);

            return {
                ...d,
                distanceKm: dist,
                hasExactMention
            };
        });

        // 8. Range Filter
        let results = formattedDonors;
        if (maxRadius > 0 && maxRadius < 100) {
            results = formattedDonors.filter((d) => d.hasExactMention || d.distanceKm <= maxRadius);
        }

        results.sort((a, b) => {
            if (a.hasExactMention && !b.hasExactMention) return -1;
            if (!a.hasExactMention && b.hasExactMention) return 1;
            return a.distanceKm - b.distanceKm;
        });

        return res.status(200).json({
            success: true,
            count: results.length,
            origin: { lat: originLat, lng: originLng, locationName: rawSearchInput || "Origin" },
            donors: results
        });
    } catch (err) {
        console.error("Donor search error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;