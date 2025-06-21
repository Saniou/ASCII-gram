// components/post.tsx
"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

// ← Експортуємо Comment, щоб можна було імпортувати звідси
export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  created_at: string;
}

// ← Експортуємо PostType
export interface PostType {
  id: string;
  content: string;
  username: string;
  created_at: string;
  likes: number;
  comments: Comment[];
  user_liked: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface PostProps {
  post: PostType;
  currentUser: User;
}

export default function Post({ post, currentUser }: PostProps) {
  const [liked, setLiked] = useState(post.user_liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLiked(post.user_liked);
    setLikeCount(post.likes);
    setComments(post.comments);
  }, [post]);

  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } catch {
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const payload = new FormData();
    payload.set("userId", currentUser.id);
    payload.set("username", currentUser.username);
    payload.set("content", newComment.trim());
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        body: payload,
      });
      const json = await res.json();
      if (json.comment) {
        setComments((cs) => [...cs, json.comment as Comment]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="terminal-card overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-green-400/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-green-400 flex items-center justify-center">
              <span className="text-green-400">
                {post.username ? post.username.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div>
              <div className="text-white font-bold">@{post.username}</div>
              <div className="text-green-500 text-xs">
                {post.created_at
                  ? formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: uk,
                    })
                  : "невідомо"}
              </div>
            </div>
          </div>
          <div className="text-green-400 text-xs">ID:{post.id.slice(0, 8)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <pre className="whitespace-pre-wrap text-green-400 font-mono">
          {post.content}
        </pre>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-green-400/30 flex space-x-6">
        <button
          onClick={handleLike}
          disabled={submitting}
          className={`flex items-center space-x-2 text-sm transition-all ${
            liked ? "text-red-400" : "text-green-400"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>[{likeCount}]</span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center space-x-2 text-green-400 text-sm"
        >
          <span>💬</span>
          <span>[{comments.length}]</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-green-400/30">
          <div className="p-4 max-h-48 overflow-y-auto space-y-4">
            {comments.map((c) => {
              const date = !isNaN(new Date(c.created_at).getTime())
                ? new Date(c.created_at)
                : new Date();
              return (
                <div key={c.id} className="flex space-x-3">
                  <div className="w-6 h-6 border border-green-400 flex items-center justify-center">
                    <span className="text-green-400">
                      {c.username ? c.username.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-sm">
                        @{c.username}
                      </span>
                      <span className="text-green-500 text-xs">
                        {formatDistanceToNow(date, {
                          addSuffix: true,
                          locale: uk,
                        })}
                      </span>
                    </div>
                    <p className="text-green-300 text-sm mt-1">{c.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New comment form */}
          <div className="p-4 border-t border-green-400/30">
            <form onSubmit={handleComment} className="flex space-x-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="add_comment..."
                disabled={submitting}
                className="flex-1 bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="border border-green-400 px-4 py-2 text-sm"
              >
                {submitting ? "[...]" : "[SEND]"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
