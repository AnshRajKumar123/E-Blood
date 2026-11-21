import React, { useState, useEffect } from "react";
import { Building2, Lock, Mail, Phone, User, ArrowRight, Loader2 } from "lucide-react";
import { apiOrgPasswordLogin, apiOrgRegister, apiSendEmailOtp } from "../services/api";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Organisation.css";

export default function OrganisationLoginPage({
    onLoginSuccess,
    onGoToHome,
    onGoToDonorLogin,
    triggerOtpToast
}) {
    const { t } = useLanguage();
    const [authTab, setAuthTab] = useState("login"); // 'login' | 'register'

    // Login states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register states
    const [orgName, setOrgName] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    const [orgPhone, setOrgPhone] = useState("");
    const [orgPassword, setOrgPassword] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [orgOtp, setOrgOtp] = useState("");

    // OTP timer
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Forgot password modal
    const [showForgotModal, setShowForgotModal] = useState(false);

    useEffect(() => {
        let timer = null;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSendOtp = async () => {
        const clean = orgEmail.trim().toLowerCase();
        if (!clean || !clean.includes("@")) {
            alert("Please enter a valid organisation email");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await apiSendEmailOtp(clean);
            if (res && res.success) {
                setResendTimer(45);
                alert(`OTP code sent to ${clean}`);
                if (res.isDemo && res.demoCode && triggerOtpToast) {
                    triggerOtpToast(res.demoCode);
                }
            } else {
                alert(res?.message || "Failed to dispatch verification email.");
            }
        } catch (err) {
            alert("Network error sending OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginEmail.trim() || !loginPassword.trim()) {
            alert("Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiOrgPasswordLogin(loginEmail.trim(), loginPassword.trim());
            if (res && res.success && res.organisation) {
                onLoginSuccess(res.organisation);
            } else {
                alert(res?.message || "Invalid credentials.");
            }
        } catch (err) {
            alert("Error logging in.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!orgName.trim() || !orgEmail.trim() || !orgPhone.trim() || !orgPassword.trim() || !orgOtp.trim()) {
            alert("Please fill all required fields and verify OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiOrgRegister({
                name: orgName.trim(),
                email: orgEmail.trim(),
                phone: orgPhone.trim(),
                password: orgPassword.trim(),
                contactPerson: contactPerson.trim() || "Admin",
                otp: orgOtp.trim()
            });

            if (res && res.success && res.organisation) {
                alert("Organisation registered successfully!");
                onLoginSuccess(res.organisation);
            } else {
                alert(res?.message || "Registration failed.");
            }
        } catch (err) {
            alert("Registration error. Please check your data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="eb-org-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home")}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">Organisation Portal</span>
                </nav>

                <h1 className="eb-org-title">Organisation Portal</h1>

                <div className="eb-org-auth-stage">
                    <div className="eb-org-icon-badge">
                        <Building2 size={22} />
                    </div>

                    <h2 className="eb-org-auth-heading">
                        Blood Bank &amp; Camp Organisers
                    </h2>
                    <p className="eb-org-auth-subhead">
                        Access your institution dashboard to register blood centres, host donation drives, and update live units.
                    </p>

                    {/* Segmented Tab Switcher */}
                    <div className="eb-auth-tab-switch">
                        <button
                            type="button"
                            className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                            onClick={() => setAuthTab("login")}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`auth-tab-btn ${authTab === "register" ? "active" : ""}`}
                            onClick={() => setAuthTab("register")}
                        >
                            Register Organisation
                        </button>
                    </div>

                    {/* 1. ORGANISATION LOGIN */}
                    {authTab === "login" ? (
                        <form onSubmit={handleLoginSubmit} className="eb-org-auth-card">
                            <div>
                                <label>Official Email</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        placeholder="centre@hospital.org"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label>Password</label>
                                    <button
                                        type="button"
                                        className="eb-forgot-pass-link"
                                        onClick={() => setShowForgotModal(true)}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="input-with-icon">
                                    <Lock size={16} />
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="eb-org-submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        <Loader2 size={16} className="spin-loader" /> Signing In...
                                    </span>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* 2. REGISTER ORGANISATION */
                        <form onSubmit={handleRegisterSubmit} className="eb-org-auth-card">
                            <div>
                                <label>Organisation Name *</label>
                                <div className="input-with-icon">
                                    <Building2 size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. City Civil Blood Centre"
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Official Email *</label>
                                <div className="input-action-split">
                                    <div className="input-with-icon flex-1">
                                        <Mail size={16} />
                                        <input
                                            type="email"
                                            placeholder="centre@hospital.org"
                                            value={orgEmail}
                                            onChange={(e) => setOrgEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="eb-btn-send-otp"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || resendTimer > 0}
                                    >
                                        {otpLoading ? (
                                            <Loader2 size={14} className="spin-loader" />
                                        ) : resendTimer > 0 ? (
                                            `${resendTimer}s`
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label>Email OTP Code *</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="4-digit OTP"
                                    value={orgOtp}
                                    onChange={(e) => setOrgOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                    required
                                />
                            </div>

                            <div>
                                <label>Contact Number *</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        placeholder="Official 10-digit number"
                                        value={orgPhone}
                                        onChange={(e) => setOrgPhone(e.target.value.replace(/[^0-9]/g, ""))}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Contact Person Name</label>
                                <div className="input-with-icon">
                                    <User size={16} />
                                    <input
                                        type="text"
                                        placeholder="Admin / Nodal Officer Name"
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Create Password *</label>
                                <div className="input-with-icon">
                                    <Lock size={16} />
                                    <input
                                        type="password"
                                        placeholder="Choose a strong password"
                                        value={orgPassword}
                                        onChange={(e) => setOrgPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="eb-org-submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        <Loader2 size={16} className="spin-loader" /> Registering...
                                    </span>
                                ) : (
                                    <>
                                        Complete Organisation Registration <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <p className="eb-org-sublink-prompt">
                        Looking to donate or find blood instead?{" "}
                        <span onClick={onGoToDonorLogin}>Donor login is here.</span>
                    </p>
                </div>
            </div>

            {/* FORGOT PASSWORD MODAL */}
            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                portalType="organisation"
                defaultEmail={loginEmail}
                triggerOtpToast={triggerOtpToast}
            />
        </div>
    );
}