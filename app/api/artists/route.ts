import { NextResponse } from "next/server";
import { getArtists } from "@/lib/services/artistService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined;

    const data = await getArtists({ category, city, page, limit, featured });
    return apiSuccess(data);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch artists", 500);
  }
}
