import { getCurrentUser } from "@/lib/auth";
import { updateBudget } from "@/lib/budget-service";
import { getDefaultPaymentMethod, startPaymentSetup } from "@/lib/payment-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  monthlyLimit: z.coerce.number().min(5).max(500),
  paused: z.enum(["true", "false"]),
  rolloverEnabled: z.enum(["true", "false"])
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  updateBudget({
    userId: user.id,
    monthlyLimitCents: Math.round(input.monthlyLimit * 100),
    paused: input.paused === "true",
    rolloverEnabled: input.rolloverEnabled === "true"
  });

  if (!getDefaultPaymentMethod(user.id)) {
    const session = await startPaymentSetup(user.id);
    return NextResponse.redirect(new URL(session.url, request.url));
  }

  return NextResponse.redirect(new URL("/budget", request.url));
}
