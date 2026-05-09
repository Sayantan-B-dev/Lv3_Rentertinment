import { getArtists } from "@/lib/services/artistService";
import ArtistCard from "@/components/ui/ArtistCard";
import { notFound } from "next/navigation";

export default async function CategoryArtistsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  const { artists, total } = await getArtists({ 
    category: decodedCategory,
    limit: 100
  });

  if (artists.length === 0) {
    // We could either show 404 or just an empty state. Let's show the page with empty state.
  }

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
          <ArtistCard key={artist.slug} artist={artist} index={i} />
        ))}
      </div>
    </div>
  );
}
