import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
console.log("URI present:", !!uri);

async function run() {
    try {
        console.log("Connecting...");
        await mongoose.connect(uri);
        console.log("Connected to", mongoose.connection.name);

        const User = mongoose.model('User');
        console.log("Dropping index email_1...");
        try {
            await User.collection.dropIndex("email_1");
            console.log("Dropped email_1 successfully");
        } catch (e) {
            console.log("Could not drop email_1 (maybe it doesn't exist or already dropped):", e.message);
        }

        await mongoose.disconnect();
        console.log("Done");
    } catch (err) {
        console.error("Critical Error:", err);
    }
}

run();
