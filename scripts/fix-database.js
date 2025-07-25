require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function fixDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const usersCollection = db.collection("users");

    // List all indexes
    console.log("Current indexes:");
    const indexes = await usersCollection.indexes();
    indexes.forEach((index) => {
      console.log("-", index.name, ":", index.key);
    });

    // Drop the username index if it exists
    try {
      await usersCollection.dropIndex("username_1");
      console.log("✅ Dropped username_1 index");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️ username_1 index does not exist");
      } else {
        console.error("❌ Error dropping username index:", error.message);
      }
    }

    // Create the correct email index
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log("✅ Created email_1 unique index");
    } catch (error) {
      console.error("❌ Error creating email index:", error.message);
    }

    // List indexes again
    console.log("\nUpdated indexes:");
    const newIndexes = await usersCollection.indexes();
    newIndexes.forEach((index) => {
      console.log("-", index.name, ":", index.key);
    });

    console.log("\n✅ Database fix completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixDatabase();
