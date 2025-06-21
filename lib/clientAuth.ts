// файл: lib/clientAuth.ts

export interface User {
  id: string;
  username: string;
  email: string;
}

export async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const { user } = await res.json();
  return user as User | null;
}
