"use client";

import { useState } from "react";

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
    <div>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Bulk JSON Import</h1>
      
      <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>Paste a JSON array of artists to bulk import or update them.</p>
        
        <textarea 
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          rows={15}
          style={{ width: '100%', padding: '1rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'monospace' }}
          placeholder='[ { "name": "Artist", "category": "Singer", "source": { "url": "..." } } ]'
        ></textarea>
        
        <button 
          onClick={handleImport}
          disabled={status === "loading" || !jsonText.trim()}
          className="btn-primary" 
          style={{ marginTop: '1rem' }}
        >
          {status === "loading" ? "Importing..." : "Import JSON"}
        </button>
      </div>

      {result && (
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: `1px solid ${status === 'success' ? 'var(--gold)' : 'var(--crimson)'}` }}>
          <h3 style={{ marginBottom: '1rem', color: status === 'success' ? 'var(--gold)' : 'var(--crimson)' }}>
            {status === "success" ? "Import Summary" : "Import Error"}
          </h3>
          {status === "success" ? (
            <ul>
              <li>Total Processed: {result.total}</li>
              <li>Created: {result.created}</li>
              <li>Updated: {result.updated}</li>
              <li>Failed: {result.failed}</li>
            </ul>
          ) : (
            <p>{result}</p>
          )}
        </div>
      )}
    </div>
  );
}
