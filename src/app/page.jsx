"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeaturedReviews from "@/components/FeaturedReviews";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  Trophy,
  ShieldCheck,
  Clock,
  MessageSquare,
  Activity,
  Calculator,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { BACKEND_URL } = useApp();
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // BMI Calculator State
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmiResult, setBmiResult] = useState(null);

  useEffect(() => {
    // Fetch featured classes
    fetch(`${BACKEND_URL}/api/classes/featured`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setFeaturedClasses(data);
        setLoadingClasses(false);
      })
      .catch(() => setLoadingClasses(false));

    // Fetch recent posts
    fetch(`${BACKEND_URL}/api/forum/recent`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setRecentPosts(data);
        setLoadingPosts(false);
      })
      .catch(() => setLoadingPosts(false));
  }, [BACKEND_URL]);

  const calculateBMI = (e) => {
    e.preventDefault();
    const hMeters = height / 100;
    const bmi = (weight / (hMeters * hMeters)).toFixed(1);
    let category = "Normal weight";
    let color = "text-emerald-500 dark:text-emerald-400";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-sky-500 dark:text-sky-400";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      color = "text-amber-500 dark:text-amber-400";
    } else if (bmi >= 30) {
      category = "Obese";
      color = "text-rose-500 dark:text-rose-400";
    }

    setBmiResult({ bmi, category, color });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO BANNER SECTION (with Motion Animation) */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-slate-200/80 dark:border-white/5">
          {/* Subtle Ambient Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/15 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-orange-500/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-7 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-wide shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  NEXT-GEN ATHLETIC EVOLUTION
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                  FORGE YOUR <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400">
                    STRONGEST SELF
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Join an elite ecosystem of fitness enthusiasts, verified master trainers,
                  and data-driven conditioning classes. Elevate your stamina, power, and
                  resilience with PulseForge.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/classes"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    Explore Classes
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/forum"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    Community Forum
                  </Link>
                </div>

                {/* Key Platform Stats Counter */}
                <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/10 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">50+</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pro Trainers</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-orange-500 dark:text-orange-400">1,200+</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Classes Booked</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">99.8%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Satisfaction</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Dynamic Banner Media with Floating Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&crop=entropy&fit=crop"
                    alt="PulseForge Gym Athlete Training"
                    className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Floating Live Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Daily Calorie Target</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Cardio & Hypertrophy sync</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                      LIVE
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC SECTION 1: FEATURED CLASSES (Ranked by Booking Count) */}
        <section className="py-20 bg-slate-50/50 dark:bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Zap className="w-4 h-4" /> TRENDING SESSIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Featured Fitness Classes
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Curated sessions selected by popularity and highest attendee bookings.
                  Discover your ideal workout regimen today.
                </p>
              </div>
              <Link
                href="/classes"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                View All Classes <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingClasses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-2xl bg-slate-200 dark:bg-white/[0.03] animate-pulse border border-slate-200 dark:border-white/5"
                  />
                ))}
              </div>
            ) : featuredClasses.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                <p>No featured classes available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredClasses.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className="group rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] hover:border-orange-500/40 transition-all flex flex-col overflow-hidden shadow-sm dark:shadow-xl hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
                  >
                    {/* Class Image */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#07090e]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-white/10 shadow-sm">
                        {item.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-md">
                        {item.bookingCount || 0} Bookings
                      </div>
                    </div>

                    {/* Class Content */}
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
                          <span className="text-xs text-slate-500 dark:text-slate-400 block">Enrollment</span>
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
          </div>
        </section>

        {/* 3. DYNAMIC SECTION 2: LATEST FORUM POSTS (3-4 Most Recent) */}
        <section className="py-20 border-t border-slate-200/80 dark:border-white/5 bg-slate-100/50 dark:bg-[#0b0f1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-4 h-4" /> ATHLETE DISCUSSIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Latest Community Forum Posts
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Knowledge drop from certified coaches, recovery protocols, and nutrition
                  breakdowns written by PulseForge experts.
                </p>
              </div>
              <Link
                href="/forum"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Join Discussions <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-slate-200 dark:bg-white/[0.03] animate-pulse border border-slate-200 dark:border-white/5"
                  />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                <p>No community posts yet. Be the first to share insights!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentPosts.slice(0, 4).map((post) => (
                  <div
                    key={post._id}
                    className="group rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] hover:border-orange-500/40 transition-all flex flex-col overflow-hidden shadow-sm dark:shadow-xl hover:-translate-y-1"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 left-2 bg-white/90 dark:bg-[#07090e]/80 text-[10px] font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                        {post.authorRole || "Coach"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          By {post.authorName}
                        </p>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {post.likes?.length || 0} Likes
                        </span>
                        <Link
                          href={`/forum/${post._id}`}
                          className="text-xs font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1"
                        >
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. EXTRA STATIC SECTION 1: THE PULSEFORGE DIFFERENCE */}
        <section className="py-20 border-t border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-[#07090e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                WHY CHOOSE PULSEFORGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Engineered for Peak Athletic Output
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                We combine scientific conditioning methodology, premium European gear,
                and an inspiring community to deliver unmatched athletic progression.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Trophy className="w-6 h-6 text-orange-500" />,
                  title: "Certified Master Coaches",
                  desc: "Every trainer is vetted with certified accreditations (CSCS, NASM, ACE) with at least 5 years of verified field experience.",
                },
                {
                  icon: <Flame className="w-6 h-6 text-rose-500" />,
                  title: "Heart-Rate Metrix Sync",
                  desc: "Track real-time heart-rate intervals, anaerobic threshold, and recovery efficiency with our built-in class telemetry.",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
                  title: "Safe & Sanitized Facilities",
                  desc: "Hospital-grade HEPA air filtration and dedicated recovery zones ensure an immaculately clean, safe environment 24/7.",
                },
                {
                  icon: <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
                  title: "Thriving Athlete Network",
                  desc: "Exchange workout routines, diet insights, and cheer each other to new personal records on our private community forum.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] hover:border-orange-500/30 transition-all hover:-translate-y-1 shadow-sm dark:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-white/[0.04] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EXTRA STATIC SECTION 2: INTERACTIVE FITNESS & BMI CALCULATOR */}
        <section className="py-20 border-t border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#0b101c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Explainer */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> INTERACTIVE TOOLS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Calculate Your Body Mass Index & Baseline
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  BMI is a reliable indicator of total body fatness for most people. Use this
                  quick scientific tool to determine your baseline category before selecting
                  your conditioning program.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-sky-500" />
                    <span>Underweight: &lt; 18.5 BMI</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Optimal Athletic Weight: 18.5 – 24.9 BMI</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Overweight: 25 – 29.9 BMI</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={calculateBMI}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-5"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Instant BMI Calculator
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="250"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="250"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:opacity-95 transition-all"
                  >
                    Calculate My BMI
                  </button>

                  {bmiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Calculated Score</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{bmiResult.bmi}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Classification</span>
                        <p className={`text-sm font-extrabold ${bmiResult.color}`}>
                          {bmiResult.category}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Athlete Reviews & 5-Star Testimonials */}
        <FeaturedReviews />
      </main>

      <Footer />
    </div>
  );
}
