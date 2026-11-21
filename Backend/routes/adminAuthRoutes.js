import express from "express";
import Admin from "../models/Admin.js";
import { loginRateLimiter } from "../middleware/authRateLimiter.js";

const router = express.Router();

// 1. Admin Login (Generic Error + Rate Limiter)
router.post("/login", loginRateLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password format."
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const admin = await Admin.findOne({ email: cleanEmail });

        // Point 1: Generic Error - don't disclose whether email exists or password failed
        if (!admin || admin.password !== password.trim()) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Return session data upon success
        return res.status(200).json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone,
                location: admin.location,
                isSuperAdmin: admin.isSuperAdmin
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An internal authentication error occurred."
        });
    }
});

// 2. Admin Logout Endpoint (Clear server-side context if tracking tokens)
router.post("/logout", (req, res) => {
    // Invalidate cookies/session tokens
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
    return res.status(200).json({
        success: true,
        message: "Session terminated successfully."
    });
});

// 2. Fetch All Admins (Roster for tasks & profile view)
router.get("/team", async (req, res) => {
    try {
        const team = await Admin.find({}, "-password").sort({ isSuperAdmin: -1, createdAt: 1 });
        return res.status(200).json({ success: true, team });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Update Admin Profile (Name, Email, Password, Phone, Location)
router.put("/profile/update", async (req, res) => {
    try {
        const { currentEmail, name, newEmail, password, phone, location } = req.body;

        if (!currentEmail) {
            return res.status(400).json({ success: false, message: "Current admin email is required" });
        }

        const admin = await Admin.findOne({ email: currentEmail.trim().toLowerCase() });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin profile not found" });
        }

        if (name) admin.name = name.trim();
        if (newEmail && newEmail.includes("@")) admin.email = newEmail.trim().toLowerCase();
        if (password && password.trim().length >= 6) admin.password = password.trim();
        if (phone !== undefined) admin.phone = phone.trim();
        if (location !== undefined) admin.location = location.trim();

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone,
                location: admin.location,
                isSuperAdmin: admin.isSuperAdmin
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Admin Tasks: Fetch all tasks
router.get("/tasks", async (req, res) => {
    try {
        const tasks = await AdminTask.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, tasks });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 5. Admin Tasks: Create new task (self or other admins)
router.post("/tasks/create", async (req, res) => {
    try {
        const { title, description, priority, assignedTo, assignedToName, createdBy, createdByName, dueDate } = req.body;

        if (!title || !assignedTo || !createdBy) {
            return res.status(400).json({ success: false, message: "Title, Assignee, and Creator are required" });
        }

        const task = await AdminTask.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            priority: priority || "MEDIUM",
            assignedTo: assignedTo.trim().toLowerCase(),
            assignedToName: assignedToName || "Admin",
            createdBy: createdBy.trim().toLowerCase(),
            createdByName: createdByName || "Admin",
            dueDate: dueDate || ""
        });

        return res.status(201).json({ success: true, message: "Task assigned successfully", task });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 6. Admin Tasks: Toggle status
router.patch("/tasks/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await AdminTask.findByIdAndUpdate(id, { $set: { status } }, { new: true });
        return res.status(200).json({ success: true, task });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 7. Admin Tasks: Delete task
router.delete("/tasks/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await AdminTask.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Task deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;