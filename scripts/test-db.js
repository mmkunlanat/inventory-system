import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Testing connection to:", MONGODB_URI ? "URI found" : "URI NOT FOUND");

async function test() {
    try {
        if (!MONGODB_URI) {
            console.error("MONGODB_URI is missing in .env.local");
            process.exit(1);
        }
        console.log("Connecting...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("Connected successfully!");
        await mongoose.disconnect();
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}

test();
