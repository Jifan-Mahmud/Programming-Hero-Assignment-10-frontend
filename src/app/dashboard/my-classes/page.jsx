"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  FolderKanban,
  Edit2,
  Trash2,
  Users,
  X,
  Check,
  PlusCircle,
  Calendar,
} from "lucide-react";

export default function MyClassesPage() {
  const { user, BACKEND_URL } = useApp();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    duration: "",
    schedule: "",
    category: "",
    description: "",
  });

  // Attendees Modal State
  const [viewingStudentsClass, setViewingStudentsClass] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const fetchClasses = () => {
    fetch(`${BACKEND_URL}/api/trainer/my-classes`, {
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
    if (user) fetchClasses();
  }, [user]);

  // Handle Delete with Confirmation Prompt
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this fitness class?")) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/classes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c._id !== id));
        toast.success("Class deleted successfully");
      } else {
        toast.error("Failed to delete class");
      }
    } catch (err) {
      toast.error("Error deleting class");
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingClass(item);
    setEditForm({
      name: item.name,
      price: item.price,
      duration: item.duration,
      schedule: item.schedule,
      category: item.category,
      description: item.description,
    });
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/classes/${editingClass._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("Class updated successfully");
        setEditingClass(null);
        fetchClasses();
      } else {
        toast.error("Failed to update class");
      }
    } catch (err) {
      toast.error("Error saving edits");
    }
  };

  // View Students Attendees Modal
  const openAttendeesModal = async (classItem) => {
    setViewingStudentsClass(classItem);
    setLoadingAttendees(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/classes/${classItem._id}/students`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAttendees(data);
      } else {
        setAttendees([]);
      }
    } catch (err) {
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-emerald-400" />
            My Created Classes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your schedule, update course details, and view booked athlete attendees.
          </p>
        </div>

        <Link
          href="/dashboard/add-class"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-black font-extrabold text-xs self-start"
        >
          <PlusCircle className="w-4 h-4" /> Add New Class
        </Link>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : classes.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <FolderKanban className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Classes Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't listed any classes yet. Click below to add your first training session!
            </p>
            <Link
              href="/dashboard/add-class"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Add New Class
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Class Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Bookings</th>
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
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openAttendeesModal(item)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        View Students ({item.bookingCount || 0})
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Update Class"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
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

      {/* 1. UPDATE MODAL */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#111827] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Update Fitness Class</h3>
              <button
                onClick={() => setEditingClass(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm({ ...editForm, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Schedule (Days & Time)
                </label>
                <input
                  type="text"
                  value={editForm.schedule}
                  onChange={(e) =>
                    setEditForm({ ...editForm, schedule: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ATTENDEES / VIEW STUDENTS MODAL */}
      {viewingStudentsClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Enrolled Students
                </h3>
                <p className="text-xs text-slate-400">
                  {viewingStudentsClass.name}
                </p>
              </div>
              <button
                onClick={() => setViewingStudentsClass(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {loadingAttendees ? (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : attendees.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No students have booked this session yet.
                </p>
              ) : (
                attendees.map((att) => (
                  <div
                    key={att._id}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          att.userImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            att.userName || "Student"
                          )}&background=10b981&color=000`
                        }
                        alt={att.userName}
                        className="w-8 h-8 rounded-full border border-emerald-500/20 object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          {att.userName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {att.userEmail}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(att.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingStudentsClass(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-white hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
