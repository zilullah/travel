'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PricingTier, TourPackage } from '@/lib/domain/package.types';
import { PackageService } from '@/lib/services/package.service';
import { SupabasePackageRepository } from '@/lib/repositories/supabase-package.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { formatIDR } from '@/app/_lib/utils';
import { revalidateLandingPages } from '@/app/_actions/revalidate';

export default function PackagePricingPage() {
  const params = useParams();
  const packageId = params?.id as string;

  const repo = new SupabasePackageRepository(supabaseClient);
  const service = new PackageService(repo);

  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (packageId) {
      Promise.all([
        service.getPackageById(packageId),
        repo.getPricingTiers(packageId),
      ])
        .then(([pkgData, tierData]) => {
          setPkg(pkgData);
          if (tierData && tierData.length > 0) {
            setTiers(tierData);
          } else if (pkgData?.pricingTiers && pkgData.pricingTiers.length > 0) {
            setTiers(pkgData.pricingTiers);
          } else {
            // Default tiers template based on basePrice
            const base = pkgData?.basePriceIdr || 2000000;
            setTiers([
              { tierName: 'Solo Traveler (1 Pax)', minPax: 1, maxPax: 1, pricePerPaxIdr: base, discountPercent: 0 },
              { tierName: 'Couple / Duo (2 Pax)', minPax: 2, maxPax: 2, pricePerPaxIdr: Math.round(base * 0.85), discountPercent: 15 },
              { tierName: 'Small Group (3-5 Pax)', minPax: 3, maxPax: 5, pricePerPaxIdr: Math.round(base * 0.7), discountPercent: 30 },
              { tierName: 'Group Saver (6-12 Pax)', minPax: 6, maxPax: 12, pricePerPaxIdr: Math.round(base * 0.55), discountPercent: 45 },
            ]);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [packageId]);

  const addTier = () => {
    setSuccess(null);
    const lastTier = tiers[tiers.length - 1];
    const nextMin = lastTier ? lastTier.maxPax + 1 : 1;
    const nextMax = nextMin + 2;
    const base = pkg?.basePriceIdr || 1500000;

    setTiers([
      ...tiers,
      {
        tierName: `Group (${nextMin}-${nextMax} Pax)`,
        minPax: nextMin,
        maxPax: nextMax,
        pricePerPaxIdr: Math.round(base * 0.5),
        discountPercent: 50,
      },
    ]);
  };

  const removeTier = (index: number) => {
    setSuccess(null);
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const clearAllTiers = () => {
    if (confirm('Hapus semua daftar pricing tier untuk paket ini?')) {
      setSuccess(null);
      setTiers([]);
    }
  };

  const updateTierField = (index: number, field: keyof PricingTier, value: string | number) => {
    setSuccess(null);
    const updated = [...tiers];
    const item = { ...updated[index], [field]: value };

    // Auto-calculate discount if price per pax changes and base price is known
    if (field === 'pricePerPaxIdr' && pkg?.basePriceIdr && pkg.basePriceIdr > 0) {
      const numPrice = Number(value);
      const discount = Math.max(0, Math.round(((pkg.basePriceIdr - numPrice) / pkg.basePriceIdr) * 100));
      item.discountPercent = discount;
    }

    updated[index] = item;
    setTiers(updated);
  };

  const handleSaveTiers = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // Validate bounds before submitting
      for (const tier of tiers) {
        if (tier.minPax > tier.maxPax) {
          throw new Error(`Tier "${tier.tierName}": Min Pax (${tier.minPax}) tidak boleh lebih besar dari Max Pax (${tier.maxPax})`);
        }
      }

      await service.updatePricingTiers(packageId, tiers);
      await revalidateLandingPages();
      setSuccess(
        tiers.length === 0
          ? 'Semua pricing tier berhasil dihapus dan landing page telah disinkronkan!'
          : `Berhasil memperbarui ${tiers.length} pricing tier paket wisata!`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan daftar harga paket';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Memuat pricing tiers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/packages" className="text-xs font-bold text-[#0284C7] hover:underline mb-1 inline-block">
            ← Kembali ke Paket Wisata
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            Kelola Pricing Tiers & Diskon
          </h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Paket: <strong className="text-[#082F49]">{pkg?.title || 'Tour Package'}</strong> (Harga Dasar:{' '}
            {pkg ? formatIDR(pkg.basePriceIdr) : '0'})
          </p>
        </div>

        <div className="flex gap-2">
          {tiers.length > 0 && (
            <button
              type="button"
              onClick={clearAllTiers}
              className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-[23px] text-xs transition-all"
            >
              Hapus Semua
            </button>
          )}
          <button
            type="button"
            onClick={addTier}
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-xs transition-all shadow-sm"
          >
            ＋ Tambah Tier Baru
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center justify-between">
          <span>✓ {success}</span>
          <Link href="/admin/packages" className="underline text-xs">
            Kembali ke Daftar Paket
          </Link>
        </div>
      )}

      <form onSubmit={handleSaveTiers} className="space-y-4">
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          {tiers.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-3xl">🏷️</div>
              <h3 className="font-bold text-[#082F49]">Belum ada Pricing Tier</h3>
              <p className="text-xs text-[#5B7C93] max-w-sm mx-auto">
                Harga paket akan menggunakan harga dasar. Klik tombol di bawah untuk menambahkan tier grup / diskon kuota pax.
              </p>
              <button
                type="button"
                onClick={addTier}
                className="mt-2 px-5 py-2 bg-[#0284C7] text-white text-xs font-bold rounded-xl"
              >
                ＋ Tambah Tier Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] font-bold text-[#082F49] uppercase">Label / Nama Tier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Small Group (3-5 Pax)"
                      value={tier.tierName}
                      onChange={(e) => updateTierField(idx, 'tierName', e.target.value)}
                      className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#082F49] uppercase">Min Pax</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={tier.minPax}
                      onChange={(e) => updateTierField(idx, 'minPax', Number(e.target.value))}
                      className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#082F49] uppercase">Max Pax</label>
                    <input
                      type="number"
                      min={tier.minPax}
                      required
                      value={tier.maxPax}
                      onChange={(e) => updateTierField(idx, 'maxPax', Number(e.target.value))}
                      className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-[#082F49] uppercase">Harga/Pax (IDR)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={tier.pricePerPaxIdr}
                      onChange={(e) => updateTierField(idx, 'pricePerPaxIdr', Number(e.target.value))}
                      className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] font-bold text-[#0284C7] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTier(idx)}
                      className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-100/60 rounded-lg text-sm font-bold transition-all"
                      title="Hapus Tier Ini"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-[#F0F9FF]">
            <Link
              href="/admin/packages"
              className="px-6 py-2.5 bg-white border border-[#BAE6FD] text-[#082F49] font-bold rounded-[23px] text-xs"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Menyimpan...' : 'Simpan Semua Pricing Tiers'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
