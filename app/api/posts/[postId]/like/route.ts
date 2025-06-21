// app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { likePostInDb } from "@/lib/data";

export async function POST(request: NextRequest) {
  // 1) Дістаємо postId з шляху
  const segments = request.nextUrl.pathname.split("/");
  const postId   = segments[segments.indexOf("posts") + 1];

  // 2) Дістаємо userId з куків
  const userId = request.cookies.get("userId")?.value;
  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 3) Toggle-лайк
  await likePostInDb(postId, userId);

  // 4) Повертаємо успіх
  return NextResponse.json({ success: true });
}
