import { NextResponse } from "next/server";
import { getArtistBySlug } from "@/lib/services/artistService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const artist = await getArtistBySlug(params.slug);
    if (!artist) {
      return apiError("Artist not found", 404);
    }
    return apiSuccess(artist);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch artist", 500);
  }
}
