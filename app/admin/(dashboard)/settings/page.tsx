"use client";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="admin-title">System <span className="text-gold">Settings</span></h1>
        <p className="admin-subtitle">Manage platform-wide configurations and authentication.</p>
      </div>

      <div className="admin-section">
        <h3 className="admin-section-title">Authentication & Security</h3>
        <p className="text-text2 mb-6">
          Admin credentials and security keys are currently managed via server-side environment variables for maximum protection.
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-text3">Admin Login Method</span>
            <span className="font-semibold text-gold">NextAuth Credentials</span>
          </div>
          <div className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-text3">Environment State</span>
            <span className="font-semibold text-green-500">Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
