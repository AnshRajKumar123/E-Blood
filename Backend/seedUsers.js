import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const firstNames = [
    "Aarav", "Simran", "Gurpreet", "Manpreet", "Harpreet", "Rohan", "Ananya", "Jasleen",
    "Navdeep", "Aman", "Pooja", "Vikram", "Neha", "Rahul", "Priya", "Karan",
    "Tanvi", "Siddharth", "Kavita", "Arjun", "Deepak", "Sunita", "Tarun", "Ishita",
    "Gaurav", "Mehak", "Rajesh", "Shweta", "Varun", "Ritu", "Balwinder", "Kuldeep",
    "Sarabjeet", "Ravinder", "Amandeep", "Jagjit", "Jaswinder", "Paramjit", "Surinder"
];

const lastNames = [
    "Sharma", "Singh", "Kaur", "Verma", "Gill", "Dhillon", "Sandhu", "Grewal",
    "Bansal", "Gupta", "Malhotra", "Mehta", "Chawla", "Bhardwaj", "Ahluwalia", "Mittal",
    "Sethi", "Khanna", "Bhatia", "Joshi", "Thakur", "Rana", "Kumar", "Rathore"
];

const bloodGroups = ["O+", "O+", "O+", "B+", "B+", "A+", "A+", "AB+", "O-", "A-", "B-", "AB-"];

const locations = [
    { city: "Mandi Gobindgarh", district: "Fatehgarh Sahib", pincode: "147301", lat: 30.6661, lng: 76.3023, street: "GT Road, Near Desh Bhagat University" },
    { city: "Sirhind", district: "Fatehgarh Sahib", pincode: "140406", lat: 30.6278, lng: 76.3888, street: "Near Gurudwara Fatehgarh Sahib, Court Complex" },
    { city: "Amloh", district: "Fatehgarh Sahib", pincode: "147203", lat: 30.6122, lng: 76.2301, street: "Main Bazaar Road" },
    { city: "Mohali", district: "SAS Nagar", pincode: "160062", lat: 30.7046, lng: 76.7179, street: "Phase 7, Near Fortis Hospital" },
    { city: "Mohali", district: "SAS Nagar", pincode: "160055", lat: 30.7180, lng: 76.7110, street: "Phase 3B2, Near Rose Garden" },
    { city: "Mohali", district: "SAS Nagar", pincode: "160071", lat: 30.6900, lng: 76.6900, street: "Sector 70, Residential Colony" },
    { city: "Kharar", district: "SAS Nagar", pincode: "140301", lat: 30.7483, lng: 76.6433, street: "Near Chandigarh University Road" },
    { city: "Chandigarh", district: "Chandigarh", pincode: "160012", lat: 30.7673, lng: 76.7766, street: "Sector 12, Near PGIMER" },
    { city: "Chandigarh", district: "Chandigarh", pincode: "160032", lat: 30.7075, lng: 76.7865, street: "Sector 32B, Near GMCH" },
    { city: "Chandigarh", district: "Chandigarh", pincode: "160017", lat: 30.7415, lng: 76.7794, street: "Sector 17 Plaza, City Centre" },
    { city: "Chandigarh", district: "Chandigarh", pincode: "160022", lat: 30.7250, lng: 76.7700, street: "Sector 22 Market, Aroma Chowk" },
    { city: "Panchkula", district: "Panchkula", pincode: "134109", lat: 30.6942, lng: 76.8606, street: "Sector 5, Near Bella Vista" },
    { city: "Panchkula", district: "Panchkula", pincode: "134112", lat: 30.6800, lng: 76.8400, street: "Sector 11, Main Market" },
    { city: "Ludhiana", district: "Ludhiana", pincode: "141001", lat: 30.9010, lng: 75.8573, street: "Civil Lines, Near DMCH" },
    { city: "Ludhiana", district: "Ludhiana", pincode: "141008", lat: 30.9100, lng: 75.8600, street: "Brown Road, Near CMC Hospital" },
    { city: "Ludhiana", district: "Ludhiana", pincode: "141002", lat: 30.8800, lng: 75.8200, street: "Sarabha Nagar, Model Town Road" },
    { city: "Khanna", district: "Ludhiana", pincode: "141401", lat: 30.7070, lng: 76.2160, street: "Near Asia's Grain Market, GT Road" },
    { city: "Patiala", district: "Patiala", pincode: "147001", lat: 30.3398, lng: 76.3869, street: "Mall Road, Near Rajindra Hospital" },
    { city: "Patiala", district: "Patiala", pincode: "147004", lat: 30.3564, lng: 76.3647, street: "Near Thapar Technology Campus" },
    { city: "Nabha", district: "Patiala", pincode: "147201", lat: 30.3742, lng: 76.1517, street: "Circular Road, Near Bus Stand" },
    { city: "Jalandhar", district: "Jalandhar", pincode: "144001", lat: 31.3260, lng: 75.5762, street: "Patel Chowk, Near Civil Hospital" },
    { city: "Jalandhar", district: "Jalandhar", pincode: "144008", lat: 31.3100, lng: 75.5900, street: "Model Town, Market Area" },
    { city: "Amritsar", district: "Amritsar", pincode: "143001", lat: 31.6340, lng: 74.8723, street: "Circular Road, Near Medical College" },
    { city: "Amritsar", district: "Amritsar", pincode: "143501", lat: 31.6100, lng: 74.9200, street: "Mehta Road, Near Vallah Bypass" },
    { city: "Bathinda", district: "Bathinda", pincode: "151001", lat: 30.2110, lng: 74.9455, street: "Mandi Dabwali Road, Near AIIMS" },
    { city: "Hoshiarpur", district: "Hoshiarpur", pincode: "146001", lat: 31.5273, lng: 75.9149, street: "Civil Lines, Near Clock Tower" }
];

