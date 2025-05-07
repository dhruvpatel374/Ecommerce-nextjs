import { connectDB } from "@/config/dbConfig";
import { tokenData } from "@/helpers/tokenData";
import validateProfileEdit from "@/helpers/validateProfileEdit";
// import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
connectDB();
export async function PATCH(request: NextRequest) {
  try {
    const user = await tokenData(request);
    const reqBody = await request.json();
    // const { firstName, lastName, photoUrl, gender } = reqBody;
    validateProfileEdit(reqBody);
    Object.keys(reqBody).forEach((key) => {
      user[key] = reqBody[key];
    });
    user.save();
    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
