import { getArtists } from "@/lib/services/artistService";
import Link from "next/link";
import { formatDuration } from "@/lib/utils/formatters";

export default async function ArtistsPage({ searchParams }: { searchParams: { page?: string, category?: string, city?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const { artists, totalPages, total } = await getArtists({ 
    page, 
    category: searchParams.category, 
    city: searchParams.city 
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
        {artists.map((artist) => (
          <Link key={artist.slug} className="artist-card" href={`/artists/${artist.slug}`}>
            <div className="artist-img-wrap">
              <img src={artist.media?.images?.[0] || "/images/placeholder.jpg"} alt={artist.name} loading="lazy" />
              <div className="artist-badge-cat">{artist.category}</div>
              <div className="artist-overlay">
                <button className="artist-overlay-btn">Book Now →</button>
              </div>
            </div>
            <div className="artist-info">
              <div className="artist-name">{artist.name}</div>
              <div className="artist-meta">
                <span className="artist-loc">
                  📍 {artist.location?.city || "India"}
                </span>
              </div>
              <div className="artist-genres">
                {artist.performance?.genres?.slice(0, 3).map((g: string) => (
                  <span key={g} className="genre-tag">{g}</span>
                ))}
              </div>
              <div className="artist-footer">
                <span className="artist-duration">⏱ {formatDuration(artist.performance?.duration_minutes?.min, artist.performance?.duration_minutes?.max)}</span>
                <button className="artist-book-btn">Enquire</button>
              </div>
            </div>
          </Link>
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
