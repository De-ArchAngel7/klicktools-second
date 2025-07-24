"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tool } from "@/types";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
}

export default function ReviewModal({
  isOpen,
  onClose,
  tool,
}: ReviewModalProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);

  useEffect(() => {
    if (isOpen && tool && session?.user?.email) {
      checkExistingReview();
    }
  }, [isOpen, tool, session]);

  const checkExistingReview = async () => {
    try {
      const response = await fetch(
        `/api/reviews?toolId=${tool?._id}&userEmail=${session?.user?.email}`
      );
      if (response.ok) {
        const reviews = await response.json();
        if (reviews.length > 0) {
          setExistingReview(reviews[0]);
          setRating(reviews[0].rating);
          setComment(reviews[0].comment || "");
        } else {
          setExistingReview(null);
          setRating(0);
          setComment("");
        }
      }
    } catch (error) {
      console.error("Error checking existing review:", error);
    }
  };

  const handleSubmit = async () => {
    if (!tool || !session?.user?.email || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: existingReview ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: tool._id,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        onClose();
        // Optionally refresh the tool data or show success message
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tool || !session?.user?.email) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: tool._id,
        }),
      });

      if (response.ok) {
        onClose();
        setExistingReview(null);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tool) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {tool.logo && (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Rate {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{tool.category}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Your Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className={`p-1 rounded-lg transition-all duration-200 ${
                        star <= rating
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-gray-600 hover:text-yellow-400 hover:bg-yellow-400/10"
                      }`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "fill-current" : ""
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {rating === 0 && "Click to rate"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Your Review (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this tool..."
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-gray-400 text-xs mt-1 text-right">
                  {comment.length}/500
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {existingReview ? "Update Review" : "Submit Review"}
                  </span>
                </motion.button>

                {existingReview && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Delete
                  </motion.button>
                )}
              </div>

              {/* Existing Review Info */}
              {existingReview && (
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <p className="text-cyan-400 text-sm font-medium mb-1">
                    You previously reviewed this tool
                  </p>
                  <p className="text-gray-300 text-sm">
                    Submitted on{" "}
                    {new Date(existingReview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
