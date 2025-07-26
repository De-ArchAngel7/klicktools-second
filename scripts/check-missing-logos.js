const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function checkMissingLogos() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    // Get all tools
    const allTools = await toolsCollection.find({}).toArray();
    console.log(`Total tools: ${allTools.length}`);

    // Check for tools without logos
    const toolsWithoutLogos = allTools.filter(
      (tool) => !tool.logo || tool.logo === ""
    );
    console.log(`\nTools without logos: ${toolsWithoutLogos.length}`);

    if (toolsWithoutLogos.length > 0) {
      console.log("\nTools missing logos:");
      toolsWithoutLogos.forEach((tool) => {
        console.log(`- ${tool.name} (Category: ${tool.category})`);
      });
    }

    // Check featured tools specifically
    const featuredTools = allTools.filter((tool) => tool.featured === true);
    console.log(`\nFeatured tools: ${featuredTools.length}`);

    const featuredWithoutLogos = featuredTools.filter(
      (tool) => !tool.logo || tool.logo === ""
    );
    console.log(`Featured tools without logos: ${featuredWithoutLogos.length}`);

    if (featuredWithoutLogos.length > 0) {
      console.log("\nFeatured tools missing logos:");
      featuredWithoutLogos.forEach((tool) => {
        console.log(`- ${tool.name} (Category: ${tool.category})`);
      });
    }

    // Show all featured tools
    console.log("\nAll featured tools:");
    featuredTools.forEach((tool) => {
      const hasLogo = tool.logo && tool.logo !== "";
      console.log(
        `- ${tool.name} (${tool.category}) - Logo: ${hasLogo ? "✓" : "✗"}`
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkMissingLogos();
