import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

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

    if (toolsCount === 0) {
      console.log(
        "⚠️  No tools found in database. You may need to run the seed script."
      );
    }

    if (usersCount === 0) {
      console.log(
        "⚠️  No users found in database. You may need to create an admin user."
      );
    }
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  } finally {
    await client.close();
  }
}

testDatabase();
