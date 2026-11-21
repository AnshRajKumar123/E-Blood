import React from "react";
import { ShieldCheck } from "lucide-react";
import "../styles/Topbar.css";

export default function Topbar({ activeTab, admin }) {
    const getHeading = () => {
        switch (activeTab) {
            case "overview": return "Master Overview";
            case "donors": return "Donors Directory";
            case "banks": return "Blood Bank Network";
            case "camps": return "Community Camps";
            case "profile": return "Admin Profile & Team Tasks";
            default: return "Dashboard";
        }
    };

    return (
        <header className="eb-topbar-wrapper">
            <div>
                <h2>{getHeading()}</h2>
                <small>Connected to E-Blood Backend Engine (Port 5001)</small>
            </div>

            <div className="eb-topbar-status">

                <div className="admin-chip">
                    <ShieldCheck size={16} color="#e11d48" />
                    <span>{admin?.name || "Admin"}</span>
                </div>
            </div>
        </header>
    );
}