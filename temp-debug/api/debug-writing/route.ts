import { NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function GET() {
  try {
    const toolsCollection = await getToolsCollection();

    // Get all AI Writing tools
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();

    // Check for duplicates
    const toolNames = writingTools.map((tool) => tool.name);
    const uniqueNames = [...new Set(toolNames)];
    const duplicates = toolNames.filter(
      (name, index) => toolNames.indexOf(name) !== index
    );

    return NextResponse.json({
      totalWritingTools: writingTools.length,
      uniqueNames: uniqueNames.length,
      duplicates: duplicates,
      allWritingTools: writingTools.map((tool) => ({
        id: tool._id,
        name: tool.name,
        category: tool.category,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
