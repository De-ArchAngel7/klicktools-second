const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

async function fixCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const toolsCollection = db.collection("tools");

    // Fix ContentBot - should be ai-writing
    const contentBotResult = await toolsCollection.updateOne(
      { name: "ContentBot" },
      { $set: { category: "ai-writing" } }
    );
    console.log("Fixed ContentBot category:", contentBotResult.modifiedCount);

    // Fix Wordtune - should be ai-writing
    const wordtuneResult = await toolsCollection.updateOne(
      { name: "Wordtune" },
      { $set: { category: "ai-writing" } }
    );
    console.log("Fixed Wordtune category:", wordtuneResult.modifiedCount);

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
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

fixCategories();
