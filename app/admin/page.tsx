"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      });
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Artists</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>{stats.artists.total}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Inquiries</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>{stats.inquiries.total}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>New Inquiries</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>{stats.inquiries.byStatus.New}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Contacted</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4cc9f0' }}>{stats.inquiries.byStatus.Contacted}</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>View All</Link>
        </div>
        
        {stats.inquiries.recent.length === 0 ? (
          <p style={{ color: 'var(--text3)' }}>No recent inquiries.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Client</th>
                <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Artist</th>
                <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Event Date</th>
                <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.inquiries.recent.map((inq: any) => (
                <tr key={inq._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem' }}>{inq.clientName}</td>
                  <td style={{ padding: '0.75rem' }}>{inq.artistName}</td>
                  <td style={{ padding: '0.75rem' }}>{inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '100px', 
                      fontSize: '0.75rem', 
                      background: inq.status === 'New' ? 'rgba(255,107,107,0.1)' : 'rgba(76,201,240,0.1)',
                      color: inq.status === 'New' ? '#ff6b6b' : '#4cc9f0'
                    }}>
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
