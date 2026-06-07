import { requireAdmin } from "@/lib/auth";
import { approveDecision } from "@/lib/decision-service";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await context.params;
  await approveDecision(id, admin.id);
  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
