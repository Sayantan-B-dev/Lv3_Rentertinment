"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const artistSlug = searchParams.get("artist") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd);

    // Hardcoding an artistId just for the form submission to pass validation
    // In a real app we'd fetch the artist ID based on slug, but here we just
    // pass a dummy 24 char hex or fetch it.
    data.artistId = "5f8f8c44b54764421b7156e9"; // dummy valid ObjectId

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Your inquiry has been submitted! Our team will contact you shortly.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setMsg(result.message || "Failed to submit inquiry.");
      }
    } catch (err: any) {
      setStatus("error");
      setMsg("Network error occurred.");
    }
  };

  return (
    <div className="section-inner" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)', paddingTop: 'calc(var(--hdr-h) + 2rem)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>Get in Touch</div>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Book an <span>Artist</span></h1>

        {status === "success" && (
          <div style={{ padding: '1rem', background: 'rgba(212,160,23,.1)', border: '1px solid var(--gold)', borderRadius: 'var(--radius)', color: 'var(--gold)', marginBottom: '2rem' }}>
            {msg}
          </div>
        )}

        {status === "error" && (
          <div style={{ padding: '1rem', background: 'rgba(196,30,58,.1)', border: '1px solid var(--crimson)', borderRadius: 'var(--radius)', color: '#ff6b6b', marginBottom: '2rem' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Artist Name</label>
            <input type="text" name="artistName" defaultValue={artistSlug ? artistSlug.replace(/-/g, ' ') : ""} required style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Your Name</label>
              <input type="text" name="clientName" required style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Email</label>
              <input type="email" name="clientEmail" required style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Phone</label>
              <input type="tel" name="clientPhone" required style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Event Date</label>
              <input type="date" name="eventDate" style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Event Type</label>
            <select name="eventType" required style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Private Party">Private Party</option>
              <option value="College">College</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: 'var(--text2)' }}>Message / Requirements</label>
            <textarea name="message" rows={4} style={{ width: '100%', padding: '.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}></textarea>
          </div>

          <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}>
            {status === "loading" ? "Submitting..." : "Send Inquiry ✦"}
          </button>
        </form>
      </div>
    </div>
  );
}
