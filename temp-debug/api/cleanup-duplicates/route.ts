import { NextResponse } from "next/server";
import { getToolsCollection } from "@/lib/db";

export async function POST() {
  try {
    const toolsCollection = await getToolsCollection();

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools before cleanup: ${allTools.length}`);

    // Find duplicates by name
    const nameCounts: { [key: string]: number } = {};
    allTools.forEach((tool) => {
      nameCounts[tool.name] = (nameCounts[tool.name] || 0) + 1;
    });

    const duplicates = Object.keys(nameCounts).filter(
      (name) => nameCounts[name] > 1
    );
    console.log(`Found ${duplicates.length} duplicate tool names:`, duplicates);

    // Remove duplicates
    let removedCount = 0;
    for (const name of duplicates) {
      const toolsWithName = await toolsCollection
        .find({ name: name })
        .toArray();
      console.log(`Tool "${name}" appears ${toolsWithName.length} times`);

      // Keep the first one, remove the rest
      for (let i = 1; i < toolsWithName.length; i++) {
        await toolsCollection.deleteOne({ _id: toolsWithName[i]._id });
        removedCount++;
        console.log(`  Removed duplicate ${i + 1}`);
      }
    }

    // Show final count
    const finalTools = await toolsCollection.find({}).toArray();
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();

    return NextResponse.json({
      success: true,
      removedCount,
      totalToolsBefore: allTools.length,
      totalToolsAfter: finalTools.length,
      writingToolsAfter: writingTools.length,
      duplicates: duplicates,
      writingTools: writingTools.map((tool) => tool.name),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup duplicates" },
      { status: 500 }
    );
  }
}
