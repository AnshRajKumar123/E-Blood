import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["camp", "emergency", "bank", "announcement", "reminder"],
            default: "camp"
        },
        targetLocation: {
            city: { type: String, default: "" },
            district: { type: String, default: "" },
            state: { type: String, default: "" }
        },
        relatedId: {
            type: String,
            default: ""
        },
        actionPath: {
            type: String,
            default: "/camps"
        },
        actionLabel: {
            type: String,
            default: "View Details"
        },
        isGlobal: {
            type: Boolean,
            default: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);