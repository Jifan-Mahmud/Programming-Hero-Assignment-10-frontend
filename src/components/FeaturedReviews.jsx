"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote, CheckCircle, Award, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function FeaturedReviews() {
  const { BACKEND_URL } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/reviews/featured`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [BACKEND_URL]);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/50 dark:bg-black/20 border-y border-slate-200/60 dark:border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Athlete Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Our Athletes Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unfiltered feedback and transformation experiences from members training daily with our certified coaches.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev, idx) => (
            <div
              key={rev._id || idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-lg shadow-black/5 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (rev.rating || 5)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-orange-500/20 group-hover:text-orange-500/40 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Class Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        rev.userImage ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                      }
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {rev.userName}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[150px]">
                        {rev.className || "Conditioning Session"}
                      </span>
                    </div>
                  </div>

                  {rev.verifiedBooking && (
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"
                      title="Verified Athlete Booking"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
