import { connectDB } from "@/config/dbConfig";
import { tokenData } from "@/helpers/tokenData";

import { NextRequest, NextResponse } from "next/server";
connectDB();
export async function GET(request: NextRequest) {
  try {
    const user = await tokenData(request);

    return NextResponse.json({ message: "Data fetched successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
}
