// components/feed.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PostComponent, { type PostType } from "./post";

interface User {
  id: string;
  username: string;
  email: string;
}

interface FeedProps {
  user: User;
}

export default function Feed({ user }: FeedProps) {
  const [posts, setPosts]     = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          console.error("Server error:", res.status, await res.text());
          setPosts([]);
          return;
        }
        const json = await res.json();
        setPosts(json.posts as PostType[]);
      } catch (err) {
        console.error("Error loading posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="terminal-card p-6 text-center">
          <div className="text-red-400">ERROR: Користувач не знайдений</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      {/* Create new post */}
      <div className="mb-8 animate-slide-in-up">
        <Link href="/create" className="block terminal-card p-6 hover:bg-gray-900/30">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border border-green-400 flex items-center justify-center">
              <span className="text-green-400 text-xl">+</span>
            </div>
            <div>
              <div className="text-green-300 text-sm">
                <span className="text-green-400">{">"}</span> create_new_post()
              </div>
              <div className="text-green-500 text-xs mt-1">
                Поділіться ASCII артом з світом…
              </div>
            </div>
          </div>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="terminal-card p-12 text-center animate-slide-in-up">
          <pre className="text-green-400 text-sm mb-6 animate-typing">{`
    ╔═══════════════════════╗
    ║     EMPTY FEED        ║
    ║                       ║
    ║   No posts found...   ║
    ║                       ║
    ║  Be the first to      ║
    ║  share ASCII art!     ║
    ╚═══════════════════════╝`}</pre>
          <Link
            href="/create"
            className="inline-block border border-green-400 px-6 py-3 hover:bg-green-400 hover:text-black glow-green btn-terminal"
          >
            [CREATE_FIRST_POST]
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="stagger-item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <PostComponent post={post} currentUser={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
