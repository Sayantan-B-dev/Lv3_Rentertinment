import { getArtists } from "@/lib/services/artistService";
import ArtistCard from "@/components/ui/ArtistCard";

export default async function CityArtistsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  
  const { artists, total } = await getArtists({ 
    city: decodedCity,
    limit: 100
  });

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div className="artists-header">
        <div>
          <div className="section-label">Location</div>
          <h2 className="section-title">Artists in <span>{decodedCity}</span></h2>
          <p className="section-desc">Showing {artists.length} performers available in this city.</p>
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
