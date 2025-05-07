import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const publicPaths = ["/", "/login", "/signup"];
  const userProtectedPaths = ["/profile", "/place-order"];
  const adminPaths = ["/admin", "/admin/manage", "/admin/edit"];

  if (publicPaths.includes(path)) {
    if (token && path === "/login") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  if (userProtectedPaths.includes(path) || path.startsWith("/admin/edit/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (adminPaths.includes(path) || path.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const response = await axios.get(
        `${request.nextUrl.origin}/api/user/profile/view`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
        }
      );
      const user = response.data.user;

      if (!user.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware: Error fetching user:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/profile",
    "/admin/:path*",
    "/place-order",
  ],
};
