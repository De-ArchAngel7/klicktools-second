"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { motion } from "framer-motion";

export default function TestOAuth() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  const testEnvironmentVariables = async () => {
    try {
      const response = await fetch("/api/test-oauth");
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error("Error testing OAuth:", error);
    }
  };

  const testGoogleOAuth = () => {
    signIn("google", { callbackUrl: "/test-oauth" });
  };

  const testGitHubOAuth = () => {
    signIn("github", { callbackUrl: "/test-oauth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            OAuth Test Page
          </h1>

          {/* Session Status */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Session Status
            </h2>
            <div className="space-y-2 text-gray-200">
              <p>Status: {status}</p>
              {session ? (
                <div>
                  <p>User: {session.user?.email}</p>
                  <p>Name: {session.user?.name}</p>
                  <p>Role: {session.user?.role}</p>
                </div>
              ) : (
                <p>Not authenticated</p>
              )}
            </div>
          </div>

          {/* Environment Variables Test */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Environment Variables Test
            </h2>
            <button
              onClick={testEnvironmentVariables}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Test Environment Variables
            </button>
            {Object.keys(testResults).length > 0 && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg">
                <pre className="text-sm text-gray-200 overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* OAuth Providers */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              OAuth Providers
            </h2>
            <div className="space-y-4">
              {providers?.google && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testGoogleOAuth}
                    className="px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Sign in with Google
                  </button>
                  <span className="text-green-400">✓ Available</span>
                </div>
              )}
              {providers?.github && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testGitHubOAuth}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Sign in with GitHub
                  </button>
                  <span className="text-green-400">✓ Available</span>
                </div>
              )}
              {!providers?.google && (
                <div className="text-red-400">
                  ✗ Google OAuth not configured
                </div>
              )}
              {!providers?.github && (
                <div className="text-red-400">
                  ✗ GitHub OAuth not configured
                </div>
              )}
            </div>
          </div>

          {/* Callback URLs */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Required Callback URLs
            </h2>
            <div className="space-y-2 text-gray-200">
              <div>
                <strong>Google OAuth:</strong>
                <code className="block mt-1 p-2 bg-black/20 rounded text-sm">
                  https://klicktools-rekgfl93z-erics-projects-b139bf58.vercel.app/api/auth/callback/google
                </code>
              </div>
              <div>
                <strong>GitHub OAuth:</strong>
                <code className="block mt-1 p-2 bg-black/20 rounded text-sm">
                  https://klicktools-rekgfl93z-erics-projects-b139bf58.vercel.app/api/auth/callback/github
                </code>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            {session ? (
              <button
                onClick={() => signOut()}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="text-gray-300">Sign in to test OAuth</div>
            )}
            <a
              href="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
