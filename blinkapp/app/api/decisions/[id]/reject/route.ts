import { requireAdmin } from "@/lib/auth";
import { rejectDecision } from "@/lib/decision-service";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await context.params;
  rejectDecision(id, admin.id);
  return NextResponse.redirect(new URL("/admin/decisions", request.url));
}
