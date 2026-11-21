import rateLimit from "express-rate-limit";

// Point 1: Login rate limiting (Max 5 failed attempts per 15 mins per IP)
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // 5 requests maximum
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many login attempts. Please wait 15 minutes before trying again."
        });
    }
});