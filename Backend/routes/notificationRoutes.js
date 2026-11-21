import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// 1. Fetch all notifications (sorted newest first)
router.get("/all", async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Create custom / emergency notification
router.post("/create", async (req, res) => {
    try {
        const { title, message, type, actionPath, actionLabel, targetLocation, relatedId } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ success: false, message: "Title and message are required" });
        }

        const notif = await Notification.create({
            title,
            message,
            type: type || "camp",
            actionPath: actionPath || "/camps",
            actionLabel: actionLabel || "View Details",
            targetLocation: targetLocation || {},
            relatedId: relatedId || ""
        });

        res.status(201).json({ success: true, notification: notif });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Mark single notification as read
router.patch("/read/:id", async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.status(200).json({ success: true, notification: notif });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Mark all as read
router.patch("/read-all", async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. Clear all notifications
router.delete("/clear", async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;