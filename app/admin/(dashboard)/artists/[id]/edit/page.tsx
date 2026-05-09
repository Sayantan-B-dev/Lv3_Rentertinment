"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ArtistForm from "@/components/admin/ArtistForm";

export default function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="p-16 text-center">Loading artist data...</div>;
  if (!artist) return <div className="p-16 text-center text-crimson">Artist not found.</div>;

  return (
    <div className="w-full">
      <div className="mb-10">
        <Link href="/admin/artists" className="text-text3 no-underline text-sm flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Directory
        </Link>
        <h1 className="admin-title">Edit <span className="text-gold">{artist.name}</span></h1>
        <p className="admin-subtitle">Update performance details, media, and biography.</p>
      </div>

      <ArtistForm mode="edit" initialData={artist} artistId={id} />
    </div>
  );
}
