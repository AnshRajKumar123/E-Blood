import React, { useState, useEffect } from "react";
import { Mail, Lock, Phone, User, ArrowRight, Loader2, KeyRound, CheckCircle2, AlertTriangle, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { apiUserPasswordLogin, apiUserRegister, apiSendEmailOtp } from "../services/api";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useLanguage } from "../context/LanguageContext";
import "../styles/LoginPage.css";

export default function LoginPage({ onLoginSuccess, onGoToRegister, onGoToHome, triggerOtpToast }) {
    const { t } = useLanguage();
    const [authTab, setAuthTab] = useState("login"); // 'login' | 'register'

    // Login fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Rate limiting & failed attempt state
    const [loginWarning, setLoginWarning] = useState(null);
    const [attemptsCount, setAttemptsCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    // Register fields
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [regOtp, setRegOtp] = useState("");

    // OTP states
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Forgot password modal state
    const [showForgotModal, setShowForgotModal] = useState(false);

    useEffect(() => {
        let timer = null;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSendOtp = async () => {
        const clean = regEmail.trim().toLowerCase();
        if (!clean || !clean.includes("@")) {
            alert("Please enter a valid email address to receive OTP");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await apiSendEmailOtp(clean);
            if (res && res.success) {
                setOtpSent(true);
                setResendTimer(45);
                alert(`OTP code dispatched to ${clean}`);
                if (res.isDemo && res.demoCode && triggerOtpToast) {
                    triggerOtpToast(res.demoCode);
                }
            } else {
                alert(res?.message || "Failed to send OTP email.");
            }
        } catch (err) {
            alert("Network error sending OTP. Please check your backend.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginWarning(null);

        if (isBlocked) {
            setLoginWarning({
                type: "blocked",
                message: "Your IP is temporarily blocked due to 5 failed login attempts. Please wait 15 minutes."
            });
            return;
        }

        if (!loginEmail.trim() || !loginPassword.trim()) {
            setLoginWarning({
                type: "error",
                message: "Please enter both your registered email and password."
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiUserPasswordLogin(loginEmail.trim(), loginPassword.trim());

            if (res && res.success && res.user) {
                setLoginWarning(null);
                setAttemptsCount(0);
                setIsBlocked(false);
                onLoginSuccess(res.user);
            } else {
                const count = res?.attemptsCount || (attemptsCount + 1);
                setAttemptsCount(count);

                if (res?.isBlocked || count >= 5) {
                    setIsBlocked(true);
                    setLoginWarning({
                        type: "blocked",
                        message: res?.message || "Your IP has been blocked due to 5 failed attempts. Please wait 15 minutes."
                    });
                } else if (res?.isWarning || count === 3) {
                    setLoginWarning({
                        type: "warning",
                        title: "Security Warning: 3 Failed Attempts",
                        message: "You logged failed 3 times and you have two more times if you not correct it your IP is blocked."
                    });
                } else {
                    setLoginWarning({
                        type: "error",
                        message: res?.message || "Invalid email or password."
                    });
                }
            }
        } catch (err) {
            setLoginWarning({
                type: "error",
                message: "Connection failed. Please ensure the backend is running on port 5001."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!regEmail.trim() || !regPhone.trim() || !regPassword.trim() || !regOtp.trim()) {
            alert("Please fill all required fields and verify OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiUserRegister({
                name: regName.trim(),
                email: regEmail.trim(),
                phone: regPhone.trim(),
                password: regPassword.trim(),
                otp: regOtp.trim()
            });

            if (res && res.success && res.user) {
                alert("Account created successfully!");
                onLoginSuccess(res.user);
            } else {
                alert(res?.message || "Registration failed.");
            }
        } catch (err) {
            alert("Registration failed. Please check your inputs.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="eb-auth-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>
                        {t("home")}
                    </span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">User Portal</span>
                </nav>

                <div className="eb-auth-card-stage">
                    <div className="eb-auth-avatar-icon">
                        <KeyRound size={26} color="#ffffff" />
                    </div>

                    <h2 className="eb-auth-card-title">Donor &amp; User Portal</h2>
                    <p className="eb-auth-card-sub">
                        Access voluntary blood requests, emergency matching, and your donor profile.
                    </p>

                    {/* Segmented Tab Switcher */}
                    <div className="eb-auth-tab-switch">
                        <button
                            type="button"
                            className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                            onClick={() => {
                                setAuthTab("login");
                                setLoginWarning(null);
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`auth-tab-btn ${authTab === "register" ? "active" : ""}`}
                            onClick={() => {
                                setAuthTab("register");
                                setLoginWarning(null);
                            }}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="eb-auth-form-box">
                        {/* 1. LOGIN FORM */}
                        {authTab === "login" ? (
                            <form onSubmit={handleLoginSubmit} autoComplete="off">
                                {/* Consecutive Failed Attempts Warning Banner */}
                                {loginWarning && (
                                    <div className={`eb-login-alert-banner ${loginWarning.type}`}>
                                        <div className="alert-banner-left">
                                            {loginWarning.type === "blocked" ? (
                                                <ShieldAlert size={20} className="banner-icon-blocked" />
                                            ) : loginWarning.type === "warning" ? (
                                                <AlertTriangle size={20} className="banner-icon-warning" />
                                            ) : (
                                                <AlertTriangle size={18} />
                                            )}
                                            <div>
                                                {loginWarning.title && <strong>{loginWarning.title}</strong>}
                                                <p>{loginWarning.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="eb-input-unit">
                                    <label>Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} />
                                        <input
                                            type="email"
                                            placeholder="Enter registered email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            disabled={isBlocked}
                                            autoComplete="off"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="eb-input-unit">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <label>Password</label>
                                        <button
                                            type="button"
                                            className="eb-forgot-pass-link"
                                            onClick={() => setShowForgotModal(true)}
                                            disabled={isBlocked}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="input-with-icon pass-field-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type={showLoginPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            disabled={isBlocked}
                                            autoComplete="new-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="eb-toggle-pass-inline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowLoginPassword((prev) => !prev);
                                            }}
                                            tabIndex={-1}
                                            title={showLoginPassword ? "Hide password" : "Show password"}
                                            aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                        >
                                            {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`eb-auth-action-btn ${isBlocked ? "btn-blocked" : ""}`}
                                    disabled={isLoading || isBlocked}
                                >
                                    {isLoading ? (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                            <Loader2 size={16} className="spin-loader" /> Verifying Credentials...
                                        </span>
                                    ) : isBlocked ? (
                                        <span>IP Blocked (Try in 15m)</span>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* 2. REGISTER FORM */
                            <form onSubmit={handleRegisterSubmit} autoComplete="off">
                                <div className="eb-input-unit">
                                    <label>Full Name</label>
                                    <div className="input-with-icon">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            placeholder="Your full name"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="eb-input-unit">
                                    <label>Email Address</label>
                                    <div className="input-action-split">
                                        <div className="input-with-icon flex-1">
                                            <Mail size={16} />
                                            <input
                                                type="email"
                                                placeholder="Enter email"
                                                value={regEmail}
                                                onChange={(e) => setRegEmail(e.target.value)}
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

                                <div className="eb-input-unit">
                                    <label>4-Digit Email OTP</label>
                                    <div className="input-with-icon">
                                        <CheckCircle2 size={16} />
                                        <input
                                            type="text"
                                            maxLength={4}
                                            placeholder="Enter 4-digit OTP"
                                            value={regOtp}
                                            onChange={(e) => setRegOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="eb-input-unit">
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={16} />
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            placeholder="10-digit mobile number"
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ""))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="eb-input-unit">
                                    <label>Create Password</label>
                                    <div className="input-with-icon pass-field-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type={showRegPassword ? "text" : "password"}
                                            placeholder="Choose a strong password"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="eb-toggle-pass-inline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowRegPassword((prev) => !prev);
                                            }}
                                            tabIndex={-1}
                                            title={showRegPassword ? "Hide password" : "Show password"}
                                            aria-label={showRegPassword ? "Hide password" : "Show password"}
                                        >
                                            {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="eb-auth-action-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                            <Loader2 size={16} className="spin-loader" /> Registering...
                                        </span>
                                    ) : (
                                        <>
                                            Complete Registration <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* FORGOT PASSWORD MODAL */}
            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                portalType="user"
                defaultEmail={loginEmail}
                triggerOtpToast={triggerOtpToast}
            />
        </div>
    );
}