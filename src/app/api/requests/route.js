import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Request from "@/models/Request";
import Item from "@/models/Item";

export async function GET() {
  await connectDB();
  const requests = await Request.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(requests);
}

export async function POST(req) {
  try {
    const { centerName, itemName, quantity } = await req.json();
    await connectDB();

    const newRequest = await Request.create({
      centerName,
      itemName,
      quantity: Number(quantity),
      status: "pending",
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, status } = await req.json();
  await connectDB();

  const request = await Request.findById(id);
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // ถ้าอนุมัติ → ตัดสต๊อก
  if (status === "approved") {
    // Find item by name (since Request schema uses itemName)
    const item = await Item.findOne({ name: request.itemName });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found in inventory" },
        { status: 404 }
      );
    }

    // เช็คของพอไหม
    if (item.quantity < request.quantity) {
      return NextResponse.json(
        { error: "สินค้าในคลังไม่เพียงพอ" },
        { status: 400 }
      );
    }

    // ตัดสต๊อก
    item.quantity -= request.quantity;
    await item.save();
  }

  // อัปเดตสถานะคำขอ
  request.status = status;
  await request.save();

  return NextResponse.json({ success: true });
}

