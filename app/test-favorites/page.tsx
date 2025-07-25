"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart, Star, X } from "lucide-react";

export default function TestFavorites() {
  const { data: session } = useSession();
  const [tools, setTools] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTools();
    if (session?.user?.email) {
      fetchFavorites();
    }
  }, [session]);

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools");
      if (response.ok) {
        const data = await response.json();
        setTools(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      setError("Failed to fetch tools");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/user/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to fetch favorites");
    }
  };

  const handleFavoriteToggle = async (toolId: string) => {
    if (!session?.user?.email) {
      setError("Please login to add favorites");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isFavorited = favorites.some((fav) => fav.toolId === toolId);

      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toolId }),
      });

      if (response.ok) {
        await fetchFavorites(); // Refresh favorites
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (toolId: string) => {
    if (!session?.user?.email) {
      setError("Please login to add reviews");
      return;
    }

    setLoading(true);
    setError("");

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

      if (response.ok) {
        setError("Review added successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Test Favorites & Reviews
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Please login to test favorites and reviews functionality.
          </p>
          <div className="text-center">
            <a
              href="/auth/signin?callbackUrl=/test-favorites"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
            >
              Sign In to Test
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Test Favorites & Reviews
          </h1>
          <p className="text-gray-300 mb-4">
            Logged in as: {session.user?.email}
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Tools</h2>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const isFavorited = favorites.some(
                    (fav) => fav.toolId === tool._id
                  );
                  return (
                    <div key={tool._id} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">
                            {tool.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            ID: {tool._id}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFavoriteToggle(tool._id)}
                            disabled={loading}
                            title={
                              isFavorited
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isFavorited
                                ? "bg-red-500/20 text-red-400"
                                : "bg-white/10 text-gray-400 hover:text-red-400"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFavorited ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleAddReview(tool._id)}
                            disabled={loading}
                            title="Add review"
                            className="p-2 bg-white/10 text-gray-400 hover:text-yellow-400 rounded-lg transition-all duration-200"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Your Favorites ({favorites.length})
              </h2>
              <div className="space-y-2">
                {favorites.map((favorite) => (
                  <div
                    key={favorite._id}
                    className="bg-black/20 rounded-lg p-3"
                  >
                    <h3 className="text-white font-medium">
                      {favorite.toolName}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Category: {favorite.category}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Added: {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <p className="text-gray-400 text-sm">No favorites yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
