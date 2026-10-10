"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import {
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Shield,
  PlusCircle,
} from "lucide-react";

export default function CommunityForumPage() {
  const { user, isTrainer, isAdmin, BACKEND_URL } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum?page=${page}&limit=4`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setTotalPosts(data.total || 0);
      }
    } catch (err) {
      console.error("Forum fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-200/80 dark:border-white/5 pb-8">
            <div>
              <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest block mb-2">
                PULSEFORGE FORUM
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
                Community Discussions
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
                Explore expert advice, workout philosophies, and recovery tips written by
                our certified Trainers and Admins. Join the conversation today.
              </p>
            </div>

            {(isTrainer || isAdmin) && (
              <Link
                href="/dashboard/add-forum-post"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 hover:scale-105 transition-all self-start md:self-end"
              >
                <PlusCircle className="w-4 h-4" /> Create New Post
              </Link>
            )}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-slate-200 dark:bg-white/[0.03] animate-pulse border border-slate-200 dark:border-white/5"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0f1422]/60 rounded-3xl border border-slate-200 dark:border-white/5">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No discussions posted yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Stay tuned for updates from coaches and athletic leaders!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] hover:border-orange-500/40 transition-all flex flex-col overflow-hidden shadow-sm dark:shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
                >
                  {/* Post Image */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#07090e]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-white/10 capitalize flex items-center gap-1.5 shadow-sm">
                      <Shield className="w-3 h-3" /> {post.authorRole || "Trainer"}
                    </div>
                  </div>

                  {/* Post Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Author Header */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <img
                          src={
                            post.authorImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              post.authorName || "Coach"
                            )}&background=f97316&color=fff`
                          }
                          alt={post.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-orange-500/30"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {post.authorName}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Truncated description */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                          {post.comments?.length || 0} Comments
                        </span>
                      </div>

                      {/* Read More button */}
                      <Link
                        href={`/forum/${post._id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white font-bold text-xs tracking-wide transition-all border border-slate-200 dark:border-white/10 hover:border-transparent text-slate-800 dark:text-white flex items-center gap-1.5"
                      >
                        Read More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                    page === num
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
