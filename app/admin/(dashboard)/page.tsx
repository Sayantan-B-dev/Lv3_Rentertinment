"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      });
  }, []);

  const statCards = [
    { title: "Total Artists", value: stats?.totalArtists || 0, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: "var(--gold)" },
    { title: "Total Images", value: stats?.totalImages || 0, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, color: "#45aaf2" },
    { title: "Video Samples", value: stats?.totalVideos || 0, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>, color: "#eb4d4b" },
    { title: "Booking Inquiries", value: stats?.totalInquiries || 0, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, color: "#20bf6b" },
  ];

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Platform <span style={{ color: 'var(--gold)' }}>Overview</span>
        </h1>
        <p style={{ color: 'var(--text2)' }}>Real-time statistics from your TaranumTalent database.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ 
            background: 'var(--surface)', 
            padding: '2rem', 
            borderRadius: '24px', 
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ fontSize: '2rem' }}>{card.icon}</div>
            <div>
              <div style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{card.title}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                {loading ? "..." : card.value.toLocaleString()}
              </div>
            </div>
            <div style={{ 
              position: 'absolute', 
              right: '-10px', 
              bottom: '-10px', 
              fontSize: '5rem', 
              opacity: 0.05,
              color: card.color
            }}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Quick Actions */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Management</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link href="/admin/artists/new" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--gold)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div style={{ fontWeight: '700' }}>Add New Artist</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Manual creation with full media support</div>
            </Link>
            <Link href="/admin/import" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--gold)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div style={{ fontWeight: '700' }}>Bulk JSON Import</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Import thousands of artists at once</div>
            </Link>
          </div>
        </div>

        {/* System Health */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text2)' }}>Database</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#20bf6b', fontWeight: '700' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Connected
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text2)' }}>Auth Service</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#20bf6b', fontWeight: '700' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Healthy
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text2)' }}>Media Storage</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#20bf6b', fontWeight: '700' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
