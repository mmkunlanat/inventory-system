import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Center from "@/models/Center";

// GET: ดึงศูนย์ทั้งหมด
export async function GET() {
  await connectDB();
  const centers = await Center.find().sort({ createdAt: -1 });
  return NextResponse.json(centers);
}

// POST: เพิ่มศูนย์
export async function POST(req) {
  const body = await req.json();
  await connectDB();
  const center = await Center.create(body);
  return NextResponse.json(center);
}

// DELETE: ลบศูนย์
export async function DELETE(req) {
  const { id } = await req.json();
  await connectDB();
  await Center.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
