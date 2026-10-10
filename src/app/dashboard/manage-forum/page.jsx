"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { MessageSquare, Trash2, ExternalLink, Heart, Clock } from "lucide-react";

export default function ManageForumPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetch(`${BACKEND_URL}/api/forum/admin/all`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user && isAdmin) fetchPosts();
  }, [user, isAdmin]);

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to moderate and remove this post?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Post removed successfully");
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          Community Forum Moderation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all user and trainer discussions. Remove flagged, inaccurate, or inappropriate community content.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Posts to Moderate</h3>
            <p className="text-xs text-slate-400">All community posts are clean!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Article Title</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Engagements</th>
                  <th className="py-4 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block text-sm line-clamp-1">
                        {post.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      {post.authorName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-slate-300 border border-white/10">
                        {post.authorRole || "Trainer"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          {post.likes?.length || 0}
                        </span>
                        <span>{post.comments?.length || 0} Comments</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/forum/${post._id}`}
                        target="_blank"
                        className="p-2 inline-flex rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="View Live Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
