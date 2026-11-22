import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Organisation from "../models/Organisation.js";
import { checkCustomerLoginLimit, recordFailedLogin, resetLoginAttempts } from "../middleware/customerRateLimiter.js";

dotenv.config();

const router = express.Router();

const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        auth: {
            user: (process.env.EMAIL_USER || "").trim(),
            pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim()
        }
    });
};

const otpStore = new Map();

// 1. Send Real Email OTP
router.post("/otp/send", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes("@")) {
            return res.status(400).json({ success: false, message: "Valid email address is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        otpStore.set(cleanEmail, {
            code: otpCode,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        const emailUser = (process.env.EMAIL_USER || "").trim();
        const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

        if (emailUser && emailPass) {
            const transporter = getTransporter();
            const mailOptions = {
                from: `"E-Blood Portal" <${emailUser}>`,
                to: cleanEmail,
                subject: `${otpCode} is your E-Blood Verification Code`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                        <h2 style="color: #e11d48; margin-bottom: 8px;">E-Blood Portal</h2>
                        <p style="color: #475569; font-size: 15px; margin-bottom: 20px;">Use the verification code below to sign in to your E-Blood account:</p>
                        <div style="background: #fff1f2; border: 1px dashed #f43f5e; padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
                            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #be123c;">${otpCode}</span>
                        </div>
                        <p style="color: #64748b; font-size: 13px; margin: 0;">This code is valid for 5 minutes.</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ success: true, isDemo: false, message: "Verification code sent to your email!" });
        }

        return res.status(200).json({
            success: true,
            isDemo: true,
            demoCode: otpCode,
            message: "Email credentials not found in .env"
        });
    } catch (err) {
        console.error("OTP Send Error:", err);
        return res.status(500).json({ success: false, message: err.message || "Failed to send email verification" });
    }
});

