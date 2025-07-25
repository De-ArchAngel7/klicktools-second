import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { getUsersCollection } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "user" } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: [],
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      return NextResponse.json({
        message: "User created successfully",
        user: {
          id: result.insertedId,
          name,
          email,
          role,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
