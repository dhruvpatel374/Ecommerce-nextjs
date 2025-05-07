import { tokenData } from "@/helpers/tokenData";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import { connectDB } from "@/config/dbConfig";
connectDB();
export async function GET(request: NextRequest) {
  try {
    const userData = await tokenData(request);

    if (!userData || !userData._id) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const user = await User.findById(userData._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const populatedUser = await user.populate("cart.productId");

    const cartData = populatedUser.cart
      .filter((item) => item.productId)
      .map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        photoUrl: item.productId.photoUrl,
        discountPrice: item.productId.discountPrice,
        description: item.productId.description,
        category: item.productId.category,
        quantity: item.quantity,
      }));

    return NextResponse.json({
      message: "Cart data fetched successfully",
      cart: cartData,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart data" },
      { status: 500 }
    );
  }
}
