"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CategoryGrid() {
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

  const categories = [
    { name: "Singers", icon: "🎤", slug: "singer", count: 64 },
    { name: "Comedians", icon: "🎭", slug: "comedian", count: 47 },
    { name: "Rappers", icon: "🎤", slug: "rapper", count: 40 },
    { name: "DJs", icon: "🎧", slug: "dj", count: 12 },
    { name: "Bollywood", icon: "🎬", slug: "bollywood", count: 28 },
    { name: "TV Artists", icon: "📺", slug: "tv", count: 24 },
    { name: "Speakers", icon: "📣", slug: "speaker", count: 6 },
    { name: "Bands", icon: "🎵", slug: "band", count: 12 },
  ];

  return (
    <section id="categories" ref={containerRef}>
      <div className="section-inner">
        <div className="categories-header reveal">
          <div>
            <div className="section-label">Browse by Type</div>
            <h2 className="section-title">Explore by <span>Category</span></h2>
            <p className="section-desc">Find exactly what your event needs — from intimate Ghazal nights to high-energy concert performances.</p>
          </div>
          <Link href="/artists" className="btn-outline">View All →</Link>
        </div>

        <div className="cat-grid">
          {categories.map((c, i) => (
            <Link key={c.slug} className="cat-card reveal" href={`/category/${c.slug}`} style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="cat-icon">{c.icon}</div>
              <span className="cat-name">{c.name}</span>
              <span className="cat-count">{c.count} Artists</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
