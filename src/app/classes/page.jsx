"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Filter,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

const CATEGORIES = [
  "all",
  "HIIT",
  "Yoga",
  "Strength",
  "Cardio",
  "Pilates",
  "CrossFit",
];

export default function AllClassesPage() {
  const { BACKEND_URL } = useApp();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClasses, setTotalClasses] = useState(0);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam =
        selectedCategory === "all" ? "" : `&category=${selectedCategory}`;
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const url = `${BACKEND_URL}/api/classes?page=${page}&limit=6${searchParam}${categoryParam}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
        setTotalPages(data.totalPages || 1);
        setTotalClasses(data.total || 0);
      }
    } catch (err) {
      console.error("Classes load error:", err);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, page, search, selectedCategory]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClasses();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest block mb-2">
              DISCOVER & TRAIN
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              All Fitness Classes
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Browse approved training sessions led by verified instructors. Filter by
              specialty or search directly by class title.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Form (MongoDB $regex) */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full md:w-96"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search classes by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm transition-colors"
                />
              </form>

              {/* Total count badge */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Showing {classes.length} of {totalClasses} approved classes
              </div>
            </div>

            {/* Category Filter Pills (MongoDB $in) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-white dark:bg-[#0f1422] text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white border border-slate-200 dark:border-white/5 hover:border-orange-500/40"
                  }`}
                >
                  {cat === "all" ? "All Programs" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Classes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-slate-200 dark:bg-white/[0.03] animate-pulse border border-slate-200 dark:border-white/5"
                />
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0f1422]/60 rounded-3xl border border-slate-200 dark:border-white/5">
              <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No classes matched your query</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching with different keywords or switch category filter to "All Programs".
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setPage(1);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/25"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((item) => (
                <div
                  key={item._id}
                  className="group rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] hover:border-orange-500/40 transition-all flex flex-col overflow-hidden shadow-sm dark:shadow-xl hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#07090e]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-white/10 shadow-sm">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      {item.bookingCount || 0} Bookings
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={
                            item.trainerImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.trainerName || "Trainer"
                            )}&background=f97316&color=fff`
                          }
                          alt={item.trainerName}
                          className="w-6 h-6 rounded-full object-cover border border-orange-500/30"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          Coach {item.trainerName}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>{item.duration || "60 mins"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-rose-500" />
                          <span>{item.difficulty || "All Levels"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Class Fee</span>
                        <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                          ${item.price}
                        </span>
                      </div>

                      <Link
                        href={`/classes/${item._id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white font-semibold text-xs tracking-wide transition-all border border-slate-200 dark:border-white/10 hover:border-transparent text-slate-800 dark:text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
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
                aria-label="Previous Page"
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
                aria-label="Next Page"
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
