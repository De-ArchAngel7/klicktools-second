const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

const logoUpdates = {
  Lumen5:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lumen5_logo.svg/1200px-Lumen5_logo.svg.png",
  Tome: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Tome_logo.svg/1200px-Tome_logo.svg.png",
  Gamma:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gamma_logo.svg/1200px-Gamma_logo.svg.png",
  Midjourney:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_logo.svg/1200px-Midjourney_logo.svg.png",
  "Stable Diffusion":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Stable_Diffusion_logo.svg/1200px-Stable_Diffusion_logo.svg.png",
  "Pika Labs":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pika_Labs_logo.svg/1200px-Pika_Labs_logo.svg.png",
  Mubert:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mubert_logo.svg/1200px-Mubert_logo.svg.png",
  Descript:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Descript_logo.svg/1200px-Descript_logo.svg.png",
  "Babylon Health":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Babylon_Health_logo.svg/1200px-Babylon_Health_logo.svg.png",
  "Playground AI":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Playground_AI_logo.svg/1200px-Playground_AI_logo.svg.png",
};

async function updateLogos() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    let updatedCount = 0;

    for (const [toolName, newLogoUrl] of Object.entries(logoUpdates)) {
      const result = await toolsCollection.updateOne(
        { name: toolName },
        { $set: { logo: newLogoUrl } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated logo for ${toolName}`);
        updatedCount++;
      } else {
        console.log(`❌ Tool ${toolName} not found`);
      }
    }

    console.log(`\nUpdated ${updatedCount} tools with new logo URLs`);

    // Check featured tools
    const featuredTools = await toolsCollection
      .find({ featured: true })
      .toArray();
    console.log(`\nFeatured tools (${featuredTools.length}):`);
    featuredTools.forEach((tool) => {
      const hasLogo = tool.logo && tool.logo !== "";
      console.log(`- ${tool.name}: ${hasLogo ? "✓" : "✗"} logo`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

updateLogos();
