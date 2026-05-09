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
      <div className="admin-header">
        <h1 className="admin-title">
          Platform <span className="text-gold">Overview</span>
        </h1>
        <p className="admin-subtitle">Real-time statistics from your database.</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="admin-card">
            <div className="admin-card-icon">{card.icon}</div>
            <div>
              <div className="admin-card-label">{card.title}</div>
              <div className="admin-card-value">
                {loading ? "..." : card.value.toLocaleString()}
              </div>
            </div>
            <div className="admin-card-bg-icon" style={{ color: card.color }}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-layout">
        {/* Quick Actions */}
        <div className="admin-section">
          <h3 className="admin-section-title">Quick Management</h3>
          <div className="admin-action-grid">
            <Link href="/admin/artists/new" className="admin-action-card">
              <div className="admin-action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div className="admin-action-label">Add New Artist</div>
              <div className="admin-action-desc">Manual creation with full media support</div>
            </Link>
            <Link href="/admin/import" className="admin-action-card">
              <div className="admin-action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div className="admin-action-label">Bulk JSON Import</div>
              <div className="admin-action-desc">Import thousands of artists at once</div>
            </Link>
          </div>
        </div>

        {/* System Health */}
        <div className="admin-section">
          <h3 className="admin-section-title">System Status</h3>
          <div className="admin-status-list">
            <div className="admin-status-item">
              <span className="admin-status-label">Database</span>
              <div className="admin-status-value status-healthy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Connected
              </div>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Auth Service</span>
              <div className="admin-status-value status-healthy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Healthy
              </div>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Media Storage</span>
              <div className="admin-status-value status-healthy">
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
