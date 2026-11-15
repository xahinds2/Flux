import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isHandleAvailable } from "@/lib/db";
import { handleError } from "@/lib/handle";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const handle = (req.nextUrl.searchParams.get("handle") ?? "").trim().toLowerCase();
  const error = handleError(handle);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ available: await isHandleAvailable(handle, userId) });
}
