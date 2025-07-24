"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save, Loader2 } from "lucide-react";
import { Tool } from "@/types";

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool?: Tool | null;
  mode: "add" | "edit";
}

const categories = [
  "AI Writing",
  "AI Image Generation",
  "AI Video",
  "AI Audio",
  "AI Code",
  "AI Research",
  "AI Productivity",
  "AI Marketing",
  "AI Design",
  "AI Analytics",
  "AI Chat",
  "AI Translation",
  "AI Education",
  "AI Healthcare",
  "AI Finance",
  "Other",
];

const pricingOptions = ["Free", "Freemium", "Paid", "Enterprise"];

export default function AddToolModal({
  isOpen,
  onClose,
  tool,
  mode,
}: AddToolModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    category: "",
    subcategory: "",
    tags: "",
    logo: "",
    color: "#3B82F6",
    featured: false,
    pricing: "Freemium" as "Free" | "Freemium" | "Paid" | "Enterprise",
    website: "",
    documentation: "",
    apiAvailable: false,
    apiUrl: "",
    pros: "",
    cons: "",
    features: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tool && mode === "edit") {
      setFormData({
        name: tool.name || "",
        description: tool.description || "",
        url: tool.url || "",
        category: tool.category || "",
        subcategory: tool.subcategory || "",
        tags: tool.tags?.join(", ") || "",
        logo: tool.logo || "",
        color: tool.color || "#3B82F6",
        featured: tool.featured || false,
        pricing: tool.pricing || "Freemium",
        website: tool.website || "",
        documentation: tool.documentation || "",
        apiAvailable: tool.apiAvailable || false,
        apiUrl: tool.apiUrl || "",
        pros: tool.pros?.join(", ") || "",
        cons: tool.cons?.join(", ") || "",
        features: tool.features?.join(", ") || "",
      });
    }
  }, [tool, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tool name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        pros: formData.pros
          .split(",")
          .map((pro) => pro.trim())
          .filter(Boolean),
        cons: formData.cons
          .split(",")
          .map((con) => con.trim())
          .filter(Boolean),
        features: formData.features
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
      };

      const url =
        mode === "add" ? "/api/admin/tools" : `/api/admin/tools/${tool?._id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose();
        // Refresh the page or update the tools list
        window.location.reload();
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || "Failed to save tool" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred while saving the tool" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-800 rounded-xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-white/20 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {mode === "add" ? "Add New Tool" : "Edit Tool"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">{errors.submit}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tool Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.name ? "border-red-500" : "border-white/20"
                      }`}
                      placeholder="Enter tool name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.description
                          ? "border-red-500"
                          : "border-white/20"
                      }`}
                      placeholder="Describe what this tool does"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.url ? "border-red-500" : "border-white/20"
                      }`}
                      placeholder="https://example.com"
                    />
                    {errors.url && (
                      <p className="text-red-400 text-sm mt-1">{errors.url}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      aria-label="Select tool category"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.category ? "border-red-500" : "border-white/20"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., Text Generation, Image Editing"
                    />
                  </div>
                </div>

                {/* Visual & Branding */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    Visual & Branding
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Brand Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        aria-label="Select brand color"
                        className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        aria-label="Enter brand color hex code"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      aria-label="Mark tool as featured"
                      className="w-4 h-4 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                    />
                    <label className="text-sm font-medium text-white/80">
                      Featured Tool
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    Pricing & Business
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Pricing Model
                    </label>
                    <select
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      aria-label="Select pricing model"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {pricingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Documentation
                    </label>
                    <input
                      type="url"
                      name="documentation"
                      value={formData.documentation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="https://docs.example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="apiAvailable"
                        checked={formData.apiAvailable}
                        onChange={handleInputChange}
                        aria-label="Mark API as available"
                        className="w-4 h-4 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                      />
                      <label className="text-sm font-medium text-white/80">
                        API Available
                      </label>
                    </div>

                    {formData.apiAvailable && (
                      <input
                        type="url"
                        name="apiUrl"
                        value={formData.apiUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="https://api.example.com"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    Tags & Features
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="AI, writing, productivity, automation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Pros (comma-separated)
                    </label>
                    <textarea
                      name="pros"
                      value={formData.pros}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Fast, accurate, easy to use, free tier available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Cons (comma-separated)
                    </label>
                    <textarea
                      name="cons"
                      value={formData.cons}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Limited features in free tier, occasional bugs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Key Features (comma-separated)
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Real-time collaboration, export to PDF, API access"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{mode === "add" ? "Add Tool" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
