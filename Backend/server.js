import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import bloodBankRoutes from "./routes/bloodBankRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import adminAuthRoutes from "./routes/adminAuthRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB().then(async () => {
    try {
        const usersCollection = mongoose.connection.collection("users");
        const indexes = await usersCollection.indexes();
        const hasPhoneIndex = indexes.some((idx) => idx.name === "phone_1");
        
        if (hasPhoneIndex) {
            const phoneIdx = indexes.find((idx) => idx.name === "phone_1");
            if (!phoneIdx.sparse) {
                await usersCollection.dropIndex("phone_1");
                await usersCollection.createIndex({ phone: 1 }, { unique: true, sparse: true });
            }
        }
    } catch (err) {
        console.warn("[MongoDB Index Warning]:", err.message);
    }
});

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve absolute uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/bloodbanks", bloodBankRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin-auth", adminAuthRoutes);

app.get("/", (req, res) => {
    res.send("E-Blood API Server is Running...");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});