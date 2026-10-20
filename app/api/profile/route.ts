import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertSeller } from "@/lib/db";
import { parseProfileInput } from "@/lib/validate";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseProfileInput(await req.json().catch(() => ({})));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  const email = (await currentUser())?.primaryEmailAddress?.emailAddress;
  return NextResponse.json(await upsertSeller(userId, { ...data, email }));
}
