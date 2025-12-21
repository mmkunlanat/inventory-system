import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const { username, password } = await req.json();

  const user = await User.findOne({ username, password });
  if (!user) {
    return NextResponse.json(
      { error: "ข้อมูลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const token = createToken({
    id: user._id,
    role: user.role
  });

  const res = NextResponse.json({
    role: user.role
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/"
  });

  return res;
}
