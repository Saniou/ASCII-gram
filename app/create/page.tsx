// app/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreatePostForm from "@/components/create-post-form";
import type { User } from "@/lib/auth";

export default function CreatePage() {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me");
        const { user } = await res.json();
        if (!user) {
          router.push("/login");
        } else {
          setUser(user);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-green-400 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="terminal-card p-8 space-y-6">
          {/* ASCII-заголовок */}
          <pre className="text-green-400 text-sm font-bold leading-tight animate-typing">
{`╔═══════════════════════════════╗
║        CREATE NEW POST        ║
║     Share your ASCII art!     ║
╚═══════════════════════════════╝`}
          </pre>
          {/* Навігація назад */}
          <div className="flex justify-between text-xs text-green-300">
            <div>&gt; Введіть ваш контент нижче</div>
            <Link
              href="/"
              className="underline hover:text-green-100 transition-colors"
            >
              [BACK]
            </Link>
          </div>

          {/* Форма */}
          <CreatePostForm user={user} />
        </div>
      </div>
    </div>
  );
}
