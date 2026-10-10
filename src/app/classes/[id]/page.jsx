"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  Clock,
  Activity,
  Calendar,
  CheckCircle2,
  Heart,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Flame,
} from "lucide-react";

export default function ClassDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;
  const router = useRouter();
  const { user, BACKEND_URL, apiFetch } = useApp();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Load class info
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/classes/${classId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Class not found");
        return res.json();
      })
      .then((data) => {
        setClassData(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Could not load class details");
        setLoading(false);
      });
  }, [BACKEND_URL, classId]);

  // Check booking & favorite status for logged-in user
  useEffect(() => {
    if (user && classId) {
      // 1. Check if already booked
      apiFetch(`/api/bookings/check/${classId}`)
        .then((res) => (res.ok ? res.json() : { booked: false }))
        .then((data) => setIsBooked(Boolean(data.booked)))
        .catch(() => {});

      // 2. Check if in favorites
      apiFetch(`/api/favorites/check/${classId}`)
        .then((res) => (res.ok ? res.json() : { isFavorite: false }))
        .then((data) => setIsFavorite(Boolean(data.isFavorite)))
        .catch(() => {});
    }
  }, [user, classId, apiFetch]);

  // Handle Book Now Action
  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book a class");
      router.push(`/login?redirect=/classes/${classId}`);
      return;
    }

    if (isBooked) {
      toast.error("You have already booked this class");
      return;
    }

    // Redirect to Payment Page
    router.push(`/payment?classId=${classId}`);
  };

  // Handle Favorite Action
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to save favorites");
      router.push(`/login?redirect=/classes/${classId}`);
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        // Remove favorite
        const res = await fetch(`${BACKEND_URL}/api/favorites/${classId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
        } else {
          toast.error("Failed to remove favorite");
        }
      } else {
        // Add favorite
        const res = await fetch(`${BACKEND_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ classId }),
        });
        const data = await res.json();
        if (res.ok) {
          setIsFavorite(true);
          toast.success("Successfully added to your favorites!");
        } else {
          toast.error(data.message || "Failed to add favorite");
        }
      }
    } catch (err) {
      toast.error("Error updating favorite");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold">Class Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            This training class might have been removed or is pending approval.
          </p>
          <Link
            href="/classes"
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm shadow-md shadow-orange-500/25"
          >
            Back to All Classes
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Classes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Image & Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl h-[380px] sm:h-[440px]">
                <img
                  src={classData.image}
                  alt={classData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#090d16]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-white/10 shadow-sm">
                  {classData.category}
                </div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  {classData.bookingCount || 0} Total Bookings
                </div>
              </div>

              {/* Class Description */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session Overview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {classData.description ||
                    "Experience comprehensive functional movement, high-energy conditioning, and expert coaching designed to help you break through plateaus and achieve athletic excellence."}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-white/10 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                      Duration
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {classData.duration || "60 mins"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                    <Activity className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                      Difficulty
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {classData.difficulty || "All Levels"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                    <Calendar className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                      Schedule
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {classData.schedule || "Mon, Wed, Fri"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trainer Profile Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      classData.trainerImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        classData.trainerName || "Trainer"
                      )}&background=f97316&color=fff`
                    }
                    alt={classData.trainerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/40"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                      Master Instructor
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {classData.trainerName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{classData.trainerEmail}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Verified Coach
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking & Actions Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 p-8 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                    Official PulseForge Session
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {classData.name}
                  </h1>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Single Session Fee</span>
                    <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                      ${classData.price}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Includes Gym Access
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Instant confirmation & digital calendar sync</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Towel service and locker amenities included</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Free cancellation up to 12 hours before session</span>
                  </div>
                </div>

                {/* Primary Action: Book Now Button */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                  <button
                    onClick={handleBookNow}
                    disabled={isBooked}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                      isBooked
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-300 dark:border-white/5"
                        : "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-orange-500/25 hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {isBooked ? "Already Booked" : "Book Now & Checkout"}
                  </button>

                  {/* Secondary Action: Add to Favorites Button */}
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      isFavorite
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
                        : "bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                    {isFavorite ? "Saved to Favorites (Remove)" : "Add to Favorites"}
                  </button>
                </div>

                {!user && (
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-2">
                    Must be signed in to book or favorite.{" "}
                    <Link href={`/login?redirect=/classes/${classId}`} className="text-orange-500 font-semibold underline">
                      Log in here
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
