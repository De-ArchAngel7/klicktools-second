import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToolsCollection } from "@/lib/db";
import { createTool } from "@/lib/models/Tool";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      url,
      category,
      subcategory,
      tags,
      logo,
      color,
      featured,
      pricing,
      website,
      documentation,
      apiAvailable,
      apiUrl,
      pros,
      cons,
      features,
    } = body;

    // Validate required fields
    if (!name || !description || !url || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const toolsCollection = await getToolsCollection();

    // Check if tool with same name already exists
    const existingTool = await toolsCollection.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingTool) {
      return NextResponse.json(
        { message: "A tool with this name already exists" },
        { status: 409 }
      );
    }

    // Create new tool
    const newTool = createTool({
      name,
      description,
      url,
      category,
      subcategory,
      tags: tags || [],
      logo,
      color,
      featured: featured || false,
      pricing: pricing || "Freemium",
      website,
      documentation,
      apiAvailable: apiAvailable || false,
      apiUrl,
      pros: pros || [],
      cons: cons || [],
      features: features || [],
      status: "active",
      createdBy: session.user.id as any,
    });

    const result = await toolsCollection.insertOne(newTool);

    return NextResponse.json(
      {
        message: "Tool created successfully",
        tool: { ...newTool, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const toolsCollection = await getToolsCollection();
    const tools = await toolsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
