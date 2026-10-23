import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "PulseForge — Elite Fitness & Gym Management Platform",
  description:
    "Elevate your athletic potential with PulseForge. Discover world-class classes, certified trainers, vibrant community discussions, live video workouts, and seamless booking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable}`} suppressHydrationWarning>
      <body className={`min-h-full flex flex-col font-sans transition-colors duration-200 selection:bg-rose-500 selection:text-white ${jakarta.className}`}>
        <AppProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "var(--bg-card, #111827)",
                color: "var(--text-primary, #ffffff)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                fontSize: "13px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              },
            }}
          />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
