import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import BloodBank from "../models/BloodBank.js";
import { upload } from "../middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const removeDiskFile = (filePath) => {
    if (!filePath || filePath.startsWith("http")) return;
    try {
        const cleanRelPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
        const absPath = path.join(__dirname, "..", cleanRelPath);
        if (fs.existsSync(absPath)) {
            fs.unlinkSync(absPath);
            console.log(`[Disk Cleanup] Deleted: ${absPath}`);
        }
    } catch (err) {
        console.warn(`[Disk Cleanup Warning] Could not remove ${filePath}:`, err.message);
    }
};

// 1. Register Blood Bank
router.post("/register", upload.array("images", 4), async (req, res) => {
    try {
        const imagePaths = req.files && req.files.length > 0
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        let stockObj = {};
        if (typeof req.body.stock === "string") {
            try { stockObj = JSON.parse(req.body.stock); } catch {}
        } else if (req.body.stock) {
            stockObj = req.body.stock;
        }

        const bankData = {
            ...req.body,
            stock: stockObj,
            unitsInStock: Number(req.body.unitsInStock) || 0,
            images: imagePaths.length > 0 ? imagePaths : [
                "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
            ]
        };

        const newBank = await BloodBank.create(bankData);
        res.status(201).json({ success: true, bloodBank: newBank });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const { state, district, bloodGroup, search } = req.query;
        let queryConditions = [];

        // 1. Filter by State
        if (state && state.trim() !== "" && state.trim().toLowerCase() !== "all") {
            queryConditions.push({ state: new RegExp(`^${state.trim()}$`, "i") });
        }

        // 2. Filter by District / City
        if (district && district.trim() !== "" && district.trim().toLowerCase() !== "all") {
            const cleanDist = district.trim();
            queryConditions.push({
                $or: [
                    { district: new RegExp(cleanDist, "i") },
                    { city: new RegExp(cleanDist, "i") },
                    { address: new RegExp(cleanDist, "i") }
                ]
            });
        }

        // 3. Search by Hospital Name / Area Keyword
        if (search && search.trim() !== "") {
            const cleanSearch = search.trim();
            queryConditions.push({
                $or: [
                    { name: new RegExp(cleanSearch, "i") },
                    { address: new RegExp(cleanSearch, "i") },
                    { city: new RegExp(cleanSearch, "i") },
                    { district: new RegExp(cleanSearch, "i") }
                ]
            });
        }

        // 4. Filter by Blood Group Stock (Decodes '+', '%2B', or decoded spaces)
        if (bloodGroup && bloodGroup.trim() !== "" && bloodGroup.trim() !== "All Blood Groups") {
            let normalizedGroup = decodeURIComponent(bloodGroup).trim().replace(/\s+/g, "+");
            // If double-encoded, handle '%2B'
            if (normalizedGroup.includes("%2B")) {
                normalizedGroup = normalizedGroup.replace(/%2B/g, "+");
            }

            const groupQuery = {};
            groupQuery[`bloodStock.${normalizedGroup}`] = { $gt: 0 };

            queryConditions.push({
                $or: [
                    groupQuery,
                    { availableGroups: normalizedGroup },
                    { unitsInStock: { $gt: 0 } }
                ]
            });
        }

        const finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};
        const banks = await BloodBank.find(finalQuery).sort({ unitsInStock: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: banks.length,
            banks
        });
    } catch (err) {
        console.error("Error fetching blood banks:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});


// 3. Edit / Update Blood Bank
router.put("/update/:id", async (req, res) => {
    try {
        const bank = await BloodBank.findById(req.params.id);
        if (!bank) {
            return res.status(404).json({ success: false, message: "Blood bank not found" });
        }

        if (req.body.name) bank.name = req.body.name.trim();
        if (req.body.phone) bank.phone = req.body.phone.trim();
        if (req.body.address) bank.address = req.body.address.trim();
        if (req.body.city) bank.city = req.body.city.trim();
        if (req.body.district) bank.district = req.body.district.trim();
        if (req.body.state) bank.state = req.body.state.trim();
        if (req.body.unitsInStock !== undefined) bank.unitsInStock = Number(req.body.unitsInStock);

        await bank.save();
        res.status(200).json({ success: true, message: "Blood bank updated successfully", bloodBank: bank });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Delete Blood Bank & Remove All Disk Files
router.delete("/delete/:id", async (req, res) => {
    try {
        const bank = await BloodBank.findById(req.params.id);
        if (!bank) {
            return res.status(404).json({ success: false, message: "Blood bank not found" });
        }

        if (Array.isArray(bank.images) && bank.images.length > 0) {
            bank.images.forEach((imgPath) => removeDiskFile(imgPath));
        }

        await BloodBank.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true, 
            message: "Blood bank and uploaded images deleted successfully" 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;