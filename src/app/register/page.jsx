"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  Flame,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  ArrowRight,
  Upload,
  Eye,
  EyeOff,
  X,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, BACKEND_URL } = useApp();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password validation: Min 6 chars, 1 uppercase, 1 lowercase
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must include at least one lowercase letter.";
    return null;
  };

  // Direct client-side image upload & canvas compression (Zero external API failure)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setImageUrl(compressedDataUrl);
          toast.success("Profile photo uploaded successfully!");
        } catch (canvasErr) {
          setImageUrl(event.target.result);
          toast.success("Profile photo loaded!");
        } finally {
          setUploading(false);
        }
      };

      img.onerror = () => {
        toast.error("Could not process selected image file.");
        setUploading(false);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      toast.error("Error reading file from disk.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const passError = validatePassword(password);
    if (passError) {
      toast.error(passError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          image: imageUrl || "",
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("pulseforge_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("pulseforge_cached_user", JSON.stringify(data.user));
      }

      await refreshUser(email, name, imageUrl);
      toast.success("Account created successfully! Welcome to PulseForge.");
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration error encountered. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
              <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Join PulseForge</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create your athletic profile and unlock all fitness features
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@pulseforge.fit"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    role === "user"
                      ? "bg-orange-500/15 border-orange-500 text-orange-600 dark:text-orange-400 shadow-md shadow-orange-500/10"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  🏃 Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("trainer")}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    role === "trainer"
                      ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  🏋️ Trainer
                </button>
              </div>
            </div>

            {/* Profile Image URL + Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Profile Image
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (or upload below)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-2 w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-white/15 hover:border-orange-500/50 bg-slate-50 dark:bg-white/[0.02] hover:bg-orange-500/5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-orange-500 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image from Device
                  </>
                )}
              </button>

              {/* Preview */}
              {imageUrl && (
                <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-orange-500/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-orange-500/40 shadow-sm"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo Selected
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Ready to attach to profile
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm shadow-sm"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Must be at least 6 characters with 1 uppercase & 1 lowercase letter.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Registering Account..." : `Create ${role === "trainer" ? "Trainer" : "Member"} Account`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-bold hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
