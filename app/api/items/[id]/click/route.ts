import { NextRequest, NextResponse } from "next/server";
import { incrementClick } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const found = await incrementClick((await params).id);
  return found ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
