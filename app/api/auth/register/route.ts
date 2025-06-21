// app/api/auth/register/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createUser, setUserSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const result = await createUser(username, email, password);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  await setUserSession(result.id!);
  return NextResponse.json({ success: true }, { status: 201 });
}
