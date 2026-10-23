"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, CheckCircle, Send, Award, ThumbsUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function ClassReviews({ classId, className, trainerName }) {
  const { user, BACKEND_URL, apiFetch } = useApp();
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    averageRating: 5.0,
    totalReviews: 0,
    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!classId) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews/class/${classId}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsData(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [classId, BACKEND_URL]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review!");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Thank you! Your athlete review has been published.");
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("Something went wrong submitting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const { reviews, averageRating, totalReviews, counts } = reviewsData;

  return (
    <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-white/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-500" />
            Athlete Reviews & Ratings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Genuine feedback from enrolled athletes who completed this program.
          </p>
        </div>
      </div>

      {/* Rating Breakdown & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10">
        {/* Score Card */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
          <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {averageRating}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-2.5 p-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = counts?.[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  {star} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          Leave Your Workout Feedback
        </h3>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "text-slate-300 dark:text-slate-700"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-orange-500">
                {rating === 5 && "⭐ Outstanding (5/5)"}
                {rating === 4 && "Great Session (4/5)"}
                {rating === 3 && "Good Workout (3/5)"}
                {rating === 2 && "Fair (2/5)"}
                {rating === 1 && "Needs Improvement (1/5)"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Share Your Training Experience
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the workout intensity, trainer coaching cues, and atmosphere? (e.g., Incredible HIIT stamina burn, Marcus pushed us to failure safely!)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          All Reviews ({reviews.length})
        </h4>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2">
            <p className="text-xs text-slate-400">
              No reviews for this session yet. Be the first athlete to leave feedback!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r, idx) => (
              <div
                key={r._id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        r.userImage ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                      }
                      alt={r.userName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/30"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {r.userName}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{r.comment}"
                </p>

                {r.verifiedBooking && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Athlete Enrollment</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