const reachChannels = ["WhatsApp", "Phone Call", "SMS"];
const genders = ["Male", "Female", "Male", "Male", "Female"]; // Balanced ratio
const weights = ["52 kg", "58 kg", "64 kg", "70 kg", "75 kg", "82 kg", "60 kg"];
const heights = ["5'4\"", "5'7\"", "5'9\"", "5'11\"", "5'6\"", "6'0\""];

const generateRandomUsers = (count = 150) => {
    const users = [];
    const usedEmails = new Set();
    const usedPhones = new Set();

    for (let i = 1; i <= count; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${fn} ${ln}`;

        // Unique realistic email
        let email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(100 + Math.random() * 900)}@gmail.com`;
        while (usedEmails.has(email)) {
            email = `${fn.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
        }
        usedEmails.add(email);

        // Unique realistic 10-digit Indian mobile number
        let phonePrefix = ["9872", "9814", "9876", "9888", "9815", "9470", "9800", "7986", "8146"][Math.floor(Math.random() * 9)];
        let phone = `${phonePrefix}${Math.floor(100000 + Math.random() * 900000)}`;
        while (usedPhones.has(phone)) {
            phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
        }
        usedPhones.add(phone);

        const loc = locations[Math.floor(Math.random() * locations.length)];
        const blood = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const isDonor = Math.random() > 0.12; // 88% active donors, 12% general seekers

        const birthYear = Math.floor(1975 + Math.random() * 28); // Ages ~23-51
        const birthMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, "0");
        const birthDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, "0");
        const dob = `${birthYear}-${birthMonth}-${birthDay}`;

        users.push({
            name: fullName,
            email,
            password: "donor@eblood2026",
            phone,
            bloodGroup: blood,
            address: `${Math.floor(10 + Math.random() * 850)}, ${loc.street}`,
            landmark: `Near ${["Civil Hospital", "Main Gurudwara", "Clock Tower", "Bus Stand", "Railway Station", "Market Complex"][Math.floor(Math.random() * 6)]}`,
            pincode: loc.pincode,
            city: loc.city,
            district: loc.district,
            state: "Punjab",
            weight: weights[Math.floor(Math.random() * weights.length)],
            height: heights[Math.floor(Math.random() * heights.length)],
            dob,
            gender,
            reachChannel: reachChannels[Math.floor(Math.random() * reachChannels.length)],
            matchDistance: [10, 15, 25, 35, 50][Math.floor(Math.random() * 5)],
            isDonor,
            pickupPoint: `${loc.street}, ${loc.city}`,
            coordinates: {
                lat: loc.lat + (Math.random() - 0.5) * 0.04,
                lng: loc.lng + (Math.random() - 0.5) * 0.04
            },
            savedLocations: [
                {
                    title: "Home",
                    address: `${loc.street}, ${loc.city}`,
                    lat: loc.lat,
                    lng: loc.lng
                }
            ],
            notifications: {
                whatsapp: true,
                sms: true,
                push: Math.random() > 0.5
            }
        });
    }

    return users;
};

const seedUsers = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("MONGO_URI is missing in your .env file!");
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB Atlas database...");

        // Safety check: ensure sparse unique indexes exist on email & phone
        const usersCollection = mongoose.connection.collection("users");
        try {
            await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });
            await usersCollection.createIndex({ phone: 1 }, { unique: true, sparse: true });
        } catch (idxErr) {
            console.log("Index check notice:", idxErr.message);
        }

        // Clean existing mock users if necessary, or insert new ones
        console.log("Generating 150 realistic donor records...");
        const usersData = generateRandomUsers(150);

        // Bulk insert using unordered inserts to bypass any individual collision safely
        let insertedCount = 0;
        for (const user of usersData) {
            try {
                await User.findOneAndUpdate(
                    { email: user.email },
                    { $set: user },
                    { upsert: true, new: true }
                );
                insertedCount++;
            } catch (singleErr) {
                // Ignore duplicates if any collision happens
            }
        }

        console.log(`Successfully seeded ${insertedCount} Users into MongoDB Atlas!`);
        process.exit(0);
    } catch (err) {
        console.error("Error seeding users:", err);
        process.exit(1);
    }
};

seedUsers();