"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
}

interface CreatePostFormProps {
  user: User;
}

export default function CreatePostForm({ user }: CreatePostFormProps) {
  const [content, setContent]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.set("userId", user.id);
      form.set("username", user.username);
      form.set("content", content.trim());

      const res = await fetch("/api/posts", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Failed to create");

      setShowSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error("Error publishing:", err);
      setLoading(false);
    }
  }

  const exampleArt = `    /\\_/\\  
   ( o.o ) 
    > ^ <

Or just write plain text!

Examples of ASCII art:
╔══════════════╗
║ Hello World! ║
╚══════════════╝

    ┌─┐┌─┐┌─┐┬┬
    ├─┤└─┐│  ││
    ┴ ┴└─┘└─┘┴┴`;

  if (showSuccess) {
    return (
      <div className="terminal-card p-12 text-center post-success">
        <pre className="text-green-400 text-sm mb-6 animate-typing">{`
╔═══════════════════════════╗
║    POST CREATED SUCCESS   ║
║                           ║
║   Redirecting to feed...  ║
╚═══════════════════════════╝`}</pre>
        <div className="loading-spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="animate-slide-in-up">
        <label className="block text-sm mb-3 text-green-300">
          <span className="text-green-400">{">"}</span> POST_CONTENT:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={exampleArt}
          className="w-full h-80 bg-black border border-green-400 p-4 text-green-400 font-mono text-sm focus:outline-none resize-none input-terminal"
          required
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-green-500 mt-1">
          <div>&gt; Use ASCII characters to create art</div>
          <div>[{content.length}/1000]</div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 animate-slide-in-up">
        <button
          type="button"
          onClick={() => setContent("")}
          disabled={loading}
          className="border border-green-400 px-6 py-3 hover:bg-green-400 hover:text-black transition-all btn-terminal"
        >
          [CLEAR]
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="border border-green-400 px-6 py-3 hover:bg-green-400 hover:text-black disabled:opacity-50 transition-all glow-green btn-terminal"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="loading-spinner mr-2"></span>
              [PUBLISHING...]
            </span>
          ) : (
            "[PUBLISH_POST]"
          )}
        </button>
      </div>
    </form>
  );
}
