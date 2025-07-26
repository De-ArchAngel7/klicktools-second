const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://heylelyaka:EHe7er5uIDlmz6jn@klicktools.r9d8lwn.mongodb.net/klicktools?retryWrites=true&w=majority&appName=klicktools";

async function fixCategoriesFinal() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("klicktools");
    const toolsCollection = db.collection("tools");

    const categoryFixes = [
      { name: "Jasper", category: "ai-writing" },
      { name: "Copy.ai", category: "ai-writing" },
      { name: "Grammarly", category: "ai-writing" },
    ];

    for (const fix of categoryFixes) {
      const result = await toolsCollection.updateOne(
        { name: fix.name },
        { $set: { category: fix.category } }
      );
      console.log(`Fixed ${fix.name}: ${result.modifiedCount} updated`);
    }

    // Add missing AI Writing tools
    const writingTools = [
      {
        name: "Writesonic",
        description: "AI writing platform for blogs, ads, and business content",
        url: "https://writesonic.com",
        category: "ai-writing",
        subcategory: "Content Writing",
        tags: ["AI", "Writing", "Blogging", "Marketing", "SEO"],
        featured: true,
        pricing: "Freemium",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Writesonic_logo.svg",
        color: "#8b5cf6",
        pros: [
          "SEO optimized",
          "Blog writing",
          "Multiple languages",
          "Templates",
        ],
        cons: ["Limited free credits", "Quality varies", "Requires editing"],
        features: [
          "Blog articles",
          "Landing pages",
          "Product descriptions",
          "SEO content",
        ],
        status: "active",
        website: "https://writesonic.com",
        documentation: "https://writesonic.com/docs",
        apiAvailable: true,
        apiUrl: "https://writesonic.com/api",
        rating: 4.4,
        reviewCount: 1100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ProWritingAid",
        description: "Comprehensive writing editor with AI-powered suggestions",
        url: "https://prowritingaid.com",
        category: "ai-writing",
        subcategory: "Writing Assistant",
        tags: ["AI", "Writing", "Editing", "Grammar", "Style"],
        featured: false,
        pricing: "Paid",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/ProWritingAid_logo.svg",
        color: "#dc2626",
        pros: [
          "Comprehensive editing",
          "Detailed reports",
          "Multiple integrations",
          "Academic focus",
        ],
        cons: ["Expensive", "Complex interface", "No free tier"],
        features: [
          "Grammar checking",
          "Style analysis",
          "Readability scores",
          "Writing reports",
        ],
        status: "active",
        website: "https://prowritingaid.com",
        documentation: "https://prowritingaid.com/help",
        apiAvailable: false,
        rating: 4.2,
        reviewCount: 450,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hemingway Editor",
        description: "Writing app that makes your writing bold and clear",
        url: "https://hemingwayapp.com",
        category: "ai-writing",
        subcategory: "Writing Assistant",
        tags: ["AI", "Writing", "Clarity", "Style", "Editing"],
        featured: false,
        pricing: "Freemium",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Hemingway_Editor_logo.svg",
        color: "#f59e0b",
        pros: [
          "Improves clarity",
          "Simple interface",
          "Free web version",
          "Readability focus",
        ],
        cons: ["Limited features", "No grammar check", "Basic AI"],
        features: [
          "Readability analysis",
          "Style suggestions",
          "Sentence structure",
          "Word choice",
        ],
        status: "active",
        website: "https://hemingwayapp.com",
        documentation: "https://hemingwayapp.com/help",
        apiAvailable: false,
        rating: 4.1,
        reviewCount: 320,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "QuillBot",
        description: "AI-powered paraphrasing and writing tool",
        url: "https://quillbot.com",
        category: "ai-writing",
        subcategory: "Writing Assistant",
        tags: ["AI", "Paraphrasing", "Writing", "Grammar", "Translation"],
        featured: false,
        pricing: "Freemium",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/QuillBot_logo.svg",
        color: "#3b82f6",
        pros: [
          "Excellent paraphrasing",
          "Grammar checker",
          "Free tier",
          "Multiple languages",
        ],
        cons: [
          "Limited creativity",
          "Repetitive suggestions",
          "Premium expensive",
        ],
        features: [
          "Paraphrasing",
          "Grammar checking",
          "Summarizer",
          "Citation generator",
        ],
        status: "active",
        website: "https://quillbot.com",
        documentation: "https://quillbot.com/help",
        apiAvailable: true,
        apiUrl: "https://quillbot.com/api",
        rating: 4.0,
        reviewCount: 280,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rytr",
        description:
          "AI writing assistant for content creation and copywriting",
        url: "https://rytr.me",
        category: "ai-writing",
        subcategory: "Content Writing",
        tags: ["AI", "Writing", "Content", "Copywriting", "Marketing"],
        featured: false,
        pricing: "Freemium",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Rytr_logo.svg",
        color: "#10b981",
        pros: [
          "Affordable",
          "Multiple use cases",
          "SEO optimized",
          "Templates",
        ],
        cons: ["Limited creativity", "Quality varies", "Basic interface"],
        features: [
          "Blog writing",
          "Marketing copy",
          "Email campaigns",
          "Social media",
        ],
        status: "active",
        website: "https://rytr.me",
        documentation: "https://rytr.me/help",
        apiAvailable: true,
        apiUrl: "https://rytr.me/api",
        rating: 3.9,
        reviewCount: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ContentBot",
        description: "AI content generator for blogs, articles, and marketing",
        url: "https://contentbot.ai",
        category: "ai-writing",
        subcategory: "Content Writing",
        tags: ["AI", "Content", "Blogging", "Marketing", "SEO"],
        featured: false,
        pricing: "Paid",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/ContentBot_logo.svg",
        color: "#7c3aed",
        pros: [
          "Long-form content",
          "SEO focused",
          "Research integration",
          "High quality",
        ],
        cons: ["Expensive", "No free tier", "Limited templates"],
        features: [
          "Blog articles",
          "Research papers",
          "SEO content",
          "Content planning",
        ],
        status: "active",
        website: "https://contentbot.ai",
        documentation: "https://contentbot.ai/docs",
        apiAvailable: true,
        apiUrl: "https://contentbot.ai/api",
        rating: 3.8,
        reviewCount: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Wordtune",
        description:
          "AI writing assistant that helps you express your ideas better",
        url: "https://wordtune.com",
        category: "ai-writing",
        subcategory: "Writing Assistant",
        tags: ["AI", "Writing", "Expression", "Style", "Clarity"],
        featured: false,
        pricing: "Freemium",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Wordtune_logo.svg",
        color: "#ef4444",
        pros: [
          "Improves expression",
          "Browser integration",
          "Free tier",
          "Multiple styles",
        ],
        cons: ["Limited features", "Requires context", "Premium expensive"],
        features: [
          "Sentence rewriting",
          "Tone adjustment",
          "Style suggestions",
          "Clarity improvement",
        ],
        status: "active",
        website: "https://wordtune.com",
        documentation: "https://wordtune.com/help",
        apiAvailable: true,
        apiUrl: "https://wordtune.com/api",
        rating: 3.7,
        reviewCount: 95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Add new tools
    for (const tool of writingTools) {
      const existing = await toolsCollection.findOne({ name: tool.name });
      if (!existing) {
        await toolsCollection.insertOne(tool);
        console.log(`Added ${tool.name}`);
      } else {
        console.log(`${tool.name} already exists`);
      }
    }

    // Check final categories
    const categories = await toolsCollection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nFinal Categories:");
    categories.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} tools`);
    });

    // Check AI Writing tools
    const writingToolsFinal = await toolsCollection
      .find({ category: "ai-writing" })
      .toArray();
    console.log(`\nAI Writing tools: ${writingToolsFinal.length}`);
    writingToolsFinal.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

fixCategoriesFinal();
