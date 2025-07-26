const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function listAllTools() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();

    console.log(`Total tools: ${allTools.length}`);
    console.log("\nAll tools:");
    allTools.forEach((tool, index) => {
      console.log(
        `${index + 1}. ${tool.name} (${tool.category || "NO CATEGORY"})`
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

listAllTools();
