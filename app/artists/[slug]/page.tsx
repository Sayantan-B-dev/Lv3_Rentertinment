import { getArtistBySlug } from "@/lib/services/artistService";
import { notFound } from "next/navigation";
import { formatDuration, formatTeamSize } from "@/lib/utils/formatters";
import Link from "next/link";

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        
        {/* Left Col: Images */}
        <div>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '1rem' }}>
            <img 
              src={
                artist.media?.images?.[0] 
                  ? (artist.media.images[0].startsWith('http') 
                      ? artist.media.images[0] 
                      : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${artist.media.images[0].startsWith('/') ? artist.media.images[0].slice(1) : artist.media.images[0]}`)
                  : "https://placehold.co/600x400/1a1a1a/d4a017?text=No+Image"
              } 
              alt={artist.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {artist.media?.images?.slice(1, 3).map((img: string, i: number) => (
              <img 
                key={i} 
                src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${img.startsWith('/') ? img.slice(1) : img}`} 
                style={{ width: '100%', borderRadius: 'var(--radius)', aspectRatio: '1', objectFit: 'cover' }} 
                alt={`${artist.name} gallery ${i+1}`} 
              />
            ))}
          </div>
        </div>

        {/* Right Col: Details */}
        <div>
          <div className="section-label">{artist.category}</div>
          <h1 className="section-title">{artist.name}</h1>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text3)' }}>📍 {artist.location?.city || "India"}</span>
            <span style={{ color: 'var(--text3)' }}>⏱ {formatDuration(artist.performance?.duration_minutes?.min, artist.performance?.duration_minutes?.max)}</span>
            <span style={{ color: 'var(--text3)' }}>👥 {formatTeamSize(artist.performance?.team_members?.min, artist.performance?.team_members?.max)}</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About</h3>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{artist.about || "No details provided."}</p>
          </div>

          {artist.performance?.genres && artist.performance.genres.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Genres</h3>
              <div className="artist-genres">
                {artist.performance.genres.map((g: string) => (
                  <span key={g} className="genre-tag">{g}</span>
                ))}
              </div>
            </div>
          )}

          {artist.performance?.languages && artist.performance.languages.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Languages</h3>
              <div className="artist-genres">
                {artist.performance.languages.map((l: string) => (
                  <span key={l} className="genre-tag" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Book {artist.name}</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill out a quick inquiry to get competitive pricing and availability for your event.</p>
            <Link href={`/contact?artist=${artist.slug}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Enquiry ✦</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
