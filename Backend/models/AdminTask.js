import mongoose from "mongoose";

const adminTaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
            default: "MEDIUM"
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        },
        assignedTo: {
            type: String, // Email of assignee
            required: true
        },
        assignedToName: {
            type: String,
            required: true
        },
        createdBy: {
            type: String, // Email of creator
            required: true
        },
        createdByName: {
            type: String,
            required: true
        },
        dueDate: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

export default mongoose.models.AdminTask || mongoose.model("AdminTask", adminTaskSchema);