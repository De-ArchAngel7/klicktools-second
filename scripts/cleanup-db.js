const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function cleanupDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // First, let's see what we have
    console.log("\n=== BEFORE CLEANUP ===");
    const allTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools: ${allTools.length}`);

    const categories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nCategories:");
    categories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });

    // Check for duplicates by name
    const duplicateNames = [];
    const seenNames = new Set();

    for (const tool of allTools) {
      if (seenNames.has(tool.name)) {
        duplicateNames.push(tool.name);
      } else {
        seenNames.add(tool.name);
      }
    }

    console.log(`\nDuplicate tool names: ${duplicateNames.length}`);
    if (duplicateNames.length > 0) {
      console.log("Duplicates:", duplicateNames);
    }

    // Remove duplicates (keep the first one, remove the rest)
    let removedCount = 0;
    for (const name of duplicateNames) {
      const toolsWithName = await toolsCollection
        .find({ name: name })
        .toArray();
      if (toolsWithName.length > 1) {
        // Keep the first one, remove the rest
        const toRemove = toolsWithName.slice(1);
        for (const tool of toRemove) {
          await toolsCollection.deleteOne({ _id: tool._id });
          removedCount++;
          console.log(`Removed duplicate: ${tool.name}`);
        }
      }
    }

    console.log(`\nRemoved ${removedCount} duplicate tools`);

    // Show final results
    console.log("\n=== AFTER CLEANUP ===");
    const finalTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools: ${finalTools.count}`);

    const finalCategories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nFinal categories:");
    finalCategories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

cleanupDatabase();
