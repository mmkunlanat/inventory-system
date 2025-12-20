import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const request = await Request.create(body);
  return NextResponse.json(request);
}

export async function GET() {
  await connectDB();
  const data = await Request.find().populate("itemId");
  return NextResponse.json(data);
}
