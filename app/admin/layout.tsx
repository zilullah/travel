'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from './_context/AdminAuthContext';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAdminAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#F0F9FF] text-[#082F49]">{children}</main>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] text-[#082F49]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-4 text-[#082F49]">
        <div className="max-w-md w-full bg-white p-8 rounded-[23px] border border-[#7DD3FC] shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <h2 className="text-2xl font-bold">Admin Access Required</h2>
          <p className="text-sm text-[#486581]">
            You must be authenticated as an <strong>admin</strong> to access this dashboard.
          </p>
          <Link
            href="/admin/login"
            className="inline-block w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm transition-all"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F0F9FF] text-[#082F49]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#7DD3FC] flex flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-black">
              L
            </span>
            <span className="font-extrabold text-lg tracking-tight">Lombok Admin</span>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/admin/packages"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-bold transition-all ${
                pathname.startsWith('/admin/packages')
                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                  : 'text-[#486581] hover:bg-[#F0F9FF]'
              }`}
            >
              <span>🏝️</span>
              <span>Tour Packages</span>
            </Link>
            <Link
              href="/admin/properties"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-bold transition-all ${
                pathname.startsWith('/admin/properties')
                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                  : 'text-[#486581] hover:bg-[#F0F9FF]'
              }`}
            >
              <span>🏡</span>
              <span>Real Estate Properties</span>
            </Link>
            <Link
              href="/admin/transfers"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-bold transition-all ${
                pathname.startsWith('/admin/transfers')
                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                  : 'text-[#486581] hover:bg-[#F0F9FF]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Transfer Points & Fleet</span>
            </Link>
            <Link
              href="/admin/rentals"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-bold transition-all ${
                pathname.startsWith('/admin/rentals')
                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                  : 'text-[#486581] hover:bg-[#F0F9FF]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>Vehicle Rentals (Motor & Mobil)</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-semibold text-[#486581] hover:bg-[#F0F9FF] transition-all"
            >
              <span>🌐</span>
              <span>View Landing Page</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-[#BAE6FD]">
          <div className="text-xs text-[#5B7C93] mb-3">
            Signed in as: <strong className="text-[#082F49] block truncate">{user.email}</strong>
          </div>
          <button
            onClick={() => logout()}
            className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#7DD3FC] px-6 flex items-center justify-between">
          <div className="font-bold text-sm text-[#5B7C93]">Management Console</div>
          <div className="flex items-center gap-3">
            <span className="bg-[#E0F2FE] text-[#0284C7] font-bold text-xs px-3 py-1 rounded-full border border-[#7DD3FC]">
              Role: Admin
            </span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
