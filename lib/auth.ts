import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsersCollection } from "@/lib/db";
const bcrypt = require("bcryptjs");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const usersCollection = await getUsersCollection();
          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: (user as any).name || "",
            role: user.role,
            image: (user as any).image || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const usersCollection = await getUsersCollection();
          const existingUser = await usersCollection.findOne({
            email: user.email?.toLowerCase(),
          });

          if (!existingUser) {
            // Create new user from OAuth
            await usersCollection.insertOne({
              email: user.email?.toLowerCase(),
              name: user.name || "",
              image: user.image || "",
              role: "user",
              favorites: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error("OAuth signin error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
