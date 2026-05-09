"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Settings</h1>
      <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text2)' }}>Admin email and password are configured via environment variables (.env.local) for the MVP.</p>
      </div>
    </div>
  );
}
