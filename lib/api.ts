import { Tool, SearchFilters } from "@/types";

export interface SearchParams {
  q?: string;
  category?: string;
  sortBy?: "name" | "popularity" | "newest";
  limit?: number;
  featured?: boolean;
}

export async function searchTools(params: SearchParams = {}): Promise<Tool[]> {
  try {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.append("q", params.q);
    if (params.category) searchParams.append("category", params.category);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.featured) searchParams.append("featured", "true");

    const url = `/api/tools?${searchParams.toString()}`;
    console.log("🔍 Searching tools with URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch tools: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Search results:", data.tools?.length || 0, "tools found");
    return data.tools || [];
  } catch (error) {
    console.error("❌ Error searching tools:", error);
    return [];
  }
}

export async function getFeaturedTools(): Promise<Tool[]> {
  return searchTools({ featured: true, limit: 8 });
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  return searchTools({ category, limit: 20 });
}

export interface Category {
  id: string;
  name: string;
  count: number;
  featuredCount: number;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
