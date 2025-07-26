const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

async function checkSpecificTools() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const toolsCollection = db.collection("tools");

    // Check specific tools
    const toolNames = [
      "Hemingway Editor",
      "QuillBot",
      "Rytr",
      "ContentBot",
      "Wordtune",
    ];

    for (const name of toolNames) {
      const tool = await toolsCollection.findOne({ name: name });
      if (tool) {
        console.log(`${name}: category = ${tool.category || "MISSING"}`);
      } else {
        console.log(`${name}: NOT FOUND`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkSpecificTools();
