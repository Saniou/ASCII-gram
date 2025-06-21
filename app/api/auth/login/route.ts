// app/api/auth/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import { validateUser, setUserSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let username: string | undefined;
  let password: string | undefined;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    // Клієнт надіслав JSON
    const body = await req.json();
    username = (body.username as string) || undefined;
    password = (body.password as string) || undefined;
  } else {
    // Клієнт надіслав FormData
    const form = await req.formData();
    username = form.get("username")?.toString();
    password = form.get("password")?.toString();
  }

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  const result = await validateUser(username, password);
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 401 }
    );
  }

  await setUserSession(result.id!);
  return NextResponse.json({ success: true });
}
