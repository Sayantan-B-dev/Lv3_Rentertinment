"use client";

import { useEffect, useState } from "react";

// Custom Checkbox Component for better look
const Checkbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: `2px solid ${checked ? 'var(--gold)' : 'var(--border)'}`,
      background: checked ? 'var(--gold)' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '0.2s',
      color: 'black'
    }}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    )}
  </div>
);

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchInquiries = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(search);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === inquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inquiries.map(i => i._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} inquiries?`)) return;

    try {
      const res = await fetch(`/api/admin/inquiries`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(i => !selectedIds.includes(i._id)));
        setSelectedIds([]);
      }
    } catch (err) {
      alert("Failed to delete inquiries");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Booking <span style={{ color: 'var(--gold)' }}>Inquiries</span>
          </h1>
          <p style={{ color: 'var(--text2)' }}>Manage lead requests from clients interested in artists.</p>
        </div>
        
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} className="btn-outline" style={{ borderColor: 'var(--crimson)', color: 'var(--crimson)', background: 'rgba(255, 71, 87, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div style={{ 
        background: 'var(--surface)', 
        padding: '1.5rem', 
        borderRadius: '20px', 
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by client name, email or artist..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1.5rem', 
                paddingLeft: '3.5rem',
                borderRadius: '14px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }} 
            />
            <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          <button type="submit" className="btn-outline" style={{ borderRadius: '14px', padding: '0 2rem' }}>Search</button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text3)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', width: '40px' }}>
                  <Checkbox checked={selectedIds.length === inquiries.length && inquiries.length > 0} onChange={toggleSelectAll} />
                </th>
                <th style={{ padding: '1rem' }}>Client Details</th>
                <th style={{ padding: '1rem' }}>Artist / Event</th>
                <th style={{ padding: '1rem' }}>Message</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>Loading inquiries...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>No inquiries found.</td></tr>
              ) : inquiries.map((iq) => (
                <tr key={iq._id} style={{ background: 'rgba(255,255,255,0.02)', height: '100px' }}>
                  <td style={{ padding: '1rem', borderRadius: '12px 0 0 12px', border: '1px solid var(--border)', borderRight: 'none' }}>
                    <Checkbox checked={selectedIds.includes(iq._id)} onChange={() => toggleSelect(iq._id)} />
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{iq.clientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{iq.clientEmail}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{iq.clientPhone}</div>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '600', color: 'var(--gold)' }}>{iq.artistName}</div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ opacity: 0.7 }}>📅</span> {iq.eventDate ? new Date(iq.eventDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{iq.eventType}</div>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', maxWidth: '250px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: '1.4' }}>
                      {iq.message || "No message provided."}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <select 
                      value={iq.status} 
                      onChange={(e) => updateStatus(iq._id, e.target.value)}
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        background: iq.status === 'New' ? 'rgba(212, 160, 23, 0.1)' : iq.status === 'Contacted' ? 'rgba(32, 191, 107, 0.1)' : 'rgba(255,255,255,0.05)', 
                        color: iq.status === 'New' ? 'var(--gold)' : iq.status === 'Contacted' ? '#20bf6b' : 'var(--text3)', 
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        border: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 12px 12px 0', border: '1px solid var(--border)', borderLeft: 'none' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                      {new Date(iq.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                      {new Date(iq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
