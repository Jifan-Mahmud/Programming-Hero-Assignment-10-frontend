"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  CalendarCheck,
  Heart,
  Award,
  Users,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  PlusCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

export default function DashboardOverviewPage() {
  const { user, role, BACKEND_URL } = useApp();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;

    let endpoint = `${BACKEND_URL}/api/stats/user`;
    if (role === "trainer") endpoint = `${BACKEND_URL}/api/stats/trainer`;
    if (role === "admin") endpoint = `${BACKEND_URL}/api/stats/admin`;

    fetch(endpoint, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, [user, role, BACKEND_URL]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-[#111827] border border-white/10 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              PORTAL DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {user?.name || "Athlete"}!
            </h1>
            <p className="text-xs text-slate-400 max-w-lg">
              {role === "admin"
                ? "Oversee user permissions, trainer applications, classes, and revenue analytics."
                : role === "trainer"
                ? "Manage your training schedule, view enrolled students, and publish athletic insights."
                : "Track your registered workout sessions, favorite classes, and coach applications."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={
                user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "Member"
                )}&background=10b981&color=000`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
            />
            <div>
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. USER DASHBOARD OVERVIEW
          ======================================================== */}
      {role === "user" && (
        <div className="space-y-8">
          {/* Visual Cards: Total Booked Classes, Total Favorites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Booked Classes
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalBooked || 0}
                </p>
                <Link
                  href="/dashboard/booked-classes"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-3"
                >
                  View Schedule <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Favorites
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalFavorites || 0}
                </p>
                <Link
                  href="/dashboard/favorites"
                  className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold mt-3"
                >
                  View Bookmarks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Trainer Application Status & Admin Feedback */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Trainer Application Status
              </h2>

              {!stats?.trainerApplication && (
                <Link
                  href="/dashboard/apply-trainer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                >
                  Apply Now
                </Link>
              )}
            </div>

            {stats?.trainerApplication ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Application Submitted</span>
                    <p className="text-xs font-semibold text-white">
                      Specialty: {stats.trainerApplication.specialty} ({stats.trainerApplication.experience} yrs)
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      stats.trainerApplication.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : stats.trainerApplication.status === "Rejected"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {stats.trainerApplication.status}
                  </span>
                </div>

                {/* Display Admin Feedback Message if Rejected */}
                {stats.trainerApplication.status === "Rejected" && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Administrator Review Feedback:
                    </div>
                    <p className="pl-5 leading-relaxed">
                      {stats.trainerApplication.feedback ||
                        "Your application did not meet our accreditation criteria at this time."}
                    </p>
                  </div>
                )}

                {stats.trainerApplication.status === "Pending" && (
                  <p className="text-xs text-amber-300/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Under administrative review. You will receive an in-app notice upon decision.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                You have not applied to become a Trainer yet. Share your athletic expertise and earn by coaching classes!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          2. TRAINER DASHBOARD OVERVIEW
          ======================================================== */}
      {role === "trainer" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Classes Created
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalClasses || 0}
                </p>
                <Link
                  href="/dashboard/my-classes"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-3"
                >
                  Manage My Classes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FolderKanban className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Students Enrolled
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalStudents || 0}
                </p>
                <Link
                  href="/dashboard/my-classes"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold mt-3"
                >
                  View Attendees <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard/add-class"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add New Class
            </Link>
            <Link
              href="/dashboard/add-forum-post"
              className="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              Share Forum Article
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================
          3. ADMIN DASHBOARD OVERVIEW (with Recharts Analytics)
          ======================================================== */}
      {role === "admin" && (
        <div className="space-y-8">
          {/* High-level platform stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Registered Users
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalUsers || 0}
                </p>
                <Link
                  href="/dashboard/manage-users"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-3"
                >
                  Manage Users <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Platform Classes
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalClasses || 0}
                </p>
                <Link
                  href="/dashboard/manage-classes"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold mt-3"
                >
                  Review Classes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FolderKanban className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Booked Sessions
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {stats?.totalBookedClasses || 0}
                </p>
                <Link
                  href="/dashboard/transactions"
                  className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-bold mt-3"
                >
                  View Transactions <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ADVANCED ANALYTICS CHARTS USING RECHARTS (Standout Requirement) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Classes & Bookings Distribution by Category */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Program Popularity by Category
                  </h3>
                  <p className="text-xs text-slate-400">Total sessions vs bookings</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.categoryData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                    <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b101c",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="classes" fill="#06b6d4" name="Classes" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bookings" fill="#10b981" name="Bookings" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Bookings & Revenue Growth */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Booking Momentum ($ Revenue)
                  </h3>
                  <p className="text-xs text-slate-400">Platform monthly trajectory</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.monthlyData || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b101c",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
