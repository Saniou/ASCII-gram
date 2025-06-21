import { NextRequest, NextResponse } from "next/server";
import { likePostInDb } from "@/lib/data";

export async function POST(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  const postId   = segments[segments.indexOf("posts") + 1];

  const userId = request.cookies.get("userId")?.value;
  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  await likePostInDb(postId, userId);

  return NextResponse.json({ success: true });
}
