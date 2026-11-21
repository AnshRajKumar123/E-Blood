import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: "User" },
        email: { type: String, trim: true, lowercase: true, sparse: true },
        password: { type: String, default: "" },
        phone: { type: String, trim: true, sparse: true },
        phoneVerified: { type: Boolean, default: false },
        bloodGroup: { type: String, default: "" },
        address: { type: String, default: "" },
        landmark: { type: String, default: "" },
        pincode: { type: String, default: "" },
        city: { type: String, default: "Punjab" },
        district: { type: String, default: "Punjab" },
        state: { type: String, default: "Punjab" },
        weight: { type: String, default: "Standard" },
        height: { type: String, default: "" },
        dob: { type: String, default: "" },
        gender: { type: String, default: "Male" },
        reachChannel: { type: String, default: "WhatsApp" },
        matchDistance: { type: Number, default: 25 },
        isDonor: { type: Boolean, default: false },
        
        donationAvailability: {
            type: String,
            enum: ["open", "urgent_only", "temporarily_unavailable", "paused"],
            default: "open"
        },
        resumeAvailabilityDate: { type: String, default: "" },
        lastDonationHistoryType: {
            type: String,
            enum: ["never", "donated_before", "dont_remember"],
            default: "never"
        },
        lastDonationDate: { type: String, default: "" },
        donationType: {
            type: String,
            enum: ["whole_blood", "platelets", "plasma", "other", ""],
            default: ""
        },
        travelDistancePreference: {
            type: String,
            enum: ["up_to_5km", "5_to_15km", "15_to_30km", "more_than_30km", "no_preference"],
            default: "no_preference"
        },
        showInDonorList: { type: Boolean, default: true },
        contactSharingPreference: {
            type: String,
            enum: ["after_accept", "direct_blood_banks"],
            default: "after_accept"
        },
        preferencesUpdatedAt: { type: Date, default: Date.now },

        pickupPoint: { type: String, default: "Designated Pickup Point" },
        coordinates: {
            lat: { type: Number, default: 30.7333 },
            lng: { type: Number, default: 76.7794 }
        },
        savedLocations: [
            {
                title: String,
                address: String,
                lat: Number,
                lng: Number,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        // Notification Center with Call Privacy & Timer Window
        notifications: {
            whatsapp: { type: Boolean, default: true },
            sms: { type: Boolean, default: true },
            push: { type: Boolean, default: false },
            allowCall: { type: Boolean, default: false }, // "No" by default
            callStartTime: { type: String, default: "09:00" },
            callEndTime: { type: String, default: "20:00" }
        }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);