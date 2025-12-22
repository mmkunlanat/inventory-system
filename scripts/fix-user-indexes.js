import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function fix() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const collection = mongoose.connection.db.collection("users");

        console.log("Checking indexes...");
        const indexes = await collection.indexes();
        console.log("Current indexes:", JSON.stringify(indexes, null, 2));

        const hasEmailIndex = indexes.some(idx => idx.name === "email_1");

        if (hasEmailIndex) {
            console.log("Dropping email_1 index...");
            await collection.dropIndex("email_1");
            console.log("Index dropped successfully");
        } else {
            console.log("No email_1 index found");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

fix();
