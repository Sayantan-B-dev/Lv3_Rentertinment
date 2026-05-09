"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminImportPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);

  const handleImport = async () => {
    try {
      setStatus("loading");
      const parsed = JSON.parse(jsonText);
      const data = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setResult(resData.data);
      } else {
        setStatus("error");
        setResult(resData.message);
      }
    } catch (e: any) {
      setStatus("error");
      setResult("Invalid JSON: " + e.message);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="admin-title">Bulk JSON <span className="text-gold">Import</span></h1>
        <p className="admin-subtitle">Paste a JSON array of artists to bulk import or update the database.</p>
      </div>
      
      <div className="admin-section mb-10">
        <textarea 
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          rows={15}
          className="filter-input font-mono text-sm min-h-[400px] mb-6"
          placeholder='[ { "name": "Artist Name", "category": "Singer", "location": { "city": "Mumbai" } } ]'
        ></textarea>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-text3">Make sure the JSON follows the artist schema strictly.</p>
          <button 
            onClick={handleImport}
            disabled={status === "loading" || !jsonText.trim()}
            className="btn-primary px-12 py-3"
          >
            {status === "loading" ? "Processing..." : "Start Bulk Import"}
          </button>
        </div>
      </div>

      {result && (
        <div className={`admin-section border-2 ${status === 'success' ? 'border-gold/30' : 'border-crimson/30'}`}>
          <h3 className={`admin-section-title ${status === 'success' ? 'text-gold' : 'text-crimson'}`}>
            {status === "success" ? "Import Successful" : "Import Failed"}
          </h3>
          {status === "success" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-text3 text-xs mb-1">Total</div>
                <div className="text-2xl font-bold">{result.total}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-text3 text-xs mb-1 text-gold">Created</div>
                <div className="text-2xl font-bold">{result.created}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-text3 text-xs mb-1 text-green-500">Updated</div>
                <div className="text-2xl font-bold">{result.updated}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-text3 text-xs mb-1 text-crimson">Failed</div>
                <div className="text-2xl font-bold">{result.failed}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-crimson/10 rounded-xl text-crimson text-sm">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
