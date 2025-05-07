import { NextRequest } from "next/server";
import { tokenData } from "./tokenData";

export const adminValidation = async (request: NextRequest) => {
  const user = await tokenData(request);
  if (user.isAdmin) {
    return true;
  }
  return false;
};
