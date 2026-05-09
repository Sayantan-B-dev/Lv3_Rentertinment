import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', paddingTop: 'var(--hdr-h)', minHeight: '100vh' }}>
        <AdminSidebar />

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2.5rem', marginLeft: '260px', minHeight: '100vh' }}>
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
