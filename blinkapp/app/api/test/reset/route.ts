import { resetStateForTests } from "@/lib/mock-store";
import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unavailable in production" }, { status: 404 });
  }

  resetStateForTests();
  return NextResponse.json({ ok: true });
}
