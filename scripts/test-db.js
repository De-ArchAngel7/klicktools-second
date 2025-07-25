const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

async function testDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db();
    const toolsCollection = db.collection("tools");
    const categoriesCollection = db.collection("categories");
    const usersCollection = db.collection("users");

    // Check if collections exist and have data
    const toolsCount = await toolsCollection.countDocuments();
    const categoriesCount = await categoriesCollection.countDocuments();
    const usersCount = await usersCollection.countDocuments();

    console.log(`📊 Database Statistics:`);
    console.log(`   Tools: ${toolsCount}`);
    console.log(`   Categories: ${categoriesCount}`);
    console.log(`   Users: ${usersCount}`);

    if (toolsCount > 0) {
      console.log("✅ Tools found in database!");
      const tools = await toolsCollection.find({}).limit(3).toArray();
      console.log("Sample tools:");
      tools.forEach((tool) => {
        console.log(`   - ${tool.name} (${tool.category})`);
      });
    }
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  } finally {
    await client.close();
  }
}

testDatabase();
