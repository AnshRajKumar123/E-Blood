import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import BloodCamp from "../models/BloodCamp.js";
import Notification from "../models/Notification.js";
import { upload } from "../middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to delete physical file from disk
const removeDiskFile = (filePath) => {
    if (!filePath || filePath.startsWith("http")) return;
    try {
        const cleanRelPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
        const absPath = path.join(__dirname, "..", cleanRelPath);
        if (fs.existsSync(absPath)) {
            fs.unlinkSync(absPath);
        }
    } catch (err) {
        console.warn(`[Disk Cleanup Warning] Could not remove ${filePath}:`, err.message);
    }
};

// 1. Create Blood Camp & Broadcast Notification
router.post("/create", upload.array("images", 4), async (req, res) => {
    try {
        const imagePaths = req.files && req.files.length > 0
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        const defaultPlaceholder = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80";

        const campData = {
            ...req.body,
            estimatedParticipants: Number(req.body.estimatedParticipants) || 100,
            image: imagePaths.length > 0 ? imagePaths[0] : defaultPlaceholder,
            images: imagePaths.length > 0 ? imagePaths : [defaultPlaceholder]
        };

        const camp = await BloodCamp.create(campData);

        // Auto-broadcast real-time notification to all users
        try {
            await Notification.create({
                title: `New Blood Camp: ${camp.title}`,
                message: `An upcoming voluntary blood donation drive has been scheduled at ${camp.campAddress}, ${camp.district || camp.city || "Punjab"} on ${camp.campDate} (${camp.startTime} – ${camp.endTime}). Organised by ${camp.organiserName}.`,
                type: "camp",
                actionPath: "/camps",
                actionLabel: "View Camp Schedule",
                relatedId: camp._id.toString(),
                targetLocation: {
                    city: camp.city || "",
                    district: camp.district || "",
                    state: camp.state || ""
                }
            });
        } catch (notifErr) {
            console.warn("[Notification Warning]: Could not auto-generate camp notification:", notifErr.message);
        }

        res.status(201).json({ success: true, camp });
    } catch (err) {
        console.error("Camp creation error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Fetch All Camps
router.get("/all", async (req, res) => {
    try {
        const camps = await BloodCamp.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: camps.length, camps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Edit / Update Blood Camp
router.put("/update/:id", upload.array("images", 4), async (req, res) => {
    try {
        const camp = await BloodCamp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ success: false, message: "Blood camp not found" });
        }

        const newImagePaths = req.files && req.files.length > 0
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        // If new images were uploaded, clean up old disk files
        if (newImagePaths.length > 0) {
            if (Array.isArray(camp.images)) {
                camp.images.forEach((img) => removeDiskFile(img));
            } else if (camp.image) {
                removeDiskFile(camp.image);
            }
            camp.images = newImagePaths;
            camp.image = newImagePaths[0];
        }

        // Update fields
        if (req.body.title) camp.title = req.body.title.trim();
        if (req.body.organiserName) camp.organiserName = req.body.organiserName.trim();
        if (req.body.organiserMobile) camp.organiserMobile = req.body.organiserMobile.trim();
        if (req.body.campAddress) camp.campAddress = req.body.campAddress.trim();
        if (req.body.campDate) camp.campDate = req.body.campDate;
        if (req.body.startTime) camp.startTime = req.body.startTime;
        if (req.body.endTime) camp.endTime = req.body.endTime;
        if (req.body.city) camp.city = req.body.city.trim();
        if (req.body.district) camp.district = req.body.district.trim();
        if (req.body.state) camp.state = req.body.state.trim();

        await camp.save();
        res.status(200).json({ success: true, message: "Blood camp updated successfully", camp });
    } catch (err) {
        console.error("Camp update error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Delete Blood Camp & Remove All Disk Files + Notifications
router.delete("/delete/:id", async (req, res) => {
    try {
        const camp = await BloodCamp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ success: false, message: "Blood camp not found" });
        }

        // Clean up all images from the uploads folder
        if (Array.isArray(camp.images) && camp.images.length > 0) {
            camp.images.forEach((imgPath) => removeDiskFile(imgPath));
        } else if (camp.image) {
            removeDiskFile(camp.image);
        }

        // Delete from MongoDB
        await BloodCamp.findByIdAndDelete(req.params.id);

        // Clean up related notifications
        try {
            await Notification.deleteMany({ relatedId: req.params.id });
        } catch (notifCleanupErr) {
            console.warn("Could not clean up camp notifications:", notifCleanupErr.message);
        }

        res.status(200).json({ 
            success: true, 
            message: "Blood camp and associated image files deleted successfully" 
        });
    } catch (err) {
        console.error("Camp delete error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;