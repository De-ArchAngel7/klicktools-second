import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const usersCollection = await getUsersCollection();
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all users with pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    // Get users with pagination
    const users = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalUsers = await usersCollection.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get user statistics
    const userStats = await usersCollection
      .aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const stats = {
      total: totalUsers,
      admins: userStats.find((s) => s._id === "admin")?.count || 0,
      users: userStats.find((s) => s._id === "user")?.count || 0,
    };

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const usersCollection = await getUsersCollection();
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Convert userId to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Prevent admin from changing their own role
    if (objectId.toString() === currentUser._id?.toString()) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    // Update user role
    const result = await usersCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User role updated successfully",
      role: role,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const usersCollection = await getUsersCollection();
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (objectId.toString() === currentUser._id?.toString()) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user to be deleted is also an admin
    const userToDelete = await usersCollection.findOne({ _id: objectId });
    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete another admin" },
        { status: 400 }
      );
    }

    // Delete user
    const result = await usersCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
