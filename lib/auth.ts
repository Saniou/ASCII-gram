// lib/auth.ts
import prisma from "./prisma";
import { cookies } from "next/headers";

export async function createUser(username: string, email: string, password: string) {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (exists) return { error: "User already exists" };

  const user = await prisma.user.create({
    data: { username, email, password },
  });
  return { success: true, id: user.id };
}

export async function validateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return { error: "Invalid credentials" };
  }
  return { success: true, id: user.id };
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? { id: user.id, username: user.username, email: user.email } : null;
}
