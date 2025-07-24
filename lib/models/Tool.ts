import { ObjectId } from "mongodb";

export interface Tool {
  _id?: ObjectId;
  name: string;
  description: string;
  url: string;
  category: string;
  subcategory?: string;
  tags: string[];
  image?: string;
  logo?: string;
  color?: string;
  featured: boolean;
  pricing: "Free" | "Freemium" | "Paid" | "Enterprise";
  rating: number;
  reviewCount: number;
  pros: string[];
  cons: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: ObjectId;
  status: "active" | "pending" | "inactive";
  views: number;
  clicks: number;
  launchDate?: Date;
  website?: string;
  documentation?: string;
  apiAvailable?: boolean;
  apiUrl?: string;
}

export interface ToolReview {
  _id?: ObjectId;
  toolId: ObjectId;
  userId: ObjectId;
  rating: number;
  review: string;
  pros?: string[];
  cons?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const createTool = (
  toolData: Omit<
    Tool,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "rating"
    | "reviewCount"
    | "views"
    | "clicks"
  >
): Tool => {
  return {
    ...toolData,
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 0,
    reviewCount: 0,
    views: 0,
    clicks: 0,
    status: "pending",
  };
};
