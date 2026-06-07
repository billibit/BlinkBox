import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    received: true,
    note: "Stripe webhook reconciliation placeholder for SetupIntent and PaymentIntent events."
  });
}
