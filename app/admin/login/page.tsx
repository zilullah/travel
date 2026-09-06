'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../_context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin/packages');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please verify credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F9FF]">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[23px] border border-[#7DD3FC] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-black mx-auto text-xl shadow-md">
            L
          </span>
          <h1 className="text-2xl font-extrabold text-[#082F49]">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Sign in with your authorized admin account to manage packages and pricing.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#082F49] uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lomboktravel.com"
              className="w-full bg-[#F0F9FF] border border-[#7DD3FC] rounded-xl px-4 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#082F49] uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F0F9FF] border border-[#7DD3FC] rounded-xl px-4 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs font-semibold text-[#0284C7] hover:underline">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
