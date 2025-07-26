import { NextRequest, NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const toolsCollection = await getToolsCollection();

    // Test 1: Get all tools
    const allTools = await toolsCollection.find({}).toArray();

    // Test 2: Get tools by category
    let categoryTools: any[] = [];
    if (category) {
      categoryTools = await toolsCollection
        .find({ category: category })
        .toArray();
    }

    // Test 3: Get distinct categories
    const categories = await toolsCollection.distinct("category");

    return NextResponse.json({
      totalTools: allTools.length,
      categoryFilter: category,
      categoryToolsCount: categoryTools.length,
      categoryTools: categoryTools.map((t) => ({
        name: t.name,
        category: t.category,
      })),
      allCategories: categories,
      sampleTools: allTools
        .slice(0, 3)
        .map((t) => ({ name: t.name, category: t.category })),
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      {
        error: "Debug API error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
