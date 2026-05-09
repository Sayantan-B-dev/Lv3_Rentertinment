"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [pathname]); // Re-run when pathname changes to pick up new elements

  return null;
}
