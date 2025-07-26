import { NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

const logoUpdates = {
  Lumen5:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lumen5_logo.svg/1200px-Lumen5_logo.svg.png",
  Tome: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Tome_logo.svg/1200px-Tome_logo.svg.png",
  Gamma:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gamma_logo.svg/1200px-Gamma_logo.svg.png",
  Midjourney:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_logo.svg/1200px-Midjourney_logo.svg.png",
  "Stable Diffusion":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Stable_Diffusion_logo.svg/1200px-Stable_Diffusion_logo.svg.png",
  "Pika Labs":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pika_Labs_logo.svg/1200px-Pika_Labs_logo.svg.png",
  Mubert:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mubert_logo.svg/1200px-Mubert_logo.svg.png",
  Descript:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Descript_logo.svg/1200px-Descript_logo.svg.png",
  "Babylon Health":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Babylon_Health_logo.svg/1200px-Babylon_Health_logo.svg.png",
  "Playground AI":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Playground_AI_logo.svg/1200px-Playground_AI_logo.svg.png",
};

export async function POST() {
  try {
    const toolsCollection = await getToolsCollection();

    let updatedCount = 0;
    const results = [];

    for (const [toolName, newLogoUrl] of Object.entries(logoUpdates)) {
      const result = await toolsCollection.updateOne(
        { name: toolName },
        { $set: { logo: newLogoUrl } }
      );

      if (result.modifiedCount > 0) {
        results.push(`✅ Updated logo for ${toolName}`);
        updatedCount++;
      } else {
        results.push(`❌ Tool ${toolName} not found`);
      }
    }

    // Check featured tools after update
    const featuredTools = await toolsCollection
      .find({ featured: true })
      .toArray();
    const featuredWithoutLogos = featuredTools.filter(
      (tool) => !tool.logo || tool.logo === ""
    );

    return NextResponse.json({
      success: true,
      updatedCount,
      results,
      featuredTools: featuredTools.length,
      featuredWithoutLogos: featuredWithoutLogos.length,
      featuredMissingLogos: featuredWithoutLogos.map((tool) => tool.name),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update logos" },
      { status: 500 }
    );
  }
}
