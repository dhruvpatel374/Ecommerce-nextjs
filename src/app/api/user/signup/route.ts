import { connectDB } from "@/config/dbConfig";
import { User } from "@/models/user";
import validateSignup from "@/helpers/validateSignup";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { firstName, lastName, emailId, password } = reqBody;
    validateSignup(reqBody);

    const user = await User.findOne({ emailId });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = await savedUser.getJWT();
    const response = NextResponse.json({
      message: "User created successfully",
      user: savedUser,
    });

    // Set the cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
