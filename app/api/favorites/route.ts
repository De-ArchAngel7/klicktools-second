import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFavoritesCollection, getToolsCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
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

    const toolsCollection = await getToolsCollection();
    const tool = await toolsCollection.findOne({ _id: toolId });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const favoritesCollection = await getFavoritesCollection();

    // Check if already favorited
    const existingFavorite = await favoritesCollection.findOne({
      userEmail: session.user.email,
      toolId: toolId,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Tool already favorited" },
        { status: 400 }
      );
    }

    // Add to favorites
    const favorite = {
      toolId: toolId,
      userEmail: session.user.email,
      toolName: tool.name,
      category: tool.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await favoritesCollection.insertOne(favorite);

    return NextResponse.json({
      message: "Added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
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

    const favoritesCollection = await getFavoritesCollection();

    const result = await favoritesCollection.deleteOne({
      userEmail: session.user.email,
      toolId: toolId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get("toolId");

    if (toolId) {
      // Check if specific tool is favorited
      const favoritesCollection = await getFavoritesCollection();
      const favorite = await favoritesCollection.findOne({
        userEmail: session.user.email,
        toolId: toolId,
      });

      return NextResponse.json({ isFavorited: !!favorite });
    }

    // Get all user favorites
    const favoritesCollection = await getFavoritesCollection();
    const favorites = await favoritesCollection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
