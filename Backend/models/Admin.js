import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Main Admin & Leader", "Admin & Researcher", "Admin & UI/UX Designer", "Admin & Backend Programmer"],
            required: true
        },
        phone: {
            type: String,
            default: ""
        },
        avatar: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: "Punjab, India"
        },
        isSuperAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);