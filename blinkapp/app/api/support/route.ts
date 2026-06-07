import { getCurrentUser } from "@/lib/auth";
import { createSupportRequest } from "@/lib/support-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["refund", "replacement", "question"]),
  message: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  createSupportRequest({
    userId: user.id,
    type: input.type,
    message: input.message
  });

  return NextResponse.redirect(new URL("/support", request.url));
}
