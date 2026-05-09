"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Stats Overview",
      href: "/admin",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
    },
    {
      label: "Artist Directory",
      href: "/admin/artists",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
      label: "Booking Inquiries",
      href: "/admin/inquiries",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
    },
    {
      label: "Bulk Import",
      href: "/admin/import",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
    },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(20, 20, 20, 0.5)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      position: 'fixed',
      top: 'var(--hdr-h)',
      bottom: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ color: 'var(--gold)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '0.5rem' }}>Management</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Dashboard</h2>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: isActive ? 'rgba(212, 160, 23, 0.15)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--text2)',
                fontWeight: isActive ? 600 : 400,
                border: isActive ? '1px solid rgba(212, 160, 23, 0.2)' : '1px solid transparent'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <Link href="/" style={{ display: 'block', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'var(--text2)', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
