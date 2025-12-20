import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("role");

  if (req.nextUrl.pathname.startsWith("/admin") && !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
