import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema(
    {
        organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
        name: { type: String, required: true, trim: true },
        category: { type: String, default: "Govt." },
        licenseNumber: { type: String, trim: true },
        address: { type: String, required: true },
        state: { type: String, default: "Punjab" },
        district: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, trim: true },
        phone: { type: String, required: true },
        email: { type: String, trim: true },
        mapsLink: { type: String, trim: true },
        unitsInStock: { type: Number, default: 50 },
        distanceKm: { type: Number, default: 2.5 },
        lat: { type: Number, default: 30.6244 },
        lng: { type: Number, default: 76.2467 },
        donorTypes: [String],
        donationTypes: [String],
        components: [String],
        bagTypes: [String],
        stock: {
            "A+": { type: Number, default: 10 },
            "A-": { type: Number, default: 5 },
            "B+": { type: Number, default: 15 },
            "B-": { type: Number, default: 5 },
            "AB+": { type: Number, default: 8 },
            "AB-": { type: Number, default: 2 },
            "O+": { type: Number, default: 20 },
            "O-": { type: Number, default: 5 }
        }
    },
    { timestamps: true }
);

export default mongoose.model("BloodBank", bloodBankSchema);