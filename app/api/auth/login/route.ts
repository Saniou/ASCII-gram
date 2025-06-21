// app/api/auth/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import { validateUser, setUserSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const result = await validateUser(username, password);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  await setUserSession(result.id!);
  return NextResponse.json({ success: true });
}
