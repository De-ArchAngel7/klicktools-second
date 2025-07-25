"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Get the callback URL from search params
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your KlickTools account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            <motion.button
              onClick={() => handleSocialSignIn("github")}
              disabled={isLoading}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-300">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/auth/signup")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
