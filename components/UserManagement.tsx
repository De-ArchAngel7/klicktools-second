"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Crown,
  User,
  Trash2,
  Edit,
  Plus,
  X,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  total: number;
  admins: number;
  users: number;
}

interface UserWithPagination {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: UserStats;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    users: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: "",
    userEmail: "",
    newPassword: "",
  });
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data: UserWithPagination = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        alert(`✅ User role updated successfully to ${newRole}!`);
        fetchUsers();
      } else {
        const error = await response.json();
        alert("❌ Error updating role: " + error.error);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("❌ Network error: Unable to update user role. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert("✅ User deleted successfully!");
        fetchUsers();
      } else {
        const error = await response.json();
        alert("❌ Error deleting user: " + error.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Network error: Unable to delete user. Please try again.");
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `🎉 SUCCESS! User Created Successfully!\n\n📧 Email: ${createForm.email}\n🔑 Password: ${createForm.password}\n👤 Role: ${createForm.role}\n\n✅ The user can now login with these credentials!`
        );
        setShowCreateModal(false);
        setCreateForm({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        // Show specific error message based on status code
        if (response.status === 409) {
          alert(
            "❌ Error: A user with this email already exists. Please use a different email address."
          );
        } else {
          alert("❌ Error creating user: " + (data.error || "Unknown error"));
        }
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert("❌ Network error: Unable to connect to server. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetPassword = (userId: string, userEmail: string) => {
    setResetPasswordData({
      userId,
      userEmail,
      newPassword: "",
    });
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordSubmit = async () => {
    try {
      if (!resetPasswordData.newPassword) {
        alert("❌ Please enter a new password");
        return;
      }

      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetPasswordData.userEmail,
          newPassword: resetPasswordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `🔐 SUCCESS! Password Reset Successfully!\n\n📧 Email: ${resetPasswordData.userEmail}\n🔑 New Password: ${resetPasswordData.newPassword}\n\n✅ The user can now login with the new password!`
        );
        setShowResetPasswordModal(false);
        setResetPasswordData({ userId: "", userEmail: "", newPassword: "" });
      } else {
        alert("❌ Error resetting password: " + data.error);
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      alert("❌ Network error: Unable to reset password. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>User Management</span>
          </h2>
          <p className="text-gray-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-lg transition-all duration-200 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-purple-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Admins</p>
              <p className="text-2xl font-bold text-white">{stats.admins}</p>
            </div>
            <Crown className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">
                Regular Users
              </p>
              <p className="text-2xl font-bold text-white">{stats.users}</p>
            </div>
            <User className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black/20 backdrop-blur-xl rounded-xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Filter users by role"
            >
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
            {(search || roleFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-lg transition-all duration-200"
                title="Clear filters"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">
                  User
                </th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        aria-label={`Change role for ${user.name}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleResetPassword(user._id, user.email)
                          }
                          className="p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded transition-all duration-200"
                          title={`Reset password for ${user.name}`}
                        >
                          🔑
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-200"
                          title={`Delete user ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-white text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={
                      showCreatePassword ? "Hide password" : "Show password"
                    }
                  >
                    {showCreatePassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  aria-label="Select user role"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-lg transition-all duration-200 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-purple-500/30"
              >
                Create User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Reset User Password
              </h3>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={resetPasswordData.userEmail}
                  disabled
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="User email"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    value={resetPasswordData.newPassword}
                    onChange={(e) =>
                      setResetPasswordData({
                        ...resetPasswordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={
                      showResetPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showResetPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPasswordSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-lg transition-all duration-200 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30"
              >
                Reset Password
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
