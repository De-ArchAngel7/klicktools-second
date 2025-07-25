"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function TestGitHubOAuth() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      setSession(session);
    });
  }, []);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("github", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError(`GitHub OAuth Error: ${result.error}`);
      } else if (result?.ok) {
        setError("GitHub OAuth successful! Redirecting...");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkEnvironmentVariables = () => {
    const envVars = {
      GITHUB_ID: process.env.NEXT_PUBLIC_GITHUB_ID || "Not set (client-side)",
      NEXTAUTH_URL:
        process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set (client-side)",
    };

    return envVars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          GitHub OAuth Test
        </h1>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Current Session:</h3>
            <pre className="text-gray-300 text-xs overflow-auto">
              {session ? JSON.stringify(session, null, 2) : "No session"}
            </pre>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">
              Environment Variables (Client-side):
            </h3>
            <pre className="text-gray-300 text-xs overflow-auto">
              {JSON.stringify(checkEnvironmentVariables(), null, 2)}
            </pre>
          </div>

          <button
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Testing GitHub OAuth..." : "Test GitHub OAuth"}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-medium mb-2">Error:</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Debugging Steps:</h3>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Check if GITHUB_ID and GITHUB_SECRET are set in Vercel</li>
              <li>• Verify callback URL in GitHub OAuth app settings</li>
              <li>• Check browser console for errors</li>
              <li>• Ensure GitHub OAuth app is not in development mode</li>
            </ul>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-medium mb-2">
              GitHub OAuth App Settings:
            </h3>
            <div className="text-yellow-300 text-sm space-y-2">
              <p>
                <strong>Homepage URL:</strong>
              </p>
              <code className="bg-black/30 px-2 py-1 rounded text-xs block">
                https://klicktools-54almjeo4-erics-projects-b139bf58.vercel.app
              </code>
              <p>
                <strong>Authorization callback URL:</strong>
              </p>
              <code className="bg-black/30 px-2 py-1 rounded text-xs block">
                https://klicktools-54almjeo4-erics-projects-b139bf58.vercel.app/api/auth/callback/github
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
