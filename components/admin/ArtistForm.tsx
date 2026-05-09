"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArtistFormProps {
  initialData?: any;
  mode: "create" | "edit";
  artistId?: string;
}

export default function ArtistForm({ initialData, mode, artistId }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    category_tag: initialData?.category_tag || "",
    booking_link: initialData?.booking_link || "",
    location: {
      city: initialData?.location?.city || "",
      state: initialData?.location?.state || "India",
    },
    about: Array.isArray(initialData?.about) ? initialData.about.join("\n") : initialData?.about || "",
    performance: {
      duration_minutes: {
        min: initialData?.performance?.duration_minutes?.min || 30,
        max: initialData?.performance?.duration_minutes?.max || 90,
      },
      team_members: {
        min: initialData?.performance?.team_members?.min || 1,
        max: initialData?.performance?.team_members?.max || 1,
      },
      genres: initialData?.performance?.genres || [],
      languages: initialData?.performance?.languages || [],
    },
    media: {
      images: initialData?.media?.images || [],
      videos: initialData?.media?.videos || [],
    },
    faq: initialData?.faq || [],
  });

  const [newGenre, setNewGenre] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newVideo, setNewVideo] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const folder = `/${formData.category || 'misc'}/${formData.name.replace(/\s+/g, '_')}`;
      data.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            images: [...prev.media.images, result.filePath]
          }
        }));
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        about: formData.about.split("\n").filter(p => p.trim() !== ""),
      };

      const url = mode === "edit" ? `/api/artists/id/${artistId}` : "/api/artists";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        router.push("/admin/artists");
        router.refresh();
      } else {
        alert("Operation failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Submit error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-main-card">
      <form onSubmit={handleSubmit} className="w-full">
        
        {/* Section 1: Basic Information */}
        <div className="admin-form-row-section">
          <h3 className="admin-form-row-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Basic Information
          </h3>
          
          <div className="admin-field-row">
            <div className="admin-field-group">
              <label className="admin-field-label">Artist Full Name</label>
              <input 
                type="text" required
                className="admin-input-base" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label">Primary Category</label>
              <input 
                type="text" required
                className="admin-input-base" 
                placeholder="e.g. Singer, DJ, Band"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field-row mt-4">
            <div className="admin-field-group">
              <label className="admin-field-label">Category Tag / Sub-category</label>
              <input 
                type="text" 
                className="admin-input-base" 
                value={formData.category_tag}
                onChange={e => setFormData({ ...formData, category_tag: e.target.value })}
              />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label">Direct Booking URL (Optional)</label>
              <input 
                type="text" 
                className="admin-input-base" 
                value={formData.booking_link}
                onChange={e => setFormData({ ...formData, booking_link: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field-row mt-4">
            <div className="admin-field-group">
              <label className="admin-field-label">City</label>
              <input 
                type="text" 
                className="admin-input-base" 
                value={formData.location.city}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
              />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label">State / Region</label>
              <input 
                type="text" 
                className="admin-input-base" 
                value={formData.location.state}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Performance Specs */}
        <div className="admin-form-row-section">
          <h3 className="admin-form-row-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Performance Specs
          </h3>

          <div className="admin-field-row">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="admin-field-group">
                <label className="admin-field-label">Min Duration (min)</label>
                <input 
                  type="number" 
                  className="admin-input-base" 
                  value={formData.performance.duration_minutes.min}
                  onChange={e => setFormData({ ...formData, performance: { ...formData.performance, duration_minutes: { ...formData.performance.duration_minutes, min: parseInt(e.target.value) } } })}
                />
              </div>
              <div className="admin-field-group">
                <label className="admin-field-label">Max Duration (min)</label>
                <input 
                  type="number" 
                  className="admin-input-base" 
                  value={formData.performance.duration_minutes.max}
                  onChange={e => setFormData({ ...formData, performance: { ...formData.performance, duration_minutes: { ...formData.performance.duration_minutes, max: parseInt(e.target.value) } } })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="admin-field-group">
                <label className="admin-field-label">Team size (Min)</label>
                <input 
                  type="number" 
                  className="admin-input-base" 
                  value={formData.performance.team_members.min}
                  onChange={e => setFormData({ ...formData, performance: { ...formData.performance, team_members: { ...formData.performance.team_members, min: parseInt(e.target.value) } } })}
                />
              </div>
              <div className="admin-field-group">
                <label className="admin-field-label">Team size (Max)</label>
                <input 
                  type="number" 
                  className="admin-input-base" 
                  value={formData.performance.team_members.max}
                  onChange={e => setFormData({ ...formData, performance: { ...formData.performance, team_members: { ...formData.performance.team_members, max: parseInt(e.target.value) } } })}
                />
              </div>
            </div>
          </div>

          <div className="admin-field-row mt-6">
            <div className="admin-field-group w-full">
              <label className="admin-field-label">Genres</label>
              <div className="admin-tag-input-wrap">
                <input 
                  type="text" className="admin-input-base" placeholder="Add genre..." 
                  value={newGenre} onChange={e=>setNewGenre(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault(); if(newGenre){setFormData({...formData, performance: {...formData.performance, genres: [...formData.performance.genres, newGenre]}}); setNewGenre("");}}}}
                />
                <button type="button" onClick={()=>{if(newGenre){setFormData({...formData, performance: {...formData.performance, genres: [...formData.performance.genres, newGenre]}}); setNewGenre("");}}} className="btn-primary px-6 rounded-xl">Add</button>
              </div>
              <div className="admin-tag-container">
                {formData.performance.genres.map((g:string)=>(
                  <div key={g} className="admin-tag">
                    {g} <span onClick={()=>setFormData({...formData, performance:{...formData.performance, genres: formData.performance.genres.filter((x:any)=>x!==g)}})} className="admin-tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-field-group w-full">
              <label className="admin-field-label">Languages</label>
              <div className="admin-tag-input-wrap">
                <input 
                  type="text" className="admin-input-base" placeholder="Add language..." 
                  value={newLang} onChange={e=>setNewLang(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault(); if(newLang){setFormData({...formData, performance: {...formData.performance, languages: [...formData.performance.languages, newLang]}}); setNewLang("");}}}}
                />
                <button type="button" onClick={()=>{if(newLang){setFormData({...formData, performance: {...formData.performance, languages: [...formData.performance.languages, newLang]}}); setNewLang("");}}} className="btn-primary px-6 rounded-xl">Add</button>
              </div>
              <div className="admin-tag-container">
                {formData.performance.languages.map((l:string)=>(
                  <div key={l} className="admin-tag opacity-80">
                    {l} <span onClick={()=>setFormData({...formData, performance:{...formData.performance, languages: formData.performance.languages.filter((x:any)=>x!==l)}})} className="admin-tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Biography & About */}
        <div className="admin-form-row-section">
          <h3 className="admin-form-row-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Biography & About
          </h3>
          <div className="admin-field-group">
            <label className="admin-field-label">Detailed Story / Biography (Press Enter for new paragraph)</label>
            <textarea 
              className="admin-input-base admin-textarea"
              placeholder="Tell the artist's story here..."
              value={formData.about}
              onChange={e => setFormData({ ...formData, about: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* Section 4: Media & Gallery */}
        <div className="admin-form-row-section">
          <h3 className="admin-form-row-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Media & Gallery
          </h3>
          
          <div className="admin-field-row">
            <div className="w-full">
              <label className="admin-field-label mb-4">Photos (Gallery Management)</label>
              <div className="admin-upload-grid">
                {formData.media.images.map((img: string, i: number) => (
                  <div key={i} className="admin-upload-item">
                    <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${img}`} alt="" />
                    <div onClick={() => setFormData({...formData, media: {...formData.media, images: formData.media.images.filter((_, idx)=>idx!==i)}})} className="admin-upload-delete">
                      Remove
                    </div>
                  </div>
                ))}
                <label className="admin-upload-btn min-h-[140px]">
                  {uploading ? (
                    <span className="animate-spin text-xl">⏳</span>
                  ) : (
                    <>
                      <span className="text-3xl">+</span>
                      <span className="text-[10px] mt-2 uppercase font-black tracking-widest">Add Photo</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="w-full">
              <label className="admin-field-label">YouTube Video Links</label>
              <div className="admin-tag-input-wrap">
                <input 
                  type="text" className="admin-input-base" placeholder="Paste YouTube link here..." 
                  value={newVideo} onChange={e => setNewVideo(e.target.value)}
                />
                <button type="button" onClick={() => { if(newVideo){ setFormData({...formData, media: {...formData.media, videos: [...formData.media.videos, newVideo]}}); setNewVideo(""); } }} className="btn-primary px-6 rounded-xl">Add</button>
              </div>
              <div className="space-y-3 mt-4">
                {formData.media.videos.map((vid: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-bg border border-border rounded-2xl">
                    <span className="text-xs truncate max-w-[85%] opacity-60 font-mono tracking-tight">{vid}</span>
                    <button type="button" onClick={() => setFormData({...formData, media: {...formData.media, videos: formData.media.videos.filter((_, idx)=>idx!==i)}})} className="text-crimson text-sm font-black">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-6 pt-12 mt-4">
          <button type="button" onClick={() => router.back()} className="btn-outline px-12 py-4 rounded-2xl">Discard Changes</button>
          <button type="submit" disabled={loading} className="btn-primary px-20 py-4 rounded-2xl text-lg font-black shadow-gold/20">
            {loading ? "Saving Profile..." : mode === 'edit' ? "Save Artist Profile" : "Create New Artist"}
          </button>
        </div>
      </form>
    </div>
  );
}
