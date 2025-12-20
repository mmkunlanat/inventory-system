import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const exist = await User.findOne({ username: body.username });
  if (exist) {
    return NextResponse.json(
      { error: "มีผู้ใช้นี้แล้ว" },
      { status: 400 }
    );
  }

  const user = await User.create(body);
  return NextResponse.json(user);
}
