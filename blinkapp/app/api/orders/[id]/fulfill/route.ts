import { fulfillOrder } from "@/lib/order-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  trackingCode: z.string().optional(),
  fulfillmentNotes: z.string().min(1)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  fulfillOrder({
    orderId: id,
    trackingCode: input.trackingCode,
    fulfillmentNotes: input.fulfillmentNotes
  });

  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
