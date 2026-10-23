"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Scale,
  Activity,
  Calendar,
  Trash2,
  Sparkles,
  Award,
  CheckCircle,
  Camera,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function TransformationPage() {
  const { user, apiFetch } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // New measurement form state
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    biceps: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch progress history
  const fetchProgress = async () => {
    try {
      const res = await apiFetch("/api/progress/my");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Fetch progress error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  // Handle submit new measurement
  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!form.weight) {
      toast.error("Please enter your current weight.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Measurement recorded! Your progress chart updated.");
        setShowLogModal(false);
        setForm({
          date: new Date().toISOString().split("T")[0],
          weight: "",
          bodyFat: "",
          waist: "",
          chest: "",
          biceps: "",
          notes: "",
        });
        fetchProgress();
      } else {
        toast.error("Failed to record measurement.");
      }
    } catch (err) {
      toast.error("Network error recording measurement.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete measurement
  const handleDeleteLog = async (id) => {
    if (!id || id.toString().startsWith("seed_")) {
      toast("Sample record cannot be deleted", { icon: "ℹ️" });
      return;
    }
    if (!confirm("Are you sure you want to remove this measurement?")) return;

    try {
      const res = await apiFetch(`/api/progress/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Measurement removed.");
        fetchProgress();
      }
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  // Calculated metrics
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const startWeight = sortedLogs.length > 0 ? sortedLogs[0].weight : 80;
  const currentWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : 80;
  const weightDelta = (currentWeight - startWeight).toFixed(1);
  const currentBodyFat = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].bodyFat || 16.5 : 18.0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-orange-500" />
            Body Transformation & Weight Loss Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual telemetry tracking your body composition, weekly weigh-ins, and conditioning milestones.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Log Measurement
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111827] border border-white/10 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Starting Weight
          </span>
          <div className="text-2xl font-black text-white">
            {startWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Baseline check-in</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#111827] border border-white/10 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Current Weight
          </span>
          <div className="text-2xl font-black text-white">
            {currentWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            Latest Weigh-in
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#111827] border border-white/10 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Net Change
          </span>
          <div className={`text-2xl font-black flex items-center gap-1 ${Number(weightDelta) <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {Number(weightDelta) <= 0 ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            {weightDelta} <span className="text-xs font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Since program start</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#111827] border border-white/10 shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Est. Body Fat
          </span>
          <div className="text-2xl font-black text-orange-400">
            {currentBodyFat} <span className="text-xs font-normal">%</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Athletic condition</span>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Weight Progression Curve (kg)
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive timeline tracking weight fluctuation and fat loss trajectory.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Steady Trend Downward 📉
          </span>
        </div>

        {/* Recharts Area Container */}
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedLogs} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3.5 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-2xl text-xs space-y-1">
                        <p className="font-bold text-white">{label}</p>
                        <p className="text-orange-400 font-extrabold text-sm">
                          Weight: {data.weight} kg
                        </p>
                        {data.bodyFat && (
                          <p className="text-slate-300 text-[11px]">Body Fat: {data.bodyFat}%</p>
                        )}
                        {data.notes && (
                          <p className="text-slate-400 italic text-[10px] max-w-[180px]">
                            "{data.notes}"
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#weightGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Measurements Table */}
      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Measurement Check-In History
          </h3>
          <span className="text-xs text-slate-400">{logs.length} Logged Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
              <tr>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Weight</th>
                <th className="py-4 px-6">Body Fat</th>
                <th className="py-4 px-6">Waist / Chest / Biceps</th>
                <th className="py-4 px-6">Notes</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedLogs.map((log, i) => (
                <tr key={log._id || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{log.date}</td>
                  <td className="py-4 px-6 font-bold text-orange-400">{log.weight} kg</td>
                  <td className="py-4 px-6 text-slate-300">
                    {log.bodyFat ? `${log.bodyFat}%` : "—"}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {log.waist || "—"} / {log.chest || "—"} / {log.biceps || "—"} cm
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                    {log.notes || "—"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Measurement Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-white/10 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" />
                Log Body Measurements
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 78.5"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Body Fat %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="18.5"
                    value={form.bodyFat}
                    onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="84"
                    value={form.waist}
                    onChange={(e) => setForm({ ...form, waist: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                    Chest (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="104"
                    value={form.chest}
                    onChange={(e) => setForm({ ...form, chest: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Workout / Nutrition Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Completed heavy squats, calorie deficit on point..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white font-black text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Measurement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
