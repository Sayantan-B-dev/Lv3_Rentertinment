"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CategoryGrid({ counts = {} }: { counts?: Record<string, number> }) {
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
    { 
      name: "Singers", 
      slug: "singer", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      )
    },
    { 
      name: "Comedians", 
      slug: "comedian", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )
    },
    { 
      name: "Rappers", 
      slug: "rapper", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      )
    },
    { 
      name: "DJs", 
      slug: "dj", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9"/>
          <path d="M3 15h18"/>
          <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        </svg>
      )
    },
    { 
      name: "Bollywood", 
      slug: "bollywood", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="m9 8 6 4-6 4Z"/>
        </svg>
      )
    },
    { 
      name: "TV Artists", 
      slug: "tv", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
          <polyline points="17 2 12 7 7 2"/>
        </svg>
      )
    },
    { 
      name: "Speakers", 
      slug: "speaker", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      )
    },
    { 
      name: "Bands", 
      slug: "band", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
          <path d="M12 5v13"/>
        </svg>
      )
    },
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
          {categories.map((c, i) => {
            // Find the display count from real data or show 0
            // Normalize names to match DB (e.g. 'Singers' vs 'singer' in DB)
            // If the user's DB has 'Singer', 'singer', etc.
            const realCount = counts[c.name] || counts[c.name.slice(0, -1)] || counts[c.slug.charAt(0).toUpperCase() + c.slug.slice(1)] || 0;

            return (
              <Link key={c.slug} className="cat-card reveal" href={`/category/${c.slug}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="cat-icon">{c.icon}</div>
                <span className="cat-name">{c.name}</span>
                <span className="cat-count">{realCount} Artists</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
