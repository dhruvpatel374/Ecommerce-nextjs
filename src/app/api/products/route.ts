import { connectDB } from "@/config/dbConfig";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";
connectDB();
export async function GET() {
  try {
    const product = await Product.find({});
    return NextResponse.json({ message: "Data fetched successfully", product });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
