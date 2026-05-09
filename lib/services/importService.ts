import { artistSchemaValidation } from "@/lib/utils/validators";
import Artist from "@/lib/models/Artist";
import { connectToDatabase } from "@/lib/db/connect";
import { slugify } from "@/lib/utils/slugify";

export async function importArtistsFromJSON(data: any[]) {
  await connectToDatabase();
  const summary = { total: data.length, created: 0, updated: 0, failed: 0, errors: [] as any[] };

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    try {
      const result = artistSchemaValidation.safeParse(item);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      const parsed = result.data;
      const slug = parsed.slug || slugify(parsed.name);
      
      const existing = await Artist.findOne({ slug });
      if (existing) {
        Object.assign(existing, parsed);
        await existing.save();
        summary.updated++;
      } else {
        const newArtist = new Artist({ ...parsed, slug });
        await newArtist.save();
        summary.created++;
      }
    } catch (error: any) {
      summary.failed++;
      summary.errors.push({ index: i, name: item.name || "Unknown", error: error.message || "Validation failed" });
    }
  }

  return summary;
}
