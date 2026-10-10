"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { CheckSquare, Eye, X, Check, Award, AlertCircle } from "lucide-react";

export default function AppliedTrainersPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchApplications = () => {
    fetch(`${BACKEND_URL}/api/trainer-applications`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user && isAdmin) fetchApplications();
  }, [user, isAdmin]);

  const openModal = (app) => {
    setSelectedApp(app);
    setFeedback("");
  };

  const handleDecision = async (status) => {
    if (!selectedApp) return;

    setProcessing(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/trainer-applications/${selectedApp._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status,
            feedback,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(`Application marked as ${status}!`);
        setSelectedApp(null);
        fetchApplications();
      } else {
        toast.error(data.message || "Failed to update application");
      }
    } catch (err) {
      toast.error("Decision update failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-emerald-400" />
          Pending Trainer Applications
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review coach submissions, verify athletic credentials, and approve or reject with custom feedback.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Award className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Pending Applications</h3>
            <p className="text-xs text-slate-400">
              All submitted trainer applications have been reviewed!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Applicant</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Specialty</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            app.userImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              app.userName || "Trainer"
                            )}&background=10b981&color=000`
                          }
                          alt={app.userName}
                          className="w-8 h-8 rounded-full border border-white/10 object-cover"
                        />
                        <span className="font-bold text-white block">
                          {app.userName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {app.userEmail}
                    </td>
                    <td className="py-4 px-6 text-emerald-400 font-semibold">
                      {app.specialty}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {app.experience} years
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openModal(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details & Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#111827] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Review Trainer Candidate</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Candidate Name:</span>
                <span className="font-bold text-white">{selectedApp.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Candidate Email:</span>
                <span className="font-mono text-white">{selectedApp.userEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Experience:</span>
                <span className="font-bold text-emerald-400">
                  {selectedApp.experience} Years Field Coaching
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Primary Specialty:</span>
                <span className="font-bold text-cyan-400">{selectedApp.specialty}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Availability / Schedule:</span>
                <span className="font-medium text-white">{selectedApp.availableTime}</span>
              </div>
            </div>

            {/* Admin Feedback Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Admin Review Feedback (Shown to Candidate upon rejection or update)
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write specific feedback regarding credentials, certifications, or expectations..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Two Action Buttons: Approve and Reject */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDecision("Reject")}
                disabled={processing}
                className="flex-1 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs transition-colors disabled:opacity-50"
              >
                Reject Application
              </button>

              <button
                onClick={() => handleDecision("Approved")}
                disabled={processing}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-black hover:opacity-95 font-black text-xs transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                Approve (Promote to Trainer)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
