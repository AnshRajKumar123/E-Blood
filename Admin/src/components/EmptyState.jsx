import React from "react";
import { Inbox, RefreshCw } from "lucide-react";
import "../styles/EmptyState.css";

export default function EmptyState({ title, message, onRefresh }) {
    return (
        <div className="eb-empty-state-card">
            <div className="eb-empty-icon-ring">
                <Inbox size={32} />
            </div>
            <h3>{title || "No Records Found"}</h3>
            <p>{message || "Your database has zero active entries for this module currently."}</p>
            {onRefresh && (
                <button type="button" className="eb-btn-empty-refresh" onClick={onRefresh}>
                    <RefreshCw size={14} /> Refresh Data
                </button>
            )}
        </div>
    );
}