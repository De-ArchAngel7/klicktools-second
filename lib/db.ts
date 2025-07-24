import { MongoClient, Db } from "mongodb";
import clientPromise from "./mongodb";

let db: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = await clientPromise;
    db = client.db("klicktools");
  }
  return db;
}

export async function getUsersCollection() {
  const database = await getDatabase();
  return database.collection("users");
}

export async function getToolsCollection() {
  const database = await getDatabase();
  return database.collection("tools");
}

export async function getReviewsCollection() {
  const database = await getDatabase();
  return database.collection("reviews");
}

export async function getFavoritesCollection() {
  const database = await getDatabase();
  return database.collection("favorites");
}

export async function initializeDatabase() {
  const database = await getDatabase();

  // Create indexes for better performance
  await database
    .collection("users")
    .createIndex({ email: 1 }, { unique: true });
  await database.collection("tools").createIndex({ name: 1 });
  await database.collection("tools").createIndex({ category: 1 });
  await database.collection("tools").createIndex({ tags: 1 });
  await database.collection("reviews").createIndex({ toolId: 1 });
  await database.collection("reviews").createIndex({ userId: 1 });
  await database.collection("favorites").createIndex({ userEmail: 1 });
  await database.collection("favorites").createIndex({ toolId: 1 });

  console.log("Database indexes created successfully");
}
