"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      username: form.get("username"),
      email:    form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // при успіху заходимо на домашню
    router.push("/");
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
          minLength={3}
          className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-white glow-green rounded-none input-terminal"
          placeholder="choose_username..."
        />
      </div>

      <div className="animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
        <label className="block text-sm mb-2 text-green-300">
          <span className="text-green-400">{">"}</span> EMAIL:
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-white glow-green rounded-none input-terminal"
          placeholder="enter_email..."
        />
      </div>

      <div className="animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
        <label className="block text-sm mb-2 text-green-300">
          <span className="text-green-400">{">"}</span> PASSWORD:
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-white glow-green rounded-none input-terminal"
          placeholder="create_password..."
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
        style={{ animationDelay: "0.6s" }}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner mr-2"></span>
            [CREATING...]
          </span>
        ) : (
          "[REGISTER]"
        )}
      </button>
    </form>
  );
}
