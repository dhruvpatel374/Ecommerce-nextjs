import { connectDB } from "@/config/dbConfig";
import { adminAuth } from "@/helpers/adminAuth";
import { validateProduct } from "@/helpers/validateProduct";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
connectDB();
export async function POST(request: NextRequest) {
  try {
    const validate = await adminAuth(request);
    if (!validate) {
      throw new Error("You are not admin");
    }
    const reqBody = await request.json();
    const {
      name,
      price,
      discountPrice,
      description,
      stock,
      category,
      photoUrl,
    } = reqBody;
    validateProduct(reqBody);
    const product = new Product({
      name,
      price,
      discountPrice,
      description,
      stock,
      category,
      photoUrl,
    });
    product.save();
    return NextResponse.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
