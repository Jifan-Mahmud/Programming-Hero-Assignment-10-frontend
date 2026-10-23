"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  Utensils,
  Scale,
  MessageCircle,
  CalendarCheck,
  Award,
  Heart,
  PlusCircle,
  FolderKanban,
  FileText,
  Users,
  UserCog,
  CheckSquare,
  DollarSign,
  MessageSquare,
  Menu,
  AlertTriangle,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, isBlocked } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Role-Based Navigation Items
  const userNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Booked Classes & Receipts", href: "/dashboard/booked-classes", icon: CalendarCheck },
    { name: "Diet & Workout Tracker", href: "/dashboard/tracker", icon: Utensils },
    { name: "Transformation Graph", href: "/dashboard/transformation", icon: Scale },
    { name: "Live Coach Chat", href: "/dashboard/chat", icon: MessageCircle },
    { name: "Favorite Classes", href: "/dashboard/favorites", icon: Heart },
    { name: "Apply as Trainer", href: "/dashboard/apply-trainer", icon: Award },
  ];

  const trainerNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Class", href: "/dashboard/add-class", icon: PlusCircle },
    { name: "My Classes", href: "/dashboard/my-classes", icon: FolderKanban },
    { name: "Student Diet & Workout Plans", href: "/dashboard/tracker", icon: Utensils },
    { name: "Live Student Chat", href: "/dashboard/chat", icon: MessageCircle },
    { name: "Add Forum Post", href: "/dashboard/add-forum-post", icon: FileText },
    { name: "My Forum Posts", href: "/dashboard/my-forum-posts", icon: MessageSquare },
  ];

  const adminNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/manage-users", icon: Users },
    { name: "Applied Trainers", href: "/dashboard/applied-trainers", icon: CheckSquare },
    { name: "Manage Trainers", href: "/dashboard/manage-trainers", icon: UserCog },
    { name: "Manage Classes", href: "/dashboard/manage-classes", icon: FolderKanban },
    { name: "Diet & Workout Protocols", href: "/dashboard/tracker", icon: Utensils },
    { name: "Transformation Analytics", href: "/dashboard/transformation", icon: Scale },
    { name: "Direct Support Chat", href: "/dashboard/chat", icon: MessageCircle },
    { name: "Transactions", href: "/dashboard/transactions", icon: DollarSign },
    { name: "Forum Moderation", href: "/dashboard/manage-forum", icon: MessageSquare },
    { name: "Add Forum Post", href: "/dashboard/add-forum-post", icon: PlusCircle },
  ];

  let currentNav = userNav;
  if (role === "trainer") currentNav = trainerNav;
  if (role === "admin") currentNav = adminNav;

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Soft Block Notification Banner */}
      {isBlocked && (
        <div className="w-full bg-rose-500/15 border-b border-rose-500/30 px-4 py-2.5 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Account Notice:</strong> Your account is softly blocked by administrators. You may browse classes and forum posts, but state modifications (bookings, applications, commenting) are restricted.
          </span>
        </div>
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 p-5 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl h-fit sticky top-28 space-y-6">
          {/* User profile snippet */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-white/5">
            <img
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "Member"
                )}&background=f97316&color=fff`
              }
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
              {role.toUpperCase()} PORTAL
            </span>
            {currentNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold shadow-md shadow-orange-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Switch Role info tip */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
            {role === "user" && (
              <p>
                Want to publish classes? Apply to become a trainer in the sidebar.
              </p>
            )}
            {role === "trainer" && (
              <p>
                Trainer status active. Classes submitted will be reviewed by admin.
              </p>
            )}
            {role === "admin" && (
              <p>
                Administrator access enabled. You can moderate all content and users.
              </p>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Toggle Button */}
        <div className="md:hidden w-full mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Menu className="w-4 h-4 text-orange-500" />
              Dashboard Menu ({role.toUpperCase()})
            </span>
            <span className="text-orange-500">Toggle</span>
          </button>

          {sidebarOpen && (
            <div className="mt-2 p-4 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xl">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      active
                        ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
