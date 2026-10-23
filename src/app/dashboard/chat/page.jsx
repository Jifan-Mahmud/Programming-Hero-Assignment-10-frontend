"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  MessageSquare,
  Send,
  User,
  Shield,
  Search,
  CheckCheck,
  Plus,
  Sparkles,
  Phone,
  Video,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { user, BACKEND_URL, apiFetch } = useApp();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const messagesEndRef = useRef(null);

  // Suggested Coaches to quickly start chat with
  const suggestedTrainers = [
    {
      name: "Marcus Vance",
      email: "marcus.trainer@pulseforge.com",
      role: "trainer",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
      specialty: "Powerlifting & Strength",
    },
    {
      name: "Elena Rostova",
      email: "elena.trainer@pulseforge.com",
      role: "trainer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      specialty: "HIIT & Conditioning",
    },
    {
      name: "Aria Thorne",
      email: "aria.trainer@pulseforge.com",
      role: "trainer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      specialty: "Mobility & Core Flow",
    },
  ];

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await apiFetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (!activeConv && data.length > 0) {
          setActiveConv(data[0]);
        }
      }
    } catch (err) {
      console.error("Fetch convs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages for active conversation
  const fetchMessages = async () => {
    if (!activeConv?._id) return;
    try {
      const res = await apiFetch(`/api/chat/messages/${activeConv._id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Mark read
        apiFetch(`/api/chat/read/${activeConv._id}`, { method: "PATCH" });
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Real-time polling every 3.5 seconds
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [activeConv]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv?._id) return;

    const textToSend = newMsg.trim();
    setNewMsg("");

    // Optimistic UI update
    const optimisticMessage = {
      _id: "temp_" + Date.now(),
      senderEmail: user?.email,
      senderName: user?.name || "Me",
      text: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await apiFetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv._id,
          text: textToSend,
        }),
      });

      if (res.ok) {
        fetchMessages();
        fetchConversations();
      } else {
        toast.error("Failed to deliver message.");
      }
    } catch (err) {
      toast.error("Network error sending message.");
    }
  };

  // Start new conversation
  const startConversation = async (coach) => {
    try {
      const res = await apiFetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: coach.email,
          recipientName: coach.name,
          recipientRole: coach.role,
          recipientImage: coach.image,
        }),
      });

      if (res.ok) {
        const conv = await res.json();
        setShowNewChatModal(false);
        setActiveConv(conv);
        fetchConversations();
        toast.success(`Chat started with ${coach.name}`);
      }
    } catch (err) {
      toast.error("Could not initiate conversation.");
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const other = c.participantDetails?.find((p) => p.email !== user?.email);
    return (
      other?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeOtherUser = activeConv?.participantDetails?.find(
    (p) => p.email !== user?.email
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            Direct Messages & Coach Support
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time 1-on-1 communication channel between athletes and certified coaches.
          </p>
        </div>

        <button
          onClick={() => setShowNewChatModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Start New Chat
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="h-[680px] rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-white/10 flex flex-col justify-between h-full bg-[#0d121f]">
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No active chats found.</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="text-xs text-orange-400 font-bold hover:underline"
                >
                  Connect with a coach
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = conv.participantDetails?.find(
                  (p) => p.email !== user?.email
                );
                const isSelected = activeConv?._id === conv._id;
                const unread = conv.unread?.[user?.email] || 0;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      isSelected
                        ? "bg-orange-500/10 border-l-4 border-orange-500"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={
                          other?.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            other?.name || "User"
                          )}&background=f97316&color=fff`
                        }
                        alt={other?.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10"
                      />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111827] absolute -bottom-0.5 -right-0.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">
                          {other?.name || "Participant"}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {conv.lastMessage || "Tap to chat..."}
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Active Message Conversation (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-[#111827]">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        activeOtherUser?.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          activeOtherUser?.name || "User"
                        )}&background=f97316&color=fff`
                      }
                      alt={activeOtherUser?.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-orange-500/30"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {activeOtherUser?.name || "Athlete Support"}
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] uppercase font-mono">
                        {activeOtherUser?.role || "coach"}
                      </span>
                    </h3>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Live Support
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/classes"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="View Classes"
                  >
                    <Info className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Messages History Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-orange-500/40" />
                    <p className="text-xs text-slate-400">
                      Say hello to {activeOtherUser?.name || "your coach"}! Ask about routines, diet advice, or form checks.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderEmail === user?.email;
                    return (
                      <div
                        key={m._id}
                        className={`flex gap-3 max-w-[80%] ${
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                            isMe
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none shadow-md"
                              : "bg-white/[0.05] border border-white/10 text-slate-200 rounded-tl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                          <span
                            className={`text-[9px] block text-right ${
                              isMe ? "text-orange-100" : "text-slate-400"
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-white/10 flex items-center gap-3 bg-white/[0.01]"
              >
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message or workout inquiry..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMsg.trim()}
                  className="p-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-white">Select a Conversation</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose a conversation from the sidebar or reach out to a master coach below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-white/10 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Connect with a Master Coach
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select a certified trainer to initiate a private coaching & Q&A channel:
              </p>

              <div className="space-y-2">
                {suggestedTrainers.map((coach) => (
                  <div
                    key={coach.email}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/40 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{coach.name}</h4>
                        <span className="text-[10px] text-orange-400 block font-medium">
                          {coach.specialty}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => startConversation(coach)}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
