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
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  onShowOnboarding?: () => void;
}

export default function Navbar({ onShowOnboarding }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
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
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-cyan-400 border border-white/20"
                  : "bg-gray-800/20 text-gray-700 hover:bg-gray-800/30 hover:text-blue-600 border border-gray-300/50"
              }`}
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

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
