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
    const { centerName, items } = await req.json();
    await connectDB();

    const newRequest = await Request.create({
      centerName,
      items: items.map(item => ({
        itemName: item.itemName,
        quantity: Number(item.quantity),
        unit: item.unit
      })),
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

  const oldStatus = request.status;
  const newStatus = status || oldStatus;

  // Handle Inventory changes only if status is changing
  if (newStatus !== oldStatus) {
    // Process each item in the request
    for (const reqItem of request.items) {
      const targetItemName = reqItem.itemName.trim();
      const dbItem = await Item.findOne({
        name: { $regex: new RegExp(`^${targetItemName}$`, "i") }
      });

      if (dbItem) {
        // 1. If currently approved and moving to NOT approved -> Restore stock
        if (oldStatus === "approved" && newStatus !== "approved") {
          dbItem.quantity += reqItem.quantity;
          await dbItem.save();
        }
        // 2. If moving TO approved from NOT approved -> Deduct stock
        else if (oldStatus !== "approved" && newStatus === "approved") {
          if (dbItem.quantity < reqItem.quantity) {
            return NextResponse.json(
              { error: `สินค้า ${targetItemName} ในคลังไม่เพียงพอ (คงเหลือ ${dbItem.quantity})` },
              { status: 400 }
            );
          }
          dbItem.quantity -= reqItem.quantity;
          await dbItem.save();
        }
      } else if (newStatus === "approved") {
        return NextResponse.json(
          { error: `ไม่พบสินค้า "${targetItemName}" ในคลัง ไม่สามารถอนุมัติได้` },
          { status: 404 }
        );
      }
    }
  }

  // Update status if provided
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

