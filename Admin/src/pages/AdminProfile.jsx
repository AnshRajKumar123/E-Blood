import React, { useState, useEffect, useRef } from "react";
import { 
    ShieldCheck, 
    Mail, 
    Phone, 
    MapPin, 
    Save, 
    Plus, 
    Clock, 
    Trash2, 
    CheckCircle2, 
    AlertCircle, 
    Users,
    ChevronDown,
    Check
} from "lucide-react";
import { 
    fetchAdminTeam, 
    updateAdminProfileApi, 
    fetchAdminTasksApi, 
    createAdminTaskApi, 
    toggleAdminTaskStatusApi, 
    deleteAdminTaskApi 
} from "../services/adminApi";
import "../styles/AdminProfile.css";

// Accessible Custom Dropdown Component
function CustomAdminSelect({ value, options, onChange, placeholder = "Select option" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || {
        label: placeholder,
        value: ""
    };

    return (
        <div className="eb-custom-select-box" ref={containerRef}>
            <button
                type="button"
                className={`eb-custom-select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="selected-label">{selectedOption.label}</span>
                <ChevronDown size={15} className={`chevron-indicator ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="eb-custom-dropdown-portal">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                className={`eb-custom-option-item ${isSelected ? "active" : ""}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="option-title-text">
                                    <strong>{opt.label}</strong>
                                    {opt.sublabel && <small>{opt.sublabel}</small>}
                                </div>
                                {isSelected && <Check size={14} className="check-icon" />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function AdminProfile({ admin, onUpdateAdminSession }) {
    // 1. Current Logged-in Admin Profile State
    const [name, setName] = useState(admin?.name || "");
    const [email, setEmail] = useState(admin?.email || "");
    const [phone, setPhone] = useState(admin?.phone || "");
    const [location, setLocation] = useState(admin?.location || "Punjab, India");
    const [newPassword, setNewPassword] = useState("");
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // 2. Team Admins Roster
    const [team, setTeam] = useState([]);

    // 3. Admin Tasks Board State
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("HIGH");
    const [assignedToEmail, setAssignedToEmail] = useState(admin?.email || "");
    const [dueDate, setDueDate] = useState("Today, 05:00 PM");
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const loadTeamAndTasks = async () => {
        try {
            const [teamRes, taskRes] = await Promise.all([
                fetchAdminTeam(),
                fetchAdminTasksApi()
            ]);
            if (teamRes.success && Array.isArray(teamRes.team)) {
                setTeam(teamRes.team);
                if (!assignedToEmail && teamRes.team.length > 0) {
                    setAssignedToEmail(admin?.email || teamRes.team[0].email);
                }
            }
            if (taskRes.success && Array.isArray(taskRes.tasks)) {
                setTasks(taskRes.tasks);
            }
        } catch (err) {
            console.error("Error loading team & tasks:", err);
        }
    };

    useEffect(() => {
        loadTeamAndTasks();
    }, []);

    // Handle Saving Admin Profile Updates to MongoDB
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus(null);

        try {
            const payload = {
                currentEmail: admin.email,
                name: name.trim(),
                newEmail: email.trim().toLowerCase(),
                phone: phone.trim(),
                location: location.trim(),
                password: newPassword ? newPassword.trim() : undefined
            };

            const res = await updateAdminProfileApi(payload);
            if (res && res.success && res.admin) {
                setSaveStatus({ type: "success", msg: "Profile credentials updated successfully!" });
                if (onUpdateAdminSession) {
                    onUpdateAdminSession(res.admin);
                }
                setNewPassword("");
                loadTeamAndTasks();
            } else {
                setSaveStatus({ type: "error", msg: res?.message || "Failed to update profile." });
            }
        } catch (err) {
            setSaveStatus({ type: "error", msg: "Server error saving profile." });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle Creating a Task for Self or Other Admins
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !assignedToEmail) {
            alert("Task title and assignee are required.");
            return;
        }

        setIsCreatingTask(true);
        const targetAdmin = team.find((t) => t.email.toLowerCase() === assignedToEmail.toLowerCase());
        const assigneeName = targetAdmin ? targetAdmin.name : "Admin";

        try {
            const payload = {
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                priority: taskPriority,
                assignedTo: assignedToEmail.trim().toLowerCase(),
                assignedToName: assigneeName,
                createdBy: admin.email,
                createdByName: admin.name,
                dueDate: dueDate.trim()
            };

            const res = await createAdminTaskApi(payload);
            if (res && res.success) {
                setTaskTitle("");
                setTaskDescription("");
                loadTeamAndTasks();
            } else {
                alert(res?.message || "Failed to assign task");
            }
        } catch (err) {
            alert("Error creating task.");
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleToggleTaskStatus = async (task) => {
        const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
        try {
            await toggleAdminTaskStatusApi(task._id, nextStatus);
            loadTeamAndTasks();
        } catch (err) {
            console.error("Status toggle error:", err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteAdminTaskApi(taskId);
            loadTeamAndTasks();
        } catch (err) {
            console.error("Task delete error:", err);
        }
    };

    // Dropdown Data Options
    const teamDropdownOptions = team.map((m) => ({
        value: m.email,
        label: m.name,
        sublabel: m.role
    }));

    const priorityOptions = [
        { value: "CRITICAL", label: "Critical Priority", sublabel: "Immediate response required" },
        { value: "HIGH", label: "High Priority", sublabel: "Address within 24 hours" },
        { value: "MEDIUM", label: "Medium Priority", sublabel: "Standard task delivery" },
        { value: "LOW", label: "Low Priority", sublabel: "Non-blocking checklist item" }
    ];

    return (
        <div className="eb-profile-page-canvas">
            {/* Top Grid: Profile Settings & Team Showcase */}
            <div className="eb-profile-top-grid">
                {/* 1. EDIT CURRENT ADMIN PROFILE */}
                <div className="eb-profile-card-pane">
                    <div className="pane-header">
                        <div className="pane-avatar-badge">
                            {(admin?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2>{admin?.name}</h2>
                            <span className="role-tag-red">{admin?.role}</span>
                            <small>{admin?.email}</small>
                        </div>
                    </div>

                    {saveStatus && (
                        <div className={`status-banner ${saveStatus.type}`}>
                            {saveStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span>{saveStatus.msg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="eb-profile-edit-form">
                        <div className="form-field-pair">
                            <div className="form-col">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-col">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field-pair">
                            <div className="form-col">
                                <label>Direct Phone Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="form-col">
                                <label>Base Jurisdiction</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-col">
                            <label>Update Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                placeholder="Enter new password (min. 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-save-profile-action" disabled={isSaving}>
                            <Save size={15} />
                            <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
                        </button>
                    </form>
                </div>

                {/* 2. THE 4 CORE ADMIN TEAM ROSTER */}
                <div className="eb-team-roster-pane">
                    <div className="roster-header">
                        <div>
                            <h3>Executive Administration Team</h3>
                            <small>The 4 leadership accounts verified for E-Blood.</small>
                        </div>
                        <Users size={20} color="#e11d48" />
                    </div>

                    <div className="roster-admins-list">
                        {team.map((member) => (
                            <div 
                                key={member._id || member.email} 
                                className={`roster-item-card ${member.email.toLowerCase() === admin.email.toLowerCase() ? "current-logged" : ""}`}
                            >
                                <div className="roster-disc">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="roster-info">
                                    <div className="roster-name-row">
                                        <strong>{member.name}</strong>
                                        {member.isSuperAdmin && <span className="super-pill">LEAD</span>}
                                        {member.email.toLowerCase() === admin.email.toLowerCase() && <span className="you-pill">YOU</span>}
                                    </div>
                                    <span className="roster-role-text">{member.role}</span>
                                    <small className="roster-email">{member.email}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Task Delegation Board */}
            <div className="eb-tasks-board-grid">
                {/* 3. ASSIGN TASK FORM */}
                <div className="eb-task-creator-pane">
                    <div className="task-creator-head">
                        <h3>Delegate Admin Task</h3>
                        <small>Assign high-priority tasks to yourself or team admins.</small>
                    </div>

                    <form onSubmit={handleCreateTask} className="task-creator-form">
                        <div className="form-col">
                            <label>Task Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. Audit Ludhiana blood bank stock"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Custom Dropdown: Assign To Team Member */}
                        <div className="form-col">
                            <label>Assign To (Team Member) *</label>
                            <CustomAdminSelect
                                value={assignedToEmail}
                                options={teamDropdownOptions}
                                onChange={(val) => setAssignedToEmail(val)}
                                placeholder="Choose Team Admin"
                            />
                        </div>

                        <div className="form-field-pair">
                            {/* Custom Dropdown: Priority */}
                            <div className="form-col">
                                <label>Priority Level *</label>
                                <CustomAdminSelect
                                    value={taskPriority}
                                    options={priorityOptions}
                                    onChange={(val) => setTaskPriority(val)}
                                    placeholder="Choose Priority"
                                />
                            </div>
                            <div className="form-col">
                                <label>Target Timeline</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Today 06:00 PM"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-col">
                            <label>Description / Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Details regarding this task..."
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-assign-task-action" disabled={isCreatingTask}>
                            <Plus size={15} />
                            <span>{isCreatingTask ? "Assigning..." : "Assign Task"}</span>
                        </button>
                    </form>
                </div>

                {/* 4. REAL TASKS LIST */}
                <div className="eb-tasks-list-pane">
                    <div className="tasks-list-head">
                        <h3>Team Operational Tasks ({tasks.length})</h3>
                        <small>Click checkbox to toggle completion status</small>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="tasks-empty-state">
                            <p>No administrative tasks assigned yet. Use the form to assign tasks to the team.</p>
                        </div>
                    ) : (
                        <div className="tasks-stack">
                            {tasks.map((task) => {
                                const isDone = task.status === "Completed";
                                return (
                                    <div key={task._id} className={`task-entry-item ${isDone ? "completed-task" : ""}`}>
                                        <button 
                                            type="button" 
                                            className={`task-check-circle ${isDone ? "checked" : ""}`}
                                            onClick={() => handleToggleTaskStatus(task)}
                                            aria-label="Toggle task status"
                                        >
                                            {isDone && <CheckCircle2 size={16} />}
                                        </button>

                                        <div className="task-main-text">
                                            <div className="task-top-tags">
                                                <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                                                    {task.priority}
                                                </span>
                                                <span className="assignee-tag">
                                                    Assigned to: <strong>{task.assignedToName}</strong>
                                                </span>
                                            </div>
                                            <strong className="task-item-title">{task.title}</strong>
                                            {task.description && <p className="task-item-desc">{task.description}</p>}
                                            <small className="task-item-meta">
                                                By {task.createdByName} · Due: {task.dueDate || "Standard"}
                                            </small>
                                        </div>

                                        <button 
                                            type="button" 
                                            className="btn-delete-task"
                                            onClick={() => handleDeleteTask(task._id)}
                                            title="Delete Task"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}