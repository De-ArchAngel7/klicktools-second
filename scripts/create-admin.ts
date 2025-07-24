import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function createAdminUser() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in environment variables");
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({
      email: "heylelyaka@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = {
      email: "heylelyaka@gmail.com",
      name: "Heylel Yaka",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);

    console.log("Admin user created successfully!");
    console.log("Email: heylelyaka@gmail.com");
    console.log("Password: admin123");
    console.log("User ID:", result.insertedId);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await client.close();
  }
}

createAdminUser();
