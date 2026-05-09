import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold)' }}>Admin Panel</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text)', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/admin/artists" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text)', textDecoration: 'none' }}>Artists</Link>
          <Link href="/admin/inquiries" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text)', textDecoration: 'none' }}>Inquiries</Link>
          <Link href="/admin/import" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text)', textDecoration: 'none' }}>JSON Import</Link>
          <Link href="/api/auth/signout" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--crimson)', textDecoration: 'none', marginTop: 'auto' }}>Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
