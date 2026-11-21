import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, Activity } from "lucide-react";
import { assets } from "../assets/assets";
import "../styles/SplashScreen.css";

export default function SplashScreen({ fadingOut }) {
    const [loadingStage, setLoadingStage] = useState("Connecting to verified donor network...");

    useEffect(() => {
        const t1 = setTimeout(() => {
            setLoadingStage("Syncing live blood bank directory...");
        }, 1100);

        const t2 = setTimeout(() => {
            setLoadingStage("Ready to save lives.");
        }, 2200);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <div className={`eb-splash-screen-root ${fadingOut ? "eb-splash-fade-out" : ""}`}>
            {/* Background Organic Wave Accents */}
            <div className="eb-splash-bg-decor">
                <div className="eb-splash-blob blob-1" />
                <div className="eb-splash-blob blob-2" />
                <div className="eb-splash-blob blob-3" />
            </div>

            {/* Subtle Top Government / Trust Pill */}
            <div className="eb-splash-top-pill">
                <ShieldCheck size={14} className="pill-ico" />
                <span>COMMUNITY EMERGENCY HEALTH NETWORK</span>
            </div>

            {/* Main Center Stage */}
            <div className="eb-splash-content-box">
                {/* Logo Frame with Dual Glow Rings */}
                <div className="eb-splash-logo-container">
                    <div className="eb-splash-ring ring-outer" />
                    <div className="eb-splash-ring ring-inner" />
                    <div className="eb-splash-logo-card">
                        <img 
                            src={assets.WebLogo} 
                            alt="E-Blood Logo" 
                            className="eb-splash-logo-img" 
                        />
                    </div>
                </div>

                {/* Typography */}
                <h1 className="eb-splash-title">E-Blood</h1>

                <div className="eb-splash-tagline-wrap">
                    <span className="eb-splash-line" />
                    <span className="eb-splash-tagline">Every Donor Matters, Every Life Counts.</span>
                    <span className="eb-splash-line" />
                </div>

                <p className="eb-splash-subtext">
                    रक्त सहायता के लिए एक भरोसेमंद डिजिटल पहल
                </p>

                {/* Heartbeat / ECG Animated Line */}
                <div className="eb-splash-ecg-container">
                    <svg className="eb-splash-ecg-svg" viewBox="0 0 300 40" preserveAspectRatio="none">
                        <path 
                            className="eb-splash-ecg-path" 
                            d="M0,20 L80,20 L95,8 L105,32 L115,12 L125,25 L135,20 L300,20" 
                        />
                    </svg>
                </div>

                {/* Dynamic Status Text */}
                <div className="eb-splash-stage-status">
                    <Activity size={13} className="spin-slow" />
                    <span>{loadingStage}</span>
                </div>

                {/* Progress Bar */}
                <div className="eb-splash-loader-bar">
                    <div className="eb-splash-progress" />
                </div>

                {/* Three Visual Trust Pills */}
                <div className="eb-splash-features-strip">
                    <div className="eb-splash-chip">
                        <Heart size={12} fill="#ff4d6d" color="#ff4d6d" />
                        <span>100% Voluntary</span>
                    </div>
                    <span className="chip-dot">•</span>
                    <div className="eb-splash-chip">
                        <span>Zero Commercial Touting</span>
                    </div>
                    <span className="chip-dot">•</span>
                    <div className="eb-splash-chip">
                        <span>Direct Seeker Contact</span>
                    </div>
                </div>
            </div>

            {/* Bottom Watermark */}
            <div className="eb-splash-footer-note">
                <span>IN COMPLIANCE WITH NBTC & DPDP ACT 2023 · INDIA</span>
            </div>
        </div>
    );
}