"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/artists/id/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArtist(data.data);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/artists/id/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artist)
      });
      const data = await res.json();
      if (data.success) {
        alert("Artist updated successfully!");
        router.push("/admin/artists");
      }
    } catch (err) {
      alert("Failed to update artist");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path: string, value: any) => {
    setArtist((prev: any) => {
      const newArtist = { ...prev };
      const parts = path.split('.');
      let current = newArtist;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newArtist;
    });
  };

  const handleArrayChange = (path: string, index: number, value: string) => {
    const parts = path.split('.');
    setArtist((prev: any) => {
      const newArtist = { ...prev };
      let current = newArtist;
      for (let i = 0; i < parts.length; i++) {
        current = current[parts[i]];
      }
      current[index] = value;
      return newArtist;
    });
  };

  const addArrayItem = (path: string) => {
    const parts = path.split('.');
    setArtist((prev: any) => {
      const newArtist = { ...prev };
      let current = newArtist;
      for (let i = 0; i < parts.length; i++) {
        if (!current[parts[i]]) current[parts[i]] = [];
        current = current[parts[i]];
      }
      current.push("");
      return newArtist;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    const parts = path.split('.');
    setArtist((prev: any) => {
      const newArtist = { ...prev };
      let current = newArtist;
      for (let i = 0; i < parts.length; i++) {
        current = current[parts[i]];
      }
      current.splice(index, 1);
      return newArtist;
    });
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading artist data...</div>;
  if (!artist) return <div style={{ padding: '4rem', textAlign: 'center' }}>Artist not found.</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/admin/artists" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Directory
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Edit <span style={{ color: 'var(--gold)' }}>{artist.name}</span></h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Basic Info */}
        <section style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Basic Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>Artist Name</label>
              <input 
                type="text" 
                value={artist.name || ""} 
                onChange={(e) => handleChange('name', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>Category</label>
              <input 
                type="text" 
                value={artist.category || ""} 
                onChange={(e) => handleChange('category', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>About / Biography</label>
              <textarea 
                value={artist.about || ""} 
                onChange={(e) => handleChange('about', e.target.value)}
                rows={5}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical' }}
              />
            </div>
          </div>
        </section>

        {/* Location & Performance */}
        <section style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Location & Performance
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>City</label>
              <input 
                type="text" 
                value={artist.location?.city || ""} 
                onChange={(e) => handleChange('location.city', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>State</label>
              <input 
                type="text" 
                value={artist.location?.state || ""} 
                onChange={(e) => handleChange('location.state', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>Min Duration (min)</label>
              <input 
                type="number" 
                value={artist.performance?.duration_minutes?.min || ""} 
                onChange={(e) => handleChange('performance.duration_minutes.min', parseInt(e.target.value))}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)' }}>Max Duration (min)</label>
              <input 
                type="number" 
                value={artist.performance?.duration_minutes?.max || ""} 
                onChange={(e) => handleChange('performance.duration_minutes.max', parseInt(e.target.value))}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
        </section>

        {/* Media Assets */}
        <section style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Media Assets (Images)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(artist.media?.images || []).map((img: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg)', flexShrink: 0 }}>
                  <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${img}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <input 
                  type="text" 
                  value={img} 
                  onChange={(e) => handleArrayChange('media.images', idx, e.target.value)}
                  placeholder="Image URL or Path"
                  style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                <button type="button" onClick={() => removeArrayItem('media.images', idx)} style={{ color: 'var(--crimson)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('media.images')} className="btn-outline" style={{ borderStyle: 'dashed', width: '100%', padding: '0.8rem' }}>+ Add Image URL</button>
          </div>

          <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
            Media Assets (Videos)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(artist.media?.videos || []).map((vid: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={vid} 
                  onChange={(e) => handleArrayChange('media.videos', idx, e.target.value)}
                  placeholder="Video URL (YouTube/Vimeo)"
                  style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                <button type="button" onClick={() => removeArrayItem('media.videos', idx)} style={{ color: 'var(--crimson)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('media.videos')} className="btn-outline" style={{ borderStyle: 'dashed', width: '100%', padding: '0.8rem' }}>+ Add Video URL</button>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Link href="/admin/artists" className="btn-outline" style={{ padding: '1rem 2rem', borderRadius: '14px' }}>Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '1rem 3rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '700' }}>
            {saving ? "Saving Changes..." : "Save Artist Profile"}
          </button>
        </div>

      </form>
    </div>
  );
}
