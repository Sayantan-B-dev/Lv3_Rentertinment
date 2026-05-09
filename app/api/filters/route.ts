import { NextResponse } from "next/server";
import { getDistinctCategories, getDistinctCities } from "@/lib/services/searchService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const [categories, cities] = await Promise.all([
      getDistinctCategories(),
      getDistinctCities()
    ]);
    
    // Filter out null/empty values
    return apiSuccess({
      categories: categories.filter(Boolean),
      cities: cities.filter(Boolean)
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch filters", 500);
  }
}
