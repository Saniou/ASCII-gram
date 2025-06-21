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

  const [liked, setLiked] = useState(post.user_liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [likesDetails, setLikesDetails] = useState<Array<{ username: string; created_at: string }>>([]);

  const [showEaster, setShowEaster] = useState(false);

  useEffect(() => {
    setLiked(post.user_liked);
    setLikeCount(post.likes);
    setComments(post.comments);
  }, [post]);

  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      setShowEaster(true);
      setTimeout(() => setShowEaster(false), 9000);
    } catch {
      setLiked(!next);
      setLikeCount(c => next ? c - 1 : c + 1);
    }
  }

  async function openLikesModal() {
    setLikesModalOpen(true);
    const res = await fetch(`/api/posts/${post.id}/likes`);
    if (res.ok) {
      const json = await res.json();
      setLikesDetails(json.likes);
    }
  }

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
        setComments(cs => [...cs, comment]);
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

    setComments(cs =>
      cs.map(x =>
        x.id === c.id
          ? {
            ...x,
            content: updated.content,
            ...(updated.created_at && { created_at: updated.created_at }),
          }
          : x
      )
    );
    setEditingId(null);
    setEditContent("");
  }

  async function deleteComment(c: Comment) {
    await fetch(`/api/posts/${post.id}/comments/${c.id}`, { method: "DELETE" });
    setComments(cs => cs.filter(x => x.id !== c.id));
  }

  const isAuthor = currentUser.id === post.userId

  async function handleDeletePost() {
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="terminal-card overflow-hidden mb-6 relative z-10">
      <div className="p-4 border-b border-green-400/30 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-green-400 flex items-center justify-center">
            <span className="text-green-400">
              {post.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-white font-bold">@{post.username}</div>
            <div className="text-green-500 text-xs">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true, locale: uk,
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 text-xs px-2 py-1 border border-red-500 hover:bg-red-500 hover:text-black transition"
            >
              Delete post
            </button>
          )}
          <div className="text-green-400 text-xs">ID:{post.id.slice(0, 8)}</div>
        </div>
      </div>

      <div className="p-6">
        <pre className="whitespace-pre-wrap text-green-400 font-mono">
          {post.content}
        </pre>
      </div>

      <div className="px-4 py-3 border-t border-green-400/30 flex space-x-6 items-center">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-sm ${liked ? "text-red-400" : "text-green-400"
            }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>[{likeCount}]</span>
        </button>

        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center space-x-2 text-green-400 text-sm"
        >
          <span>💬</span>
          <span>[{comments.length}]</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-green-400/30">
          <div className="p-4 max-h-48 overflow-y-auto space-y-4">
            {comments.map(c => {
              const date = new Date(c.created_at);
              const isMe = c.userId === currentUser.id;
              return (
                <div key={c.id} className="flex space-x-3">
                  <div className="w-6 h-6 border border-green-400 flex items-center justify-center">
                    <span className="text-green-400">
                      {(c.username ?? "?").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-sm">
                          @{c.username}
                        </span>
                        <span className="text-green-500 text-xs">
                          {formatDistanceToNow(date, { addSuffix: true, locale: uk })}
                        </span>
                      </div>
                      {isMe && (
                        <div className="space-x-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="text-yellow-400 text-xs hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteComment(c)}
                            className="text-red-400 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Редагування */}
                    {editingId === c.id ? (
                      <div className="mt-2 flex space-x-2">
                        <input
                          className="flex-1 bg-black border border-green-400 px-2 py-1 text-green-400"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                        />
                        <button
                          onClick={() => saveEdit(c)}
                          className="text-green-400 text-xs px-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-400 text-xs px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-green-300 text-sm mt-1">{c.content}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-green-400/30">
            <form onSubmit={handleComment} className="flex space-x-3">
              <input
                type="text"
                className="flex-1 bg-black border border-green-400 px-3 py-2 text-green-400"
                placeholder="add_comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="border border-green-400 px-4 py-2 text-xs"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      )}

      {likesModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="bg-black border border-green-400 p-4 w-64">
            <h3 className="text-green-400 mb-2">Likes:</h3>
            <ul className="text-green-300 text-xs space-y-1 max-h-40 overflow-y-auto">
              {likesDetails.map((u, i) => (
                <li key={i}>
                  {u.username} —{" "}
                  {formatDistanceToNow(new Date(u.created_at), {
                    addSuffix: true, locale: uk,
                  })}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setLikesModalOpen(false)}
              className="mt-4 px-3 py-1 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEaster && (
        <div className="ascii-easter">
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
