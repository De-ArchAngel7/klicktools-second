const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function fixDuplicates() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools before cleanup: ${allTools.length}`);

    // Find duplicates by name
    const nameCounts = {};
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
      console.log(`\nTool "${name}" appears ${toolsWithName.length} times`);

      // Keep the first one, remove the rest
      for (let i = 1; i < toolsWithName.length; i++) {
        await toolsCollection.deleteOne({ _id: toolsWithName[i]._id });
        removedCount++;
        console.log(`  Removed duplicate ${i + 1}`);
      }
    }

    console.log(`\nRemoved ${removedCount} duplicate tools`);

    // Show final count
    const finalTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools after cleanup: ${finalTools.length}`);

    // Show AI Writing tools specifically
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nAI Writing tools after cleanup: ${writingTools.length}`);
    writingTools.forEach((tool) => {
      console.log(`  - ${tool.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

fixDuplicates();
