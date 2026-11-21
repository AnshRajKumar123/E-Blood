import React, { useState } from "react";
import { Search, Trash2, Building2, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { deleteAdminBloodBank } from "../services/adminApi";
import EmptyState from "../components/EmptyState";
import "../styles/ManagementTable.css";

export default function BloodBankManagement({ banks, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const filtered = (banks || []).filter((b) => 
        (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.city || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (bank) => {
        if (!window.confirm(`Permanently delete blood centre "${bank.name}"`)) return;

        setDeletingId(bank._id || bank.id);
        try {
            const res = await deleteAdminBloodBank(bank._id || bank.id);
            if (res && res.success) {
                alert(`Blood bank "${bank.name}" deleted successfully.`);
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
                        placeholder="Search blood centres by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button type="button" className="eb-filter-refresh" onClick={onRefresh}>
                    <RefreshCw size={15} />
                </button>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    title="No Blood Banks Registered"
                    message="There are currently zero blood centres listed."
                    onRefresh={onRefresh}
                />
            ) : (
                <div className="eb-table-card">
                    <table className="eb-custom-table">
                        <thead>
                            <tr>
                                <th>Centre Name</th>
                                <th>District / State</th>
                                <th>Phone Helpline</th>
                                <th>Stock Units</th>
                                <th>License</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((bank) => {
                                const isDeleting = deletingId === (bank._id || bank.id);
                                return (
                                    <tr key={bank._id || bank.id}>
                                        <td>
                                            <strong>{bank.name}</strong>
                                            <small style={{ display: "block", color: "#64748b" }}>{bank.category || "General Centre"}</small>
                                        </td>
                                        <td>{bank.city || bank.district}, {bank.state}</td>
                                        <td>{bank.phone || "N/A"}</td>
                                        <td>
                                            <span className="units-tag">{bank.unitsInStock || 0} Units</span>
                                        </td>
                                        <td><code>{bank.licenseNumber || "CLAA-Verified"}</code></td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="btn-trash-action"
                                                onClick={() => handleDelete(bank)}
                                                disabled={isDeleting}
                                                title="Delete blood bank"
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