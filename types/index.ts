import "next-auth";

export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role: "user" | "admin";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

export interface SearchFilters {
  category?: string;
  pricing?: string;
  rating?: number;
  status?: string;
}

export interface Tool {
  _id?: string;
  name: string;
  description: string;
  url: string;
  category: string;
  subcategory?: string;
  tags: string[];
  featured: boolean;
  pricing: "Free" | "Freemium" | "Paid";
  logo?: string;
  color?: string;
  rating?: number;
  reviewCount?: number;
  pros?: string[];
  cons?: string[];
  features?: string[];
  status: "active" | "inactive" | "beta";
  website?: string;
  documentation?: string;
  apiAvailable?: boolean;
  apiUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  _id?: string;
  toolId: string;
  userId: string;
  userEmail: string; // Added for easier querying
  rating: number;
  comment?: string;
  toolName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  _id?: string;
  toolId: string;
  userEmail: string;
  toolName: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// NextAuth.js type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: "user" | "admin";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: "user" | "admin";
  }
}
