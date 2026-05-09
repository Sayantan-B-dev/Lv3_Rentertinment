"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const observeNewElements = () => {
      const els = document.querySelectorAll('.reveal:not(.visible)');
      els.forEach(el => observer.observe(el));
    };

    // Initial run
    observeNewElements();

    // Watch for new elements added to the DOM (like after a fetch or page change)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, searchParams]); // Re-run when path or params change

  return null;
}
