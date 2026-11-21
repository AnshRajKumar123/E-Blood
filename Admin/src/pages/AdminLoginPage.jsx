import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { adminLoginApi } from "../services/adminApi";
import "../styles/AdminLogin.css";
import { AdminImg } from "../assets/asset";

export default function AdminLoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Invalid email or password.");
            return;
        }

        setLoading(true);

        try {
            const res = await adminLoginApi(email.trim(), password.trim());
            if (res && res.success && res.admin) {
                onLoginSuccess(res.admin);
            } else {
                // Point 1: Display clean, safe generic error
                setError(res?.message || "Invalid email or password.");
            }
        } catch {
            setError("Server connection failure. Please verify backend service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="eb-admin-auth-root">
            <div className="eb-admin-auth-card">
                <div className="eb-auth-header">
                    <div className="eb-auth-emblem">
                        <img src={AdminImg.WebLogo} alt="Website Logo" />
                    </div>
                    <h2>E-Blood Admin</h2>
                    <p>Enter administrative credentials to access master systems</p>
                </div>

                {error && <div className="eb-auth-error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="eb-auth-form" autoComplete="off">
                    <div className="eb-auth-field">
                        <label>Admin Email</label>
                        <div className="eb-input-icon-box">
                            <Mail size={16} />
                            <input
                                type="email"
                                placeholder="Enter admin email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="eb-auth-field">
                        <label>Password</label>
                        <div className="eb-input-icon-box">
                            <Lock size={16} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="eb-toggle-pass-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowPassword((prev) => !prev);
                                }}
                                tabIndex={-1}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="eb-btn-auth-submit" disabled={loading}>
                        {loading ? (
                            <span className="flex-center">
                                <Loader2 size={16} className="spin-loader" /> Verifying Credentials...
                            </span>
                        ) : (
                            <span className="flex-center">
                                Access Control Desk <ArrowRight size={16} />
                            </span>
                        )}
                    </button>
                </form>

                <div className="eb-auth-footer-notice">
                    <ShieldCheck size={14} color="#16a34a" />
                    <span>Protected by End-to-End Rate Limiting &amp; Secure Authentication</span>
                </div>
            </div>
        </div>
    );
}