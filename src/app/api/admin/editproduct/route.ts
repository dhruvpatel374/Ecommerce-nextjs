import { adminAuth } from "@/helpers/adminAuth";
import { validateProduct } from "@/helpers/validateProduct";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const validate = await adminAuth(request);
    if (!validate) {
      throw new Error("You are not admin");
    }
    const reqBody = await request.json();
    const { _id } = reqBody;
    validateProduct(reqBody);
    const product = await Product.findById(_id);
    if (!product) {
      throw new Error("Product not found");
    }
    Object.keys(reqBody).forEach((key) => {
      product[key] = reqBody[key];
    });
    await product.save();
    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
