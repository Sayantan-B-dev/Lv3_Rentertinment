import { getArtists } from "@/lib/services/artistService";
import Link from "next/link";
import ArtistCard from "@/components/ui/ArtistCard";

export default async function ArtistsPage({ searchParams }: { searchParams: Promise<{ page?: string, category?: string, city?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const { artists, totalPages, total } = await getArtists({ 
    page, 
    category: params.category, 
    city: params.city 
  });

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div className="artists-header">
        <div>
          <div className="section-label">Browse All</div>
          <h2 className="section-title">Discover <span>Artists</span></h2>
          <p className="section-desc">Showing {artists.length} of {total} artists</p>
        </div>
      </div>

      <div className="artists-grid">
        {artists.map((artist, i) => (
          <ArtistCard key={artist.slug} artist={artist} index={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
          {page > 1 && <Link href={`/artists?page=${page - 1}`} className="btn-outline">← Previous</Link>}
          <span style={{ display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`/artists?page=${page + 1}`} className="btn-outline">Next →</Link>}
        </div>
      )}
    </div>
  );
}
