"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ArtistFilterBar({ 
  categories, 
  cities, 
  basePath = "/artists" 
}: { 
  categories: string[], 
  cities: string[],
  basePath?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");

  const handleFilter = (queryOverride?: string, catOverride?: string, cityOverride?: string) => {
    const params = new URLSearchParams();
    const finalQ = queryOverride !== undefined ? queryOverride : q;
    const finalCat = catOverride !== undefined ? catOverride : category;
    const finalCity = cityOverride !== undefined ? cityOverride : city;

    if (finalQ) params.set("q", finalQ);
    if (finalCat) params.set("category", finalCat);
    if (finalCity) params.set("city", finalCity);
    
    // If we are on a category page and category changed, redirect to new category page
    if (basePath.startsWith('/category/') && finalCat) {
      router.push(`/category/${encodeURIComponent(finalCat)}?${params.toString()}`);
    } else {
      router.push(`${basePath}?${params.toString()}`);
    }
  };

  const onCategoryChange = (val: string) => {
    setCategory(val);
    handleFilter(q, val, city);
  };

  const onCityChange = (val: string) => {
    setCity(val);
    handleFilter(q, category, val);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '3rem', 
      flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.02)',
      padding: '1.5rem',
      borderRadius: '20px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search by name or keyword..." 
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          style={{ 
            width: '100%', 
            padding: '0.8rem 1.2rem', 
            paddingLeft: '2.8rem',
            borderRadius: '12px', 
            background: 'var(--bg)', 
            border: '1px solid var(--border)',
            color: 'var(--text)'
          }}
        />
        <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>

      <select 
        value={category} 
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{ flex: 1, minWidth: '150px', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select 
        value={city} 
        onChange={(e) => onCityChange(e.target.value)}
        style={{ flex: 1, minWidth: '150px', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        <option value="">All Cities</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <button onClick={() => handleFilter()} className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>
        Search
      </button>
    </div>
  );
}
