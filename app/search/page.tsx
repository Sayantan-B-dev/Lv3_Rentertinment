import { searchArtists } from "@/lib/services/searchService";
import Link from "next/link";
import { formatDuration } from "@/lib/utils/formatters";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string, category?: string, city?: string } }) {
  const q = searchParams.q || "";
  const artists = q ? await searchArtists(q, { category: searchParams.category, city: searchParams.city }) : [];

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
      )}
    </div>
  );
}
