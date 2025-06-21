"use server";

import { redirect } from "next/navigation";
import { createPostInDb } from "./data";
import { clearUserSession } from "./auth";

export async function register(formData: FormData) {
  const body = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  }
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function login(formData: FormData) {
  const body = {
    username: formData.get('username'),
    password: formData.get('password'),
  }
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}


export async function createPost(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;
  const username = formData.get("username") as string;
  const content = formData.get("content") as string;

  if (!userId || !username || !content) {
    throw new Error("All fields are required");
  }

  await createPostInDb(userId, username, content);

  redirect("/");
}

export async function logout(): Promise<void> {
  await clearUserSession();

}