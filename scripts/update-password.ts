import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { getUsersCollection } from "../lib/db";

// Load environment variables first
dotenv.config({ path: ".env.local" });

async function updatePassword() {
  try {
    console.log("🔍 Updating user password...");

    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables");
      console.log("💡 Make sure your .env.local file contains MONGODB_URI");
      return;
    }

    const usersCollection = await getUsersCollection();

    // Your email and new password
    const email = "heylelyaka@gmail.com";
    const newPassword = "#eric-yaka%";

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log("🔐 Hashing password...");
    console.log("📧 Email:", email);
    console.log("🔑 New password:", newPassword);
    console.log("🔒 Hashed password:", hashedPassword);

    // Update the user's password
    const result = await usersCollection.updateOne(
      { email: email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.log("❌ User not found with email:", email);
      return;
    }

    if (result.modifiedCount === 0) {
      console.log("⚠️ Password was already the same");
    } else {
      console.log("✅ Password updated successfully!");
    }

    // Verify the user exists
    const user = await usersCollection.findOne({ email });
    if (user) {
      console.log("✅ User found:", {
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
      });
    }
  } catch (error) {
    console.error("❌ Error updating password:", error);
  } finally {
    process.exit(0);
  }
}

updatePassword();
