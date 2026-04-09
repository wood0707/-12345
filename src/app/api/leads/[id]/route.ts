import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, phone, email } = await req.json();

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "모든 항목을 입력해 주세요." }, { status: 400 });
  }

  await db
    .update(leads)
    .set({ name, phone, email })
    .where(eq(leads.id, Number(id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.delete(leads).where(eq(leads.id, Number(id)));

  return NextResponse.json({ success: true });
}
