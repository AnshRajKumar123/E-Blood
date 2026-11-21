import React, { useState, useEffect } from "react";
import {
    Users,
    Building2,
    Tent,
    Droplet,
    ArrowUpRight,
    Calendar,
    Clock,
    Phone,
    MapPin,
    ShieldCheck,
    Plus,
    Play,
    Pause,
    RotateCcw,
    Sparkles
} from "lucide-react";
import "../styles/DashboardOverview.css";

export default function DashboardOverview({ donors = [], banks = [], camps = [], onSelectTab, admin }) {
    const donorsCount = donors.length;
    const banksCount = banks.length;
    const campsCount = camps.length;
    const totalUnits = banks.reduce((acc, curr) => acc + (Number(curr.unitsInStock) || 0), 0);

    const nextCamp = camps.length > 0 ? camps[0] : null;

    // Dispatch Stopwatch
    const [timerSeconds, setTimerSeconds] = useState(488);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTimer = (totalSec) => {
        const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
        const s = String(totalSec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const targetGoal = Math.max(50, donorsCount + 10);
    const progressPercent = Math.min(100, Math.round((donorsCount / targetGoal) * 100));

    return (
        <div className="eb-donezo-dashboard">
            {/* 1. GREETING BANNER FOR LOGGED-IN ADMIN */}
            <div className="eb-admin-greeting-banner">
                <div className="banner-left-info">
                    <span className="banner-role-pill">
                        <Sparkles size={13} /> {admin?.role || "Admin"}
                    </span>
                    <h2>Hello, {admin?.name || "Admin"}  👋</h2>
                    <p>
                        Welcome back to the E-Blood master command deck. System is running live with synchronization.
                    </p>
                </div>
                <div className="banner-right-meta">
                    <div className="meta-chip">
                        <ShieldCheck size={16} color="#e11d48" />
                        <span>Master Access Level</span>
                    </div>
                </div>
            </div>

            {/* Header Action Strip */}
            <div className="eb-donezo-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Real-time emergency donor dispatch and clinical inventory metrics.</p>
                </div>
                <div className="eb-header-btns">
                    <button type="button" className="btn-primary-red" onClick={() => onSelectTab("camps")}>
                        <Plus size={16} /> Schedule Camp
                    </button>
                    <button type="button" className="btn-outline-white" onClick={() => onSelectTab("donors")}>
                        Export Registry
                    </button>
                </div>
            </div>

            {/* Top 4 KPI Cards */}
            <div className="eb-kpi-quad-grid">
                <div className="eb-kpi-card-white" onClick={() => onSelectTab("donors")}>
                    <div className="kpi-card-head">
                        <span className="kpi-title">Total Donors</span>
                        <span className="kpi-corner-btn"><ArrowUpRight size={16} /></span>
                    </div>
                    <div className="kpi-value-main">{donorsCount}</div>
                    <div className="kpi-footer-sub">
                        <span className="kpi-pill red">Live Database</span>
                        <small>Registered Citizens</small>
                    </div>
                </div>

                <div className="eb-kpi-card-white" onClick={() => onSelectTab("banks")}>
                    <div className="kpi-card-head">
                        <span className="kpi-title">Blood Centres</span>
                        <span className="kpi-corner-btn"><ArrowUpRight size={16} /></span>
                    </div>
                    <div className="kpi-value-main">{banksCount}</div>
                    <div className="kpi-footer-sub">
                        <span className="kpi-pill black">CLAA Certified</span>
                        <small>Licensed Banks</small>
                    </div>
                </div>

                <div className="eb-kpi-card-white" onClick={() => onSelectTab("camps")}>
                    <div className="kpi-card-head">
                        <span className="kpi-title">Active Drives</span>
                        <span className="kpi-corner-btn"><ArrowUpRight size={16} /></span>
                    </div>
                    <div className="kpi-value-main">{campsCount}</div>
                    <div className="kpi-footer-sub">
                        <span className="kpi-pill red">Upcoming</span>
                        <small>Community Drives</small>
                    </div>
                </div>

                <div className="eb-kpi-card-white">
                    <div className="kpi-card-head">
                        <span className="kpi-title">Total Stock Units</span>
                        <span className="kpi-corner-btn"><ArrowUpRight size={16} /></span>
                    </div>
                    <div className="kpi-value-main">{totalUnits}</div>
                    <div className="kpi-footer-sub">
                        <span className="kpi-pill black">Inventory</span>
                        <small>Units in Storage</small>
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart + Reminders + Action List */}
            <div className="eb-mid-trio-grid">
                <div className="eb-white-card eb-chart-box">
                    <div className="card-inner-head">
                        <h3>Donation Registrations Activity</h3>
                        <small>Weekly Volunteer Inflow</small>
                    </div>

                    <div className="eb-pill-bar-stage">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                            const heights = [45, 80, 60, 95, 35, 70, 50];
                            const isPeak = idx === 3;
                            return (
                                <div key={idx} className="eb-bar-col">
                                    <div className="eb-bar-track">
                                        <div
                                            className={`eb-bar-fill ${isPeak ? "peak" : ""}`}
                                            style={{ height: `${heights[idx]}%` }}
                                        >
                                            {isPeak && <span className="bar-tag">Peak</span>}
                                        </div>
                                    </div>
                                    <span className="bar-day-lbl">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="eb-white-card eb-reminder-box">
                    <span className="box-mini-lbl">Upcoming Scheduled Drive</span>
                    {nextCamp ? (
                        <>
                            <h4>{nextCamp.title}</h4>
                            <p className="reminder-time">
                                <Clock size={13} /> {nextCamp.campDate} ({nextCamp.startTime || "09:00"} - {nextCamp.endTime || "17:00"})
                            </p>
                            <p className="reminder-venue">
                                <MapPin size={13} /> {nextCamp.campAddress || `${nextCamp.city || ""}, ${nextCamp.district || ""}`}
                            </p>
                            <button
                                type="button"
                                className="eb-btn-reminder-action"
                                onClick={() => onSelectTab("camps")}
                            >
                                <Calendar size={15} /> Manage Drive Details
                            </button>
                        </>
                    ) : (
                        <div className="reminder-empty">
                            <p>No active outdoor blood donation drive scheduled.</p>
                            <button
                                type="button"
                                className="eb-btn-reminder-action"
                                onClick={() => onSelectTab("camps")}
                            >
                                <Plus size={15} /> Schedule Drive
                            </button>
                        </div>
                    )}
                </div>

                <div className="eb-white-card eb-project-tasks-box">
                    <div className="card-inner-head-row">
                        <h3>System Operational Focus</h3>
                        <button type="button" className="btn-icon-subtle" onClick={() => onSelectTab("profile")}>
                            View Tasks
                        </button>
                    </div>

                    <div className="task-items-list">
                        <div className="task-line-item">
                            <div className="task-ico red"><Droplet size={14} /></div>
                            <div className="task-content">
                                <strong>CLAA Verification Check</strong>
                                <small>Review hospital drug licenses</small>
                            </div>
                        </div>

                        <div className="task-line-item">
                            <div className="task-ico black"><ShieldCheck size={14} /></div>
                            <div className="task-content">
                                <strong>DPDP Compliance Review</strong>
                                <small>Donor privacy data controls</small>
                            </div>
                        </div>

                        <div className="task-line-item">
                            <div className="task-ico red"><Users size={14} /></div>
                            <div className="task-content">
                                <strong>Cool-off Sync Routine</strong>
                                <small>90-day recovery window updates</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="eb-bottom-trio-grid">
                <div className="eb-white-card eb-table-panel">
                    <div className="card-inner-head-row">
                        <h3>Voluntary Donors (Latest Entries)</h3>
                        <button type="button" className="btn-table-more" onClick={() => onSelectTab("donors")}>
                            View All ({donorsCount})
                        </button>
                    </div>

                    {donors.length === 0 ? (
                        <div className="table-empty-box">
                            <p>No registered voluntary donors found.</p>
                        </div>
                    ) : (
                        <div className="table-scroll-wrap">
                            <table className="eb-mini-data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Blood Group</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.slice(0, 4).map((d) => (
                                        <tr key={d._id || d.id}>
                                            <td>
                                                <div className="table-user-strip">
                                                    <div className="user-avatar-circle">
                                                        {(d.name || "D").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{d.name}</strong>
                                                        <small>{d.email || d.phone || "No direct email"}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge-blood-red">{d.bloodGroup || "O+"}</span>
                                            </td>
                                            <td>
                                                <span className="user-city">{d.city || d.district || "Punjab"}</span>
                                            </td>
                                            <td>
                                                <span className="badge-status-completed">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="eb-white-card eb-gauge-panel">
                    <div className="card-inner-head">
                        <h3>Network Fulfillment</h3>
                        <small>Donor Target Ratio</small>
                    </div>

                    <div className="gauge-stage">
                        <svg width="190" height="105" viewBox="0 0 100 55" className="gauge-svg">
                            <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="#f1f5f9"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="#e11d48"
                                strokeWidth="12"
                                strokeDasharray="125.6"
                                strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="gauge-center-data">
                            <h2>{progressPercent}%</h2>
                            <small>Goal: {targetGoal} Donors</small>
                        </div>
                    </div>

                    <div className="gauge-legend-pills">
                        <span className="g-pill"><span className="g-dot red" /> Verified ({donorsCount})</span>
                        <span className="g-pill"><span className="g-dot black" /> Target ({targetGoal})</span>
                    </div>
                </div>

                <div className="eb-black-card eb-timer-panel">
                    <div className="timer-header">
                        <span className="timer-title">Emergency Response Timer</span>
                        <span className="timer-indicator-live" />
                    </div>

                    <div className="timer-digits">
                        {formatTimer(timerSeconds)}
                    </div>

                    <div className="timer-ctrls">
                        <button
                            type="button"
                            className="btn-timer-icon"
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            title={isTimerRunning ? "Pause" : "Start"}
                        >
                            {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                            type="button"
                            className="btn-timer-icon reset"
                            onClick={() => setTimerSeconds(0)}
                            title="Reset Stopwatch"
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}