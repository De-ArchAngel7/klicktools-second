"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, Heart, MessageCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import ReviewModal from "@/components/ReviewModal";
import OnboardingScreen from "@/components/OnboardingScreen";
import { Tool } from "@/types";
import DarkModeToggle from "@/components/DarkModeToggle";

const getCategoryIcon = (category: string) => {
  // Map category names to their icon files
  const categoryIconMap: { [key: string]: string } = {
    "All Tools": "ai-all",
    "AI Writing": "ai-writing",
    "ai-writing": "ai-writing",
    "ai-chat": "ai-chat",
    "ai-image": "ai-image",
    "ai-video": "ai-video",
    "ai-code": "ai-code",
    "ai-business": "ai-business",
    "ai-education": "ai-education",
    "ai-health": "ai-health",
    "ai-audio": "ai-audio",
    "ai-beauty": "ai-beauty",
  };

  const iconName = categoryIconMap[category] || "default";

  const pngPath = `/category-icons/${iconName}.png`;
  const svgPath = `/category-icons/${iconName}.svg`;

  return { pngPath, svgPath };
};

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState({
    pricing: "",
    rating: 0,
    status: "",
    apiAvailable: false,
  });

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Define hasActiveFilters before using it in useEffect
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    sortBy !== "popularity" ||
    Object.values(advancedFilters).some(
      (v) => v !== "" && v !== 0 && v !== false
    );

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    fetchFeaturedTools();
    fetchCategories();
  }, []);

  // Trigger search when searchQuery changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Trigger search when filters change
  useEffect(() => {
    if (
      searchQuery ||
      selectedCategory ||
      Object.values(advancedFilters).some(
        (v) => v !== "" && v !== 0 && v !== false
      )
    ) {
      handleSearch();
    }
  }, [advancedFilters, sortBy, selectedCategory]);

  // Auto-scroll to search results when they appear
  useEffect(() => {
    if (
      searchResults.length > 0 &&
      (searchQuery ||
        selectedCategory ||
        Object.values(advancedFilters).some(
          (v) => v !== "" && v !== 0 && v !== false
        ))
    ) {
      const searchResultsElement = document.getElementById("search-results");
      if (searchResultsElement) {
        setTimeout(() => {
          searchResultsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 500);
      }
    }
  }, [searchResults, searchQuery, selectedCategory, advancedFilters]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const fetchFeaturedTools = async () => {
    try {
      const response = await fetch("/api/tools?featured=true");
      if (response.ok) {
        const data = await response.json();
        setFeaturedTools(data);
      }
    } catch (error) {
      console.error("Error fetching featured tools:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async () => {
    // Don't search if no query and no filters
    if (
      !searchQuery &&
      !selectedCategory &&
      !Object.values(advancedFilters).some(
        (v) => v !== "" && v !== 0 && v !== false
      )
    ) {
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);
      if (advancedFilters.pricing)
        params.append("pricing", advancedFilters.pricing);
      if (advancedFilters.rating > 0)
        params.append("rating", advancedFilters.rating.toString());
      if (advancedFilters.status)
        params.append("status", advancedFilters.status);
      if (advancedFilters.apiAvailable) params.append("apiAvailable", "true");

      const response = await fetch(`/api/tools?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Search failed:", response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching tools:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleReviewClick = (tool: Tool) => {
    setSelectedTool(tool);
    setShowReviewModal(true);
  };

  const handleFavoriteToggle = (toolId: string, isFavorited: boolean) => {
    // Update the tool's favorite status in the UI
    setSearchResults((prev) =>
      prev.map((tool) =>
        tool._id === toolId ? { ...tool, isFavorited } : tool
      )
    );
    setFeaturedTools((prev) =>
      prev.map((tool) =>
        tool._id === toolId ? { ...tool, isFavorited } : tool
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("popularity");
    setAdvancedFilters({
      pricing: "",
      rating: 0,
      status: "",
      apiAvailable: false,
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "neon-gradient-bg" : "ai-gradient-bg"
      }`}
    >
      {/* Animated Stars Background for Dark Mode */}
      {isDarkMode && (
        <div className="stars-bg">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      )}
      {/* Navbar */}
      <Navbar />

      {/* Floating Search Results Indicator */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg backdrop-blur-xl max-w-[90vw] sm:max-w-none ${
            isDarkMode
              ? "neon-glass-card text-cyan-400 neon-border-glow"
              : "ai-glass-card text-gray-800"
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-sm sm:text-base">
              {searchResults.length} tools found - Scroll down to view results
            </span>
            <button
              onClick={clearFilters}
              className={`ml-1 sm:ml-2 p-1 rounded-full transition-all duration-200 ${
                isDarkMode ? "hover:bg-cyan-400/20" : "hover:bg-white/30"
              }`}
              title="Clear all filters"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
              : "bg-gradient-to-br from-white/20 via-transparent to-white/10"
          }`}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 ${
                isDarkMode
                  ? "text-white neon-text-glow"
                  : "text-white ai-text-glow"
              }`}
            >
              Discover the Best
              <span className="gradient-text bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {" "}
                AI Tools
              </span>
            </h1>
            <p
              className={`text-xl mb-8 max-w-3xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-white/90"
              }`}
            >
              Explore our curated collection of cutting-edge AI tools and
              utilities. Find the perfect solution for your next project.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className={`w-full px-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    isDarkMode
                      ? "neon-glass-card text-white placeholder-gray-400 neon-border-glow"
                      : "ai-glass-card text-white placeholder-white/70 border-0"
                  }`}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>

            {/* Search Results - Now appears immediately after search */}
            {(searchQuery ||
              selectedCategory ||
              Object.values(advancedFilters).some(
                (v) => v !== "" && v !== 0 && v !== false
              )) && (
              <motion.div
                id="search-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-12"
              >
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-2xl">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                          Search Results
                          {searchQuery && (
                            <span className="text-gray-400 font-normal">
                              {" "}
                              for "{searchQuery}"
                            </span>
                          )}
                        </h2>
                      </div>
                      <p className="text-gray-400 ml-11 sm:ml-12 text-sm sm:text-base">
                        {isSearching
                          ? "Searching..."
                          : `${searchResults.length} tools found`}
                      </p>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className="text-gray-400 text-sm">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Sort search results"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest</option>
                        <option value="rating">Highest Rated</option>
                        <option value="name">Name A-Z</option>
                      </select>
                      <button
                        onClick={clearFilters}
                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
                        title="Clear all filters"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Badges */}
                  {(searchQuery ||
                    selectedCategory ||
                    Object.values(advancedFilters).some(
                      (v) => v !== "" && v !== 0 && v !== false
                    )) && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-6">
                      {searchQuery && (
                        <span className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs sm:text-sm border border-cyan-500/30">
                          <span>Search: "{searchQuery}"</span>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:bg-cyan-500/30 rounded-full p-0.5 transition-all duration-200"
                            title="Remove search filter"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCategory && (
                        <span className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs sm:text-sm border border-purple-500/30">
                          <span>Category: {selectedCategory}</span>
                          <button
                            onClick={() => setSelectedCategory("")}
                            className="hover:bg-purple-500/30 rounded-full p-0.5 transition-all duration-200"
                            title="Remove category filter"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </span>
                      )}
                      {advancedFilters.pricing && (
                        <span className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm border border-green-500/30">
                          <span>Pricing: {advancedFilters.pricing}</span>
                          <button
                            onClick={() =>
                              setAdvancedFilters({
                                ...advancedFilters,
                                pricing: "",
                              })
                            }
                            className="hover:bg-green-500/30 rounded-full p-0.5 transition-all duration-200"
                            title="Remove pricing filter"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </span>
                      )}
                      {advancedFilters.rating > 0 && (
                        <span className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm border border-yellow-500/30">
                          <span>Rating: {advancedFilters.rating}+ stars</span>
                          <button
                            onClick={() =>
                              setAdvancedFilters({
                                ...advancedFilters,
                                rating: 0,
                              })
                            }
                            className="hover:bg-yellow-500/30 rounded-full p-0.5 transition-all duration-200"
                            title="Remove rating filter"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </span>
                      )}
                      {advancedFilters.apiAvailable && (
                        <span className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm border border-blue-500/30">
                          <span>API Available</span>
                          <button
                            onClick={() =>
                              setAdvancedFilters({
                                ...advancedFilters,
                                apiAvailable: false,
                              })
                            }
                            className="hover:bg-blue-500/30 rounded-full p-0.5 transition-all duration-200"
                            title="Remove API filter"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Results Grid */}
                  {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-cyan-400">Searching for tools...</p>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((tool) => (
                        <GlassmorphicCard
                          key={tool._id}
                          tool={tool}
                          onFavoriteToggle={handleFavoriteToggle}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No tools found
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Try adjusting your search criteria or browse our
                        categories below.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-all duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Advanced Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Advanced Filters</span>
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-cyan-400 hover:text-cyan-300 text-sm self-start sm:self-auto"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pricing Filter */}
                  <div>
                    <label
                      htmlFor="pricing-filter"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Pricing
                    </label>
                    <select
                      id="pricing-filter"
                      value={advancedFilters.pricing}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          pricing: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      aria-label="Filter by pricing"
                    >
                      <option value="">All Pricing</option>
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label
                      htmlFor="rating-filter"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Minimum Rating
                    </label>
                    <select
                      id="rating-filter"
                      value={advancedFilters.rating}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          rating: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      aria-label="Filter by minimum rating"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={4}>4+ Stars</option>
                      <option value={3}>3+ Stars</option>
                      <option value={2}>2+ Stars</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      htmlFor="status-filter"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status-filter"
                      value={advancedFilters.status}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      aria-label="Filter by status"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="beta">Beta</option>
                      <option value="deprecated">Deprecated</option>
                    </select>
                  </div>

                  {/* API Available Filter */}
                  <div>
                    <label
                      htmlFor="api-filter"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      API Available
                    </label>
                    <select
                      id="api-filter"
                      value={advancedFilters.apiAvailable ? "true" : ""}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          apiAvailable: e.target.value === "true",
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      aria-label="Filter by API availability"
                    >
                      <option value="">All Tools</option>
                      <option value="true">API Available</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDarkMode
                ? "text-white neon-text-glow"
                : "text-white ai-text-glow"
            }`}
          >
            Browse by Category
          </h2>
          <p
            className={`max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-400" : "text-white/80"
            }`}
          >
            Explore tools organized by category to find exactly what you need
            for your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.button
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCategorySelect(category.category)}
                className={`category-card p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                  selectedCategory === category.category
                    ? isDarkMode
                      ? "neon-glass-card border-cyan-400 text-cyan-400 scale-105 neon-border-glow"
                      : "ai-glass-card border-white/40 text-white scale-105"
                    : isDarkMode
                    ? "neon-glass-card border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-400 hover:scale-105"
                    : "ai-glass-card border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-105"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-400 to-purple-500 neon-border-glow"
                        : "bg-gradient-to-r from-white/20 to-white/10"
                    }`}
                  >
                    <img
                      src={getCategoryIcon(category.category).pngPath}
                      alt={category.category}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.endsWith(".png")) {
                          target.src = getCategoryIcon(
                            category.category
                          ).svgPath;
                        } else {
                          target.src = "/category-icons/default.png";
                        }
                      }}
                    />
                  </div>
                  <p className="font-medium text-xs sm:text-sm mb-1 line-clamp-2">
                    {category.category}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-white/70"
                    }`}
                  >
                    {category.count} tools
                  </p>
                  {selectedCategory === category.category && (
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode
                          ? "text-cyan-400 neon-text-glow"
                          : "text-white"
                      }`}
                    >
                      ✓ Active
                    </p>
                  )}
                </div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className={isDarkMode ? "text-gray-400" : "text-white/70"}>
                Loading categories...
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-white ai-text-glow"
            }`}
          >
            Featured Tools
          </h2>
          <p
            className={`max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-400" : "text-white/80"
            }`}
          >
            Hand-picked tools that stand out for their innovation, quality, and
            user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(featuredTools) && featuredTools.length > 0 ? (
            featuredTools.map((tool, index) => (
              <motion.div
                key={tool._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassmorphicCard
                  tool={tool}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-400">Loading featured tools...</div>
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        tool={selectedTool}
      />

      {/* Onboarding Screen */}
      {showOnboarding && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
