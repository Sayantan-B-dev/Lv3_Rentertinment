"use client";

import Link from "next/link";
import ArtistForm from "@/components/admin/ArtistForm";

export default function NewArtistPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <Link href="/admin/artists" className="text-text3 no-underline text-sm flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Directory
        </Link>
        <h1 className="admin-title">Create <span className="text-gold">New Artist</span></h1>
        <p className="admin-subtitle">Add a new professional artist to the platform database.</p>
      </div>

      <ArtistForm mode="create" />
    </div>
  );
}
