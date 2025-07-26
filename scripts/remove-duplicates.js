const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function removeDuplicates() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Get all AI Writing tools
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`Found ${writingTools.length} AI Writing tools`);

    // Group by name to find duplicates
    const groupedByName = {};
    writingTools.forEach((tool) => {
      if (!groupedByName[tool.name]) {
        groupedByName[tool.name] = [];
      }
      groupedByName[tool.name].push(tool);
    });

    // Remove duplicates, keeping the first one
    let removedCount = 0;
    for (const [name, tools] of Object.entries(groupedByName)) {
      if (tools.length > 1) {
        console.log(`Found ${tools.length} duplicates for "${name}"`);

        // Keep the first one, remove the rest
        const toRemove = tools.slice(1);
        for (const tool of toRemove) {
          await toolsCollection.deleteOne({ _id: tool._id });
          removedCount++;
          console.log(`Removed duplicate: ${tool.name} (${tool._id})`);
        }
      }
    }

    console.log(`\nRemoved ${removedCount} duplicate tools`);

    // Verify the result
    const remainingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nRemaining AI Writing tools: ${remainingTools.length}`);
    remainingTools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

removeDuplicates();
