"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FileText, Send, Image as ImageIcon } from "lucide-react";

export default function AddForumPostPage() {
  const router = useRouter();
  const { isTrainer, isAdmin, isBlocked, BACKEND_URL } = useApp();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }

    if (!isTrainer && !isAdmin) {
      toast.error("Only Trainers and Admins can publish forum articles");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/forum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          image:
            image ||
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Community article posted successfully!");
        if (isTrainer) {
          router.push("/dashboard/my-forum-posts");
        } else {
          router.push("/forum");
        }
      } else {
        toast.error(data.message || "Failed to create forum post");
      }
    } catch (err) {
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          Create Community Forum Post
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Share your professional workout knowledge, nutritional methodologies, and recovery science with the community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-5"
      >
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Optimal Carbohydrate Timing for High-Volume Hypertrophy"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Header Image URL (ImgBB or Web Link)
          </label>
          <div className="relative">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://i.ibb.co/... or https://images.unsplash.com/..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Provide an ImgBB upload link or Unsplash image URL. A fitness stock image is used if left blank.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Article Body / Comprehensive Content
          </label>
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your in-depth guide, workout breakdowns, or scientific explanations..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm resize-none leading-relaxed"
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
            {loading ? "Publishing..." : "Publish Forum Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
