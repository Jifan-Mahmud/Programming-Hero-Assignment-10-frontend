"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Users, Shield, Ban, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";

export default function ManageUsersPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch(`${BACKEND_URL}/api/users`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user && isAdmin) fetchUsers();
  }, [user, isAdmin]);

  // Toggle soft block
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`User status changed to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  // Promote to Admin
  const handleMakeAdmin = async (userId) => {
    if (!confirm("Are you sure you want to promote this user to Administrator?")) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "admin" }),
      });

      if (res.ok) {
        toast.success("User promoted to Admin!");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: "admin" } : u))
        );
      } else {
        toast.error("Failed to promote user");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400" />
          Manage Platform Users
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Oversee all registered members. Apply soft-block restrictions or promote trusted members to Administrator.
        </p>
      </div>

      {/* Soft Block Policy Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-200">Soft Block Policy Active:</strong>
          Blocked users retain login and read-only browsing privileges for classes and forums. The backend strictly rejects their state-changing mutations (booking, applying as trainer, commenting) with error: <em>"Action restricted by Admin"</em>.
        </div>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <p>No registered users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const isBlocked = u.status === "blocked";
                  const isAdminRole = u.role === "admin";

                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name || "User"
                              )}&background=10b981&color=000`
                            }
                            alt={u.name}
                            className="w-8 h-8 rounded-full border border-white/10 object-cover"
                          />
                          <span className="font-bold text-white block">
                            {u.name || "Member"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono">
                        {u.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAdminRole
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : u.role === "trainer"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isBlocked
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {u.status || "active"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* Conditionally render Block or Unblock button */}
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                            isBlocked
                              ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </button>

                        {/* Make Admin Button */}
                        {!isAdminRole && (
                          <button
                            onClick={() => handleMakeAdmin(u._id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-bold text-xs transition-colors"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
