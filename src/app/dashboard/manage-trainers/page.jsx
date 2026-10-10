"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { UserCog, ArrowDownCircle, Award } from "lucide-react";

export default function ManageTrainersPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = () => {
    fetch(`${BACKEND_URL}/api/users/trainers`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user && isAdmin) fetchTrainers();
  }, [user, isAdmin]);

  const handleDemote = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to demote this trainer? This will strip their trainer privileges and revert their role back to standard User."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/demote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Trainer demoted to standard user successfully");
        setTrainers((prev) => prev.filter((t) => t._id !== userId));
      } else {
        toast.error("Failed to demote trainer");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserCog className="w-6 h-6 text-emerald-400" />
          Manage Active Trainers
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review currently verified instructors across the platform. You may demote a coach if guidelines are violated.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : trainers.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Award className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Active Trainers</h3>
            <p className="text-xs text-slate-400">
              Approve candidate submissions in Applied Trainers to add coaches.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Trainer</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trainers.map((t) => (
                  <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            t.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              t.name || "Coach"
                            )}&background=10b981&color=000`
                          }
                          alt={t.name}
                          className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
                        />
                        <div>
                          <span className="font-bold text-white block">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Coach Certified
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {t.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t.status || "active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {/* Demote to User button with confirmation prompt */}
                      <button
                        onClick={() => handleDemote(t._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" /> Demote to User
                      </button>
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
