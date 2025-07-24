import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToolsCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if tool exists
    const existingTool = await toolsCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!existingTool) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    // Check if another tool with same name exists (excluding current tool)
    const duplicateTool = await toolsCollection.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: new ObjectId(params.id) },
    });

    if (duplicateTool) {
      return NextResponse.json(
        { message: "A tool with this name already exists" },
        { status: 409 }
      );
    }

    // Update tool
    const updateData = {
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
      updatedAt: new Date(),
    };

    const result = await toolsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Tool updated successfully",
    });
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if tool exists
    const existingTool = await toolsCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!existingTool) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    // Delete tool
    const result = await toolsCollection.deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Tool deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
