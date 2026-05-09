"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactForm() {
  const searchParams = useSearchParams();
  const artistSlug = searchParams.get("artist") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd);

    // Default valid ObjectId if artist not found via slug (or keep empty if backend handles it)
    data.artistId = "5f8f8c44b54764421b7156e9"; 

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
    <div className="section-inner pt-nav">
      <div className="max-w-2xl mx-auto">
        <div className="section-label justify-center">Get in Touch</div>
        <h1 className="section-title text-center mb-10">Book an <span>Artist</span></h1>

        {status === "success" && (
          <div className="p-4 bg-gold/10 border border-gold rounded-2xl text-gold mb-8 text-center animate-fade-in">
            {msg}
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-crimson/10 border border-crimson rounded-2xl text-crimson mb-8 text-center animate-fade-in">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-section space-y-6">
          
          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Artist Name</label>
            <input 
              type="text" 
              name="artistName" 
              defaultValue={artistSlug ? artistSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ""} 
              required 
              className="filter-input"
              placeholder="e.g. Arijit Singh"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Your Name</label>
              <input type="text" name="clientName" required className="filter-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Email Address</label>
              <input type="email" name="clientEmail" required className="filter-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Phone Number</label>
              <input type="tel" name="clientPhone" required className="filter-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Event Date</label>
              <input type="date" name="eventDate" className="filter-input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Type of Event</label>
            <select name="eventType" required className="filter-select w-full">
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Private Party">Private Party</option>
              <option value="College">College</option>
              <option value="Concert">Concert / Festival</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Message / Requirements</label>
            <textarea 
              name="message" 
              rows={4} 
              className="filter-input min-h-[120px]"
              placeholder="Tell us about your event expectations..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading"} 
            className="btn-primary w-full py-4 text-lg mt-4 shadow-gold/20"
          >
            {status === "loading" ? "Submitting Inquiry..." : "Submit Inquiry ✦"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="section-inner pt-nav text-center">Loading form...</div>}>
      <ContactForm />
    </Suspense>
  );
}
