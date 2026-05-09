import { NextResponse } from "next/server";
import { searchArtists } from "@/lib/services/searchService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;

    if (!q) {
      return apiError("Search query 'q' is required", 400);
    }

    const data = await searchArtists(q, { category, city });
    return apiSuccess(data);
  } catch (error: any) {
    return apiError(error.message || "Failed to search artists", 500);
  }
}
