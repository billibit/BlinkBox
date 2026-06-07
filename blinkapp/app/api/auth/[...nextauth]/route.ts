import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "Auth.js placeholder",
    note: "Production auth will use Auth.js / NextAuth with role-backed sessions."
  });
}

export async function POST() {
  return NextResponse.json({
    provider: "Auth.js placeholder"
  });
}
