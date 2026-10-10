import React from "react";
import { Dumbbell } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center animate-pulse shadow-2xl shadow-emerald-500/30">
          <Dumbbell className="w-8 h-8 text-black animate-spin" strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-emerald-500/20 animate-ping pointer-events-none" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-black tracking-widest uppercase text-white">
          PULSE<span className="text-emerald-400">FORGE</span>
        </p>
        <p className="text-xs text-slate-400">Loading athletic workspace...</p>
      </div>
    </div>
  );
}
