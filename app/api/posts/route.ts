// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPostInDb } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  const posts = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    include: {
      author: { select: { id: true, username: true } },
      comments: {
        orderBy: { created_at: "asc" },
        include: {
          author: { select: { id: true, username: true } },
          likes: true,                // тягнемо всі лайки
        },
      },
      likes: true,                   // тягнемо всі лайки поста
    },
  });

  // Тепер пробіжимося й перетворимо у потрібний shape:
  const payload = posts.map((p) => ({
    id: p.id,
    userId: p.author.id,
    username: p.author.username,
    content: p.content,
    created_at: p.created_at.toISOString(),
    likes: p.likes.length,
    user_liked: userId != null && p.likes.some((l) => l.userId === userId),
    comments: p.comments.map((c) => ({
      id: c.id,
      postId: p.id,
      userId: c.author.id,
      username: c.author.username,
      content: c.content,
      created_at: c.created_at.toISOString(),
      likesCount: c.likes.length,                              // ← тут
      userLiked: userId != null && c.likes.some((l) => l.userId === userId), // ← і тут
    })),
  }));

  return NextResponse.json({ posts: payload });
}


export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const userId   = form.get("userId")?.toString();
    const username = form.get("username")?.toString();
    const content  = form.get("content")?.toString();

    if (!userId || !username || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const id = await createPostInDb(userId, username, content);
    return NextResponse.json(
      { success: true, id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ POST /api/posts error:", err);
    return NextResponse.json(
      { error: "Cannot create post", message: err.message },
      { status: 500 }
    );
  }
}
