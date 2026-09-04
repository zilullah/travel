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
              href="/properties"
              className="flex items-center gap-3 px-4 py-2.5 rounded-[23px] text-sm font-semibold text-[#486581] hover:bg-[#F0F9FF] transition-all"
            >
              <span>🏡</span>
              <span>View Landing</span>
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
