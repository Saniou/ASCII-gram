import { NextResponse, NextRequest } from "next/server";
import { getPosts, createPostInDb } from "@/lib/data";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  const posts = await getPosts(userId);
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const userId   = form.get("userId")?.toString();
  const username = form.get("username")?.toString();
  const content  = form.get("content")?.toString();

  if (!userId || !username || !content) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const id = await createPostInDb(userId, username, content);
  return NextResponse.json({ success: true, id }, { status: 201 });
}
