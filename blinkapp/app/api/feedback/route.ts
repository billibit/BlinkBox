import { createFeedback } from "@/lib/feedback-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  liked: z.enum(["true", "false"]),
  comment: z.string().optional()
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  createFeedback({
    orderId: input.orderId,
    rating: input.rating,
    liked: input.liked === "true",
    comment: input.comment ?? ""
  });

  return NextResponse.redirect(new URL("/gifts", request.url));
}
