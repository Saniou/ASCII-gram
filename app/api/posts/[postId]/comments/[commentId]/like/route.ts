// app/api/posts/[postId]/comments/[commentId]/like/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: any  // тут any, щоб TS не сварився
) {
  const { postId, commentId } = params;
  const userId = request.headers.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Перевіряємо, чи є вже лайк
  const existing = await prisma.commentLike.findUnique({
    where: { commentId_userId: { commentId, userId } },
  });

  let liked: boolean;
  if (existing) {
    // якщо лайк був — видаляємо
    await prisma.commentLike.delete({
      where: { commentId_userId: { commentId, userId } },
    });
    liked = false;
  } else {
    // якщо не було — створюємо
    await prisma.commentLike.create({
      data: { commentId, userId },
    });
    liked = true;
  }

  // Порахуємо оновлену кількість лайків
  const count = await prisma.commentLike.count({
    where: { commentId },
  });

  return NextResponse.json({ success: true, liked, count });
}
