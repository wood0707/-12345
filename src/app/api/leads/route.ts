import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { name, phone, email } = await req.json();

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "모든 항목을 입력해 주세요." }, { status: 400 });
  }

  await db.insert(leads).values({ name, phone, email });

  return NextResponse.json({ success: true });
}
