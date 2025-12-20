import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Item from "@/models/Item";

export async function GET() {
  await connectDB();
  const requests = await Request.find()
    .populate("centerId")
    .populate("items.itemId");
  return Response.json(requests);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  // ตรวจสอบสต็อก
  for (let i of data.items) {
    const item = await Item.findById(i.itemId);
    if (item.quantity < i.quantity) {
      return Response.json(
        { error: "สินค้าไม่พอ" },
        { status: 400 }
      );
    }
  }

  const request = await Request.create(data);
  return Response.json(request);
}

export async function PUT(req) {
  await connectDB();
  const { requestId, approve } = await req.json();

  const request = await Request.findById(requestId)
    .populate("items.itemId");

  if (approve) {
    for (let i of request.items) {
      const item = await Item.findById(i.itemId._id);
      item.quantity -= i.quantity;
      await item.save();
    }
    request.status = "approved";
  } else {
    request.status = "rejected";
  }

  await request.save();
  return Response.json(request);
}
