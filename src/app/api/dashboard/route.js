import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import Center from "@/models/Center";
import Request from "@/models/Request";

export async function GET() {
  await connectDB();

  const itemsCount = await Item.countDocuments();
  const centersCount = await Center.countDocuments();
  const requestsCount = await Request.countDocuments();
  const pendingCount = await Request.countDocuments({
    status: "pending",
  });

  const latestRequests = await Request.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return NextResponse.json({
    itemsCount,
    centersCount,
    requestsCount,
    pendingCount,
    latestRequests,
  });
}
