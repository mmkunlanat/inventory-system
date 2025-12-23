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
    const { centerName, itemName, quantity, unit } = await req.json();
    await connectDB();

    const newRequest = await Request.create({
      centerName,
      itemName,
      quantity: Number(quantity),
      unit,
      status: "pending",
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, status, itemName, quantity, unit } = await req.json();
  await connectDB();

  const request = await Request.findById(id);
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const oldStatus = request.status;
  const newStatus = status || oldStatus;

  // Handle Inventory changes only if status is changing
  if (newStatus !== oldStatus) {
    // Determine target item (using either current request itemName or the new updated one)
    const targetItemName = (itemName || request.itemName).trim();
    const item = await Item.findOne({
      name: { $regex: new RegExp(`^${targetItemName}$`, "i") }
    });

    if (item) {
      // 1. If currently approved and moving to NOT approved -> Restore stock
      if (oldStatus === "approved" && newStatus !== "approved") {
        item.quantity += request.quantity;
        await item.save();
      }
      // 2. If moving TO approved from NOT approved -> Deduct stock
      else if (oldStatus !== "approved" && newStatus === "approved") {
        const targetQuantity = quantity ? Number(quantity) : request.quantity;
        if (item.quantity < targetQuantity) {
          return NextResponse.json(
            { error: `สินค้าในคลังไม่เพียงพอ (คงเหลือ ${item.quantity})` },
            { status: 400 }
          );
        }
        item.quantity -= targetQuantity;
        await item.save();
      }
    } else if (newStatus === "approved") {
      // If trying to approve but no item found in DB
      return NextResponse.json(
        { error: "ไม่พบสินค้าชิ้นนี้ในคลัง ไม่สามารถอนุมัติได้" },
        { status: 404 }
      );
    }
  }

  // Update fields if provided
  if (itemName) request.itemName = itemName;
  if (quantity) request.quantity = Number(quantity);
  if (unit) request.unit = unit;
  if (status) request.status = status;

  await request.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectDB();

    const request = await Request.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await Request.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

