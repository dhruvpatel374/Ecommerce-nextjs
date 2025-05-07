import { adminAuth } from "@/helpers/adminAuth";
import { Order } from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const validate = await adminAuth(request);
    if (!validate) {
      throw new Error("You are not admin");
    }
    const orders = await Order.find({}).populate("products.productId");
    return NextResponse.json({ message: "Data fetched successfully", orders });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
export async function PATCH(request: NextRequest) {
  try {
    const validate = await adminAuth(request);
    if (!validate) {
      throw new Error("You are not admin");
    }
    const reqBody = await request.json();
    const { _id, status } = reqBody;
    // "pending", "processing", "shipped", "delivered", "cancelled"
    if (
      status !== "pending" &&
      status !== "processing" &&
      status !== "shipped" &&
      status !== "delivered" &&
      status !== "cancelled"
    ) {
      throw new Error("Invalid status");
    }
    const order = await Order.findById(_id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    await order.save();
    return NextResponse.json({ message: "Order updated successfully", order });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
