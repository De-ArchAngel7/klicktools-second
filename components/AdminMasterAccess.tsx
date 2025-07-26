"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Trash2, Users, Eye, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { hasRole } from "@/lib/utils";

interface Favorite {
  _id: string;
  toolId: string;
  userEmail: string;
  toolName: string;
  category: string;
  createdAt: string;
}

interface Review {
  _id: string;
  toolId: string;
  userEmail: string;
  toolName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminMasterAccess() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews">(
    "favorites"
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user?.email && hasRole(session.user, "admin")) {
      fetchAllFavorites();
      fetchAllReviews();
    }
  }, [session]);

  const fetchAllFavorites = async () => {
    try {
      const response = await fetch("/api/admin/all-favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await fetch("/api/admin/all-reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDeleteFavorite = async (
    favoriteId: string,
    userEmail: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete this favorite for ${userEmail}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Favorite deleted successfully!" });
        fetchAllFavorites(); // Refresh the list
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete favorite",
        });
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string, userEmail: string) => {
    if (
      !confirm(`Are you sure you want to delete this review for ${userEmail}?`)
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Review deleted successfully!" });
        fetchAllReviews(); // Refresh the list
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete review",
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user?.email || !hasRole(session.user, "admin")) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400 text-center">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Admin Master Access
            </h2>
            <p className="text-gray-400 text-sm">
              Manage all users' favorites and reviews
            </p>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "favorites"
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "reviews"
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "favorites" && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No favorites found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">
                        {favorite.toolName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        User: {favorite.userEmail}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Category: {favorite.category}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Added:{" "}
                        {new Date(favorite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteFavorite(favorite._id, favorite.userEmail)
                      }
                      disabled={loading}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Delete favorite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No reviews found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">
                          {review.toolName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        User: {review.userEmail}
                      </p>
                      {review.comment && (
                        <p className="text-gray-300 text-sm mb-2">
                          "{review.comment}"
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                        Reviewed:{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteReview(review._id, review.userEmail)
                      }
                      disabled={loading}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
