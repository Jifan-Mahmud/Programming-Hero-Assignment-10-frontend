"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const AppContext = createContext(null);

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Smart fetcher that handles direct port 5000 or proxy rewrite /backend-api
export async function apiFetch(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("pulseforge_token")
      : null;
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await fetch(`${BACKEND_URL}${cleanPath}`, {
      ...options,
      headers,
      credentials: "include",
    });
    return res;
  } catch (err) {
    // Fallback to proxy rewrite if port 5000 has direct connect issues
    try {
      const fallbackPath = cleanPath.replace(/^\/api/, "/backend-api");
      const res = await fetch(fallbackPath, {
        ...options,
        headers,
        credentials: "include",
      });
      return res;
    } catch (fallbackErr) {
      throw err;
    }
  }
}

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("pulseforge_cached_user");
        const token = localStorage.getItem("pulseforge_token");
        if (cached && token) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("pulseforge_cached_user");
      const token = localStorage.getItem("pulseforge_token");
      if (cached && token) return false;
    }
    return true;
  });
  const [notifications, setNotifications] = useState([]);

  // Better auth session
  const { data: sessionData, isPending: sessionPending } = useSession();

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("pulseforge_theme") || "dark";
    setTheme(savedTheme);
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pulseforge_theme", nextTheme);
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  // Sync user with backend and fetch latest role & status
  const fetchBackendUser = useCallback(async (fallbackEmail = null, fallbackName = null, fallbackImage = null) => {
    try {
      // 1. Check if user is authenticated on backend via HTTPOnly cookie or Bearer header
      const meRes = await apiFetch("/api/me");

      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData);
        localStorage.setItem("pulseforge_cached_user", JSON.stringify(userData));
        return userData;
      }

      // 2. If backend cookie missing but Better Auth session is present, sync JWT
      const emailToSync = fallbackEmail || sessionData?.user?.email;
      if (emailToSync) {
        const jwtRes = await apiFetch("/api/jwt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailToSync,
            name: fallbackName || sessionData?.user?.name || "Member",
            image: fallbackImage || sessionData?.user?.image || "",
          }),
        });

        if (jwtRes.ok) {
          const jwtData = await jwtRes.json();
          if (jwtData.token) {
            localStorage.setItem("pulseforge_token", jwtData.token);
          }
          setUser(jwtData.user);
          localStorage.setItem("pulseforge_cached_user", JSON.stringify(jwtData.user));
          return jwtData.user;
        }
      }

      // Check localStorage cached profile for instant seamless reload
      const cached = localStorage.getItem("pulseforge_cached_user");
      const token = localStorage.getItem("pulseforge_token");
      if (cached && token) {
        try {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          return parsed;
        } catch (e) {}
      }
      setUser(null);
      return null;
    } catch (err) {
      const cached = localStorage.getItem("pulseforge_cached_user");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          return parsed;
        } catch (e) {}
      }
      if (sessionData?.user) {
        setUser({
          name: sessionData.user.name,
          email: sessionData.user.email,
          image: sessionData.user.image,
          role: "user",
          status: "active",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [sessionData]);

  // Initial sync when session changes
  useEffect(() => {
    if (!sessionPending) {
      if (sessionData?.user) {
        fetchBackendUser(
          sessionData.user.email,
          sessionData.user.name,
          sessionData.user.image
        );
      } else {
        fetchBackendUser();
      }
    }
  }, [sessionData, sessionPending, fetchBackendUser]);

  // Keep cached user updated
  useEffect(() => {
    if (user) {
      localStorage.setItem("pulseforge_cached_user", JSON.stringify(user));
    }
  }, [user]);

  // Fetch in-app notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await apiFetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {}
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user?.email, fetchNotifications]);

  // Guaranteed Logout Handler (Clear backend cookie, Better Auth, and local state)
  const logout = async () => {
    try {
      try {
        await apiFetch("/api/logout", { method: "POST" });
      } catch (e) {}

      try {
        await authClient.signOut();
      } catch (e) {}

      setUser(null);
      localStorage.removeItem("pulseforge_token");
      localStorage.removeItem("pulseforge_cached_user");
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      setUser(null);
      localStorage.removeItem("pulseforge_token");
      localStorage.removeItem("pulseforge_cached_user");
      window.location.href = "/login";
    }
  };

  const isBlocked = user?.status === "blocked";
  const role = user?.role || "user";
  const isAdmin = role === "admin";
  const isTrainer = role === "trainer";

  const isAuthLoading = user ? false : (loading || sessionPending);

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isTrainer,
        isBlocked,
        loading: isAuthLoading,
        theme,
        toggleTheme,
        logout,
        refreshUser: fetchBackendUser,
        notifications,
        fetchNotifications,
        BACKEND_URL,
        apiFetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
