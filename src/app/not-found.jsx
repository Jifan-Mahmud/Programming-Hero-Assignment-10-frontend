import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dumbbell, ArrowLeft, Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Gym Themed 404 Graphic Illustration */}
          <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="w-28 h-28 rounded-3xl bg-[#111827] border border-white/10 flex items-center justify-center shadow-2xl relative">
              <Dumbbell className="w-14 h-14 text-emerald-400 -rotate-45" strokeWidth={2} />
              <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-wider shadow">
                404 OUT OF BOUNDS
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Rep Missed! Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              The fitness class, athlete discussion, or route you are looking for has been moved, archived, or doesn't exist.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
