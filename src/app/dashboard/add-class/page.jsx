"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { PlusCircle, Send } from "lucide-react";

export default function AddClassPage() {
  const router = useRouter();
  const { isTrainer, isAdmin, isBlocked, BACKEND_URL } = useApp();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("HIIT");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [duration, setDuration] = useState("60 mins");
  const [schedule, setSchedule] = useState("Mon, Wed, Fri - 07:00 AM");
  const [price, setPrice] = useState(35);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }

    if (!isTrainer && !isAdmin) {
      toast.error("Only verified Trainers and Admins can create classes");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          image:
            image ||
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
          category,
          difficulty,
          duration,
          schedule,
          price: Number(price),
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Class submitted successfully! It is pending administrator approval."
        );
        router.push("/dashboard/my-classes");
      } else {
        toast.error(data.message || "Failed to create class");
      }
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          Add New Fitness Class
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Publish an elite workout session. Newly created classes default to "Pending"
          status until verified by platform administrators.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-5"
      >
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Class Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spartan Core & Plyometrics"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="HIIT">HIIT</option>
              <option value="Yoga">Yoga</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Pilates">Pilates</option>
              <option value="CrossFit">CrossFit</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 50 mins"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Price (USD)
            </label>
            <input
              type="number"
              min="5"
              max="500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Class Schedule (Days & Time)
          </label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. Mon, Wed, Fri - 07:00 AM"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Banner Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Class Description & Syllabus
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail the workout format, target muscle groups, and required gear..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm resize-none"
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
            {loading ? "Submitting Class..." : "Submit Class (Default: Pending)"}
          </button>
        </div>
      </form>
    </div>
  );
}
