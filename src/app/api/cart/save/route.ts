import { tokenData } from "@/helpers/tokenData";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const newCartItem = reqBody.cart;

    if (!Array.isArray(newCartItem)) {
      return NextResponse.json(
        { message: "Cart data must be an array" },
        { status: 400 }
      );
    }

    const user = await tokenData(request);

    if (!user?._id) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const updatedCart = newCartItem.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity || 1,
    }));

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { cart: updatedCart } },
      { new: true }
    );

    return NextResponse.json({
      message:
        newCartItem.length === 0
          ? "Cart cleared successfully"
          : "Cart updated successfully",
      cart: updatedUser?.cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
