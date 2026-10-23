"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Utensils,
  Dumbbell,
  Droplets,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  Save,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TrackerPage() {
  const { user, apiFetch } = useApp();
  const [activeTab, setActiveTab] = useState("my-tracker"); // "my-tracker" | "trainer-assign"
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Daily log state
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [completedMeals, setCompletedMeals] = useState([]);
  const [waterConsumed, setWaterConsumed] = useState(2.0);
  const [dailyNotes, setDailyNotes] = useState("");
  const [savingLog, setSavingLog] = useState(false);

  // Trainer client assignment state
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [assignForm, setAssignForm] = useState({
    title: "Custom Athletic Hypertrophy & Cutting Protocol",
    goal: "Fat Loss & Muscle Retention",
    dailyCalories: 2400,
    waterGoalLiters: 3.5,
    targetProteinGrams: 170,
    targetCarbsGrams: 220,
    targetFatGrams: 65,
  });

  // Fetch member's plan
  const fetchMyPlan = async () => {
    try {
      const res = await apiFetch("/api/plans/my-plan");
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (err) {
      console.error("Fetch plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily log
  const fetchDailyLog = async (dateStr) => {
    try {
      const res = await apiFetch(`/api/plans/log/${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setCompletedWorkouts(data.completedWorkouts || []);
        setCompletedMeals(data.completedMeals || []);
        setWaterConsumed(data.waterConsumedLiters || 0);
        setDailyNotes(data.notes || "");
      }
    } catch (err) {
      console.error("Fetch log error:", err);
    }
  };

  // Fetch clients for trainer
  const fetchClients = async () => {
    if (user?.role === "trainer" || user?.role === "admin") {
      try {
        const res = await apiFetch("/api/plans/trainer/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data);
          if (data.length > 0 && !selectedClient) {
            setSelectedClient(data[0].email);
          }
        }
      } catch (err) {
        console.error("Fetch clients error:", err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPlan();
      fetchDailyLog(selectedDate);
      fetchClients();
    }
  }, [user, selectedDate]);

  // Toggle workout checkmark
  const toggleWorkout = (id) => {
    setCompletedWorkouts((prev) =>
      prev.includes(id) ? prev.filter((wId) => wId !== id) : [...prev, id]
    );
  };

  // Toggle meal checkmark
  const toggleMeal = (id) => {
    setCompletedMeals((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  // Save daily log
  const handleSaveLog = async () => {
    setSavingLog(true);
    try {
      const res = await apiFetch("/api/plans/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          completedWorkouts,
          completedMeals,
          waterConsumedLiters: waterConsumed,
          notes: dailyNotes,
        }),
      });

      if (res.ok) {
        toast.success("Today's progress logged successfully! Keep up the momentum! 🔥");
      } else {
        toast.error("Failed to save progress.");
      }
    } catch (err) {
      toast.error("Network error saving log.");
    } finally {
      setSavingLog(false);
    }
  };

  // Trainer assign plan submit
  const handleAssignPlan = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Please select a client to assign.");
      return;
    }

    try {
      const res = await apiFetch("/api/plans/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberEmail: selectedClient,
          ...assignForm,
          meals: plan?.meals || [],
          workouts: plan?.workouts || [],
        }),
      });

      if (res.ok) {
        toast.success(`Plan successfully assigned to ${selectedClient}!`);
      } else {
        toast.error("Could not assign plan.");
      }
    } catch (err) {
      toast.error("Failed to assign plan.");
    }
  };

  const isTrainerOrAdmin = user?.role === "trainer" || user?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-500" />
            Diet & Workout Performance Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily macro nutrition, check off completed workout sets, and achieve optimal conditioning.
          </p>
        </div>

        {/* Tab switchers if trainer/admin */}
        {isTrainerOrAdmin && (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#111827] border border-white/10">
            <button
              onClick={() => setActiveTab("my-tracker")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "my-tracker"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              My Tracker
            </button>
            <button
              onClick={() => setActiveTab("trainer-assign")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "trainer-assign"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Assign to Students
            </button>
          </div>
        )}
      </div>

      {activeTab === "my-tracker" ? (
        <div className="space-y-6">
          {/* Top Banner: Plan Overview & Macro Targets */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#111827] to-[#0b0e17] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  Personalized Program
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {plan?.title || "Elite Hypertrophy & Conditioning Protocol"}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Prescribed by: <strong className="text-slate-200">{plan?.trainerName || "Marcus Vance"}</strong> •
                  Goal: <span className="text-emerald-400 font-bold">{plan?.goal || "Lean Conditioning"}</span>
                </p>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-xs font-bold"
                  />
                </div>

                <button
                  onClick={handleSaveLog}
                  disabled={savingLog}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingLog ? "Saving..." : "Save Today"}</span>
                </button>
              </div>
            </div>

            {/* Target Metrics KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold mb-1">
                  <Flame className="w-4 h-4" /> Calories
                </div>
                <div className="text-xl font-black text-white">
                  {plan?.dailyCalories || 2400}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">kcal</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold mb-1">
                  <Droplets className="w-4 h-4" /> Hydration
                </div>
                <div className="text-xl font-black text-white">
                  {plan?.waterGoalLiters || 3.5}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">Liters</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Dumbbell className="w-4 h-4" /> Protein Target
                </div>
                <div className="text-xl font-black text-white">
                  {plan?.targetProteinGrams || 170}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">g</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <TrendingUp className="w-4 h-4" /> Carbs / Fat
                </div>
                <div className="text-xl font-black text-white">
                  {plan?.targetCarbsGrams || 220}g / {plan?.targetFatGrams || 65}g
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Left: Daily Meals | Right: Daily Workouts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Meals Plan & Check-Off */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Prescribed Meal Schedule
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {completedMeals.length} / {plan?.meals?.length || 4} Completed
                </span>
              </div>

              <div className="space-y-3">
                {plan?.meals?.map((meal) => {
                  const isDone = completedMeals.includes(meal.id);
                  return (
                    <div
                      key={meal.id}
                      onClick={() => toggleMeal(meal.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button type="button" className="mt-0.5 text-emerald-400">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-black" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:text-white" />
                          )}
                        </button>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                            {meal.time}
                          </span>
                          <h4
                            className={`text-xs font-bold ${
                              isDone ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {meal.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {meal.calories} kcal • P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Water Consumption Counter */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Daily Water Intake
                    </span>
                    <span className="text-[10px] text-blue-300">
                      Current: {waterConsumed.toFixed(1)} / {plan?.waterGoalLiters || 3.5} Liters
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWaterConsumed((w) => Math.max(0, w - 0.5))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setWaterConsumed((w) => w + 0.5)}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-md"
                  >
                    + 0.5 L
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Workout Routines & Sets Check-Off */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-rose-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Training Routine & Movements
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {completedWorkouts.length} / {plan?.workouts?.length || 5} Sets
                </span>
              </div>

              <div className="space-y-3">
                {plan?.workouts?.map((w) => {
                  const isDone = completedWorkouts.includes(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => toggleWorkout(w.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button type="button" className="mt-0.5 text-emerald-400">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-black" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:text-white" />
                          )}
                        </button>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                            {w.day} • {w.targetMuscle}
                          </span>
                          <h4
                            className={`text-xs font-bold ${
                              isDone ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {w.exercise}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {w.sets} Sets × {w.reps} • Rest: {w.restSec}s
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notes Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Workout Notes & Form Reflections
                </label>
                <textarea
                  rows={2}
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  placeholder="e.g., Felt strong on squats, increased bench press weight by 5 lbs..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Trainer / Admin Assignment View */
        <div className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Assign Personalized Plan to Student
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select an enrolled athlete from your classes and configure their daily macro calories and training split.
            </p>
          </div>

          <form onSubmit={handleAssignPlan} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                Select Athlete
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {clients.map((c) => (
                  <option key={c.email} value={c.email} className="bg-slate-900">
                    {c.name} ({c.email}) — Class: {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                Plan Title
              </label>
              <input
                type="text"
                value={assignForm.title}
                onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Daily Calorie Target (kcal)
                </label>
                <input
                  type="number"
                  value={assignForm.dailyCalories}
                  onChange={(e) => setAssignForm({ ...assignForm, dailyCalories: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Water Target (Liters)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={assignForm.waterGoalLiters}
                  onChange={(e) => setAssignForm({ ...assignForm, waterGoalLiters: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={assignForm.targetProteinGrams}
                  onChange={(e) => setAssignForm({ ...assignForm, targetProteinGrams: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={assignForm.targetCarbsGrams}
                  onChange={(e) => setAssignForm({ ...assignForm, targetCarbsGrams: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={assignForm.targetFatGrams}
                  onChange={(e) => setAssignForm({ ...assignForm, targetFatGrams: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white font-black text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-4"
            >
              Confirm & Assign Plan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
