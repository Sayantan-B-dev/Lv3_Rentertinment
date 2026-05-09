import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="flex pt-[var(--hdr-h)] min-h-screen">
        <AdminSidebar />

        {/* Main Content */}
        <main className="admin-main">
          <div className="full-width-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
