export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const item = await Item.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
