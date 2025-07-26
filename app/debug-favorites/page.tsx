"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function DebugFavorites() {
  const { data: session } = useSession();
  const [tools, setTools] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools");
      if (response.ok) {
        const data = await response.json();
        setTools(data.slice(0, 3)); // Get first 3 tools for testing
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };

  const testFavorite = async (toolId: string) => {
    if (!session?.user?.email) {
      setDebugInfo({ error: "Not authenticated" });
      return;
    }

    setLoading(true);
    setDebugInfo({});

    try {
      // Test adding favorite
      const addResponse = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toolId }),
      });

      const addData = await addResponse.json();

      setDebugInfo({
        addResponse: {
          status: addResponse.status,
          data: addData,
        },
        toolId,
        userEmail: session.user.email,
      });

      // Test checking favorite status
      const checkResponse = await fetch(`/api/favorites?toolId=${toolId}`);
      const checkData = await checkResponse.json();

      setDebugInfo((prev) => ({
        ...prev,
        checkResponse: {
          status: checkResponse.status,
          data: checkData,
        },
      }));
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testReview = async (toolId: string) => {
    if (!session?.user?.email) {
      setDebugInfo({ error: "Not authenticated" });
      return;
    }

    setLoading(true);
    setDebugInfo({});

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId,
          rating: 5,
          comment: "Test review from debug page",
        }),
      });

      const data = await response.json();

      setDebugInfo({
        reviewResponse: {
          status: response.status,
          data: data,
        },
        toolId,
        userEmail: session.user.email,
      });
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Debug Favorites & Reviews
          </h1>

          {session ? (
            <p className="text-gray-300 mb-4">
              Logged in as: {session.user?.email}
            </p>
          ) : (
            <p className="text-red-300 mb-4">Not authenticated</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Test Tools
              </h2>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <div key={tool._id} className="bg-black/20 rounded-lg p-3">
                    <h3 className="text-white font-medium">{tool.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">ID: {tool._id}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => testFavorite(tool._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 disabled:opacity-50"
                      >
                        Test Favorite
                      </button>
                      <button
                        onClick={() => testReview(tool._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 disabled:opacity-50"
                      >
                        Test Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Debug Info
              </h2>
              <div className="bg-black/20 rounded-lg p-3">
                <pre className="text-gray-300 text-xs overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
