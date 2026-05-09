"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatDuration } from "@/lib/utils/formatters";
import ArtistCard from "@/components/ui/ArtistCard";

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
            <ArtistCard key={artist.slug} artist={artist} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
