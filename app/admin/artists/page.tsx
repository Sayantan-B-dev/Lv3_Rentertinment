"use client";

import { useEffect, useState } from "react";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/artists?limit=100")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArtists(data.data.artists);
        }
      });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 0 }}>Artists Management</h1>
      </div>
      
      <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Name</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Category</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>City</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>{artist.name}</td>
                <td style={{ padding: '0.75rem' }}>{artist.category}</td>
                <td style={{ padding: '0.75rem' }}>{artist.location?.city || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
