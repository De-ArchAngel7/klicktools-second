"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Star, MessageSquare, ExternalLink, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tool } from "@/types";
import ReviewModal from "./ReviewModal";
import AuthModal from "./AuthModal";
import ColorThief from "colorthief";

interface GlassmorphicCardProps {
  tool: Tool;
  onFavoriteToggle?: (toolId: string, isFavorited: boolean) => void;
}

export default function GlassmorphicCard({
  tool,
  onFavoriteToggle,
}: GlassmorphicCardProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<"favorite" | "review">(
    "favorite"
  );
  const [dominantColor, setDominantColor] = useState<string>(
    "rgba(59, 130, 246, 0.3)"
  );
  const [isColorExtracted, setIsColorExtracted] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (session?.user?.email) {
      checkFavoriteStatus();
      checkUserReview();
    }
  }, [session, tool._id]);

  useEffect(() => {
    if (tool.logo && !isColorExtracted) {
      extractDominantColor();
    }
  }, [tool.logo, isColorExtracted]);

  const extractDominantColor = async () => {
    if (!tool.logo || !logoRef.current) return;

    try {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const palette = colorThief.getPalette(img, 5);
          if (palette && palette.length > 0) {
            const [r, g, b] = palette[0];
            const color = `rgba(${r}, ${g}, ${b}, 0.3)`;
            setDominantColor(color);
            setIsColorExtracted(true);
          }
        } catch (error) {
          console.log("Color extraction failed, using default:", error);
          setDominantColor("rgba(59, 130, 246, 0.3)");
          setIsColorExtracted(true);
        }
      };

      img.onerror = () => {
        setDominantColor("rgba(59, 130, 246, 0.3)");
        setIsColorExtracted(true);
      };

      img.src = tool.logo;
    } catch (error) {
      console.log("Color extraction error:", error);
      setDominantColor("rgba(59, 130, 246, 0.3)");
      setIsColorExtracted(true);
    }
  };

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
      setAuthAction("favorite");
      setShowAuthModal(true);
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

      const data = await response.json();

      if (response.ok) {
        setIsFavorited(!isFavorited);
        onFavoriteToggle?.(tool._id as string, !isFavorited);
        alert(isFavorited ? "Removed from favorites!" : "Added to favorites!");
      } else {
        alert("Error: " + (data.error || "Failed to update favorite"));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative overflow-hidden rounded-xl border border-white/20 backdrop-blur-xl transition-all duration-300 hover:border-white/30"
        style={{
          background: `linear-gradient(135deg, ${dominantColor}, rgba(255, 255, 255, 0.1))`,
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
        }}
      >
        {/* Glassmorphic Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                {tool.logo ? (
                  <>
                    <img
                      ref={logoRef}
                      src={tool.logo}
                      alt={tool.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg">
                      {tool.name.charAt(0).toUpperCase()}
                    </div>
                  </>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg">
                    {tool.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors break-words leading-tight drop-shadow-sm">
                  {tool.name}
                </h3>
                <p className="text-gray-200 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed drop-shadow-sm">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 sm:ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                  isFavorited
                    ? "bg-red-500/30 text-red-300 border border-red-400/50 shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-red-300 border border-white/20 shadow-lg"
                }`}
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    isFavorited ? "fill-current" : ""
                  }`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!session?.user?.email) {
                    setAuthAction("review");
                    setShowAuthModal(true);
                    return;
                  }
                  setShowReviewModal(true);
                }}
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-yellow-300 border border-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm"
                title="Rate this tool"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>

          {/* Tags and Category */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-sm">
                {tool.category}
              </span>
              {tool.subcategory && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-200 backdrop-blur-sm border border-white/20 shadow-sm">
                  {tool.subcategory}
                </span>
              )}
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full self-start sm:self-auto backdrop-blur-sm border shadow-sm ${
                tool.pricing === "Free"
                  ? "bg-green-500/30 text-green-200 border-green-400/50"
                  : tool.pricing === "Freemium"
                  ? "bg-yellow-500/30 text-yellow-200 border-yellow-400/50"
                  : "bg-purple-500/30 text-purple-200 border-purple-400/50"
              }`}
            >
              {tool.pricing}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (tool.rating || 0)
                        ? "text-yellow-300 fill-current drop-shadow-sm"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-200 text-xs sm:text-sm drop-shadow-sm">
                {tool.rating ? `${tool.rating.toFixed(1)}` : "No rating"}
              </span>
              {tool.reviewCount && tool.reviewCount > 0 && (
                <span className="text-gray-400 text-xs sm:text-sm">
                  ({tool.reviewCount} reviews)
                </span>
              )}
            </div>

            {userRating > 0 && (
              <div className="flex items-center space-x-1 self-start sm:self-auto">
                <span className="text-cyan-300 text-xs drop-shadow-sm">
                  Your rating:
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2 h-2 ${
                        i < userRating
                          ? "text-cyan-300 fill-current drop-shadow-sm"
                          : "text-gray-500"
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
                    className="px-2 py-1 text-xs bg-white/10 text-gray-200 rounded-md backdrop-blur-sm border border-white/20 shadow-sm"
                  >
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-md backdrop-blur-sm border border-white/20 shadow-sm">
                    +{tool.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <motion.a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-lg backdrop-blur-sm"
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
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white rounded-lg transition-all duration-200 text-sm backdrop-blur-sm border border-white/20 shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Website</span>
                </motion.a>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-2">
              {tool.apiAvailable && (
                <span className="px-2 py-1 text-xs bg-cyan-500/30 text-cyan-200 rounded-full border border-cyan-400/50 backdrop-blur-sm shadow-sm">
                  API
                </span>
              )}
              {tool.status === "beta" && (
                <span className="px-2 py-1 text-xs bg-yellow-500/30 text-yellow-200 rounded-full border border-yellow-400/50 backdrop-blur-sm shadow-sm">
                  Beta
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        tool={tool}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
        toolName={tool.name}
      />
    </>
  );
}
