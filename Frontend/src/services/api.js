const RAW_API_URL = (import.meta.env.VITE_API_URL || "/api").trim().replace(/\/$/, "");

export const BACKEND_URL = RAW_API_URL.startsWith("http")
    ? RAW_API_URL.replace(/\/api$/, "")
    : "";

const API_BASE = RAW_API_URL.startsWith("http")
    ? (RAW_API_URL.endsWith("/api") ? RAW_API_URL : `${RAW_API_URL}/api`)
    : "/api";

// Resolve image paths
export const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) {
        return "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80";
    }
    if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
        return imgSrc;
    }
    const cleanPath = imgSrc.startsWith("/") ? imgSrc : `/${imgSrc}`;
    return `${BACKEND_URL}${cleanPath}`;
};

const safePost = async (url, body) => {
    try {
        const isFormData = body instanceof FormData;

        const headers = isFormData
            ? { "Accept": "application/json" }
            : { "Content-Type": "application/json", "Accept": "application/json" };

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: isFormData ? body : JSON.stringify(body)
        });

        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return {
                success: false,
                message: res.status === 404
                    ? "Endpoint not found on backend. Please ensure the backend server was restarted."
                    : res.status === 413
                    ? "Uploaded image files are too large. Please upload smaller photos."
                    : "Server returned an unexpected response. Please check your backend logs."
            };
        }
    } catch (err) {
        console.error(`POST error on ${url}:`, err);
        return { success: false, message: err.message };
    }
};

const safeGet = async (url) => {
    try {
        const res = await fetch(url, {
            headers: { "Accept": "application/json" }
        });
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: false, message: text.slice(0, 100) };
        }
    } catch (err) {
        console.error(`GET error on ${url}:`, err);
        return { success: false, message: err.message };
    }
};

// 1. Email OTP & User Authentication
export const apiSendEmailOtp = async (email) => {
    return safePost(`${API_BASE}/auth/otp/send`, { email });
};

export const apiVerifyEmailOtp = async (email, code, expectedCode = "", name = "User") => {
    return safePost(`${API_BASE}/auth/otp/verify`, { email, code, expectedCode, name });
};

export const apiVerifyOrgOtp = async (email, code, expectedCode = "") => {
    return safePost(`${API_BASE}/auth/organisation/verify-otp`, { email, code, expectedCode });
};

// 2. Donor Profile Updates & Search
export const apiRegisterDonor = async (donorData) => {
    return safePost(`${API_BASE}/auth/user/register-donor`, donorData);
};

export const apiDeleteUserAccount = async (identifier) => {
    try {
        const res = await fetch(`${API_BASE}/auth/user/delete/${encodeURIComponent(identifier)}`, {
            method: "DELETE"
        });
        const text = await res.text();
        return JSON.parse(text);
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiAddUserLocation = async (email, location) => {
    return safePost(`${API_BASE}/auth/user/location`, { email, location });
};

export const apiDeleteUserLocation = async (email, locationId) => {
    try {
        const res = await fetch(`${API_BASE}/auth/user/location/${encodeURIComponent(email)}/${locationId}`, {
            method: "DELETE"
        });
        const text = await res.text();
        return JSON.parse(text);
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiSearchDonors = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.bloodGroup && filters.bloodGroup !== "All Blood Groups") {
        params.append("bloodGroup", filters.bloodGroup);
    }
    if (filters.state) params.append("state", filters.state);
    if (filters.city) params.append("city", filters.city);
    if (filters.district) params.append("district", filters.district);
    if (filters.pincode) params.append("pincode", filters.pincode);
    if (filters.landmark) params.append("landmark", filters.landmark);
    if (filters.radius !== undefined && filters.radius !== null) {
        params.append("radius", filters.radius);
    }
    if (filters.lat) params.append("lat", filters.lat);
    if (filters.lng) params.append("lng", filters.lng);

    return safeGet(`${API_BASE}/donors/search?${params.toString()}`);
};

// 3. Organisation Authentication & Settings
export const apiOrgLogin = async (email, name = "", contactPerson = "") => {
    return safePost(`${API_BASE}/auth/organisation/login`, { email, name, contactPerson });
};

export const apiSaveOrgSettings = async (settings) => {
    return safePost(`${API_BASE}/auth/organisation/settings`, settings);
};

// 4. Blood Banks APIs
export const apiRegisterBloodBank = async (bankFormData) => {
    return safePost(`${API_BASE}/bloodbanks/register`, bankFormData);
};

export const apiGetBloodBanks = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.state) params.append("state", filters.state);
    if (filters.district) params.append("district", filters.district);
    if (filters.bloodGroup) params.append("bloodGroup", filters.bloodGroup);
    if (filters.search) params.append("search", filters.search);
    return safeGet(`${API_BASE}/bloodbanks/all?${params.toString()}`);
};

