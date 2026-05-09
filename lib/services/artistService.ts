import Artist from "@/lib/models/Artist";
import { connectToDatabase } from "@/lib/db/connect";
import { slugify } from "@/lib/utils/slugify";

export async function getArtists(params: { category?: string; city?: string; page?: number; limit?: number; featured?: boolean; q?: string }) {
  await connectToDatabase();
  
  const conditions: any[] = [];
  
  if (params.q) {
    conditions.push({ $text: { $search: params.q } });
  }

  if (params.category) {
    conditions.push({
      $or: [
        { "search.category_lower": params.category.toLowerCase() },
        { category: { $regex: new RegExp(`^${params.category}$`, "i") } }
      ]
    });
  }

  if (params.city) {
    conditions.push({
      $or: [
        { "search.city_lower": params.city.toLowerCase() },
        { "location.city": { $regex: new RegExp(`^${params.city}$`, "i") } }
      ]
    });
  }

  if (params.featured !== undefined) {
    conditions.push({ featured: params.featured });
  }

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(24, params.limit || 12);
  const skip = (page - 1) * limit;

  const query = Artist.find(filter);
  
  if (params.q) {
    query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
  } else {
    query.sort({ createdAt: -1 });
  }

  const [artists, total] = await Promise.all([
    query.skip(skip).limit(limit).lean(),
    Artist.countDocuments(filter)
  ]);
  console.log(`getArtists found ${artists.length} artists of total ${total} for filter:`, JSON.stringify(filter));
  if (artists.length > 0) {
    console.log("DEBUG: Artist keys:", Object.keys(artists[0]));
    console.log("DEBUG: First artist media:", JSON.stringify(artists[0].media, null, 2));
    if (!artists[0].media || !artists[0].media.images || artists[0].media.images.length === 0) {
       console.log("DEBUG: NO IMAGES FOUND IN media.images. Checking for images in other fields...");
       console.log("DEBUG: Full artist object snapshot:", JSON.stringify(artists[0], (key, value) => key === 'about' ? '...' : value, 2));
    }
  }
  
  return JSON.parse(JSON.stringify({ 
    artists, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  }));
}

export async function getArtistBySlug(slug: string) {
  await connectToDatabase();
  const artist = await Artist.findOne({ slug }).lean();
  return artist ? JSON.parse(JSON.stringify(artist)) : null;
}

export async function getArtistById(id: string) {
  await connectToDatabase();
  const artist = await Artist.findById(id).lean();
  return artist ? JSON.parse(JSON.stringify(artist)) : null;
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
