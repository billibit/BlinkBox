import { getCurrentUser } from "@/lib/auth";
import { getState } from "@/lib/mock-store";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  aboutYourself: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData();
  const input = schema.parse(Object.fromEntries(formData));
  const stateUser = getState().users.find((candidate) => candidate.id === user.id);
  if (stateUser) stateUser.name = input.name;

  return NextResponse.redirect(new URL("/budget", request.url));
}
