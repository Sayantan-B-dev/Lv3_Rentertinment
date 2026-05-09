"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatDuration } from "@/lib/utils/formatters";

export default function FeaturedArtists({ artists }: { artists: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    const els = containerRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="artists" ref={containerRef}>
      <div className="section-inner">
        <div className="artists-header reveal">
          <div>
            <div className="section-label">Handpicked for You</div>
            <h2 className="section-title">Featured <span>Artists</span></h2>
            <p className="section-desc">Top-rated performers trusted by thousands of events across India and globally.</p>
          </div>
          <Link href="/artists" className="btn-outline">All Artists →</Link>
        </div>

        <div className="artists-grid">
          {artists.map((artist, index) => (
            <Link key={artist.slug} className="artist-card reveal" href={`/artists/${artist.slug}`} style={{ transitionDelay: `${index * 0.07}s` }}>
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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg> {artist.location?.city || "India"}
                  </span>
                </div>
                <div className="artist-genres">
                  {artist.performance?.genres?.slice(0, 3).map((g: string) => (
                    <span key={g} className="genre-tag">{g}</span>
                  ))}
                </div>
                <div className="artist-footer">
                  <span className="artist-duration">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                    </svg> {formatDuration(artist.performance?.duration_minutes?.min, artist.performance?.duration_minutes?.max)}
                  </span>
                  <button className="artist-book-btn">Enquire</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
