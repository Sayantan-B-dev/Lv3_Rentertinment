import { searchArtists } from "@/lib/services/searchService";
import Link from "next/link";
import ArtistCard from "@/components/ui/ArtistCard";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, category?: string, city?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";
  const artists = q ? await searchArtists(q, { category: params.category, city: params.city }) : [];

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div className="artists-header">
        <div>
          <div className="section-label">Search Results</div>
          <h2 className="section-title">Results for <span>"{q}"</span></h2>
          <p className="section-desc">Found {artists.length} artists matching your search.</p>
        </div>
      </div>

      {artists.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text2)' }}>
          <p>No artists found. Try adjusting your search query or filters.</p>
          <Link href="/artists" className="btn-outline" style={{ marginTop: '1rem' }}>Browse All Artists</Link>
        </div>
      ) : (
        <div className="artists-grid">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.slug} artist={artist} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
