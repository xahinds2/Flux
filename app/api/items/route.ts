import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createItem, getListings, getSeller } from "@/lib/db";
import { parseItemInput } from "@/lib/validate";

export async function GET(req: NextRequest) {
  const sellerId = req.nextUrl.searchParams.get("seller_id") ?? undefined;
  return NextResponse.json(await getListings(sellerId));
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await getSeller(userId);
  if (!seller?.whatsapp_number) {
    return NextResponse.json({ error: "Set your WhatsApp number in your profile first" }, { status: 400 });
  }

  const parsed = parseItemInput(await req.json().catch(() => ({})), userId);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  return NextResponse.json(await createItem(userId, data), { status: 201 });
}
