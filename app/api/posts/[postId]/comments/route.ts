import { NextResponse, NextRequest } from "next/server";
import { addCommentToDb } from "@/lib/data";

export async function POST(request: NextRequest) {
  const segments    = request.nextUrl.pathname.split("/");
  const postId      = segments[segments.indexOf("posts") + 1];
  const form        = await request.formData();
  const userId      = form.get("userId")?.toString();
  const username    = form.get("username")?.toString();
  const content     = form.get("content")?.toString();

  if (!userId || !username || !content) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const comment = await addCommentToDb(postId, userId, content, username);
  if (!comment) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }

  return NextResponse.json({ success: true, comment });
}
