// components/post.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  created_at: string;
  likesCount: number;
  userLiked: boolean;
}

export interface PostType {
  id: string;
  userId: string;
  username: string;
  content: string;
  created_at: string;
  likes: number;
  user_liked: boolean;
  comments: Comment[];
}

interface PostProps {
  post: PostType;
  currentUser: User;
}

export default function Post({ post, currentUser }: PostProps) {
  const router = useRouter();

  // --- локальні стани ---
  const [liked, setLiked] = useState(post.user_liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEaster, setShowEaster] = useState(false);

  // синхронізуємо стан коментарів при зміні пропсів
  useEffect(() => {
    setComments(post.comments);
  }, [post.comments]);

  // --- лайк поста ---
  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      // показати пасхалку
      setShowEaster(true);
      setTimeout(() => setShowEaster(false), 9000);
    } catch {
      // відкотити при помилці
      setLiked(!next);
      setLikeCount(c => next ? c - 1 : c + 1);
    }
  }

  const toggleCommentLike = async (commentId: string, idx: number) => {
    try {
      const res = await fetch(
        `/api/posts/${post.id}/comments/${commentId}/like`,
        { method: "POST", headers: { "userId": currentUser.id } }
      );
      const { success, liked, count } = await res.json();
      if (success) {
        setComments(cs => {
          const arr = [...cs];
          arr[idx] = {
            ...arr[idx],
            userLiked: liked,
            likesCount: count,
          };
          return arr;
        });
      }
    } catch (err) {
      console.error("Server error when liking comment:", err);
    }
  };

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const form = new FormData();
    form.set("userId", currentUser.id);
    form.set("username", currentUser.username);
    form.set("content", newComment.trim());
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        body: form,
      });
      const { comment } = await res.json();
      if (comment) {
        setComments(cs => [...cs, {
          ...comment,
          likesCount: 0,
          userLiked: false
        }]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(c: Comment) {
    setEditingId(c.id);
    setEditContent(c.content);
  }
  async function saveEdit(c: Comment) {
    if (!editContent.trim()) return;
    const form = new FormData();
    form.set("content", editContent.trim());
    const res = await fetch(
      `/api/posts/${post.id}/comments/${c.id}`,
      { method: "PATCH", body: form }
    );
    const { comment: updated } = await res.json();
    setComments(cs => cs.map(x => x.id === c.id
      ? { ...x, content: updated.content, created_at: updated.created_at }
      : x
    ));
    setEditingId(null);
    setEditContent("");
  }

  async function deleteComment(c: Comment) {
    await fetch(`/api/posts/${post.id}/comments/${c.id}`, { method: "DELETE" });
    setComments(cs => cs.filter(x => x.id !== c.id));
  }

  return (
    <div className="terminal-card overflow-hidden mb-6 relative">
      {/* Header */}
      <div className="p-4 border-b border-green-400/30 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-green-400 flex items-center justify-center">
            <span className="text-green-400">{post.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-white font-bold">@{post.username}</div>
            <div className="text-green-500 text-xs">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: uk })}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-green-400 text-xs">ID: {post.id.slice(0, 8)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <pre className="whitespace-pre-wrap text-green-400 font-mono">{post.content}</pre>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-green-400/30 flex space-x-6 items-center">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-sm ${liked ? "text-red-400" : "text-green-400"}`}
        >
          <span className="cursor-pointer">{liked ? "♥" : "♡"}</span>
          <span className="cursor-pointer">[{likeCount}]</span>
        </button>
        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center space-x-2 text-green-400 text-sm"
        >
          <span className="cursor-pointer">💬</span>
          <span className="cursor-pointer">[{comments.length}]</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-green-400/30">
          <div className="p-4 max-h-48 overflow-y-auto space-y-4">
            {comments.map((c, idx) => {
              const date = new Date(c.created_at);
              const isMe = c.userId === currentUser.id;
              return (
                <div key={c.id} className="flex space-x-3">
                  {/* Avatar */}
                  <div className="w-6 h-6 border border-green-400 flex items-center justify-center">
                    <span className="text-green-400">{(c.username || "?").charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      {/* Author + time */}
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-sm">@{c.username}</span>
                        <span className="text-green-500 text-xs">
                          {formatDistanceToNow(date, { addSuffix: true, locale: uk })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Like button on comment */}
                        <button
                          onClick={() => toggleCommentLike(c.id, idx)}
                          className={`flex items-center space-x-1 text-sm ${c.userLiked ? "text-red-400" : "text-green-400"}`}
                        >
                          <span className="cursor-pointer">{c.userLiked ? "♥" : "♡"}</span>
                          <span>[{c.likesCount}]</span>
                        </button>
                        {/* Edit/Delete own comment */}
                        {isMe && (
                          <>
                            <button onClick={() => startEdit(c)} className="text-yellow-400 text-xs hover:underline cursor-pointer">Edit</button>
                            <button onClick={() => deleteComment(c)} className="text-red-400 text-xs hover:underline cursor-pointer">Delete</button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit form or content */}
                    {editingId === c.id ? (
                      <div className="mt-2 flex space-x-2">
                        <input
                          className="flex-1 bg-black border border-green-400 px-2 py-1 text-green-400"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                        />
                        <button onClick={() => saveEdit(c)} className="text-green-400 text-xs px-2">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-red-400 text-xs px-2">Cancel</button>
                      </div>
                    ) : (
                      <p className="text-green-300 text-sm mt-1">{c.content}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Comment Form */}
          <div className="p-4 border-t border-green-400/30">
            <form onSubmit={handleComment} className="flex space-x-3">
              <input
                type="text"
                className="flex-1 bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none"
                placeholder="add_comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={submitting}
              />
              <button type="submit" disabled={submitting || !newComment.trim()} className="border border-green-400 px-4 py-2 text-xs">
                SEND
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ASCII Easter Egg */}
      {showEaster && (
        <div className="ascii-easter absolute bottom-0 right-0 p-4 text-xs text-green-400">
          {`                                 (O)
                              __--|--__
                      .------~---------~-----.
                      | .------------------. |
                      | |                  | |
                      | |   .'''.  .'''.   | |
                      | |   :    ''    :   | |
                      | |   :          :   | |
                      | |    '.      .'    | |
                      | |      '.  .'      | |
.------------.        | |        ''        | |  .------------.
| O          |        | \`------------------' |  |            |
| O   .-----.|        \`.____________________.'  |.-----.     |
| O .'      ||          \`-------.  .-------'    ||      \`.   |
|o*.'       ||   .--.      ____.'  \`.____       ||       \`.  |
|.-'        || .-~--~-----~--------------~----. ||        \`-.|
||          || |AST  .---------.|.--------.|()| ||          ||
||          || |     \`---------'|\`-o-=----'|  | ||          ||
|\`-._    AST|| |-*-*------------| *--  (==)|  | ||AST    _.-'|
|    ~-.____|| |  SANIO- KRASULIA|          |  | ||____.-~    |
\`------------' \`------------------------------' \`------------'`}
        </div>
      )}
    </div>
  );
}
