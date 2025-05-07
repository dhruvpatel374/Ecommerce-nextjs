import { connectDB } from "@/config/dbConfig";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
connectDB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id } = reqBody;
    const product = await Product.find({ _id: _id });
    return NextResponse.json({ message: "Data fetched successfully", product });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
