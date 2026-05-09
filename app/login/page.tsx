"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLoading } from "@/lib/context/LoadingContext";

type View = "login" | "register" | "verify";

function LoginPageContent() {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    code: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === "Email not verified") {
        setView("verify");
        setError("Please verify your email first.");
      } else {
        setError("Invalid credentials.");
      }
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSuccess("Verification code sent to your email!");
      setView("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          code: formData.code
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSuccess("Email verified! You can now login.");
      setView("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-inner" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--hdr-h) 1rem' }}>
      <div style={{ width: '100%', maxWidth: '450px', background: 'var(--surface)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-playfair)', fontWeight: 900, marginBottom: '0.5rem' }}>
            {view === 'login' ? 'Welcome Back' : view === 'register' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>
            {view === 'login' ? 'Enter your credentials to continue' : view === 'register' ? 'Join India\'s premium artist platform' : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {error && <div style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(255,107,107,0.2)' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(76,201,240,0.1)', color: '#4cc9f0', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(76,201,240,0.2)' }}>{success}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button type="button" onClick={() => signIn('google', { callbackUrl })} className="btn-outline" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', justifyContent: 'center', display: 'flex', gap: '0.5rem' }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text2)' }}>
              Don't have an account? <button type="button" onClick={() => setView('register')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create one</button>
            </p>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="johndoe123" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min 6 characters" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text2)' }}>
              Already have an account? <button type="button" onClick={() => setView('login')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
            </p>
          </form>
        )}

        {view === 'verify' && (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>6-Digit Code</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="123456" maxLength={6} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', color: '#d4a017', outline: 'none', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 'bold' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text2)' }}>
              Didn't receive code? <button type="button" onClick={handleRegister} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Resend</button>
            </p>
          </form>
        )}

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
