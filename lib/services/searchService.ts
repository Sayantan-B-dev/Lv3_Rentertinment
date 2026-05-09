import Artist from "@/lib/models/Artist";
import { connectToDatabase } from "@/lib/db/connect";

export async function searchArtists(q: string, filters?: { category?: string; city?: string }) {
  await connectToDatabase();
  const query: any = { $text: { $search: q } };
  if (filters?.category) query["search.category_lower"] = filters.category.toLowerCase();
  if (filters?.city) query["search.city_lower"] = filters.city.toLowerCase();
  
  return Artist.find(query, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .lean();
}

export async function getDistinctCategories() {
  await connectToDatabase();
  return Artist.distinct("category");
}

export async function getDistinctCities() {
  await connectToDatabase();
  return Artist.distinct("location.city");
}
