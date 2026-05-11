"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/config/site";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNav = () => {
    setNavOpen(!navOpen);
    document.body.style.overflow = !navOpen ? "hidden" : "";
  };

  const closeNav = () => {
    setNavOpen(false);
    document.body.style.overflow = "";
  };

  const user = session?.user as any;

  return (
    <>
      <header
        id="site-header"
        style={{
          background: scrolled
            ? 'rgba(5, 7, 10, 0.65)'
            : 'rgba(5, 7, 10, 0.35)',

          backdropFilter: scrolled
            ? 'blur(18px) saturate(180%)'
            : 'blur(10px) saturate(140%)',

          WebkitBackdropFilter: scrolled
            ? 'blur(18px) saturate(180%)'
            : 'blur(10px) saturate(140%)',

          boxShadow: scrolled
            ? '0 4px 30px rgba(0,0,0,.4), 0 1px 0 rgba(0, 210, 255, 0.1)'
            : '0 4px 20px rgba(0,0,0,.15)',

          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 210, 255, 0.5)'
            : '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="hdr-inner">
          <Link href="/" className="logo" onClick={closeNav}>
            <div className="logo-icon">
              <img src="/icon.png" alt="Rentertainment Logo" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
            </div>
            <div className="logo-text">
              {siteConfig.name}
              <span>Premium Artist Booking</span>
            </div>
          </Link>

          <nav>
            <Link href="/#categories">Categories</Link>
            <Link href="/artists">Artists</Link>
            <Link href="/#how">How It Works</Link>
            <Link href="/#testimonials">Reviews</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="hdr-actions">
            {user?.role === "admin" && (
              <Link href="/admin" className="btn-outline btn-xs" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>Admin Panel</Link>
            )}

            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link href="/profile" className="btn-outline btn-xs">Profile</Link>
                <button onClick={() => signOut()} className="btn-outline btn-xs" style={{ color: 'var(--crimson)' }}>Logout</button>
              </div>
            ) : (
              <Link href="/login" className="btn-outline btn-xs">Login</Link>
            )}

            <Link href="/contact" className="btn-primary btn-sm">Book Artist ✦</Link>
            <button className="hamburger" onClick={toggleNav} aria-label="Menu">
              <span style={navOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}}></span>
              <span style={navOpen ? { opacity: 0 } : {}}></span>
              <span style={navOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className={`mobile-nav ${navOpen ? 'open' : ''}`} id="mobileNav">
        <Link href="/#categories" onClick={closeNav}>Categories</Link>
        <Link href="/artists" onClick={closeNav}>Artists</Link>
        <Link href="/#how" onClick={closeNav}>How It Works</Link>
        <Link href="/#testimonials" onClick={closeNav}>Reviews</Link>
        <Link href="/contact" onClick={closeNav}>Contact</Link>
        <Link href="/contact" className="btn-primary" style={{ borderRadius: '10px', justifyContent: 'center', marginTop: 'auto' }} onClick={closeNav}>Book Artist ✦</Link>
      </nav>
    </>
  );
}
