const API_BASE = "http://localhost:5001/api";

const safeFetch = async (url, options = {}) => {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Admin API Error:", err);
        return { success: false, message: err.message || "Network error" };
    }
};

// 1. Admin Authentication & Team
export const adminLoginApi = async (email, password) => {
    return safeFetch(`${API_BASE}/admin-auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
};

export const fetchAdminTeam = async () => {
    return safeFetch(`${API_BASE}/admin-auth/team`);
};

export const updateAdminProfileApi = async (payload) => {
    return safeFetch(`${API_BASE}/admin-auth/profile/update`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
};

// 2. Admin Tasks
export const fetchAdminTasksApi = async () => {
    return safeFetch(`${API_BASE}/admin-auth/tasks`);
};

export const createAdminTaskApi = async (payload) => {
    return safeFetch(`${API_BASE}/admin-auth/tasks/create`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
};

export const toggleAdminTaskStatusApi = async (id, status) => {
    return safeFetch(`${API_BASE}/admin-auth/tasks/status/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
    });
};

export const deleteAdminTaskApi = async (id) => {
    return safeFetch(`${API_BASE}/admin-auth/tasks/delete/${id}`, {
        method: "DELETE"
    });
};

// 3. Donors Fetch & Delete
export const fetchAllDonors = async () => {
    return safeFetch(`${API_BASE}/donors/search`);
};

export const deleteDonorAccount = async (identifier) => {
    return safeFetch(`${API_BASE}/auth/user/delete/${encodeURIComponent(identifier)}`, {
        method: "DELETE",
    });
};

// 4. Blood Banks Fetch & Delete
export const fetchAdminBloodBanks = async () => {
    return safeFetch(`${API_BASE}/bloodbanks/all`);
};

export const deleteAdminBloodBank = async (id) => {
    return safeFetch(`${API_BASE}/bloodbanks/delete/${id}`, {
        method: "DELETE",
    });
};

// 5. Blood Camps Fetch & Delete
export const fetchAdminCamps = async () => {
    return safeFetch(`${API_BASE}/camps/all`);
};

export const deleteAdminCamp = async (id) => {
    return safeFetch(`${API_BASE}/camps/delete/${id}`, {
        method: "DELETE",
    });
};