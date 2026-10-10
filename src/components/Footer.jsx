"use client";

import React from "react";
import Link from "next/link";
import { Flame, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-[#05070b] border-t border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white">
                PULSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400">FORGE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering athletes, fitness enthusiasts, and coaches with
              next-generation workout management, world-class community discussions, and
              effortless class bookings.
            </p>
            {/* Social Links with new X logo */}
            <div className="flex items-center gap-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-500/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-500/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/classes" className="hover:text-orange-500 transition-colors">
                  All Classes
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-orange-500 transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/dashboard/apply-trainer" className="hover:text-orange-500 transition-colors">
                  Become a Trainer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitness Categories */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">
              Programs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/classes?category=HIIT" className="hover:text-orange-500 transition-colors">
                  High-Intensity (HIIT)
                </Link>
              </li>
              <li>
                <Link href="/classes?category=Yoga" className="hover:text-orange-500 transition-colors">
                  Vinyasa & Yin Yoga
                </Link>
              </li>
              <li>
                <Link href="/classes?category=Strength" className="hover:text-orange-500 transition-colors">
                  Strength & Hypertrophy
                </Link>
              </li>
              <li>
                <Link href="/classes?category=Cardio" className="hover:text-orange-500 transition-colors">
                  Endurance Cardio
                </Link>
              </li>
              <li>
                <Link href="/classes?category=CrossFit" className="hover:text-orange-500 transition-colors">
                  CrossFit & Conditioning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>450 Lexington Ave, New York, NY 10017</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 489-FORGE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@pulseforge.fit</span>
              </li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  Open 24/7 for Members
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PulseForge Fitness Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
