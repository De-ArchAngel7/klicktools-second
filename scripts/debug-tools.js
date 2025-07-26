const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

async function debugTools() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const toolsCollection = db.collection("tools");

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools: ${allTools.length}`);

    // Check each tool's category
    console.log("\nTools and their categories:");
    allTools.forEach((tool) => {
      console.log(`${tool.name}: ${tool.category || "NO CATEGORY"}`);
    });

    // Check AI Writing tools specifically
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nAI Writing tools found: ${writingTools.length}`);
    writingTools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

debugTools();
