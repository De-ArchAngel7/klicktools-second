const { MongoClient } = require("mongodb");

// Test environment variables
console.log("🔍 Testing OAuth Environment Variables:");
console.log("=====================================");

// Check if environment variables are loaded
const envVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
};

Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${key.includes("SECRET") ? "***SET***" : value}`);
  } else {
    console.log(`❌ ${key}: NOT SET`);
  }
});

console.log("\n🔗 OAuth Callback URLs:");
console.log("======================");
console.log(`Google: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
console.log(`GitHub: ${process.env.NEXTAUTH_URL}/api/auth/callback/github`);

console.log("\n📋 Next Steps:");
console.log("==============");
console.log("1. Make sure these URLs are added to your OAuth providers:");
console.log(
  `   - Google: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);
console.log(
  `   - GitHub: ${process.env.NEXTAUTH_URL}/api/auth/callback/github`
);
console.log("2. For Google: Add your email as a test user if in testing mode");
console.log("3. For GitHub: Make sure the callback URL is exactly correct");
