"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection({ categories, trailImages }: { categories: string[], trailImages?: string[] }) {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q") as string;
    const cat = fd.get("category") as string;
    let url = `/search?q=${encodeURIComponent(q)}`;
    if (cat) url += `&category=${encodeURIComponent(cat)}`;
    router.push(url);
  };

  return (
    <section id="hero">
      <div className="hero-content">
        <div className="hero-badge">India's No. 1 Artist Booking Platform</div>

        <h1 className="hero-title">
          Book the <em>Perfect Artist</em><br />for Every Stage
        </h1>

        <p className="hero-sub">
          From chart-topping Bollywood singers to legendary Sufi maestros — discover, connect, and book artists across India and the world.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input type="text" name="q" placeholder="Search artist by name…" required />
          <select name="category">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit">Search ↗</button>
        </form>

        <div className="hero-tags">
          <div className="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            Singers
          </div>
          <div className="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Z"/><path d="M9.5 10c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Z"/><path d="M12 18c-2.4 0-4.4-1.2-5.4-3h10.8c-1 1.8-3 3-5.4 3Z"/><path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z"/></svg>
            Comedians
          </div>
          <div className="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 12l5 5"/></svg>
            DJs
          </div>
          <div className="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            Rappers
          </div>
          <div className="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
            Bollywood
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10l5 5 5-5" />
        </svg>
        Scroll to explore
      </div>
    </section>
  );
}
