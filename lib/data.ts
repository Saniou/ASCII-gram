import prisma from "./prisma";

export type CommentRecord = {
  id: string;
  userId: string;
  username: string;
  content: string;
  created_at: string;
};

export type PostRecord = {
  id: string;
  content: string;
  username: string;
  created_at: string;
  likes: number;
  comments: CommentRecord[];
  user_liked: boolean;
};

export async function getPosts(userId?: string): Promise<PostRecord[]> {

  const posts = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    include: {
      author:   { select: { username: true } },
      likes:    true,
      comments: {
        orderBy: { created_at: "asc" },
        include: { author: { select: { username: true } } },
      },
    },
  });

  return posts.map((p) => ({
    id:         p.id,
    content:    p.content,
    username:   p.author.username,
    created_at: p.created_at.toISOString(),
    likes:      p.likes.length,
    user_liked: userId
      ? p.likes.some((l) => l.userId === userId)
      : false,
    comments: p.comments.map((c) => ({
      id:         c.id,
      userId:     c.authorId,
      username:   c.author.username,
      content:    c.content,
      created_at: c.created_at.toISOString(),
    })),
  }));
}

export async function likePostInDb(postId: string, userId: string) {
  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }
}

export async function createPostInDb(userId: string, username: string, content: string) {
  const p = await prisma.post.create({
    data: { content, authorId: userId },
  });
  return p.id;
}

export async function addCommentToDb(
  postId: string,
  userId: string,
  content: string,
  username: string
) {
  const c = await prisma.comment.create({
    data: { content, authorId: userId, postId },
  });
  return {
    id:         c.id,
    userId,
    username,
    content:    c.content,
    created_at: c.created_at.toISOString(),
  };
}
