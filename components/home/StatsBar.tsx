"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ totalArtists: 0, totalCities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats({
            totalArtists: data.data.totalArtists,
            totalCities: data.data.totalCities
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    const el = containerRef.current?.querySelector('.reveal');
    if (el) observer.observe(el);

    const counters = containerRef.current?.querySelectorAll('.stat-num[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const targetEl = e.target as HTMLElement;
        const target = parseInt(targetEl.dataset.count || "0");
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          if (target >= 1000) {
            targetEl.textContent = (current >= 1000 ? (current / 1000).toFixed(target >= 10000 ? 0 : 0) + 'k+' : current.toString() + '+');
          } else {
            targetEl.textContent = current + '+';
          }
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(targetEl);
      });
    }, { threshold: 0.5 });

    counters?.forEach(c => counterObserver.observe(c));

    return () => {
      observer.disconnect();
      counterObserver.disconnect();
    };
  }, [stats]);

  return (
    <section id="stats" ref={containerRef}>
      <div className="section-inner">
        <div className="stats-grid reveal stats-grid-2">
          <div className="stat-cell">
            <div className="stat-num" data-count={stats.totalArtists}>0</div>
            <div className="stat-label">Artists Listed</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" data-count={stats.totalCities}>0</div>
            <div className="stat-label">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
