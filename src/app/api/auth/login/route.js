import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    let user = await User.findOne({ username });

    // Auto-seed/Fix admin if trying to login as Admin
    if (username === "Admin") {
      if (!user) {
        console.log("Admin not found, seeding...");
        const hashedPassword = await bcrypt.hash("123456789", 10);
        user = await User.create({
          username: "Admin",
          password: hashedPassword,
          role: "admin"
        });
        console.log("Admin seeded successfully");
      } else if (user.role !== "admin") {
        console.log("Admin exists but role is incorrect. Fixing...");
        user.role = "admin";
        await user.save();
        console.log("Admin role fixed to admin");
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id,
      role: user.role,
      username: user.username
    });

    const res = NextResponse.json({
      success: true,
      role: user.role,
      username: user.username
    });

    // Set Cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์: " + error.message },
      { status: 500 }
    );
  }
}
