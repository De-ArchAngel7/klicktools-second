const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/?retryWrites=true&w=majority&appName=klicktools";

const tools = [
  {
    name: "ChatGPT",
    description:
      "Advanced AI language model for conversation and text generation",
    category: "Chat & Language Models",
    pricing: "Freemium",
    rating: 4.8,
    reviewCount: 1250,
    featured: true,
    status: "Active",
    apiAvailable: true,
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    color: "#10a37f",
    tags: ["AI", "Chat", "Language", "OpenAI"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Midjourney",
    description: "AI-powered image generation from text descriptions",
    category: "Image Generation",
    pricing: "Paid",
    rating: 4.7,
    reviewCount: 890,
    featured: true,
    status: "Active",
    apiAvailable: false,
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
    color: "#ff6b6b",
    tags: ["AI", "Image", "Generation", "Art"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Notion AI",
    description: "AI-powered workspace for notes, docs, and collaboration",
    category: "Productivity",
    pricing: "Freemium",
    rating: 4.6,
    reviewCount: 650,
    featured: true,
    status: "Active",
    apiAvailable: true,
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    color: "#000000",
    tags: ["Productivity", "Notes", "Collaboration", "AI"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "GitHub Copilot",
    description: "AI-powered code completion and pair programming",
    category: "Development",
    pricing: "Paid",
    rating: 4.5,
    reviewCount: 720,
    featured: true,
    status: "Active",
    apiAvailable: true,
    logo: "https://github.githubassets.com/images/modules/copilot/cp-head-square.png",
    color: "#2ea44f",
    tags: ["Development", "Code", "AI", "GitHub"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Canva",
    description:
      "AI-powered design platform for creating graphics and presentations",
    category: "Design",
    pricing: "Freemium",
    rating: 4.4,
    reviewCount: 1100,
    featured: true,
    status: "Active",
    apiAvailable: false,
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    color: "#00c4cc",
    tags: ["Design", "Graphics", "AI", "Presentation"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db();
    const toolsCollection = db.collection("tools");

    // Clear existing tools
    await toolsCollection.deleteMany({});
    console.log("🗑️  Cleared existing tools");

    // Insert new tools
    const result = await toolsCollection.insertMany(tools);
    console.log(`✅ Inserted ${result.insertedCount} tools successfully!`);

    // Create indexes
    await toolsCollection.createIndex({ name: 1 });
    await toolsCollection.createIndex({ category: 1 });
    await toolsCollection.createIndex({ featured: 1 });
    await toolsCollection.createIndex({ rating: -1 });
    console.log("✅ Created database indexes");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
