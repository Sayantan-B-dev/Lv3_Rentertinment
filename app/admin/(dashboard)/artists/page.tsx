"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Custom Checkbox Component for better look
const Checkbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: `2px solid ${checked ? 'var(--gold)' : 'var(--border)'}`,
      background: checked ? 'var(--gold)' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '0.2s',
      color: 'black'
    }}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    )}
  </div>
);

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, withImages: 0 });

  const fetchArtists = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artists?limit=100${query ? `&q=${encodeURIComponent(query)}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setArtists(data.data.artists);
        setStats({ 
          total: data.data.total, 
          withImages: data.data.artists.filter((a: any) => a.media?.images?.length > 0).length 
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArtists(search);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === artists.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(artists.map(a => a._id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;
    
    try {
      const res = await fetch(`/api/artists/id/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArtists(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      alert("Failed to delete artist");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} artists?`)) return;

    try {
      const res = await fetch(`/api/artists`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setArtists(prev => prev.filter(a => !selectedIds.includes(a._id)));
        setSelectedIds([]);
      }
    } catch (err) {
      alert("Failed to delete artists");
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Artist <span style={{ color: 'var(--gold)' }}>Directory</span>
          </h1>
          <p style={{ color: 'var(--text2)' }}>Manage your database of {stats.total} artists across India.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-outline" style={{ borderColor: 'var(--crimson)', color: 'var(--crimson)', background: 'rgba(255, 71, 87, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <Link href="/admin/artists/new" className="btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 20px rgba(212, 160, 23, 0.2)' }}>
            + Create New Artist
          </Link>
        </div>
      </div>

      <div style={{ 
        background: 'var(--surface)', 
        padding: '1.5rem', 
        borderRadius: '20px', 
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by name, category or city..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1.5rem', 
                paddingLeft: '3.5rem',
                borderRadius: '14px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '1rem'
              }} 
            />
            <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          <button type="submit" className="btn-outline" style={{ borderRadius: '14px', padding: '0 2rem' }}>Search</button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text3)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', width: '40px' }}>
                  <Checkbox checked={selectedIds.length === artists.length && artists.length > 0} onChange={toggleSelectAll} />
                </th>
                <th style={{ padding: '1rem' }}>Artist</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Media Assets</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>Loading artists...</td></tr>
              ) : artists.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>No artists found.</td></tr>
              ) : artists.map((artist) => (
                <tr key={artist._id} style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  transition: '0.2s',
                  height: '100px' // Increased row height as requested
                }} className="admin-row">
                  <td style={{ padding: '1rem', borderRadius: '12px 0 0 12px', border: '1px solid var(--border)', borderRight: 'none' }}>
                    <Checkbox checked={selectedIds.includes(artist._id)} onChange={() => toggleSelect(artist._id)} />
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        background: 'var(--bg)',
                        border: '1px solid var(--border)'
                      }}>
                        <img 
                          src={artist.media?.images?.[0] ? (artist.media.images[0].startsWith('http') ? artist.media.images[0] : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${artist.media.images[0]}`) : "https://placehold.co/100x100/1a1a1a/d4a017?text=Artist"} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt=""
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{artist.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{artist.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', 
                      background: 'rgba(212, 160, 23, 0.1)', 
                      color: 'var(--gold)', 
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>{artist.category}</span>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {artist.location?.city || "Unknown"}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginLeft: '1.25rem' }}>{artist.location?.state || "India"}</div>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div title="Images" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text2)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span style={{ fontWeight: 'bold' }}>{artist.media?.images?.length || 0}</span>
                      </div>
                      <div title="Videos" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text2)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                        <span style={{ fontWeight: 'bold' }}>{artist.media?.videos?.length || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 12px 12px 0', border: '1px solid var(--border)', borderLeft: 'none' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/artists/${artist._id}/edit`} style={{ 
                        padding: '0.5rem', 
                        borderRadius: '8px', 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border)',
                        textDecoration: 'none',
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center'
                      }} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </Link>
                      <button onClick={() => handleDelete(artist._id)} style={{ 
                        padding: '0.5rem', 
                        borderRadius: '8px', 
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '1px solid rgba(255, 71, 87, 0.2)',
                        cursor: 'pointer',
                        color: 'var(--crimson)',
                        display: 'flex',
                        alignItems: 'center'
                      }} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
