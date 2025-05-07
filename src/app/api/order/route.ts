import { connectDB } from "@/config/dbConfig";
import { Order } from "@/models/order";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { tokenData } from "@/helpers/tokenData";
import { Product } from "@/models/product";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { userId, products, totalAmount, address } = reqBody;

    if (!userId || !products || !totalAmount || !address) {
      throw new Error("Missing required fields");
    }
    if (!Array.isArray(products)) {
      throw new Error("Products must be an array");
    }
    if (
      !address.houseFlatNo ||
      !address.localityArea ||
      !address.cityTown ||
      !address.state ||
      !address.pincode
    ) {
      throw new Error("All address fields are required");
    }

    if (typeof userId !== "string" || !mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.cart = [];
    await user.save();
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.name} (Available: ${product.stock}, Ordered: ${item.quantity})`
        );
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      userId,
      products,
      totalAmount,
      address,
    });
    await order.save();

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await tokenData(request);

    const orders = await Order.find({ userId: user._id }).populate(
      "products.productId"
    );

    return NextResponse.json({ message: "Data fetched successfully", orders });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
