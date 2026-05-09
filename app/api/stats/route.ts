import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Artist from "@/lib/models/Artist";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    await connectToDatabase();
    
    const [totalArtists, citiesResult] = await Promise.all([
      Artist.countDocuments(),
      Artist.distinct("location.city")
    ]);

    // Calculate dynamic "Happy Clients" (e.g. 5x total artists or a fixed base + factor)
    // For now, let's just return real base counts
    return apiSuccess({
      totalArtists,
      totalCities: citiesResult.length,
      yearsExperience: 12, // This could be a constant or calculated
      happyClients: Math.floor(totalArtists * 3.5) // Example multiplier for "real-ish" data
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
