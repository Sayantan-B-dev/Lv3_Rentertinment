"use client";

import { useEffect, useState } from "react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetchInquiries = () => {
    fetch("/api/inquiries")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInquiries(data.data);
        }
      });
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchInquiries();
  };

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Inquiries Management</h1>
      
      <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Client</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Artist</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Event Date</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Phone</th>
              <th style={{ padding: '0.75rem', color: 'var(--text2)', fontWeight: 'normal' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>{inq.clientName}</td>
                <td style={{ padding: '0.75rem' }}>{inq.artistName}</td>
                <td style={{ padding: '0.75rem' }}>{inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{inq.clientPhone}</td>
                <td style={{ padding: '0.75rem' }}>
                  <select 
                    value={inq.status} 
                    onChange={(e) => updateStatus(inq._id, e.target.value)}
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.2rem', borderRadius: '4px' }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
