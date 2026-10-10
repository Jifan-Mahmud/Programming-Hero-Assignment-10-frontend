"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { CalendarCheck, ArrowRight, Clock, DollarSign, Calendar } from "lucide-react";

export default function BookedClassesPage() {
  const { user, BACKEND_URL } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${BACKEND_URL}/api/bookings/my`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, BACKEND_URL]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-emerald-400" />
          My Booked Classes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all sessions you have successfully enrolled in and confirmed with Stripe payment.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <CalendarCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Booked Classes Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't enrolled in any training classes yet. Browse our catalog to find sessions matching your goals.
            </p>
            <Link
              href="/classes"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Browse Classes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Class Name</th>
                  <th className="py-4 px-6">Trainer</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Paid Fee</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block text-sm">
                        {b.className}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        TX: {b.transactionId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      Coach {b.trainerName}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {b.schedule}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ${b.price}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/classes/${b.classId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500 hover:text-black font-semibold text-xs border border-white/10 hover:border-emerald-500 transition-all"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
