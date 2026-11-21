import React, { useState, useEffect } from "react";
import { 
    Bell, 
    Calendar, 
    Building2, 
    CheckCheck, 
    Trash2, 
    ExternalLink, 
    Clock, 
    Loader2, 
    Sparkles,
    ShieldAlert
} from "lucide-react";
import { 
    apiGetNotifications, 
    apiMarkNotificationRead, 
    apiMarkAllNotificationsRead, 
    apiClearAllNotifications 
} from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/NotificationsPage.css";

function formatTimeAgo(dateString) {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export default function NotificationsPage({ onGoToHome, onNavigate }) {
    const { language, t } = useLanguage();
    const isHindi = language === "hi";

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await apiGetNotifications();
            if (res && res.success && Array.isArray(res.notifications)) {
                setNotifications(res.notifications);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error("Error loading real notifications:", err);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        setNotifications((prev) => 
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        try {
            await apiMarkNotificationRead(id);
        } catch (err) {
            console.error("Mark read error:", err);
        }
    };

    const handleMarkAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await apiMarkAllNotificationsRead();
        } catch (err) {
            console.error("Mark all read error:", err);
        }
    };

    const handleClearAll = async () => {
        const confirmClear = window.confirm(
            isHindi ? "क्या आप सभी वास्तविक सूचनाएं हटाना चाहते हैं?" : "Are you sure you want to clear all notifications?"
        );
        if (!confirmClear) return;

        setNotifications([]);
        try {
            await apiClearAllNotifications();
        } catch (err) {
            console.error("Clear notifications error:", err);
        }
    };

    const handleActionClick = (notif) => {
        handleMarkAsRead(notif._id);
        const path = notif.actionPath || "/camps";
        const pageKey = path.replace("/", "") || "home";
        if (onNavigate) {
            onNavigate(pageKey);
        }
    };

    const filteredNotifications = notifications.filter((notif) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "camps") return notif.type === "camp";
        if (activeFilter === "emergency") return notif.type === "emergency";
        if (activeFilter === "banks") return notif.type === "bank";
        if (activeFilter === "reminders") return notif.type === "reminder" || notif.type === "announcement";
        return true;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const renderTypeIcon = (type) => {
        switch (type) {
            case "camp":
                return <Calendar size={20} />;
            case "emergency":
                return <ShieldAlert size={20} />;
            case "bank":
                return <Building2 size={20} />;
            case "reminder":
                return <Sparkles size={20} />;
            default:
                return <Bell size={20} />;
        }
    };

    return (
        <div className="eb-notif-page-root">
            <div className="eb-container">
                <nav className="eb-breadcrumb" aria-label="Breadcrumb">
                    <span className="breadcrumb-link" onClick={onGoToHome}>{t("home")}</span>
                    <span className="breadcrumb-sep">&rsaquo;</span>
                    <span className="breadcrumb-current">{isHindi ? "सूचना केंद्र" : "Notification Center"}</span>
                </nav>

                <div className="eb-notif-header-strip">
                    <div className="eb-notif-title-wrap">
                        <h1>
                            <span>{isHindi ? "सूचनाएं व अलर्ट" : "Notifications & Alerts"}</span>
                            {unreadCount > 0 && (
                                <span className="eb-notif-count-pill">{unreadCount} {isHindi ? "नया" : "New"}</span>
                            )}
                        </h1>
                        <p className="eb-notif-subtext">
                            {isHindi 
                                ? "संस्थाओं द्वारा आयोजित रक्तदान शिविरों और वास्तविक आपातकालीन अनुरोधों के वास्तविक अलर्ट।"
                                : "Real-time updates on scheduled blood camps, emergencies, and inventory reports."}
                        </p>
                    </div>

                    <div className="eb-notif-top-actions">
                        {unreadCount > 0 && (
                            <button 
                                type="button" 
                                className="eb-btn-text-action"
                                onClick={handleMarkAllRead}
                            >
                                <CheckCheck size={14} color="#16a34a" />
                                <span>{isHindi ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark all as read"}</span>
                            </button>
                        )}

                        {notifications.length > 0 && (
                            <button 
                                type="button" 
                                className="eb-btn-text-action"
                                onClick={handleClearAll}
                            >
                                <Trash2 size={14} color="#e11d48" />
                                <span>{isHindi ? "साफ़ करें" : "Clear all"}</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="eb-notif-filter-tabs">
                    <button 
                        type="button" 
                        className={`eb-notif-tab ${activeFilter === "all" ? "active" : ""}`}
                        onClick={() => setActiveFilter("all")}
                    >
                        {isHindi ? "सभी" : "All"} ({notifications.length})
                    </button>
                    <button 
                        type="button" 
                        className={`eb-notif-tab ${activeFilter === "camps" ? "active" : ""}`}
                        onClick={() => setActiveFilter("camps")}
                    >
                        {isHindi ? "रक्तदान शिविर" : "Blood Camps"}
                    </button>
                    <button 
                        type="button" 
                        className={`eb-notif-tab ${activeFilter === "emergency" ? "active" : ""}`}
                        onClick={() => setActiveFilter("emergency")}
                    >
                        {isHindi ? "आपातकालीन अलर्ट" : "Emergency Alerts"}
                    </button>
                    <button 
                        type="button" 
                        className={`eb-notif-tab ${activeFilter === "banks" ? "active" : ""}`}
                        onClick={() => setActiveFilter("banks")}
                    >
                        {isHindi ? "ब्लड बैंक" : "Blood Banks"}
                    </button>
                    <button 
                        type="button" 
                        className={`eb-notif-tab ${activeFilter === "reminders" ? "active" : ""}`}
                        onClick={() => setActiveFilter("reminders")}
                    >
                        {isHindi ? "सुझाव व घोषणाएं" : "Reminders & Tips"}
                    </button>
                </div>

                {isLoading ? (
                    <div className="eb-notif-empty-state">
                        <Loader2 size={32} className="spin-loader" style={{ color: "#e11d48" }} />
                        <p>{isHindi ? "वास्तविक सूचनाएं लोड हो रही हैं..." : "Loading notifications..."}</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="eb-notif-empty-state">
                        <Bell size={42} color="#cbd5e1" />
                        <h3>{isHindi ? "कोई सूचना नहीं है" : "No Notifications Found"}</h3>
                        <p>
                            {isHindi 
                                ? "जब कोई संस्था रक्तदान शिविर आयोजित करेगी या कोई आपातकालीन अलर्ट जारी होगा, वह यहाँ दिखेगा।"
                                : "When organisations create blood camps or hospitals broadcast shortage alerts, they will appear here in real time."}
                        </p>
                    </div>
                ) : (
                    <div className="eb-notif-deck">
                        {filteredNotifications.map((notif) => (
                            <div 
                                key={notif._id} 
                                className={`eb-notif-item-card ${!notif.isRead ? "unread" : ""}`}
                                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                            >
                                <div className={`eb-notif-icon-circle ${notif.type || "camp"}`}>
                                    {renderTypeIcon(notif.type)}
                                </div>

                                <div className="eb-notif-content">
                                    <div className="eb-notif-content-top">
                                        <h3>{notif.title}</h3>
                                        <span className="eb-notif-time">
                                            <Clock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                                            {formatTimeAgo(notif.createdAt)}
                                        </span>
                                    </div>

                                    <p className="eb-notif-desc">{notif.message}</p>

                                    <div className="eb-notif-footer-row">
                                        <div className="eb-notif-badge-group">
                                            <span className={`eb-notif-type-tag ${notif.type || "camp"}`}>
                                                {notif.type === "camp" && (isHindi ? "शिविर अलर्ट" : "Camp Alert")}
                                                {notif.type === "emergency" && (isHindi ? "आपातकालीन" : "Emergency")}
                                                {notif.type === "bank" && (isHindi ? "ब्लड बैंक" : "Blood Bank")}
                                                {notif.type === "reminder" && (isHindi ? "स्वास्थ्य सुझाव" : "Health Tip")}
                                                {notif.type === "announcement" && (isHindi ? "घोषणा" : "Announcement")}
                                            </span>

                                            {notif.targetLocation?.district && (
                                                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                                                    📍 {notif.targetLocation.district}
                                                </span>
                                            )}
                                        </div>

                                        <button 
                                            type="button" 
                                            className="eb-notif-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(notif);
                                            }}
                                        >
                                            <span>{notif.actionLabel || (isHindi ? "विवरण देखें" : "View Details")}</span>
                                            <ExternalLink size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}