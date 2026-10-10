"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Award, Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function ApplyTrainerPage() {
  const router = useRouter();
  const { user, isTrainer, isBlocked, BACKEND_URL } = useApp();

  const [experience, setExperience] = useState(3);
  const [specialty, setSpecialty] = useState("Yoga");
  const [availableTime, setAvailableTime] = useState("Weekdays & Weekends (Morning / Evening)");
  const [loading, setLoading] = useState(false);
  const [existingApp, setExistingApp] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${BACKEND_URL}/api/trainer-applications/my`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setExistingApp(data))
      .catch(() => {});
  }, [user, BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }

    if (isTrainer) {
      toast.error("You are already a verified Trainer!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/trainer-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          experience: Number(experience),
          specialty,
          availableTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted successfully! Status is now Pending.");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (err) {
      toast.error("Submission error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          Apply as PulseForge Trainer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Join our accredited roster of fitness coaches. Create high-energy classes and build your clientele.
        </p>
      </div>

      {isTrainer ? (
        <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">You are a Verified Trainer!</h2>
          <p className="text-xs text-slate-300">
            Head to the Trainer section in your dashboard to list new sessions and manage attendees.
          </p>
        </div>
      ) : existingApp && existingApp.status === "Pending" ? (
        <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
          <Clock className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Application Under Review</h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            You already have an active submission pending administrator approval. We will notify you once reviewed.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-5"
        >
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Coaching Experience (Years)
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Primary Coaching Specialty
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="Yoga">Yoga & Mobility</option>
              <option value="Weights">Weights & Hypertrophy</option>
              <option value="Cardio">Cardio & Speed Conditioning</option>
              <option value="HIIT">HIIT & Metabolic Conditioning</option>
              <option value="Pilates">Pilates & Core Sculpt</option>
              <option value="CrossFit">CrossFit & Functional Training</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Available Coaching Schedule / Hours
            </label>
            <input
              type="text"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="e.g. Mon-Fri Mornings, Weekend Evenings"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Submitting Application..." : "Submit Trainer Application"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
