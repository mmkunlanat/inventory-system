import { connectDB } from "@/lib/mongodb";
import Center from "@/models/Center";

export async function GET() {
  await connectDB();
  const centers = await Center.find();
  return Response.json(centers);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const center = await Center.create(data);
  return Response.json(center);
}
