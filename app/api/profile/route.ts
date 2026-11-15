import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isHandleAvailable, upsertSeller } from "@/lib/db";
import { parseProfileInput } from "@/lib/validate";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseProfileInput(await req.json().catch(() => ({})));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  const email = (await currentUser())?.primaryEmailAddress?.emailAddress;
  if (data.handle && !(await isHandleAvailable(data.handle, userId))) {
    return NextResponse.json({ error: "This address is already taken." }, { status: 409 });
  }
  try {
    return NextResponse.json(await upsertSeller(userId, { ...data, email }));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000 && "keyPattern" in error && (error.keyPattern as Record<string, unknown>)?.handle) {
      return NextResponse.json({ error: "This address is already taken." }, { status: 409 });
    }
    throw error;
  }
}
