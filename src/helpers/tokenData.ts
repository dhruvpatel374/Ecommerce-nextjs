import { NextRequest } from "next/server";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { User } from "@/models/user";

export const tokenData = async (request: NextRequest) => {
  const token = request.cookies.get("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const decodedData: string | JwtPayload | unknown = jsonwebtoken.verify(
    token.value,
    process.env.JWT_SECRET!
  );
  const user = await User.findById(decodedData);
  return user;
};
