"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Star, MessageSquare, ExternalLink, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tool } from "@/types";

interface AIToolCardProps {
  tool: Tool;
  onFavoriteToggle?: (toolId: string, isFavorited: boolean) => void;
}

export default function AIToolCard({
  tool,
  onFavoriteToggle,
}: AIToolCardProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      checkFavoriteStatus();
      checkUserReview();
    }
  }, [session, tool._id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?toolId=${tool._id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await fetch(
        `/api/reviews?toolId=${tool._id}&userEmail=${session?.user?.email}`
      );
      if (response.ok) {
        const reviews = await response.json();
        if (reviews.length > 0) {
          setUserRating(reviews[0].rating);
        }
      }
    } catch (error) {
      console.error("Error checking user review:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!session?.user?.email) {
      // Redirect to login or show login modal
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toolId: tool._id }),
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
        onFavoriteToggle?.(tool._id as string, !isFavorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClass = (color?: string) => {
    if (!color) return "ai-tool-color-blue";

    const colorMap: { [key: string]: string } = {
      "#10a37f": "ai-tool-color-green",
      "#1a73e8": "ai-tool-color-blue",
      "#ea4335": "ai-tool-color-red",
      "#fbbc04": "ai-tool-color-yellow",
      "#34a853": "ai-tool-color-green",
      "#ff6b35": "ai-tool-color-orange",
      "#8e44ad": "ai-tool-color-purple",
      "#e74c3c": "ai-tool-color-red",
      "#3498db": "ai-tool-color-blue",
      "#2ecc71": "ai-tool-color-green",
      "#f39c12": "ai-tool-color-orange",
      "#9b59b6": "ai-tool-color-purple",
      "#e67e22": "ai-tool-color-orange",
      "#16a085": "ai-tool-color-teal",
      "#d35400": "ai-tool-color-orange",
      "#c0392b": "ai-tool-color-red",
      "#2980b9": "ai-tool-color-blue",
      "#27ae60": "ai-tool-color-green",
      "#f1c40f": "ai-tool-color-yellow",
    };

    return colorMap[color.toLowerCase()] || "ai-tool-color-blue";
  };

  const colorClass = getColorClass(tool.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`ai-tool-card ${colorClass} group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl transition-all duration-300 hover:border-white/20`}
      style={
        {
          "--tool-border-color": "var(--tool-color)",
          "--tool-glow-color": "var(--tool-color)",
        } as React.CSSProperties
      }
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="ai-tool-logo-container relative">
              {tool.logo ? (
                <>
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="ai-tool-logo w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove(
                        "ai-tool-logo-fallback-hidden"
                      );
                    }}
                  />
                  <div className="ai-tool-logo-fallback ai-tool-logo-fallback-hidden w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {tool.name.charAt(0).toUpperCase()}
                  </div>
                </>
              ) : (
                <div className="ai-tool-logo-fallback w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {tool.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isFavorited
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400 border border-white/10"
              }`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewModal(true)}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-400 border border-white/10 transition-all duration-200"
              title="Rate this tool"
            >
              <Star className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Tags and Category */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="ai-tool-category-badge px-2 py-1 text-xs font-medium rounded-full">
              {tool.category}
            </span>
            {tool.subcategory && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300">
                {tool.subcategory}
              </span>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              tool.pricing === "Free"
                ? "bg-green-500/20 text-green-400"
                : tool.pricing === "Freemium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-purple-500/20 text-purple-400"
            }`}
          >
            {tool.pricing}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < (tool.rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              {tool.rating ? `${tool.rating.toFixed(1)}` : "No rating"}
            </span>
            {tool.reviewCount && tool.reviewCount > 0 && (
              <span className="text-gray-500 text-sm">
                ({tool.reviewCount} reviews)
              </span>
            )}
          </div>

          {userRating > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-cyan-400 text-xs">Your rating:</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2 h-2 ${
                      i < userRating
                        ? "text-cyan-400 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        {tool.features && tool.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded-md"
                >
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-md">
                  +{tool.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Tool</span>
            </motion.a>

            {tool.website && (
              <motion.a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-3 py-2 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Website</span>
              </motion.a>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {tool.apiAvailable && (
              <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                API
              </span>
            )}
            {tool.status === "beta" && (
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                Beta
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="ai-tool-card-overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
