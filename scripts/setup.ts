import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local BEFORE any other imports
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Debug: Check if environment variables are loaded
console.log("🔍 Environment check:");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

async function setup() {
  try {
    console.log("🚀 Setting up KlickTools database...");

    // Dynamically import database modules after environment variables are loaded
    const { initializeDatabase } = await import("../lib/db");
    const { seedDatabase } = await import("../lib/seed");

    // Initialize database (create indexes)
    await initializeDatabase();

    // Seed database with initial data
    await seedDatabase();

    console.log("✅ Database setup completed successfully!");
    console.log("");
    console.log("📋 Next steps:");
    console.log('1. Run "yarn dev" to start the development server');
    console.log("");
    console.log("🔑 Default admin credentials:");
    console.log("Email: admin@klicktools.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setup();
