"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Flame,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Bell,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, logout, theme, toggleTheme, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Classes", href: "/classes" },
    { name: "Community Forum", href: "/forum" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#07090e]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
                PULSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400">FORGE</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-1 font-semibold">
                Fitness & Gym
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-full">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Conditional Dashboard Link (Role-Based) */}
            {user && (
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/25"
                    : "text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-orange-500/10"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notifications Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setUserMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-orange-500" /> Notifications
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {notifications.length} total
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs space-y-1 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              {n.title}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 dark:border-white/10 hover:border-orange-500/50 bg-slate-50 dark:bg-white/[0.02] transition-colors"
                >
                  <img
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "Member"
                      )}&background=f97316&color=fff`
                    }
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-orange-500/40"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white block truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-orange-500 dark:text-orange-400 tracking-wider">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {role} account
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-orange-500" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white hover:opacity-95 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b101c] px-4 pt-4 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.href)
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20"
            >
              Dashboard ({role})
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-white/10">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <img
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "Member"
                      )}&background=f97316&color=fff`
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-800 dark:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-orange-500/25"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
