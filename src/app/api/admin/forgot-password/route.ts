import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function generateMagicToken(password: string): Promise<string> {
  const expiry = Date.now() + 15 * 60 * 1000; // 15분
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
    new TextEncoder().encode(String(expiry))
  );
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return Buffer.from(JSON.stringify({ expiry, sig: sigHex })).toString(
    "base64url"
  );
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 이메일 일치 여부와 관계없이 동일한 응답 (이메일 노출 방지)
  const okResponse = NextResponse.json({ ok: true });

  if (!adminEmail || !adminPassword || email !== adminEmail) {
    return okResponse;
  }

  const token = await generateMagicToken(adminPassword);
  const baseUrl = request.nextUrl.origin;
  const magicLink = `${baseUrl}/api/admin/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"관리자 시스템" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: "관리자 로그인 링크",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1d4ed8;">관리자 로그인 링크</h2>
        <p>아래 버튼을 클릭하면 관리자 페이지에 로그인됩니다.</p>
        <p style="color: #6b7280; font-size: 14px;">링크는 15분 동안 유효합니다.</p>
        <a href="${magicLink}"
          style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1d4ed8; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          로그인하기
        </a>
        <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">
          이 이메일을 요청하지 않으셨다면 무시하세요.
        </p>
      </div>
    `,
  });

  return okResponse;
}
