"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  PhoneOff,
  Maximize2,
  Users,
  Flame,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LiveClassRoomPage({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;
  const router = useRouter();
  const { user, BACKEND_URL } = useApp();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Media states
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Tabata / Workout Interval Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(45);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [round, setRound] = useState(1);
  const [caloriesBurned, setCaloriesBurned] = useState(140);
  const [bpm, setBpm] = useState(142);

  // Live in-room chat
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "System",
      text: "Welcome to the live session! Ensure your camera is framed and stay hydrated.",
      time: "Just now",
      isSystem: true,
    },
    {
      id: 2,
      sender: "Coach Marcus",
      text: "Great to see everyone! Today we focus on explosive hip drive and clean mechanics.",
      time: "1 min ago",
      isTrainer: true,
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // Simulated participants
  const [participants] = useState([
    { name: "Sarah Connor", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop", bpm: 156 },
    { name: "Liam Miller", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", bpm: 148 },
    { name: "Elena Rostova", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop", bpm: 162 },
  ]);

  // Fetch class details
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/classes/${classId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setClassData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [classId, BACKEND_URL]);

  // Initialize camera stream
  useEffect(() => {
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Camera/Mic permission not granted or device not available:", err.message);
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Interval timer tick
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => {
          if (prev <= 1) {
            setIsRestPhase((currentPhase) => {
              const nextPhase = !currentPhase;
              if (nextPhase) {
                toast("REST PHASE (15s) — Deep breaths & water!", { icon: "💧" });
                return true;
              } else {
                setRound((r) => r + 1);
                toast("WORK PHASE (45s) — Maximum effort!", { icon: "🔥" });
                return false;
              }
            });
            return isRestPhase ? 45 : 15;
          }
          return prev - 1;
        });

        // Simulate calorie & heart rate burn
        setCaloriesBurned((prev) => prev + 1);
        setBpm(Math.floor(138 + Math.random() * 22));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, isRestPhase]);

  // Toggle Video
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        toast(videoTrack.enabled ? "Camera turned on" : "Camera turned off");
      }
    } else {
      setVideoEnabled(!videoEnabled);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        toast(audioTrack.enabled ? "Microphone unmuted" : "Microphone muted");
      }
    } else {
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = displayStream;
        }
        setScreenSharing(true);
        displayStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
          }
        };
        toast.success("Screen sharing started");
      } catch (err) {
        toast.error("Screen share cancelled");
      }
    } else {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      setScreenSharing(false);
      toast("Stopped screen sharing");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: user?.name || "Me (Athlete)",
      text: inputMsg.trim(),
      time: "Just now",
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
  };

  const handleEmojiReact = (emoji) => {
    const newMsg = {
      id: Date.now(),
      sender: user?.name || "Me",
      text: emoji,
      time: "Just now",
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0b0e17] shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/booked-classes"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold text-[10px] tracking-wider uppercase">
              Live Broadcast
            </span>
            <h1 className="text-sm font-bold truncate max-w-[280px] sm:max-w-md">
              {classData?.title || classData?.name || "Live Athletic Conditioning"}
            </h1>
          </div>
        </div>

        {/* Live HUD Quick Telemetry */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-xl text-rose-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Avg Heart Rate: <strong>{bpm} BPM</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-xl text-orange-400">
            <Flame className="w-3.5 h-3.5" />
            <span>Energy Burned: <strong>{caloriesBurned} kcal</strong></span>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Video Canvas & Controls (Left 8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 flex flex-col justify-between space-y-4">
          {/* Main Video Stream Frame */}
          <div className="relative flex-1 rounded-3xl bg-slate-900 border border-white/10 overflow-hidden min-h-[400px] flex items-center justify-center shadow-2xl">
            {videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto text-slate-400">
                  <VideoOff className="w-8 h-8" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Camera turned off</p>
              </div>
            )}

            {/* Overlaid Coach Info (Top Left) */}
            <div className="absolute top-4 left-4 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold">Coach {classData?.trainerName || "Marcus Vance"}</span>
              <span className="text-[10px] text-slate-400 font-mono">(Lead Stream)</span>
            </div>

            {/* Overlaid Workout HUD: Tabata Timer (Top Right) */}
            <div className="absolute top-4 right-4 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-center min-w-[140px] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isRestPhase ? "Rest Phase 💧" : "Work Phase 🔥"} • Round {round}/8
              </div>
              <div className={`text-3xl font-black font-mono tracking-tight ${isRestPhase ? "text-cyan-400" : "text-orange-500"}`}>
                00:{workSeconds < 10 ? `0${workSeconds}` : workSeconds}
              </div>
              <div className="flex items-center justify-center gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={timerRunning ? "Pause" : "Start"}
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setWorkSeconds(45);
                    setIsRestPhase(false);
                    setRound(1);
                  }}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Overlaid Participant Row (Bottom Left) */}
            <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2">
              {participants.map((p, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 relative shadow-lg group bg-slate-800"
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold px-1 py-0.5 truncate text-center">
                    {p.name.split(" ")[0]}
                  </div>
                </div>
              ))}
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-xs">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-bold mt-0.5">+14</span>
              </div>
            </div>
          </div>

          {/* Bottom Stream Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10 flex items-center justify-center gap-3 sm:gap-4 shadow-xl">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                audioEnabled
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              }`}
            >
              {audioEnabled ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{audioEnabled ? "Mute" : "Unmute"}</span>
            </button>

            {/* Video Camera Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                videoEnabled
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              }`}
            >
              {videoEnabled ? <Video className="w-5 h-5 text-orange-400" /> : <VideoOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{videoEnabled ? "Stop Camera" : "Start Camera"}</span>
            </button>

            {/* Screen Sharing Toggle */}
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                screenSharing
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              }`}
            >
              <ScreenShare className="w-5 h-5" />
              <span className="hidden sm:inline">{screenSharing ? "Stop Share" : "Share Screen"}</span>
            </button>

            {/* Leave Studio Call */}
            <button
              onClick={() => router.push("/dashboard/booked-classes")}
              className="p-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Leave Studio</span>
            </button>
          </div>
        </div>

        {/* Live In-Room Chat & Community HUD (Right 4 or 3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0b0e17] flex flex-col justify-between h-full">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Class Chat & Q&A
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              Live Feed
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[460px] text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl border ${
                  msg.isSystem
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                    : msg.isTrainer
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-300"
                    : "bg-white/[0.03] border-white/5 text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px] text-white">
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Quick Reaction Emojis */}
          <div className="px-4 py-2 flex items-center justify-between gap-1.5 border-t border-white/5 bg-white/[0.01]">
            {["🔥", "💪", "⚡", "👏", "💧", "🏋️"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiReact(emoji)}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:scale-125 transition-all text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask coach or cheer on athletes..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
