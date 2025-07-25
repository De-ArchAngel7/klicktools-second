import { NextRequest, NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "popularity";
    const pricing = searchParams.get("pricing");
    const rating = searchParams.get("rating");
    const status = searchParams.get("status");
    const apiAvailable = searchParams.get("apiAvailable");

    console.log("API: Fetching tools with params:", {
      query,
      category,
      featured,
      sort,
    });

    const toolsCollection = await getToolsCollection();
    let filter: any = {};

    // Featured filter
    if (featured === "true") {
      filter.featured = true;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Pricing filter
    if (pricing) {
      filter.pricing = pricing;
    }

    // Rating filter
    if (rating) {
      filter.rating = { $gte: parseInt(rating) };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // API available filter
    if (apiAvailable === "true") {
      filter.apiAvailable = true;
    }

    // Text search
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    // Sort options
    let sortOption: any = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "popularity":
      default:
        sortOption = { featured: -1, rating: -1, reviewCount: -1 };
        break;
    }

    console.log("API: Executing database query...");
    const tools = await toolsCollection.find(filter).sort(sortOption).toArray();
    console.log(`API: Found ${tools.length} tools`);

    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const toolsCollection = await getToolsCollection();

    const result = await toolsCollection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Tool created successfully",
      toolId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
