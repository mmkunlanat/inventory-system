import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";

// GET: ดึงรายการสินค้า
export async function GET() {
  await connectDB();
  const items = await Item.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

// POST: เพิ่มสินค้า
export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const item = await Item.create(body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: แก้ไขสินค้า
export async function PUT(req) {
  try {
    const { _id, ...updateData } = await req.json();
    await connectDB();
    const item = await Item.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: ลบสินค้า
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectDB();
    await Item.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

