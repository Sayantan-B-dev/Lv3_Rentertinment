"use client";

import { useEffect } from "react";

export default function HomeBackground({ trailImages }: { trailImages?: string[] }) {
  useEffect(() => {
    if (!trailImages || trailImages.length === 0) return;

    let lastX = 0;
    let lastY = 0;
    let currentImageIndex = 0;
    const distanceThreshold = 60;
    const trailElements: HTMLElement[] = [];
    const maxTrail = 5;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      
      if (distance > distanceThreshold) {
        lastX = e.clientX;
        lastY = e.clientY;

        const img = document.createElement("img");
        img.src = trailImages[currentImageIndex];
        img.className = "mouse-trail-img";
        
        // Fixed positioning relative to viewport since this is global background
        img.style.position = "fixed";
        img.style.left = `${e.clientX - 25}px`; 
        img.style.top = `${e.clientY - 25}px`;
        img.style.zIndex = "1"; // Above grid, below content
        
        document.body.appendChild(img);
        trailElements.push(img);
        
        currentImageIndex = (currentImageIndex + 1) % trailImages.length;

        void img.offsetWidth;
        img.classList.add("active");

        trailElements.forEach((el, index) => {
          const pos = trailElements.length - 1 - index;
          const scale = 1 - (pos * 0.2);
          const opacity = 1 - (pos * 0.3);
          el.style.transform = `scale(${Math.max(0.3, scale)})`;
          el.style.opacity = `${Math.max(0, opacity)}`;
        });

        if (trailElements.length > maxTrail) {
          const oldest = trailElements.shift();
          if (oldest) {
            oldest.classList.remove("active");
            oldest.classList.add("exit");
            setTimeout(() => oldest.remove(), 400);
          }
        }

        setTimeout(() => {
          if (trailElements.includes(img)) {
            const idx = trailElements.indexOf(img);
            if (idx > -1) trailElements.splice(idx, 1);
            img.classList.remove("active");
            img.classList.add("exit");
            setTimeout(() => img.remove(), 400);
          }
        }, 600);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      trailElements.forEach(el => el.remove());
    };
  }, [trailImages]);

  return (
    <div className="home-global-bg">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>
      
      {/* Pre-fetch images */}
      {trailImages && (
        <div style={{ display: 'none' }}>
          {trailImages.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}
