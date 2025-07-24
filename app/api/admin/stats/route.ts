import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getToolsCollection,
  getUsersCollection,
  getReviewsCollection,
  getFavoritesCollection,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all collections
    const toolsCollection = await getToolsCollection();
    const reviewsCollection = await getReviewsCollection();
    const favoritesCollection = await getFavoritesCollection();

    // Basic counts
    const totalTools = await toolsCollection.countDocuments();
    const totalUsers = await usersCollection.countDocuments();
    const totalReviews = await reviewsCollection.countDocuments();
    const totalFavorites = await favoritesCollection.countDocuments();

    // Recent tools (last 10)
    const recentTools = await toolsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Top categories with counts
    const categoryPipeline = [
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ];
    const categoryStats = await toolsCollection
      .aggregate(categoryPipeline)
      .toArray();
    const topCategories = categoryStats.map((stat) => ({
      category: stat._id,
      count: stat.count,
    }));

    // Tools by pricing
    const pricingPipeline = [
      { $group: { _id: "$pricing", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    const pricingStats = await toolsCollection
      .aggregate(pricingPipeline)
      .toArray();
    const toolsByPricing = pricingStats.map((stat) => ({
      pricing: stat._id,
      count: stat.count,
    }));

    // Monthly growth data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const monthName = startDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const toolsInMonth = await toolsCollection.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const usersInMonth = await usersCollection.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      monthlyGrowth.push({
        month: monthName,
        tools: toolsInMonth,
        users: usersInMonth,
      });
    }

    // Status distribution
    const statusPipeline = [
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    const statusStats = await toolsCollection
      .aggregate(statusPipeline)
      .toArray();
    const toolsByStatus = statusStats.map((stat) => ({
      status: stat._id,
      count: stat.count,
    }));

    // Average rating
    const ratingPipeline = [
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ];
    const ratingStats = await toolsCollection
      .aggregate(ratingPipeline)
      .toArray();
    const averageRating =
      ratingStats.length > 0
        ? Math.round(ratingStats[0].avgRating * 10) / 10
        : 0;

    // Featured tools count
    const featuredToolsCount = await toolsCollection.countDocuments({
      featured: true,
    });

    // API available tools count
    const apiToolsCount = await toolsCollection.countDocuments({
      apiAvailable: true,
    });

    const stats = {
      totalTools,
      totalUsers,
      totalReviews,
      totalFavorites,
      recentTools,
      topCategories,
      toolsByPricing,
      monthlyGrowth,
      toolsByStatus,
      averageRating,
      featuredToolsCount,
      apiToolsCount,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
