import mongoose from "mongoose";
import connectDB from "../src/lib/mongodb.js";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
    try {
        await connectDB();

        const adminUsername = "Admin";
        const adminPassword = "123456789";

        // Check if admin exists
        const existingAdmin = await User.findOne({ username: adminUsername });

        if (existingAdmin) {
            console.log("Admin account already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";
            await existingAdmin.save();
        } else {
            console.log("Creating new Admin account...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                username: adminUsername,
                password: hashedPassword,
                role: "admin"
            });
        }

        console.log("Admin account seeded successfully!");
        console.log("Username: " + adminUsername);
        console.log("Password: " + adminPassword);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
}

seedAdmin();
