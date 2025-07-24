import { NextRequest, NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const toolsCollection = await getToolsCollection();

    // Get all unique categories with tool counts
    const categories = await toolsCollection
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            category: "$_id",
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    // Add the "All Tools" category
    const totalTools = await toolsCollection.countDocuments();
    const allToolsCategory = {
      category: "All Tools",
      count: totalTools,
    };

    return NextResponse.json([allToolsCategory, ...categories]);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
