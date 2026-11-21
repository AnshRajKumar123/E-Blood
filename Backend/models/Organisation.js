import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
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
            default: ""
        },
        contactPerson: {
            type: String,
            default: "Admin"
        },
        phone: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: "Punjab"
        },
        district: {
            type: String,
            default: "Punjab"
        },
        state: {
            type: String,
            default: "Punjab"
        },
        licenseNumber: {
            type: String,
            default: ""
        },
        category: {
            type: String,
            default: "Private"
        },
        myRole: {
            type: String,
            default: "Admin"
        },
        teamMembers: [
            {
                name: String,
                email: String,
                role: { type: String, default: "Staff" }
            }
        ],
        contactNumbers: [
            {
                phone: String,
                tag: { type: String, default: "General" }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.models.Organisation || mongoose.model("Organisation", organisationSchema);