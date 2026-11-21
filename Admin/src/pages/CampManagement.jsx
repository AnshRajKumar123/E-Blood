import React, { useState } from "react";
import { Search, Trash2, Calendar, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { deleteAdminCamp } from "../services/adminApi";
import EmptyState from "../components/EmptyState";
import "../styles/ManagementTable.css";

export default function CampManagement({ camps = [], onRefresh }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const filtered = (camps || []).filter((c) =>
        (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.city || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (camp) => {
        if (!window.confirm(`Permanently remove camp drive "${camp.title}"?`)) return;

        setDeletingId(camp._id || camp.id);
        try {
            const res = await deleteAdminCamp(camp._id || camp.id);
            if (res && res.success) {
                alert(`Camp "${camp.title}" deleted.`);
                onRefresh();
            } else {
                alert(res?.message || "Failed to delete.");
            }
        } catch {
            alert("Error communicating with backend.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="eb-table-pane-root">
            <div className="eb-filter-bar">
                <div className="eb-filter-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search scheduled camps by title or venue..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button type="button" className="eb-filter-refresh" onClick={onRefresh} title="Refresh data">
                    <RefreshCw size={15} />
                </button>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    title="No Scheduled Blood Drives"
                    message="There are no upcoming blood camps scheduled in the database."
                    onRefresh={onRefresh}
                />
            ) : (
                <div className="eb-table-card">
                    <table className="eb-custom-table">
                        <thead>
                            <tr>
                                <th>Camp Title</th>
                                <th>Venue Location</th>
                                <th>Date Scheduled</th>
                                <th>Timing</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((camp) => {
                                const isDeleting = deletingId === (camp._id || camp.id);
                                return (
                                    <tr key={camp._id || camp.id}>
                                        <td>
                                            <strong>{camp.title}</strong>
                                            <small style={{ display: "block", color: "#64748b" }}>{camp.organizer || "Voluntary Camp"}</small>
                                        </td>
                                        <td>
                                            <span className="flex-text">
                                                <MapPin size={13} color="#e11d48" />
                                                {camp.campAddress || `${camp.city || ""}, ${camp.district || ""}`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="flex-text">
                                                <Calendar size={13} color="#0a0a0a" /> {camp.campDate}
                                            </span>
                                        </td>
                                        <td>{camp.startTime || "09:00"} – {camp.endTime || "17:00"}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="btn-trash-action"
                                                onClick={() => handleDelete(camp)}
                                                disabled={isDeleting}
                                                title="Delete camp"
                                            >
                                                {isDeleting ? <Loader2 size={14} className="spin-loader" /> : <Trash2 size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}