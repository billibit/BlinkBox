import { runDueSchedules } from "@/lib/schedule-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  runDueSchedules();
  return NextResponse.redirect(new URL("/admin/decisions", request.url));
}
