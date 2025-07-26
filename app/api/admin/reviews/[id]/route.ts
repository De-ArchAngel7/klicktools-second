import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviewsCollection, getToolsCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Convert id to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid review ID format" },
        { status: 400 }
      );
    }

    const reviewsCollection = await getReviewsCollection();

    // Get the review to find the toolId before deleting
    const review = await reviewsCollection.findOne({ _id: objectId });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const result = await reviewsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update tool's average rating
    const toolsCollection = await getToolsCollection();
    const toolReviews = await reviewsCollection
      .find({ toolId: review.toolId })
      .toArray();

    if (toolReviews.length > 0) {
      const avgRating =
        toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;
      await toolsCollection.updateOne(
        { _id: review.toolId },
        {
          $set: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: toolReviews.length,
          },
        }
      );
    } else {
      await toolsCollection.updateOne(
        { _id: review.toolId },
        {
          $set: {
            rating: 0,
            reviewCount: 0,
          },
        }
      );
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
