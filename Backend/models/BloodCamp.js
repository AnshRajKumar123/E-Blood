import mongoose from "mongoose";

const bloodCampSchema = new mongoose.Schema(
    {
        organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
        title: { type: String, required: true, trim: true },
        organiserName: { type: String, required: true },
        organiserMobile: { type: String, required: true },
        organiserEmail: { type: String },
        campAddress: { type: String, required: true },
        state: { type: String, default: "Punjab" },
        district: { type: String, required: true },
        city: { type: String, required: true },
        campDate: { type: String, required: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        estimatedParticipants: { type: Number, default: 100 },
        whatsappNumber: { type: String },
        mapsLink: { type: String },
        supporter: { type: String },
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
        },
        // Multiple images array for the 3-second carousel
        images: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

export default mongoose.models.BloodCamp || mongoose.model("BloodCamp", bloodCampSchema);