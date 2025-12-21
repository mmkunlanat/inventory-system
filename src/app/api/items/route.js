import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

// GET: ดึงรายการสินค้า
export async function GET() {
  await connectDB();
  const items = await Item.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

// POST: เพิ่มสินค้า
export async function POST(req) {
  const body = await req.json();
  await connectDB();
  const item = await Item.create(body);
  return NextResponse.json(item);
}

// DELETE: ลบสินค้า
export async function DELETE(req) {
  const { id } = await req.json();
  await connectDB();
  await Item.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
