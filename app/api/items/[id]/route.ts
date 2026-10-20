import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { deleteItem, updateItem } from "@/lib/db";
import { parseItemInput } from "@/lib/validate";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseItemInput(await req.json().catch(() => ({})), userId);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  const result = await updateItem((await params).id, userId, data);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const removed = result.before.images.filter((url) => !data.images.includes(url));
  if (removed.length) await del(removed).catch(console.error);

  return NextResponse.json(result.after);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await deleteItem((await params).id, userId);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (item.images.length) await del(item.images).catch(console.error);

  return NextResponse.json({ success: true });
}
