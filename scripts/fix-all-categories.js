const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

async function fixAllCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const toolsCollection = db.collection("tools");

    // Fix missing categories
    const updates = [
      { name: "Hemingway Editor", category: "ai-writing" },
      { name: "QuillBot", category: "ai-writing" },
      { name: "Rytr", category: "ai-writing" },
      { name: "ContentBot", category: "ai-writing" },
      { name: "Wordtune", category: "ai-writing" },
    ];

    for (const update of updates) {
      const result = await toolsCollection.updateOne(
        { name: update.name },
        { $set: { category: update.category } }
      );
      console.log(`Fixed ${update.name}: ${result.modifiedCount} updated`);
    }

    // Check categories again
    const categories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nUpdated Categories:");
    categories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });

    // Check AI Writing tools
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nAI Writing tools: ${writingTools.length}`);
    writingTools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

fixAllCategories();
