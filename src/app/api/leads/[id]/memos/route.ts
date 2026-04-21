import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leadMemos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

function authorized(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  return process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db
    .select()
    .from(leadMemos)
    .where(eq(leadMemos.leadId, Number(id)))
    .orderBy(desc(leadMemos.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "내용을 입력해 주세요." }, { status: 400 });
  const [memo] = await db
    .insert(leadMemos)
    .values({ leadId: Number(id), content: content.trim() })
    .returning();
  return NextResponse.json(memo);
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { memoId } = await req.json();
  await db.delete(leadMemos).where(eq(leadMemos.id, Number(memoId)));
  return NextResponse.json({ success: true });
}
