"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
        <label className="block text-sm mb-2 text-green-300">
          <span className="text-green-400">{">"}</span> USERNAME:
        </label>
        <input
          type="text"
          name="username"
          required
          className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-white glow-green rounded-none input-terminal"
          placeholder="enter_username..."
        />
      </div>

      <div className="animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
        <label className="block text-sm mb-2 text-green-300">
          <span className="text-green-400">{">"}</span> PASSWORD:
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-white glow-green rounded-none input-terminal"
          placeholder="enter_password..."
        />
      </div>

      {error && (
        <div className="border border-red-400 p-3 text-red-400 text-sm bg-red-900/20 animate-slide-in-up">
          <span className="text-red-400">ERROR:</span> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-green-400 p-3 hover:bg-green-400 hover:text-black disabled:opacity-50 transition-all glow-green btn-terminal animate-slide-in-up"
        style={{ animationDelay: "0.5s" }}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner mr-2"></span>
            [CONNECTING...]
          </span>
        ) : (
          "[LOGIN]"
        )}
      </button>
    </form>
  );
}
