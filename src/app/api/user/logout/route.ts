import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout Successfully",
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
