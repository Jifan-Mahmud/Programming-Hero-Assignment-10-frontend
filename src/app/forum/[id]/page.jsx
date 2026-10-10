"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  Heart,
  ThumbsDown,
  MessageSquare,
  ArrowLeft,
  Clock,
  Shield,
  Send,
  CornerDownRight,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

export default function ForumPostDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, BACKEND_URL } = useApp();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // New comment input
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Replying state
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // Editing state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Load post
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view forum post discussions");
      router.push(`/login?redirect=/forum/${postId}`);
      return;
    }

    if (postId) {
      fetch(`${BACKEND_URL}/api/forum/${postId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Post not found");
          return res.json();
        })
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load post");
          setLoading(false);
        });
    }
  }, [authLoading, user, postId, BACKEND_URL, router]);

  // Vote handler (Like / Dislike)
  const handleVote = async (type) => {
    if (!user) {
      toast.error("Login required to vote");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to vote");
        return;
      }

      // Update local state
      setPost((prev) => {
        let likes = [...(prev.likes || [])];
        let dislikes = [...(prev.dislikes || [])];

        if (type === "like") {
          if (likes.includes(user.email)) {
            likes = likes.filter((e) => e !== user.email);
          } else {
            likes.push(user.email);
            dislikes = dislikes.filter((e) => e !== user.email);
          }
        } else if (type === "dislike") {
          if (dislikes.includes(user.email)) {
            dislikes = dislikes.filter((e) => e !== user.email);
          } else {
            dislikes.push(user.email);
            likes = likes.filter((e) => e !== user.email);
          }
        }

        return { ...prev, likes, dislikes };
      });
    } catch (err) {
      toast.error("Vote failed");
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({ ...prev, comments: data.comments }));
        setNewComment("");
        toast.success("Comment posted!");
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Reply to Comment
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: replyContent.trim(),
          parentCommentId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({ ...prev, comments: data.comments }));
        setReplyingToId(null);
        setReplyContent("");
        toast.success("Reply added!");
      } else {
        toast.error(data.message || "Failed to add reply");
      }
    } catch (err) {
      toast.error("Error submitting reply");
    }
  };

  // Save Edit Comment
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/forum/${postId}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editContent.trim() }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({ ...prev, comments: data.comments }));
        setEditingCommentId(null);
        setEditContent("");
        toast.success("Comment updated!");
      } else {
        toast.error(data.message || "Failed to update comment");
      }
    } catch (err) {
      toast.error("Error editing comment");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/forum/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({ ...prev, comments: data.comments }));
        toast.success("Comment deleted");
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (err) {
      toast.error("Error deleting comment");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold">Post Not Found</h2>
          <Link
            href="/forum"
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm"
          >
            Back to Forum
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasLiked = post.likes?.includes(user?.email);
  const hasDisliked = post.dislikes?.includes(user?.email);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discussions
          </Link>

          {/* Article Container */}
          <article className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-2xl">
            {/* Header Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#090d16]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-white/10 capitalize flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> {post.authorRole || "Trainer"} Verified
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              {/* Post Title & Metadata */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.authorImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.authorName || "Coach"
                      )}&background=10b981&color=000`
                    }
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {post.authorName}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {post.title}
                </h1>
              </div>

              {/* Full Description */}
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-b border-white/10 py-6">
                {post.description}
              </div>

              {/* Like / Dislike Interaction Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Like Button */}
                  <button
                    onClick={() => handleVote("like")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      hasLiked
                        ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                        : "bg-white/[0.04] text-slate-300 border-white/10 hover:border-rose-500/50 hover:text-rose-400"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${hasLiked ? "fill-white" : ""}`}
                    />
                    <span>Like ({post.likes?.length || 0})</span>
                  </button>

                  {/* Dislike Button */}
                  <button
                    onClick={() => handleVote("dislike")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      hasDisliked
                        ? "bg-slate-700 text-white border-slate-600"
                        : "bg-white/[0.04] text-slate-300 border-white/10 hover:border-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <ThumbsDown
                      className={`w-4 h-4 ${hasDisliked ? "fill-white" : ""}`}
                    />
                    <span>Dislike ({post.dislikes?.length || 0})</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>{post.comments?.length || 0} Discussions</span>
                </div>
              </div>
            </div>
          </article>

          {/* COMMENTS & REPLIES SECTION */}
          <section className="mt-10 rounded-3xl bg-[#111827] border border-white/10 p-6 sm:p-10 space-y-8">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Comments & Athlete Insights
            </h3>

            {/* Post new comment form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={
                    user?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "Member"
                    )}&background=10b981&color=000`
                  }
                  alt={user?.name || "Member"}
                  className="w-8 h-8 rounded-full border border-emerald-500/30 shrink-0 mt-1"
                />
                <div className="flex-1 relative">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts, ask questions, or contribute experience..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              {(!post.comments || post.comments.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                post.comments.map((comm) => {
                  const isCommentOwner = comm.userEmail === user?.email;
                  const canModerate = isCommentOwner || isAdmin;

                  return (
                    <div
                      key={comm.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
                    >
                      {/* Top comment header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              comm.userImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                comm.userName || "User"
                              )}&background=10b981&color=000`
                            }
                            alt={comm.userName}
                            className="w-7 h-7 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {comm.userName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(comm.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Owner / Admin actions */}
                        <div className="flex items-center gap-1">
                          {isCommentOwner && (
                            <button
                              onClick={() => {
                                setEditingCommentId(comm.id);
                                setEditContent(comm.content);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                              title="Edit Comment"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canModerate && (
                            <button
                              onClick={() => handleDeleteComment(comm.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content or Edit Form */}
                      {editingCommentId === comm.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-3 py-1 rounded-lg border border-white/10 text-[11px] text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(comm.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-[11px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300 leading-relaxed pl-9">
                          {comm.content}
                        </p>
                      )}

                      {/* Reply Button Trigger */}
                      <div className="pl-9 pt-1 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setReplyingToId(
                              replyingToId === comm.id ? null : comm.id
                            );
                            setReplyContent("");
                          }}
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          Reply
                        </button>
                      </div>

                      {/* Inline Reply Input Form */}
                      {replyingToId === comm.id && (
                        <div className="pl-9 pt-2 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`Reply to ${comm.userName}...`}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleReplySubmit(comm.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies List */}
                      {comm.replies && comm.replies.length > 0 && (
                        <div className="pl-9 pt-3 space-y-2.5 border-t border-white/5 mt-2">
                          {comm.replies.map((rep) => {
                            const isRepOwner = rep.userEmail === user?.email;
                            const canModRep = isRepOwner || isAdmin;

                            return (
                              <div
                                key={rep.id}
                                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={
                                        rep.userImage ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                          rep.userName || "User"
                                        )}&background=10b981&color=000`
                                      }
                                      alt={rep.userName}
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span className="text-[11px] font-bold text-white">
                                      {rep.userName}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {new Date(rep.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {canModRep && (
                                    <div className="flex items-center gap-1">
                                      {isRepOwner && (
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(rep.id);
                                            setEditContent(rep.content);
                                          }}
                                          className="text-slate-400 hover:text-emerald-400 p-1"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(rep.id)
                                        }
                                        className="text-slate-400 hover:text-rose-400 p-1"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {editingCommentId === rep.id ? (
                                  <div className="space-y-1.5 pt-1">
                                    <input
                                      type="text"
                                      value={editContent}
                                      onChange={(e) =>
                                        setEditContent(e.target.value)
                                      }
                                      className="w-full px-2 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() =>
                                          setEditingCommentId(null)
                                        }
                                        className="text-[10px] text-slate-400"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleSaveEdit(rep.id)}
                                        className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-bold"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-300 pl-7">
                                    {rep.content}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
