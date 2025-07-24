"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }

    localStorage.setItem("theme", newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-1 bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10"
      >
        {[
          { value: "light", icon: Sun, label: "Light" },
          { value: "dark", icon: Moon, label: "Dark" },
          { value: "system", icon: Monitor, label: "System" },
        ].map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(value as Theme)}
            className={`relative p-2 rounded-md transition-all duration-200 ${
              theme === value
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            title={`${label} mode`}
          >
            <Icon className="w-4 h-4" />
            {theme === value && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-md border border-cyan-500/30"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
