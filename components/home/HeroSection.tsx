"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection({ categories }: { categories: string[] }) {
  const router = useRouter();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const interval = setInterval(() => {
      const p = document.createElement("div");
      p.className = "particle";
      const x = Math.random() * 100;
      const dur = 4 + Math.random() * 6;
      const delay = Math.random() * 3;
      p.style.cssText = `left:${x}%;bottom:0;animation-duration:${dur}s;animation-delay:${delay}s;`;
      if (Math.random() > 0.5) p.style.background = "var(--saffron)";
      hero.appendChild(p);
      setTimeout(() => p.remove(), (dur + delay) * 1000);
    }, 800);
    return () => clearInterval(interval);
  }, []);

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
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

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
          <Link className="hero-tag" href="/category/singer">🎤 Singers</Link>
          <Link className="hero-tag" href="/category/comedian">🎭 Comedians</Link>
          <Link className="hero-tag" href="/category/dj">🎧 DJs</Link>
          <Link className="hero-tag" href="/category/rapper">🎤 Rappers</Link>
          <Link className="hero-tag" href="/category/bollywood">🎬 Bollywood</Link>
          <Link className="hero-tag" href="/category/sufi">🎙 Sufi</Link>
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
