"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FolderKanban, Check, X, Trash2, Clock, CheckCircle2 } from "lucide-react";

export default function ManageClassesPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = () => {
    fetch(`${BACKEND_URL}/api/classes/admin/all`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user && isAdmin) fetchClasses();
  }, [user, isAdmin]);

  // Approve or Reject status
  const handleStatusChange = async (classId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/classes/${classId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Class marked as ${newStatus}`);
        setClasses((prev) =>
          prev.map((c) => (c._id === classId ? { ...c, status: newStatus } : c))
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  // Delete class
  const handleDeleteClass = async (classId) => {
    if (!confirm("Are you sure you want to permanently delete this class?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Class deleted");
        setClasses((prev) => prev.filter((c) => c._id !== classId));
      } else {
        toast.error("Failed to delete class");
      }
    } catch (err) {
      toast.error("Error deleting class");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-emerald-400" />
          Manage Platform Classes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all classes submitted by trainers. Approve to make them visible to public athletes, or reject/delete.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : classes.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FolderKanban className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Classes Submitted</h3>
            <p className="text-xs text-slate-400">
              When trainers submit classes, they will appear here for verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Class Name</th>
                  <th className="py-4 px-6">Trainer</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {classes.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block text-sm">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.schedule}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {item.trainerName}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ${item.price}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {/* Approve Button */}
                      {item.status !== "Approved" && (
                        <button
                          onClick={() => handleStatusChange(item._id, "Approved")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs transition-colors"
                          title="Approve Class"
                        >
                          Approve
                        </button>
                      )}

                      {/* Reject Button */}
                      {item.status !== "Rejected" && (
                        <button
                          onClick={() => handleStatusChange(item._id, "Rejected")}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold text-xs transition-colors"
                          title="Reject Class"
                        >
                          Reject
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClass(item._id)}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
