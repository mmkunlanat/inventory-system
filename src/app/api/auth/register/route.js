import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const exist = await User.findOne({ username });
    if (exist) {
      return NextResponse.json(
        { error: "มีชื่อผู้ใช้นี้ในระบบแล้ว" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: "center" // Force center role for all new registrations
    });

    console.log("User created successfully:", username);

    return NextResponse.json({
      message: "ลงทะเบียนสำเร็จ",
      username: user.username
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์: " + error.message },
      { status: 500 }
    );
  }
}
