import React, { useState, useEffect, useRef } from "react";
import { 
    Search, 
    Trash2, 
    MapPin, 
    Phone, 
    ShieldCheck, 
    RefreshCw, 
    Loader2, 
    Users, 
    ChevronDown, 
    Check, 
    Droplet 
} from "lucide-react";
import { deleteDonorAccount } from "../services/adminApi";
import EmptyState from "../components/EmptyState";
import "../styles/ManagementTable.css";

// Accessible Custom Blood Group Dropdown
function CustomBloodSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const bloodOptions = [
        { value: "", label: "All Blood Groups" },
        { value: "A+", label: "A+ Positive" },
        { value: "A-", label: "A- Negative" },
        { value: "B+", label: "B+ Positive" },
        { value: "B-", label: "B- Negative" },
        { value: "AB+", label: "AB+ Positive" },
        { value: "AB-", label: "AB- Negative" },
        { value: "O+", label: "O+ Positive" },
        { value: "O-", label: "O- Negative" }
    ];

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = bloodOptions.find((opt) => opt.value === value) || bloodOptions[0];

    return (
        <div className="eb-custom-blood-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className={`eb-blood-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-left">
                    <Droplet size={14} className={value ? "ico-active" : "ico-muted"} />
                    <span>{selectedOption.label}</span>
                </div>
                <ChevronDown size={14} className={`trigger-chevron ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-blood-menu-portal">
                    {bloodOptions.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                className={`eb-blood-option-row ${isSelected ? "selected" : ""}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="opt-left">
                                    {opt.value && <span className="opt-blood-pill">{opt.value}</span>}
                                    <span className="opt-label">{opt.label}</span>
                                </div>
                                {isSelected && <Check size={14} className="opt-check" />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function DonorManagement({ donors = [], onRefresh }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const totalDonorsCount = donors.length;

    const filtered = (donors || []).filter((d) => {
        const matchesQuery = 
            (d.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.phone || "").includes(searchTerm);
        const matchesBlood = !selectedGroup || d.bloodGroup === selectedGroup;
        return matchesQuery && matchesBlood;
    });

    const handleDelete = async (donor) => {
        const identifier = donor.email || donor.phone;
        if (!identifier) {
            alert("No email or phone identifier attached to this user.");
            return;
        }

        const confirmMsg = `Are you sure you want to permanently delete donor "${donor.name}"?\n\nThis will remove them and force their active session to logout.`;
        if (!window.confirm(confirmMsg)) return;

        setDeletingId(donor._id || donor.id);
        try {
            const res = await deleteDonorAccount(identifier);
            if (res && res.success) {
                alert(`Donor "${donor.name}" was permanently removed.`);
                onRefresh();
            } else {
                alert(res?.message || "Failed to delete user account.");
            }
        } catch {
            alert("Error communicating with backend.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="eb-table-pane-root">
            {/* Top Stat Summary Banner */}
            <div className="eb-donor-summary-banner">
                <div className="summary-left">
                    <div className="summary-icon-pill">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2>Donors Directory</h2>
                        <p>Verified voluntary donors registered in database.</p>
                    </div>
                </div>

                <div className="summary-badges-stack">
                    <div className="donor-count-chip total">
                        <small>Total Donors</small>
                        <strong>{totalDonorsCount}</strong>
                    </div>
                    <div className="donor-count-chip active">
                        <small>Filtered Matching</small>
                        <strong>{filtered.length}</strong>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar with Custom Blood Dropdown */}
            <div className="eb-filter-bar">
                <div className="eb-filter-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search donors by name, city, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <CustomBloodSelect
                    value={selectedGroup}
                    onChange={(val) => setSelectedGroup(val)}
                />

                <button 
                    type="button" 
                    className="eb-filter-refresh" 
                    onClick={onRefresh} 
                    title="Refresh live data"
                >
                    <RefreshCw size={15} />
                </button>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    title="No Registered Donors Found"
                    message={
                        searchTerm || selectedGroup
                            ? "No donors match your current search and blood group filter criteria."
                            : "There are currently zero voluntary donors."
                    }
                    onRefresh={onRefresh}
                />
            ) : (
                <div className="eb-table-card">
                    <table className="eb-custom-table">
                        <thead>
                            <tr>
                                <th>Donor Profile</th>
                                <th>Group</th>
                                <th>Location</th>
                                <th>Contact Number</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((donor) => {
                                const isDeleting = deletingId === (donor._id || donor.id);
                                return (
                                    <tr key={donor._id || donor.id}>
                                        <td>
                                            <div className="profile-cell">
                                                <div className="profile-disc">
                                                    {(donor.name || "D").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong>{donor.name}</strong>
                                                    <small>{donor.email || "No email"}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="blood-tag">{donor.bloodGroup || "O+"}</span>
                                        </td>
                                        <td>
                                            <span className="flex-text">
                                                <MapPin size={13} color="#64748b" />
                                                {donor.city || "Punjab"}, {donor.state || "Punjab"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="flex-text">
                                                <Phone size={13} color="#16a34a" />
                                                {donor.phone || "No phone"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="status-badge-verified">
                                                <ShieldCheck size={12} /> Active
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="btn-trash-action"
                                                onClick={() => handleDelete(donor)}
                                                disabled={isDeleting}
                                                title="Delete user from database"
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