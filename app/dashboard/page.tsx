"use client";

import { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Star,
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  ArrowLeft,
  Home,
  Lock,
} from "lucide-react";
import { hasRole } from "@/lib/utils";
import AddToolModal from "@/components/AddToolModal";
import UserManagement from "@/components/UserManagement";
import { Tool as ToolType, Review, Favorite } from "@/types";

interface DashboardStats {
  totalTools: number;
  totalUsers: number;
  totalReviews: number;
  totalFavorites: number;
  recentTools: ToolType[];
  topCategories: { category: string; count: number }[];
  toolsByPricing: { pricing: string; count: number }[];
  monthlyGrowth: { month: string; tools: number; users: number }[];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolType | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
      return;
    }

    if (session?.user) {
      fetchUserData();
      if (hasRole(session.user, "admin")) {
        fetchAdminStats();
      }
    }
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const [favoritesRes, reviewsRes] = await Promise.all([
        fetch("/api/user/favorites"),
        fetch("/api/user/reviews"),
      ]);

      if (favoritesRes.ok) {
        const favoritesData = await favoritesRes.json();
        setFavorites(favoritesData);
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "heylelyaka@gmail.com",
          newPassword: "#eric-yaka%",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "✅ Password updated successfully! You can now login with:\nEmail: heylelyaka@gmail.com\nPassword: #eric-yaka%"
        );
      } else {
        alert("❌ Error updating password: " + data.error);
      }
    } catch (error) {
      alert("❌ Error updating password: " + error);
    }
  };

  const handleFixExistingUser = async () => {
    try {
      // First update the password
      const passwordResponse = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "heylelyaka@gmail.com",
          newPassword: "#eric-yaka%",
        }),
      });

      if (passwordResponse.ok) {
        alert(
          "✅ Your existing account has been fixed!\n\nLogin Credentials:\nEmail: heylelyaka@gmail.com\nPassword: #eric-yaka%\n\nYou can now use these credentials to login!"
        );
      } else {
        alert(
          "❌ Error fixing account: " + (await passwordResponse.json()).error
        );
      }
    } catch (error) {
      alert("❌ Error fixing account: " + error);
    }
  };

  const handleCreateNewAdmin = async () => {
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Heylel Admin",
          email: "heylelyaka@gmail.com",
          password: "admin123456",
          role: "admin",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "✅ New admin user created successfully!\n\nLogin Credentials:\nEmail: heylelyaka@gmail.com\nPassword: admin123456\n\nYou can now use these credentials to login!"
        );
      } else {
        alert("❌ Error creating user: " + data.error);
      }
    } catch (error) {
      alert("❌ Error creating user: " + error);
    }
  };

  const handleEditTool = (tool: ToolType) => {
    setEditingTool(tool);
    setShowAddModal(true);
  };

  const handleDeleteTool = async (toolId: string) => {
    if (confirm("Are you sure you want to delete this tool?")) {
      try {
        const response = await fetch(`/api/admin/tools/${toolId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAdminStats(); // Refresh stats
        }
      } catch (error) {
        console.error("Error deleting tool:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingTool(null);
    fetchAdminStats(); // Refresh stats after changes
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Checking authentication...</p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we verify your login status
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-6">
            You need to be logged in to access your dashboard. Please sign in to
            continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => signIn()}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-medium"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <a
              href="/"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">
            Fetching your data and preferences
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = hasRole(session.user, "admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300">
                  Welcome back, {session.user.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handleFixExistingUser}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 border border-blue-500/30 text-sm"
              >
                <span>Fix My Account</span>
              </button>
              <button
                onClick={handleCreateNewAdmin}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200 border border-green-500/30 text-sm"
              >
                <span>Create New Admin</span>
              </button>
              <button
                onClick={handleUpdatePassword}
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-200 border border-yellow-500/30 text-sm"
              >
                <span>Update Password</span>
              </button>
              <a
                href="/"
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </a>
              <a
                href="/"
                className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all duration-200 border border-cyan-500/30 text-sm"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 bg-black/20 backdrop-blur-xl rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "favorites", label: "Favorites", icon: Heart },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "settings", label: "Settings", icon: Settings },
            ...(isAdmin
              ? [
                  { id: "admin", label: "Admin", icon: Activity },
                  { id: "users", label: "Users", icon: Shield },
                ]
              : []),
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Favorites
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {favorites.length}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">
                        Reviews
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {reviews.length}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">
                        Member Since
                      </p>
                      <p className="text-lg font-bold text-white">Active</p>
                    </div>
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-300 text-sm font-medium">
                        Status
                      </p>
                      <p className="text-lg font-bold text-white">Premium</p>
                    </div>
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Favorites
                  </h3>
                  {favorites.length > 0 ? (
                    <div className="space-y-3">
                      {favorites.slice(0, 5).map((favorite) => (
                        <div
                          key={favorite._id}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {favorite.toolName}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {favorite.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No favorites yet</p>
                  )}
                </div>

                <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Reviews
                  </h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.slice(0, 5).map((review) => (
                        <div
                          key={review._id}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {review.toolName}
                            </p>
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No reviews yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  My Favorites
                </h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite._id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {favorite.toolName}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {favorite.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No favorites yet</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  My Reviews
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {review.toolName}
                                </p>
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
                            </div>
                            {review.comment && (
                              <p className="text-gray-300 text-sm">
                                {review.comment}
                              </p>
                            )}
                          </div>
                          <span className="text-gray-400 text-xs">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No reviews yet</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="user-email"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      value={session.user.email || ""}
                      disabled
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      aria-label="User email address"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="user-name"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={session.user.name || ""}
                      disabled
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      aria-label="User name"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "admin" && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Admin Stats Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-300 text-sm font-medium">
                        Total Tools
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.totalTools || 0}
                      </p>
                      <p className="text-emerald-400 text-xs mt-1">
                        +12% this month
                      </p>
                    </div>
                    <Activity className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Total Users
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.totalUsers || 0}
                      </p>
                      <p className="text-blue-400 text-xs mt-1">
                        +8% this month
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">
                        Total Reviews
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.totalReviews || 0}
                      </p>
                      <p className="text-purple-400 text-xs mt-1">
                        +15% this month
                      </p>
                    </div>
                    <MessageSquare className="w-10 h-10 text-purple-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-300 text-sm font-medium">
                        Total Favorites
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.totalFavorites || 0}
                      </p>
                      <p className="text-cyan-400 text-xs mt-1">
                        +22% this month
                      </p>
                    </div>
                    <Heart className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Categories */}
                <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Top Categories
                    </h3>
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  {stats?.topCategories && stats.topCategories.length > 0 ? (
                    <div className="space-y-4">
                      {stats.topCategories
                        .slice(0, 5)
                        .map((category, index) => (
                          <div
                            key={category.category}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-white font-medium">
                                {category.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div
                                  className={`progress-bar ${
                                    stats?.topCategories
                                      ? `progress-width-${Math.round(
                                          (category.count /
                                            Math.max(
                                              ...stats.topCategories.map(
                                                (c) => c.count
                                              )
                                            )) *
                                            100
                                        )}`
                                      : "progress-width-0"
                                  }`}
                                ></div>
                              </div>
                              <span className="text-cyan-400 font-bold">
                                {category.count}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No category data available</p>
                  )}
                </div>

                {/* Pricing Distribution */}
                <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Pricing Distribution
                    </h3>
                    <PieChart className="w-5 h-5 text-purple-400" />
                  </div>
                  {stats?.toolsByPricing && stats.toolsByPricing.length > 0 ? (
                    <div className="space-y-4">
                      {stats.toolsByPricing.map((pricing) => (
                        <div
                          key={pricing.pricing}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                pricing.pricing === "Free"
                                  ? "bg-green-400"
                                  : pricing.pricing === "Freemium"
                                  ? "bg-yellow-400"
                                  : "bg-purple-400"
                              }`}
                            ></div>
                            <span className="text-white font-medium">
                              {pricing.pricing}
                            </span>
                          </div>
                          <span className="text-cyan-400 font-bold">
                            {pricing.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No pricing data available</p>
                  )}
                </div>
              </div>

              {/* Recent Tools Management */}
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Recent Tools
                  </h3>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Tool</span>
                  </button>
                </div>

                {stats?.recentTools && stats.recentTools.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">
                            Tool
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">
                            Pricing
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentTools.map((tool) => (
                          <tr
                            key={tool._id}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                {tool.logo && (
                                  <img
                                    src={tool.logo}
                                    alt={tool.name}
                                    className="w-8 h-8 rounded-lg object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                )}
                                <div>
                                  <p className="text-white font-medium">
                                    {tool.name}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {tool.description.substring(0, 50)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                                {tool.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  tool.pricing === "Free"
                                    ? "bg-green-500/20 text-green-400"
                                    : tool.pricing === "Freemium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-purple-500/20 text-purple-400"
                                }`}
                              >
                                {tool.pricing}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  tool.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : tool.status === "beta"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {tool.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditTool(tool)}
                                  className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded"
                                  aria-label={`Edit ${tool.name}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteTool(tool._id as string)
                                  }
                                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                                  aria-label={`Delete ${tool.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">No tools available</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "users" && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <UserManagement />
            </motion.div>
          )}
        </div>
      </div>

      {/* Add/Edit Tool Modal */}
      {showAddModal && (
        <AddToolModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          tool={editingTool}
          mode={editingTool ? "edit" : "add"}
        />
      )}
    </div>
  );
}
