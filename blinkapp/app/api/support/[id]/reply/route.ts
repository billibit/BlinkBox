import { resolveSupportRequest } from "@/lib/support-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  resolution: z.string().min(1)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  resolveSupportRequest(id, input.resolution);

  return NextResponse.redirect(new URL("/admin/support", request.url));
}
