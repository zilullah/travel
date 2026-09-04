'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TourPackage, PackageCategory, PackageStatus } from '@/lib/domain/package.types';
import { PackageService } from '@/lib/services/package.service';
import { SupabasePackageRepository } from '@/lib/repositories/supabase-package.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { formatIDR } from '@/app/_lib/utils';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const repo = new SupabasePackageRepository(supabaseClient);
  const service = new PackageService(repo);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await service.listPackages();
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleStatusChange = async (id: string, status: PackageStatus) => {
    try {
      await service.updatePackageStatus(id, status);
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await service.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  const filtered = packages.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            Tour Packages & Products
          </h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Manage all travel tours, itineraries, and custom pricing tiers.
          </p>
        </div>

        <Link
          href="/admin/packages/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-sm transition-all"
        >
          <span>＋</span>
          <span>Add New Package</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[23px] border border-[#7DD3FC] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by tour title or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs font-semibold text-[#082F49] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="adventure">Adventure</option>
            <option value="island_hopping">Island Hopping</option>
            <option value="cultural">Cultural</option>
            <option value="custom">Custom</option>
            <option value="honeymoon">Honeymoon</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs font-semibold text-[#082F49] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Package List / Table */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">
          Loading tour packages...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-[23px] border border-[#7DD3FC] space-y-3">
          <div className="text-3xl">🏝️</div>
          <h3 className="font-bold text-[#082F49]">No tour packages found</h3>
          <p className="text-xs text-[#486581]">
            Try changing your search filters or create a new package to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-[23px] border border-[#7DD3FC] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={pkg.imageUrl || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80'}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      pkg.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : pkg.status === 'draft'
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-slate-400 text-white'
                    }`}
                  >
                    {pkg.status}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                    {pkg.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-[#082F49] line-clamp-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#486581] mt-1 line-clamp-2">
                    {pkg.tagline || 'No description provided.'}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#5B7C93] pt-2 border-t border-[#F0F9FF]">
                    <span>📍 {pkg.destination}</span>
                    <span>⏱️ {pkg.duration}</span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-[#0284C7]">
                    Base Price: {formatIDR(pkg.basePriceIdr)}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F9FF] flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="px-3 py-1.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] font-bold text-xs rounded-lg transition-all"
                    >
                      Edit Details
                    </Link>
                    <Link
                      href={`/admin/packages/${pkg.id}/pricing`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-all"
                    >
                      Pricing Tiers
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(pkg.id, pkg.title)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                    title="Delete Package"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
