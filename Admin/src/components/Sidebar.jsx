import React from "react";
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    Tent, 
    UserCog,
    LogOut,
    HeartPulse
} from "lucide-react";
import "../styles/Sidebar.css";
import { AdminImg } from "../assets/asset";

export default function Sidebar({ activeTab, setActiveTab, onLogout, admin }) {
    const navItems = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { id: "donors", label: "Donors Directory", icon: <Users size={18} /> },
        { id: "banks", label: "Blood Banks", icon: <Building2 size={18} /> },
        { id: "camps", label: "Donation Camps", icon: <Tent size={18} /> },
        { id: "profile", label: "Admin Profile", icon: <UserCog size={18} /> },
    ];

    return (
        <aside className="eb-sidebar-container">
            {/* Top Brand Logo Section */}
            <div className="eb-sidebar-brand-box">
                <div className="eb-sidebar-logo-slot">
                    {/* Official E-Blood Brand Logo Icon */}
                    <div className="eb-logo-circle">
                        <img src={AdminImg.WebLogo} alt="" />
                    </div>
                </div>
                <div className="eb-brand-titles">
                    <span className="eb-brand-main">E-Blood</span>
                    <span className="eb-brand-badge">ADMIN PORTAL</span>
                </div>
            </div>

            {/* Navigation Options */}
            <nav className="eb-sidebar-nav-list">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`eb-sidebar-item ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom Admin User & Logout */}
            <div className="eb-sidebar-bottom">
                <div className="eb-admin-mini-profile" onClick={() => setActiveTab("profile")}>
                    <div className="eb-mini-avatar">
                        {(admin?.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="eb-mini-info">
                        <strong>{admin?.name || "Admin"}</strong>
                        <small>{admin?.role || "Super Admin"}</small>
                    </div>
                </div>

                <button type="button" className="eb-sidebar-btn-logout" onClick={onLogout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}