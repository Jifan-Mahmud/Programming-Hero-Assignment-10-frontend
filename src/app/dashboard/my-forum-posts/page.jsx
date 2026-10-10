"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Trash2,
  Heart,
  PlusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function MyForumPostsPage() {
  const { user, BACKEND_URL } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = () => {
    fetch(`${BACKEND_URL}/api/forum/trainer/my`, {
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
    if (user) fetchMyPosts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this forum article?")) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Post removed successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            My Forum Articles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Articles and coaching insights published by you on the Community Forum.
          </p>
        </div>

        <Link
          href="/dashboard/add-forum-post"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-black font-extrabold text-xs self-start"
        >
          <PlusCircle className="w-4 h-4" /> Create Article
        </Link>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Articles Published</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't written any community articles yet. Share your workout guidance with our athlete base!
            </p>
            <Link
              href="/dashboard/add-forum-post"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Write First Post
            </Link>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-colors"
              >
                <div className="relative h-44 w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] bg-[#090d16]/80 text-rose-400 px-2 py-0.5 rounded-full border border-white/10">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    {post.likes?.length || 0} Likes
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="font-bold text-white text-sm line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-4 flex items-center justify-between">
                    <Link
                      href={`/forum/${post._id}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Read Post <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
