import { getArtists } from "@/lib/services/artistService";
import { getUserFavorites } from "@/lib/services/userService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import ArtistCard from "@/components/ui/ArtistCard";
import { notFound } from "next/navigation";

export default async function CategoryArtistsPage({ params }: { params: Promise<{ category: string }> }) {
  const [{ category }, session] = await Promise.all([
    params,
    getServerSession(authOptions)
  ]);
  
  const decodedCategory = decodeURIComponent(category);
  const { artists, total } = await getArtists({ 
    category: decodedCategory,
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
