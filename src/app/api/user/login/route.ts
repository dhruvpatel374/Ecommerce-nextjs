import { connectDB } from "@/config/dbConfig";
import { User } from "@/models/user";

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { emailId, password } = reqBody;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
    const token = await user.getJWT();
    const response = NextResponse.json({
      message: "User logged in successfully",
      user,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
