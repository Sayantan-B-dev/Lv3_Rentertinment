import Artist from "@/lib/models/Artist";
import { connectToDatabase } from "@/lib/db/connect";
import { slugify } from "@/lib/utils/slugify";

export async function getArtists(params: { category?: string; city?: string; page?: number; limit?: number; featured?: boolean }) {
  await connectToDatabase();
  const filter: any = {};
  if (params.category) filter["search.category_lower"] = params.category.toLowerCase();
  if (params.city) filter["search.city_lower"] = params.city.toLowerCase();
  if (params.featured !== undefined) filter.featured = params.featured;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(24, params.limit || 12);
  const skip = (page - 1) * limit;

  const [artists, total] = await Promise.all([
    Artist.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Artist.countDocuments(filter)
  ]);
  return { artists, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getArtistBySlug(slug: string) {
  await connectToDatabase();
  return Artist.findOne({ slug }).lean();
}

export async function getArtistById(id: string) {
  await connectToDatabase();
  return Artist.findById(id).lean();
}

export async function createArtist(data: any) {
  await connectToDatabase();
  if (!data.slug) {
    data.slug = slugify(data.name);
  }
  return Artist.create(data);
}

export async function updateArtist(id: string, data: any) {
  await connectToDatabase();
  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }
  const artist = await Artist.findById(id);
  if (!artist) throw new Error("Artist not found");

  Object.assign(artist, data);
  await artist.save(); // triggers pre-save hook
  return artist;
}

export async function deleteArtist(id: string) {
  await connectToDatabase();
  return Artist.findByIdAndDelete(id);
}
