import { getCurrentUser } from "@/lib/auth";
import { startPaymentSetup } from "@/lib/payment-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const session = await startPaymentSetup(user.id);
  return NextResponse.redirect(new URL(session.url, request.url));
}
