"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Heart, Trash2, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const { user, BACKEND_URL } = useApp();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    fetch(`${BACKEND_URL}/api/favorites/my`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (classId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/favorites/${classId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.classId !== classId && f._id !== classId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove favorite");
      }
    } catch (err) {
      toast.error("Error removing favorite");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          My Favorite Classes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Saved training sessions for quick booking and future reference.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Heart className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Favorite Classes Saved</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't bookmarked any classes yet. Click "Add to Favorites" on any class page to save it here.
            </p>
            <Link
              href="/classes"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Browse Classes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav._id}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-colors"
              >
                <div className="relative h-44 w-full">
                  <img
                    src={fav.image}
                    alt={fav.className}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#090d16]/80 text-emerald-400 border border-white/10">
                    {fav.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {fav.className}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Coach {fav.trainerName}
                    </p>
                    <span className="text-xs font-bold text-emerald-400 block mt-2">
                      ${fav.price}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-4 flex items-center justify-between">
                    <Link
                      href={`/classes/${fav.classId}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleRemoveFavorite(fav.classId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