// 5. Blood Camps APIs
export const apiRegisterCamp = async (campFormData) => {
    return safePost(`${API_BASE}/camps/create`, campFormData);
};

export const apiGetCamps = async () => {
    return safeGet(`${API_BASE}/camps/all`);
};

// 6. Notification Center Preferences
export const apiUpdateUserNotifications = async (payload) => {
    return safePost(`${API_BASE}/auth/user/notifications`, payload);
};

// Delete & Update Blood Bank
export const apiDeleteBloodBank = async (bankId) => {
    try {
        const res = await fetch(`${API_BASE}/bloodbanks/delete/${bankId}`, { method: "DELETE" });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiUpdateBloodBank = async (bankId, data) => {
    try {
        const res = await fetch(`${API_BASE}/bloodbanks/update/${bankId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

// Delete & Update Blood Camp
export const apiDeleteCamp = async (campId) => {
    try {
        const res = await fetch(`${API_BASE}/camps/delete/${campId}`, { method: "DELETE" });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiUpdateCamp = async (campId, data) => {
    try {
        const res = await fetch(`${API_BASE}/camps/update/${campId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

// 7. Live Notification Hub APIs
export const apiGetNotifications = async () => {
    return safeGet(`${API_BASE}/notifications/all`);
};

export const apiMarkNotificationRead = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/notifications/read/${id}`, {
            method: "PATCH",
            headers: { "Accept": "application/json" }
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiMarkAllNotificationsRead = async () => {
    try {
        const res = await fetch(`${API_BASE}/notifications/read-all`, {
            method: "PATCH",
            headers: { "Accept": "application/json" }
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const apiClearAllNotifications = async () => {
    try {
        const res = await fetch(`${API_BASE}/notifications/clear`, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
};

// User Password & Register APIs
export const apiUserPasswordLogin = async (email, password) => {
    return safePost(`${API_BASE}/auth/user/login`, { email, password });
};

export const apiUserRegister = async (payload) => {
    return safePost(`${API_BASE}/auth/user/register`, payload);
};

// Organisation Password & Register APIs
export const apiOrgPasswordLogin = async (email, password) => {
    return safePost(`${API_BASE}/auth/organisation/password-login`, { email, password });
};

export const apiOrgRegister = async (payload) => {
    return safePost(`${API_BASE}/auth/organisation/register`, payload);
};

// Forgot Password API Handlers
export const apiSendForgotPasswordOtp = async (email, portalType = "user") => {
    return safePost(`${API_BASE}/auth/forgot-password/send-otp`, { email, portalType });
};

export const apiVerifyForgotPasswordOtp = async (email, code) => {
    return safePost(`${API_BASE}/auth/forgot-password/verify-otp`, { email, code });
};

export const apiResetPasswordWithOtp = async (payload) => {
    return safePost(`${API_BASE}/auth/forgot-password/reset`, payload);
};

export const apiUpdateDonorQuestionnaire = async (payload) => {
    return safePost(`${API_BASE}/auth/user/questionnaire`, payload);
};

export const apiCheckDonationReminder = async (email) => {
    return safeGet(`${API_BASE}/auth/user/check-reminder?email=${encodeURIComponent(email)}`);
};