import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const admins = [
    {
        name: "Ansh Raj",
        email: "anshkumar4377@gmail.com",
        password: "ansh@eblood2026",
        role: "Main Admin & Leader",
        phone: "+91 73678 24173",
        location: "Punjab, India",
        isSuperAdmin: true
    },
    {
        name: "Ankit Harivanshi",
        email: "ankit07@gmail.com",
        password: "ankit@eblood2026",
        role: "Admin & Researcher",
        phone: "+91 87893 80878",
        location: "Punjab, India",
        isSuperAdmin: false
    },
    {
        name: "Abhishek Aarya",
        email: "abhishekrazz58@gmail.com",
        password: "abhishek@eblood2026",
        role: "Admin & UI/UX Designer",
        phone: "+91 91356 20023",
        location: "Punjab, India",
        isSuperAdmin: false
    },
    {
        name: "Ranjit Kushwaha",
        email: "ranjitkumar3603706@gmail.com",
        password: "ranjit@eblood2026",
        role: "Admin & Backend Programmer",
        phone: "+91 62050 03763",
        location: "Punjab, India",
        isSuperAdmin: false
    }
];

const seedAdmins = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("MONGO_URI is missing in .env file");
            process.exit(1);
        }

        await mongoose.connect(mongoUri);

        for (const admin of admins) {
            await Admin.findOneAndUpdate(
                { email: admin.email.toLowerCase() },
                { $set: admin },
                { upsert: true, new: true }
            );
            console.log(`Seeded Admin: ${admin.name} (${admin.email})`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error seeding admins:", err);
        process.exit(1);
    }
};

seedAdmins();