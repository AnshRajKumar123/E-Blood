import React, { useState, useEffect } from "react";
import AdminLoginPage from "./pages/AdminLoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardOverview from "./pages/DashboardOverview";
import DonorManagement from "./pages/DonorManagement";
import BloodBankManagement from "./pages/BloodBankManagement";
import CampManagement from "./pages/CampManagement";
import AdminProfile from "./pages/AdminProfile";
import { fetchAllDonors, fetchAdminBloodBanks, fetchAdminCamps } from "./services/adminApi";
import "./styles/AdminDashboard.css";

export default function App() {
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const saved = localStorage.getItem("eblood_admin_session");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [activeTab, setActiveTab] = useState("overview");
    const [donors, setDonors] = useState([]);
    const [banks, setBanks] = useState([]);
    const [camps, setCamps] = useState([]);

    const loadPlatformData = async () => {
        try {
            const [dRes, bRes, cRes] = await Promise.all([
                fetchAllDonors(),
                fetchAdminBloodBanks(),
                fetchAdminCamps(),
            ]);

            if (dRes && dRes.success && Array.isArray(dRes.donors)) {
                setDonors(dRes.donors);
            } else {
                setDonors([]);
            }

            if (bRes && bRes.success && Array.isArray(bRes.banks)) {
                setBanks(bRes.banks);
            } else {
                setBanks([]);
            }

            if (cRes && cRes.success && Array.isArray(cRes.camps)) {
                setCamps(cRes.camps);
            } else {
                setCamps([]);
            }
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        }
    };

    useEffect(() => {
        if (adminUser) {
            loadPlatformData();
        }
    }, [adminUser]);

    const handleLoginSuccess = (adminPayload) => {
        setAdminUser(adminPayload);
        localStorage.setItem("eblood_admin_session", JSON.stringify(adminPayload));
    };

    const handleUpdateAdminSession = (updatedAdmin) => {
        setAdminUser(updatedAdmin);
        localStorage.setItem("eblood_admin_session", JSON.stringify(updatedAdmin));
    };

    // Complete Session Destruction on Logout (Point 1)
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5001/api/admin-auth/logout", { method: "POST" });
        } catch (err) {
            console.warn("Backend logout endpoint unreachable.");
        } finally {
            localStorage.removeItem("eblood_admin_session");
            localStorage.clear();
            sessionStorage.clear();
            setAdminUser(null);
            setActiveTab("overview");
        }
    };

    if (!adminUser) {
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="eb-admin-root-layout">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
                admin={adminUser}
            />

            <div className="eb-admin-main-viewport">
                <Topbar activeTab={activeTab} admin={adminUser} />

                <main className="eb-admin-content-stage">
                    {activeTab === "overview" && (
                        <DashboardOverview
                            donors={donors}
                            banks={banks}
                            camps={camps}
                            onSelectTab={setActiveTab}
                            admin={adminUser}
                        />
                    )}

                    {activeTab === "donors" && (
                        <DonorManagement
                            donors={donors}
                            onRefresh={loadPlatformData}
                        />
                    )}

                    {activeTab === "banks" && (
                        <BloodBankManagement
                            banks={banks}
                            onRefresh={loadPlatformData}
                        />
                    )}

                    {activeTab === "camps" && (
                        <CampManagement
                            camps={camps}
                            onRefresh={loadPlatformData}
                        />
                    )}

                    {activeTab === "profile" && (
                        <AdminProfile 
                            admin={adminUser} 
                            onUpdateAdminSession={handleUpdateAdminSession}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}