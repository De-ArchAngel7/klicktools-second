import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviewsCollection, getToolsCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toolId, rating, comment } = await request.json();

    if (!toolId || !rating) {
      return NextResponse.json(
        { error: "Tool ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const toolsCollection = await getToolsCollection();

    // Convert toolId to ObjectId for database query
    let objectId;
    try {
      objectId = new ObjectId(toolId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid tool ID format" },
        { status: 400 }
      );
    }

    const tool = await toolsCollection.findOne({ _id: objectId });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const reviewsCollection = await getReviewsCollection();

    // Check if user already reviewed this tool
    const existingReview = await reviewsCollection.findOne({
      userEmail: session.user.email,
      toolId: toolId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this tool" },
        { status: 400 }
      );
    }

    // Create new review
    const review = {
      toolId: toolId,
      userId: session.user.id || session.user.email,
      userEmail: session.user.email,
      rating: rating,
      comment: comment || "",
      toolName: tool.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await reviewsCollection.insertOne(review);

    // Update tool's average rating
    const toolReviews = await reviewsCollection
      .find({ toolId: toolId })
      .toArray();
    const avgRating =
      toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;

    await toolsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: toolReviews.length,
        },
      }
    );

    return NextResponse.json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
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

    const { toolId, rating, comment } = await request.json();

    if (!toolId || !rating) {
      return NextResponse.json(
        { error: "Tool ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const reviewsCollection = await getReviewsCollection();

    // Update existing review
    const result = await reviewsCollection.updateOne(
      {
        userEmail: session.user.email,
        toolId: toolId,
      },
      {
        $set: {
          rating: rating,
          comment: comment || "",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update tool's average rating
    const toolsCollection = await getToolsCollection();

    // Convert toolId to ObjectId for database query
    let objectId;
    try {
      objectId = new ObjectId(toolId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid tool ID format" },
        { status: 400 }
      );
    }

    const toolReviews = await reviewsCollection
      .find({ toolId: toolId })
      .toArray();
    const avgRating =
      toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;

    await toolsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: toolReviews.length,
        },
      }
    );

    return NextResponse.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
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

    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json(
        { error: "Tool ID is required" },
        { status: 400 }
      );
    }

    const reviewsCollection = await getReviewsCollection();

    const result = await reviewsCollection.deleteOne({
      userEmail: session.user.email,
      toolId: toolId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update tool's average rating
    const toolsCollection = await getToolsCollection();

    // Convert toolId to ObjectId for database query
    let objectId;
    try {
      objectId = new ObjectId(toolId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid tool ID format" },
        { status: 400 }
      );
    }

    const toolReviews = await reviewsCollection
      .find({ toolId: toolId })
      .toArray();

    if (toolReviews.length > 0) {
      const avgRating =
        toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;
      await toolsCollection.updateOne(
        { _id: objectId },
        {
          $set: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: toolReviews.length,
          },
        }
      );
    } else {
      await toolsCollection.updateOne(
        { _id: objectId },
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get("toolId");
    const userEmail = searchParams.get("userEmail");

    if (!toolId) {
      return NextResponse.json(
        { error: "Tool ID is required" },
        { status: 400 }
      );
    }

    const reviewsCollection = await getReviewsCollection();
    let query: any = { toolId: toolId };

    // If userEmail is provided, get user's specific review
    if (userEmail) {
      query.userEmail = userEmail;
    }

    const reviews = await reviewsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
