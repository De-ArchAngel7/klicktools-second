import { NextResponse } from "next/server";

export async function GET() {
  const envVars = {
    GITHUB_ID: process.env.GITHUB_ID ? "Set" : "Not set",
    GITHUB_SECRET: process.env.GITHUB_SECRET ? "Set" : "Not set",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
  };

  return NextResponse.json({
    message: "OAuth Environment Variables Status",
    environment: process.env.NODE_ENV,
    variables: envVars,
    timestamp: new Date().toISOString(),
  });
}
