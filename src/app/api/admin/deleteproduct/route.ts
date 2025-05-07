import { adminAuth } from "@/helpers/adminAuth";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const validate = await adminAuth(request);
    if (!validate) {
      throw new Error("You are not admin");
    }
    const reqBody = await request.json();
    const { _id } = reqBody;
    const product = await Product.findByIdAndDelete(_id);
    if (!product) {
      throw new Error("Product not found");
    }
    return NextResponse.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
