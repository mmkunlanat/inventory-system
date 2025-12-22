export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Item from "@/models/Item";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();

    return NextResponse.json({
      totalUsers,
      totalItems,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);

    return NextResponse.json(
      { message: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
