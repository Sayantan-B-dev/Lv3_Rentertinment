"use client";

import { useEffect, useRef } from "react";

export default function StatsBar() {
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
            targetEl.textContent = (current >= 1000 ? (current / 1000).toFixed(target >= 10000 ? 0 : 0) + 'k+' : current.toString());
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
  }, []);

  return (
    <section id="stats" ref={containerRef}>
      <div className="section-inner">
        <div className="stats-grid reveal">
          <div className="stat-cell">
            <div className="stat-num" data-count="20000">0</div>
            <div className="stat-label">Artists Listed</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" data-count="10000">0</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" data-count="15">0</div>
            <div className="stat-label">Years of Experience</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" data-count="50">0</div>
            <div className="stat-label">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
