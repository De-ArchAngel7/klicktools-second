"use client";

import { signIn } from "next-auth/react";

export default function TestOAuth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          OAuth Test
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Test Google OAuth
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Test GitHub OAuth
          </button>

          <div className="text-center text-gray-300 text-sm mt-6">
            <p>Check the browser console for any errors</p>
            <p>Make sure redirect URIs are configured correctly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
