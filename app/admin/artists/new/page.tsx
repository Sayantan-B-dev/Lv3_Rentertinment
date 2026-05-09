"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArtistPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const fd = new FormData(e.currentTarget);
    
    // Construct the payload matching the schema
    const payload = {
      name: fd.get("name"),
      category: fd.get("category"),
      about: fd.get("about"),
      location: {
        city: fd.get("city"),
        state: fd.get("state"),
        country: fd.get("country") || "India",
      },
      performance: {
        duration_minutes: {
          min: Number(fd.get("durationMin")),
          max: Number(fd.get("durationMax"))
        },
        team_members: {
          min: Number(fd.get("teamMin")),
          max: Number(fd.get("teamMax"))
        },
        genres: fd.get("genres")?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
        languages: fd.get("languages")?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
      },
      media: {
        images: fd.get("images")?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
        videos: fd.get("videos")?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
      },
      featured: fd.get("featured") === "on"
    };

    try {
      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The API expects an array for bulk import or single creation
        body: JSON.stringify([payload])
      });
      
      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/admin/artists"), 1500);
      } else {
        setStatus("error");
      }
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add New Artist</h1>

      {status === "success" && <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Artist created successfully! Redirecting...</div>}
      {status === "error" && <div style={{ color: 'var(--crimson)', marginBottom: '1rem' }}>Failed to create artist. Please check validation.</div>}

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Basic Info */}
        <fieldset style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px' }}>
          <legend style={{ color: 'var(--gold)', padding: '0 0.5rem' }}>Basic Info</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name</label>
              <input name="name" required style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
              <select name="category" required style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}>
                <option value="Singer">Singer</option>
                <option value="Comedian">Comedian</option>
                <option value="DJ">DJ</option>
                <option value="Rapper">Rapper</option>
                <option value="Speaker">Speaker</option>
                <option value="Band">Band</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>About</label>
            <textarea name="about" rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}></textarea>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="featured" id="featured" />
            <label htmlFor="featured">Featured Artist (Shows on Homepage)</label>
          </div>
        </fieldset>

        {/* Location Info */}
        <fieldset style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px' }}>
          <legend style={{ color: 'var(--gold)', padding: '0 0.5rem' }}>Location Info</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>City</label>
              <input name="city" required style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>State</label>
              <input name="state" required style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Country</label>
              <input name="country" defaultValue="India" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
          </div>
        </fieldset>

        {/* Performance Info */}
        <fieldset style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px' }}>
          <legend style={{ color: 'var(--gold)', padding: '0 0.5rem' }}>Performance Details</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Duration (Min - Max minutes)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input name="durationMin" type="number" required placeholder="60" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
                <input name="durationMax" type="number" required placeholder="120" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Team Size (Min - Max members)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input name="teamMin" type="number" required placeholder="1" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
                <input name="teamMax" type="number" required placeholder="5" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Genres (comma separated)</label>
              <input name="genres" placeholder="Bollywood, Rock, Sufi" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Languages (comma separated)</label>
              <input name="languages" placeholder="Hindi, English, Punjabi" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
            </div>
          </div>
        </fieldset>

        {/* Media */}
        <fieldset style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px' }}>
          <legend style={{ color: 'var(--gold)', padding: '0 0.5rem' }}>Media Assets</legend>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image URLs (comma separated)</label>
            <input name="images" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} placeholder="https://imagekit.io/..." />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Video Embed URLs (comma separated)</label>
            <input name="videos" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} placeholder="https://youtube.com/embed/..." />
          </div>
        </fieldset>

        <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ padding: '1rem', justifyContent: 'center' }}>
          {status === "loading" ? "Saving..." : "Save Artist"}
        </button>
      </form>
    </div>
  );
}
