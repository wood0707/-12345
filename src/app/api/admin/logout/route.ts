import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url)
  );
  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
  return response;
}
