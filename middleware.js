import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token && (
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/center")
  )) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, "mysecretkey");

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/center") &&
      decoded.role !== "center"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
