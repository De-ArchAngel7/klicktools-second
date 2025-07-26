import { NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function GET() {
  try {
    const toolsCollection = await getToolsCollection();

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();

    // Check for tools without logos
    const toolsWithoutLogos = allTools.filter(
      (tool) => !tool.logo || tool.logo === ""
    );

    // Check featured tools specifically
    const featuredTools = allTools.filter((tool) => tool.featured === true);
    const featuredWithoutLogos = featuredTools.filter(
      (tool) => !tool.logo || tool.logo === ""
    );

    return NextResponse.json({
      totalTools: allTools.length,
      toolsWithoutLogos: toolsWithoutLogos.length,
      featuredTools: featuredTools.length,
      featuredWithoutLogos: featuredWithoutLogos.length,
      missingLogos: toolsWithoutLogos.map((tool) => ({
        name: tool.name,
        category: tool.category,
        featured: tool.featured,
      })),
      featuredMissingLogos: featuredWithoutLogos.map((tool) => ({
        name: tool.name,
        category: tool.category,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to check logos" },
      { status: 500 }
    );
  }
}
