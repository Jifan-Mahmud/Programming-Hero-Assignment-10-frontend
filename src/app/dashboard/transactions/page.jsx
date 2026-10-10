"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { DollarSign, CreditCard, Calendar } from "lucide-react";

export default function TransactionsPage() {
  const { user, isAdmin, BACKEND_URL } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetch(`${BACKEND_URL}/api/bookings/all`, {
        credentials: "include",
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setTransactions(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, isAdmin, BACKEND_URL]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          Platform Payment Transactions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Read-only audit record of all Stripe payments processed across PulseForge.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <CreditCard className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Transactions Logged</h3>
            <p className="text-xs text-slate-400">
              When athletes checkout classes, the transaction history appears here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">User Email</th>
                  <th className="py-4 px-6">Enrolled Class</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-200">
                      {tx.userEmail}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      {tx.className}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ${tx.price}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(tx.paidAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-[11px] text-cyan-400">
                      {tx.transactionId}
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
