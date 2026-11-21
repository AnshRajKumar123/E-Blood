// In-memory tracker for customer IP login attempts
// Map structure: ip -> { count: number, blockedUntil: number | null, lastAttempt: number }
const ipLoginTracker = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15-minute lockout window
const MAX_ATTEMPTS = 5;

// Clean up expired IP entries every 10 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipLoginTracker.entries()) {
        if (now - data.lastAttempt > WINDOW_MS && (!data.blockedUntil || now > data.blockedUntil)) {
            ipLoginTracker.delete(ip);
        }
    }
}, 10 * 60 * 1000);

export const checkCustomerLoginLimit = (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || req.ip || "unknown-ip";
    const now = Date.now();
    const entry = ipLoginTracker.get(ip);

    if (entry && entry.blockedUntil && now < entry.blockedUntil) {
        const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
        return res.status(429).json({
            success: false,
            isBlocked: true,
            attemptsLeft: 0,
            message: `Your IP is blocked due to 5 consecutive failed login attempts. Please try again after ${remainingMinutes} minute(s).`
        });
    }

    req.clientIp = ip;
    next();
};

export const recordFailedLogin = (ip) => {
    const now = Date.now();
    let entry = ipLoginTracker.get(ip);

    if (!entry) {
        entry = { count: 1, blockedUntil: null, lastAttempt: now };
    } else {
        // Reset count if previous failure happened outside the 15-minute window
        if (now - entry.lastAttempt > WINDOW_MS && !entry.blockedUntil) {
            entry.count = 1;
        } else {
            entry.count += 1;
        }
        entry.lastAttempt = now;
    }

    if (entry.count >= MAX_ATTEMPTS) {
        entry.blockedUntil = now + WINDOW_MS;
        ipLoginTracker.set(ip, entry);
        return {
            isBlocked: true,
            attemptsCount: entry.count,
            attemptsLeft: 0
        };
    }

    ipLoginTracker.set(ip, entry);
    return {
        isBlocked: false,
        attemptsCount: entry.count,
        attemptsLeft: Math.max(0, MAX_ATTEMPTS - entry.count)
    };
};

export const resetLoginAttempts = (ip) => {
    ipLoginTracker.delete(ip);
};