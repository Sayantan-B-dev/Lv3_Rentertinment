"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      <header id="site-header" style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,.5)' : 'none' }}>
        <div className="hdr-inner">
          <Link href="/" className="logo" onClick={closeNav}>
            <div className="logo-icon">T</div>
            <div className="logo-text">
              TaranumTalent
              <span>India's Artist Platform</span>
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
            <button className="theme-toggle" id="themeToggle" aria-label="Toggle theme"></button>
            <Link href="/admin/login" className="btn-outline">Login</Link>
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