// 2. Verify Email OTP For Donors / Normal Users
router.post("/otp/verify", async (req, res) => {
    try {
        const { email, code, expectedCode, name } = req.body;
        if (!email || !code) {
            return res.status(400).json({ success: false, message: "Email and verification code required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const record = otpStore.get(cleanEmail);
        let isValid = false;

        if (record) {
            if (Date.now() > record.expiresAt) {
                otpStore.delete(cleanEmail);
                return res.status(400).json({ success: false, message: "OTP has expired. Please request a new code." });
            }
            if (record.code === code.trim()) {
                isValid = true;
                otpStore.delete(cleanEmail);
            }
        }

        if (!isValid && expectedCode && code.trim() === expectedCode) {
            isValid = true;
        }

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        let user = await User.findOne({ email: cleanEmail });
        if (!user) {
            user = await User.create({
                name: name && name !== "User" ? name : cleanEmail.split("@")[0],
                email: cleanEmail,
                city: "Punjab",
                district: "Punjab",
                state: "Punjab",
                isDonor: false,
                wantsToBeDonor: false,
                showInDonorList: true
            });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Register/Update Donor Profile
router.post("/user/register-donor", async (req, res) => {
    try {
        const {
            userId,
            email,
            phone,
            name,
            bloodGroup,
            address,
            landmark,
            pincode,
            city,
            district,
            state,
            weight,
            height,
            dob,
            gender,
            reachChannel,
            matchDistance,
            coordinates,
            wantsToBeDonor,
            recentlyDonated,
            nextDonationDate,
            showInDonorList
        } = req.body;

        const cleanEmail = email ? email.trim().toLowerCase() : null;
        const cleanPhone = phone ? phone.replace(/\s+/g, "") : null;

        let queryConditions = [];
        if (userId) queryConditions.push({ _id: userId });
        if (cleanEmail) queryConditions.push({ email: cleanEmail });
        if (cleanPhone) {
            queryConditions.push({ phone: cleanPhone });
            queryConditions.push({ phone: phone });
        }

        if (queryConditions.length === 0) {
            return res.status(400).json({ success: false, message: "User identifier, email, or phone required" });
        }

        const updateFields = {
            name: name || "User",
            bloodGroup: bloodGroup || "O+",
            address: address ? address.trim() : "",
            landmark: landmark ? landmark.trim() : "",
            pincode: pincode ? pincode.trim() : "",
            city: city || "Punjab",
            district: district || city || "Punjab",
            state: state || "Punjab",
            weight: weight || "Standard",
            height: height || "",
            dob: dob || "",
            gender: gender || "Male",
            reachChannel: reachChannel || "WhatsApp",
            matchDistance: matchDistance || 25,
            isDonor: true,
            pickupPoint: address && landmark ? `${address}, Near ${landmark}, ${city}` : (city || "Designated Pickup Point")
        };

        if (cleanEmail) updateFields.email = cleanEmail;
        if (phone) updateFields.phone = phone.trim();
        if (coordinates) updateFields.coordinates = coordinates;
        if (wantsToBeDonor !== undefined) updateFields.wantsToBeDonor = wantsToBeDonor;
        if (recentlyDonated !== undefined) updateFields.recentlyDonated = recentlyDonated;
        if (nextDonationDate !== undefined) updateFields.nextDonationDate = nextDonationDate;
        if (showInDonorList !== undefined) updateFields.showInDonorList = showInDonorList;

        const user = await User.findOneAndUpdate(
            { $or: queryConditions },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Update Questionnaire & Availability Endpoint (Supports BOTH POST and PUT)
const handleQuestionnaireUpdate = async (req, res) => {
    try {
        const {
            email,
            donationAvailability,
            resumeAvailabilityDate,
            lastDonationHistoryType,
            lastDonationDate,
            donationType,
            travelDistancePreference,
            showInDonorList,
            contactSharingPreference
        } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "User email is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const updateData = { preferencesUpdatedAt: new Date() };

        if (donationAvailability) {
            if (!["open", "urgent_only", "temporarily_unavailable", "paused"].includes(donationAvailability)) {
                return res.status(400).json({ success: false, message: "Invalid donation availability option." });
            }
            updateData.donationAvailability = donationAvailability;
        }

        if (resumeAvailabilityDate !== undefined) {
            updateData.resumeAvailabilityDate = resumeAvailabilityDate;
        }

        if (lastDonationHistoryType) {
            updateData.lastDonationHistoryType = lastDonationHistoryType;
            if (lastDonationHistoryType === "donated_before") {
                if (lastDonationDate) {
                    const todayStr = new Date().toISOString().split("T")[0];
                    if (lastDonationDate > todayStr) {
                        return res.status(400).json({ success: false, message: "Recent donation date cannot be in the future." });
                    }
                    updateData.lastDonationDate = lastDonationDate;
                }
                if (donationType) updateData.donationType = donationType;
            } else {
                updateData.lastDonationDate = "";
                updateData.donationType = "";
            }
        }

        if (travelDistancePreference) {
            updateData.travelDistancePreference = travelDistancePreference;
        }

        if (showInDonorList !== undefined) {
            updateData.showInDonorList = Boolean(showInDonorList);
        }

        if (contactSharingPreference) {
            updateData.contactSharingPreference = contactSharingPreference;
        }

        const user = await User.findOneAndUpdate(
            { email: cleanEmail },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Your preferences have been updated successfully.",
            user
        });
    } catch (err) {
        console.error("Error saving preferences:", err);
        return res.status(500).json({ success: false, message: "We couldn't save your changes. Please try again." });
    }
};

router.post("/user/questionnaire", handleQuestionnaireUpdate);
router.put("/user/questionnaire", handleQuestionnaireUpdate);

// 5. Check if Donation Target Date Reached
router.get("/user/check-reminder", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: "Email required" });

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const todayStr = new Date().toISOString().split("T")[0];
        let shouldRemind = false;

        if (user.nextDonationDate && user.nextDonationDate <= todayStr && user.lastDonationReminderSent !== user.nextDonationDate) {
            shouldRemind = true;
        }

        return res.status(200).json({
            success: true,
            shouldRemind,
            scheduledDate: user.nextDonationDate,
            user
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 6. User Login with Rate Limiter
router.post("/user/login", checkCustomerLoginLimit, async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.clientIp;

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            const failData = recordFailedLogin(ip);
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
                attemptsLeft: failData.attemptsLeft,
                attemptsCount: failData.attemptsCount
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: cleanEmail });

        if (!user || !user.password || user.password !== password.trim()) {
            const failData = recordFailedLogin(ip);

            if (failData.isBlocked) {
                return res.status(429).json({
                    success: false,
                    isBlocked: true,
                    attemptsCount: failData.attemptsCount,
                    attemptsLeft: 0,
                    message: "You have failed login 5 times. Your IP has been blocked for 15 minutes."
                });
            }

            if (failData.attemptsCount === 3) {
                return res.status(401).json({
                    success: false,
                    isWarning: true,
                    attemptsCount: 3,
                    attemptsLeft: 2,
                    message: "You logged failed 3 times and you have two more times if you not correct it your IP is blocked."
                });
            }

            return res.status(401).json({
                success: false,
                attemptsCount: failData.attemptsCount,
                attemptsLeft: failData.attemptsLeft,
                message: `Invalid email or password. You have ${failData.attemptsLeft} attempt(s) remaining.`
            });
        }

        resetLoginAttempts(ip);
        return res.status(200).json({ success: true, message: "Login successful", user });
    } catch (err) {
        return res.status(500).json({ success: false, message: "An error occurred during authentication." });
    }
});

// 7. User Registration with OTP
router.post("/user/register", async (req, res) => {
    try {
        const { name, email, phone, password, otp } = req.body;
        if (!email || !password || !phone || !otp) {
            return res.status(400).json({ success: false, message: "All fields including OTP are required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const record = otpStore.get(cleanEmail);
        let isValidOtp = false;
        if (record && record.code === otp.trim()) {
            isValidOtp = true;
            otpStore.delete(cleanEmail);
        }

        if (!isValidOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        let user = await User.findOne({ email: cleanEmail });
        if (user && user.password) {
            return res.status(400).json({ success: false, message: "Account already exists with this email. Please sign in." });
        }

        if (!user) {
            user = await User.create({
                name: name ? name.trim() : cleanEmail.split("@")[0],
                email: cleanEmail,
                phone: phone.trim(),
                password: password.trim(),
                city: "Punjab",
                district: "Punjab",
                state: "Punjab",
                isDonor: false,
                wantsToBeDonor: false,
                showInDonorList: true
            });
        } else {
            user.name = name ? name.trim() : user.name;
            user.phone = phone.trim();
            user.password = password.trim();
            await user.save();
        }

        return res.status(201).json({ success: true, message: "Account registered successfully", user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 8. Delete Account
router.delete("/user/delete/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;
        await User.findOneAndDelete({
            $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
        });
        return res.status(200).json({ success: true, message: "Account deleted." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 9. User Saved Locations
router.post("/user/location", async (req, res) => {
    try {
        const { email, location } = req.body;
        if (!email || !location) {
            return res.status(400).json({ success: false, message: "Email and location required" });
        }
        const user = await User.findOneAndUpdate(
            { email: email.trim().toLowerCase() },
            { $push: { savedLocations: location } },
            { new: true }
        );
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/user/location/:email/:locationId", async (req, res) => {
    try {
        const { email, locationId } = req.params;
        const user = await User.findOneAndUpdate(
            { email: email.trim().toLowerCase() },
            { $pull: { savedLocations: { _id: locationId } } },
            { new: true }
        );
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// 10. Notifications Preferences
router.post("/user/notifications", async (req, res) => {
    try {
        const { email, phone, notifications } = req.body;
        const cleanEmail = email ? email.trim().toLowerCase() : null;
        const cleanPhone = phone ? phone.replace(/\s+/g, "") : null;

        if (!cleanEmail && !cleanPhone) {
            return res.status(400).json({ success: false, message: "User email or phone required" });
        }

        const query = cleanEmail ? { email: cleanEmail } : { phone: cleanPhone };
        const user = await User.findOneAndUpdate(query, { $set: { notifications } }, { new: true });
        return res.status(200).json({ success: true, message: "Notification preferences saved", user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Password recovery endpoints
router.post("/forgot-password/send-otp", async (req, res) => {
    try {
        const { email, portalType } = req.body;
        if (!email || !email.includes("@")) {
            return res.status(400).json({ success: false, message: "Valid email address is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        let account = portalType === "organisation" ? await Organisation.findOne({ email: cleanEmail }) : await User.findOne({ email: cleanEmail });

        if (!account) {
            return res.status(404).json({ success: false, message: `No account registered with this email.` });
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        otpStore.set(`reset_${cleanEmail}`, { code: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 });

        const emailUser = (process.env.EMAIL_USER || "").trim();
        const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

        if (emailUser && emailPass) {
            const transporter = getTransporter();
            await transporter.sendMail({
                from: `"E-Blood Security" <${emailUser}>`,
                to: cleanEmail,
                subject: `${otpCode} is your Password Reset Code`,
                html: `<p>Your password reset code is <b>${otpCode}</b>. Valid for 5 minutes.</p>`
            });
            return res.status(200).json({ success: true, message: "Reset code sent to your email!" });
        }

        return res.status(200).json({ success: true, isDemo: true, demoCode: otpCode, message: "Demo code generated" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/forgot-password/reset", async (req, res) => {
    try {
        const { email, portalType, code, newPassword, confirmPassword } = req.body;
        if (!email || !code || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters and match" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const stored = otpStore.get(`reset_${cleanEmail}`);
        if (!stored || stored.code !== code.trim() || Date.now() > stored.expiresAt) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
        }

        otpStore.delete(`reset_${cleanEmail}`);

        if (portalType === "organisation") {
            await Organisation.findOneAndUpdate({ email: cleanEmail }, { $set: { password: newPassword.trim() } });
        } else {
            await User.findOneAndUpdate({ email: cleanEmail }, { $set: { password: newPassword.trim() } });
        }

        return res.status(200).json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;