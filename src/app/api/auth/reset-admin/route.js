import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Starting Admin Reset...");
        await connectDB();

        const adminUsername = "Admin";
        const adminPassword = "123456789";

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Check if user already exists
        const existing = await User.findOne({ username: adminUsername });

        if (existing) {
            existing.password = hashedPassword;
            existing.role = "admin";
            await existing.save();
            return NextResponse.json({
                success: true,
                message: "บัญชี Admin มีอยู่แล้ว และได้ทำการรีเซ็ตรหัสผ่านเป็น 123456789 เรียบร้อยแล้ว",
                username: adminUsername
            });
        } else {
            await User.create({
                username: adminUsername,
                password: hashedPassword,
                role: "admin"
            });
            return NextResponse.json({
                success: true,
                message: "สร้างบัญชี Admin ใหม่ (ชื่อ: Admin / รหัส: 123456789) สำเร็จ!",
                username: adminUsername
            });
        }
    } catch (err) {
        console.error("Admin Reset Error:", err);
        return NextResponse.json({
            success: false,
            error: err.message,
            detail: "กรุณาตรวจสอบว่า MONGODB_URI ใน .env.local ถูกต้องหรือไม่"
        }, { status: 500 });
    }
}
