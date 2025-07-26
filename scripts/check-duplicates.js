const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function checkDuplicates() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Check all AI Writing tools
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nTotal AI Writing tools: ${writingTools.length}`);

    // Check for duplicates by name
    const toolNames = writingTools.map((tool) => tool.name);
    const uniqueNames = [...new Set(toolNames)];

    console.log(`\nUnique tool names: ${uniqueNames.length}`);
    console.log(`Duplicate names: ${toolNames.length - uniqueNames.length}`);

    // Show all AI Writing tools
    console.log("\nAll AI Writing tools:");
    writingTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (ID: ${tool._id})`);
    });

    // Check for exact duplicates
    const duplicates = [];
    for (let i = 0; i < writingTools.length; i++) {
      for (let j = i + 1; j < writingTools.length; j++) {
        if (writingTools[i].name === writingTools[j].name) {
          duplicates.push({
            name: writingTools[i].name,
            id1: writingTools[i]._id,
            id2: writingTools[j]._id,
          });
        }
      }
    }

    if (duplicates.length > 0) {
      console.log("\nDuplicate entries found:");
      duplicates.forEach((dup) => {
        console.log(`- ${dup.name}: ${dup.id1} and ${dup.id2}`);
      });
    } else {
      console.log("\nNo exact duplicates found");
    }

    // Check categories
    const categories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nAll categories:");
    categories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkDuplicates();
