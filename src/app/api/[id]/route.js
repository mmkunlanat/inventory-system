import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Item from "@/models/Item";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const { status } = await req.json();

  const request = await Request.findById(params.id);
  if (!request) return NextResponse.json({ error: "Not found" });

  // ถ้าอนุมัติ → ตัดสต็อก
  if (status === "approved") {
    const item = await Item.findById(request.itemId);
    if (item.quantity < request.quantity) {
      return NextResponse.json({ error: "สินค้าไม่พอ" }, { status: 400 });
    }
    item.quantity -= request.quantity;
    await item.save();
  }

  request.status = status;
  await request.save();

  return NextResponse.json(request);
}
