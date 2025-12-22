import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const adminUsername = "Admin";
        const adminPassword = "123456789";

        const existingAdmin = await User.findOne({ username: adminUsername });

        if (existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";
            await existingAdmin.save();
            return NextResponse.json({ message: "Admin account updated successfully" });
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                username: adminUsername,
                password: hashedPassword,
                role: "admin"
            });
            return NextResponse.json({ message: "Admin account created successfully" });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
