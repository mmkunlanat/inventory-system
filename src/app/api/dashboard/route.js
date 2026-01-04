import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import Request from "@/models/Request";
import Center from "@/models/Center";

export async function GET() {
  try {
    await connectDB();

    const [itemsCount, centersCount, requestsCount, pendingCount, deliveriesCount, latestRequests] = await Promise.all([
      Item.countDocuments(),
      Center.countDocuments(),
      Request.countDocuments(),
      Request.countDocuments({ status: "pending" }),
      Request.countDocuments({ status: "approved" }),
      Request.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return NextResponse.json({
      itemsCount,
      centersCount,
      requestsCount,
      pendingCount,
      deliveriesCount,
      latestRequests,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

