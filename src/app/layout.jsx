import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "PulseForge — Elite Fitness & Gym Management Platform",
  description:
    "Elevate your athletic potential with PulseForge. Discover world-class classes, certified trainers, vibrant community discussions, and seamless booking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 selection:bg-rose-500 selection:text-white">
        <AppProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                fontSize: "14px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
              },
            }}
          />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
