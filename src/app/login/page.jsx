"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Flame,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { refreshUser, BACKEND_URL } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Direct backend login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("pulseforge_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("pulseforge_cached_user", JSON.stringify(data.user));
      }

      await refreshUser(email);
      toast.success("Welcome back to PulseForge!");
      const targetDestination = redirectUrl && redirectUrl !== "/login" ? redirectUrl : "/dashboard";
      router.push(targetDestination);
    } catch (err) {
      toast.error("Login encountered an error");
    } finally {
      setLoading(false);
    }
  };

  // Google Social Login
  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });
    } catch (err) {
      toast.error("Google sign in failed");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
            <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Log in to PulseForge</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your classes, bookmarks, and coaching community
          </p>
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/[0.04] text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2.5 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
          <span className="text-[10px] text-slate-500 uppercase font-semibold">
            Or With Email
          </span>
          <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 font-bold hover:underline"
          >
            Create Free Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}
