import React, { useState, useEffect, useRef } from "react";
import { 
    X, 
    Mail, 
    Lock, 
    KeyRound, 
    ArrowRight, 
    CheckCircle2, 
    RotateCcw, 
    Loader2, 
    ShieldCheck, 
    Eye, 
    EyeOff,
    AlertCircle
} from "lucide-react";
import { 
    apiSendForgotPasswordOtp, 
    apiVerifyForgotPasswordOtp, 
    apiResetPasswordWithOtp 
} from "../services/api";
import "../styles/ForgotPasswordModal.css";

export default function ForgotPasswordModal({ 
    isOpen, 
    onClose, 
    portalType = "user", // 'user' | 'organisation'
    defaultEmail = "",
    triggerOtpToast,
    onPasswordResetSuccess
}) {
    const [step, setStep] = useState(1); // 1: Email, 2: 4-Box OTP, 3: New Passwords
    const [email, setEmail] = useState(defaultEmail || "");
    const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Separate toggles for each input
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        if (defaultEmail) setEmail(defaultEmail);
    }, [defaultEmail]);

    useEffect(() => {
        let timer = null;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    if (!isOpen) return null;

    // 1. Send OTP Request
    const handleSendCode = async (e) => {
        if (e) e.preventDefault();
        const clean = email.trim().toLowerCase();
        if (!clean || !clean.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setOtpError("");
        try {
            const res = await apiSendForgotPasswordOtp(clean, portalType);
            if (res && res.success) {
                setStep(2);
                setResendTimer(45);
                setOtpDigits(["", "", "", ""]);
                if (res.isDemo && res.demoCode && triggerOtpToast) {
                    triggerOtpToast(res.demoCode);
                }
                setTimeout(() => inputRefs[0].current?.focus(), 150);
            } else {
                alert(res?.message || "Account not found or error dispatching code");
            }
        } catch (err) {
            alert("Network error sending reset code.");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Real OTP Verification against Backend
    const triggerOtpVerification = async (enteredCode) => {
        setIsLoading(true);
        setOtpError("");
        try {
            const res = await apiVerifyForgotPasswordOtp(email.trim().toLowerCase(), enteredCode);
            if (res && res.success) {
                setIsOtpVerified(true);
                setTimeout(() => {
                    setStep(3);
                }, 900);
            } else {
                setOtpError(res?.message || "Invalid verification code. Please check your email.");
                setOtpDigits(["", "", "", ""]);
                inputRefs[0].current?.focus();
            }
        } catch (err) {
            setOtpError("Network error verifying code. Try again.");
            setOtpDigits(["", "", "", ""]);
            inputRefs[0].current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    // 4 Segmented Box Inputs Handler
    const handleOtpChange = (index, value) => {
        const char = value.replace(/[^0-9]/g, "").slice(-1);
        const updated = [...otpDigits];
        updated[index] = char;
        setOtpDigits(updated);
        setOtpError("");

        if (char && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        const completeCode = updated.join("");
        if (completeCode.length === 4) {
            triggerOtpVerification(completeCode);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // 3. Reset Password
    const handleFinalReset = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            alert("Please fill both password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                email: email.trim().toLowerCase(),
                portalType,
                code: otpDigits.join(""),
                newPassword: newPassword.trim(),
                confirmPassword: confirmPassword.trim()
            };

            const res = await apiResetPasswordWithOtp(payload);
            if (res && res.success) {
                alert("Password reset successfully! Please sign in with your new password.");
                if (onPasswordResetSuccess) onPasswordResetSuccess();
                handleCloseModal();
            } else {
                alert(res?.message || "Failed to update password");
            }
        } catch (err) {
            alert("Error updating password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setStep(1);
        setOtpDigits(["", "", "", ""]);
        setIsOtpVerified(false);
        setOtpError("");
        setNewPassword("");
        setConfirmPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    return (
        <div className="eb-forgot-modal-backdrop" onClick={handleCloseModal}>
            <div className="eb-forgot-modal-sheet" onClick={(e) => e.stopPropagation()}>
                {/* Mobile Drag Pill */}
                <div className="eb-modal-drag-pill" />

                <button type="button" className="eb-modal-close-ico" onClick={handleCloseModal}>
                    <X size={18} />
                </button>

                {/* STEP 1: ENTER REGISTERED EMAIL */}
                {step === 1 && (
                    <div className="eb-forgot-content-box">
                        <div className="eb-forgot-icon-badge">
                            <KeyRound size={22} />
                        </div>
                        <h2>Reset your password</h2>
                        <p>
                            Enter the registered {portalType === "organisation" ? "organisation" : "account"} email to receive a 4-digit verification code.
                        </p>

                        <form onSubmit={handleSendCode} className="eb-forgot-form">
                            <div className="eb-forgot-input-wrap">
                                <label>Registered Email Address</label>
                                <div className="eb-forgot-input-inner">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        placeholder="name@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="eb-forgot-submit-btn" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        <Loader2 size={16} className="spin-loader" /> Sending Code...
                                    </span>
                                ) : (
                                    <>Send Reset Code <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 2: 4-DIGIT SEGMENTED VERIFICATION CODE */}
                {step === 2 && (
                    <div className="eb-forgot-content-box">
                        {isOtpVerified ? (
                            <div className="eb-otp-verified-celebrate">
                                <CheckCircle2 size={54} className="verified-bounce-icon" />
                                <h3>Code Verified!</h3>
                                <p>Securing session and taking you to password setup...</p>
                            </div>
                        ) : (
                            <>
                                <h2>Let's verify your code</h2>
                                <p>
                                    We've sent a 4-digit code to <strong>{email}</strong>. It will auto-verify once entered.
                                </p>

                                <div className="eb-otp-segmented-grid">
                                    {otpDigits.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={inputRefs[idx]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                            className={`eb-otp-digit-box ${digit ? "filled" : ""} ${idx === otpDigits.findIndex(d => !d) ? "active-focus" : ""} ${otpError ? "has-error" : ""}`}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                {isLoading && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#fda4af", fontSize: "13px", marginBottom: "8px" }}>
                                        <Loader2 size={15} className="spin-loader" /> Verifying code...
                                    </div>
                                )}

                                {otpError && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#f87171", fontSize: "12.5px", margin: "4px 0 12px" }}>
                                        <AlertCircle size={14} />
                                        <span>{otpError}</span>
                                    </div>
                                )}

                                <div className="eb-otp-resend-row">
                                    <span>Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        className="eb-resend-link"
                                        onClick={handleSendCode}
                                        disabled={resendTimer > 0 || isLoading}
                                    >
                                        <RotateCcw size={12} />
                                        <span>{resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* STEP 3: CREATE NEW PASSWORD */}
                {step === 3 && (
                    <div className="eb-forgot-content-box">
                        <div className="eb-forgot-icon-badge success">
                            <ShieldCheck size={22} />
                        </div>
                        <h2>Create New Password</h2>
                        <p>Set a new, secure password for your {portalType} account.</p>

                        <form onSubmit={handleFinalReset} className="eb-forgot-form">
                            <div className="eb-forgot-input-wrap">
                                <label>New Password</label>
                                <div className="eb-forgot-input-inner">
                                    <Lock size={16} />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Minimum 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="eb-toggle-pass-eye"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowNewPassword((prev) => !prev);
                                        }}
                                        title={showNewPassword ? "Hide password" : "Show password"}
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="eb-forgot-input-wrap">
                                <label>Confirm New Password</label>
                                <div className="eb-forgot-input-inner">
                                    <Lock size={16} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eb-toggle-pass-eye"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowConfirmPassword((prev) => !prev);
                                        }}
                                        title={showConfirmPassword ? "Hide password" : "Show password"}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="eb-forgot-submit-btn" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        <Loader2 size={16} className="spin-loader" /> Saving Password...
                                    </span>
                                ) : (
                                    "Save & Sign In"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}