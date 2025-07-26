const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function checkCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Check categories in database
    const categories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nCategories in database:");
    categories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });

    // Check if ai-writing exists
    const writingTools = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nAI Writing tools: ${writingTools.length}`);
    writingTools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });

    // Check total tools
    const totalTools = await toolsCollection.countDocuments();
    console.log(`\nTotal tools: ${totalTools}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkCategories();
