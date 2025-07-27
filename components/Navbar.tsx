"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  onShowOnboarding?: () => void;
}

export default function Navbar({ onShowOnboarding }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
    "system"
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    const checkSystemTheme = () => {
      if (themeMode === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add("dark");
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDarkMode(false);
        }
      }
    };

    // Initialize theme based on system preference
    const initializeTheme = () => {
      if (themeMode === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add("dark");
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDarkMode(false);
        }
      }
    };

    initializeTheme();
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkSystemTheme);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkSystemTheme);
    };
  }, [themeMode]);

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const setLightMode = () => {
    setThemeMode("light");
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
  };

  const setDarkMode = () => {
    setThemeMode("dark");
    document.documentElement.classList.add("dark");
    setIsDarkMode(true);
  };

  const setSystemMode = () => {
    setThemeMode("system");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? "neon-glass-navbar"
            : "ai-glass-navbar"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur-lg opacity-50 animate-pulse" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">
              KlickTools
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a
              href="/"
              className={`transition-colors duration-200 text-sm lg:text-base ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Home
            </a>
            <a
              href="/dashboard"
              className={`transition-colors duration-200 text-sm lg:text-base ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Dashboard
            </a>
            <a
              href="#categories"
              className={`transition-colors duration-200 text-sm lg:text-base ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Categories
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Theme Controls - Desktop */}
            <div className="hidden sm:flex">
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1 flex items-center space-x-1">
                {/* Light Mode Button */}
                <motion.button
                  onClick={setLightMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    themeMode === "light"
                      ? "bg-yellow-500/30 text-yellow-300 shadow-lg shadow-yellow-500/25"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                  title="Light mode"
                >
                  <Sun className="w-4 h-4" />
                  {themeMode === "light" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-yellow-500/20 rounded-lg border border-yellow-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>

                {/* Dark Mode Button */}
                <motion.button
                  onClick={setDarkMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    themeMode === "dark"
                      ? "bg-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/25"
                      : "text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                  }`}
                  title="Dark mode"
                >
                  <Moon className="w-4 h-4" />
                  {themeMode === "dark" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>

                {/* System Mode Button */}
                <motion.button
                  onClick={setSystemMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    themeMode === "system"
                      ? "bg-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/25"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10"
                  }`}
                  title="System preference"
                >
                  <Monitor className="w-4 h-4" />
                  {themeMode === "system" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-cyan-500/20 rounded-lg border border-cyan-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Theme Controls - Mobile */}
            <div className="sm:hidden">
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1 flex items-center space-x-1">
                {/* Light Mode Button */}
                <motion.button
                  onClick={setLightMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-1.5 rounded-md transition-all duration-300 ${
                    themeMode === "light"
                      ? "bg-yellow-500/30 text-yellow-300 shadow-lg shadow-yellow-500/25"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                  title="Light mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                  {themeMode === "light" && (
                    <motion.div
                      layoutId="activeThemeMobile"
                      className="absolute inset-0 bg-yellow-500/20 rounded-md border border-yellow-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>

                {/* Dark Mode Button */}
                <motion.button
                  onClick={setDarkMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-1.5 rounded-md transition-all duration-300 ${
                    themeMode === "dark"
                      ? "bg-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/25"
                      : "text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                  }`}
                  title="Dark mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                  {themeMode === "dark" && (
                    <motion.div
                      layoutId="activeThemeMobile"
                      className="absolute inset-0 bg-purple-500/20 rounded-md border border-purple-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>

                {/* System Mode Button */}
                <motion.button
                  onClick={setSystemMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-1.5 rounded-md transition-all duration-300 ${
                    themeMode === "system"
                      ? "bg-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/25"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10"
                  }`}
                  title="System preference"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  {themeMode === "system" && (
                    <motion.div
                      layoutId="activeThemeMobile"
                      className="absolute inset-0 bg-cyan-500/20 rounded-md border border-cyan-500/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-white/90 hover:text-white hover:bg-white/20"
              }`}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/dashboard")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30"
                        : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:block">{session.user.name}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignOut}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        : "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:block">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`sm:hidden p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-white/90 hover:text-white hover:bg-white/20"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden overflow-hidden ${
                isDarkMode ? "bg-black/90" : "ai-glass-card"
              } rounded-lg mt-2`}
            >
              <div className="px-4 py-3 space-y-3">
                <a
                  href="/"
                  className={`block transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/dashboard"
                  className={`block transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
                <a
                  href="#categories"
                  className={`block transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-white/90 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </a>
                {status === "loading" ? (
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : session ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        window.location.href = "/dashboard";
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30"
                          : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>{session.user.name}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                          : "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200 font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
