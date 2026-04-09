import { NextRequest, NextResponse } from "next/server";

async function verifyMagicToken(
  token: string,
  password: string
): Promise<boolean> {
  try {
    const { expiry, sig } = JSON.parse(
      Buffer.from(token, "base64url").toString()
    );
    if (Date.now() > expiry) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(
      (sig as string).match(/.{2}/g)!.map((b: string) => parseInt(b, 16))
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(String(expiry))
    );
  } catch {
    return false;
  }
}

async function getAuthToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("admin_session")
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !token ||
    !adminPassword ||
    !(await verifyMagicToken(token, adminPassword))
  ) {
    return NextResponse.redirect(
      new URL("/admin/login?error=expired", request.url)
    );
  }

  const authToken = await getAuthToken(adminPassword);
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("admin_auth", authToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
