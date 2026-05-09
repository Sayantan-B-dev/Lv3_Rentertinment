import { NextResponse } from "next/server";
import { getArtists, deleteArtist } from "@/lib/services/artistService";
import { searchArtists } from "@/lib/services/searchService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined;

    if (q) {
      const results = await searchArtists(q, { category, city });
      // searchArtists returns array, we normalize to match getArtists structure for dashboard
      return apiSuccess({ artists: results, total: results.length, page: 1, totalPages: 1 });
    }

    const data = await getArtists({ category, city, page, limit, featured });
    return apiSuccess(data);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch artists", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids)) {
      return apiError("Invalid IDs provided", 400);
    }

    const results = await Promise.all(ids.map(id => deleteArtist(id)));
    return apiSuccess({ deletedCount: results.length });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete artists", 500);
  }
}
