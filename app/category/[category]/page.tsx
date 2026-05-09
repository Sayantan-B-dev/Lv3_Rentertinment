import { getArtists } from "@/lib/services/artistService";
import { getUserFavorites } from "@/lib/services/userService";
import { getDistinctCategories, getDistinctCities } from "@/lib/services/searchService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import ArtistCard from "@/components/ui/ArtistCard";
import ArtistFilterBar from "@/components/ui/ArtistFilterBar";
import { notFound } from "next/navigation";

export default async function CategoryArtistsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ q?: string, city?: string }>
}) {
  const [{ category }, sParams, session, categories, cities] = await Promise.all([
    params,
    searchParams,
    getServerSession(authOptions),
    getDistinctCategories(),
    getDistinctCities()
  ]);
  
  const decodedCategory = decodeURIComponent(category);
  const { artists, total } = await getArtists({ 
    category: decodedCategory,
    q: sParams.q,
    city: sParams.city,
    limit: 100
  });

  const favorites = session?.user ? await getUserFavorites((session.user as any).id) : [];

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div className="artists-header">
        <div>
          <div className="section-label">Category</div>
          <h2 className="section-title"><span>{decodedCategory}</span> Artists</h2>
          <p className="section-desc">Showing {artists.length} of {total} results for this category.</p>
        </div>
      </div>

      <ArtistFilterBar categories={categories} cities={cities} basePath={`/category/${category}`} />

      <div className="artists-grid">
        {artists.map((artist, i) => (
          <ArtistCard 
            key={artist.slug} 
            artist={artist} 
            index={i} 
            initialIsFavorite={favorites.includes(artist._id.toString())} 
          />
        ))}
      </div>
    </div>
  );
}
