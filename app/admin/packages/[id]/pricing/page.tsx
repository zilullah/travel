'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PricingTier, TourPackage } from '@/lib/domain/package.types';
import { PackageService } from '@/lib/services/package.service';
import { SupabasePackageRepository } from '@/lib/repositories/supabase-package.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { formatIDR } from '@/app/_lib/utils';

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
  const [success, setSuccess] = useState(false);

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
          } else {
            // Default tiers template
            setTiers([
              { tierName: 'Solo Traveler (1 Pax)', minPax: 1, maxPax: 1, pricePerPaxIdr: pkgData?.basePriceIdr || 2000000, discountPercent: 0 },
              { tierName: 'Couple / Duo (2 Pax)', minPax: 2, maxPax: 2, pricePerPaxIdr: Math.round((pkgData?.basePriceIdr || 2000000) * 0.85), discountPercent: 15 },
              { tierName: 'Small Group (3-5 Pax)', minPax: 3, maxPax: 5, pricePerPaxIdr: Math.round((pkgData?.basePriceIdr || 2000000) * 0.7), discountPercent: 30 },
              { tierName: 'Group Saver (6-12 Pax)', minPax: 6, maxPax: 12, pricePerPaxIdr: Math.round((pkgData?.basePriceIdr || 2000000) * 0.55), discountPercent: 45 },
            ]);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [packageId]);

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        tierName: 'Custom Tier',
        minPax: 1,
        maxPax: 4,
        pricePerPaxIdr: pkg?.basePriceIdr || 1500000,
        discountPercent: 0,
      },
    ]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTierField = (index: number, field: keyof PricingTier, value: string | number) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const handleSaveTiers = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await service.updatePricingTiers(packageId, tiers);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save pricing tiers';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Loading pricing tiers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/packages" className="text-xs font-bold text-[#0284C7] hover:underline mb-1 inline-block">
            ← Back to Packages
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            Pricing Tiers & Discounts
          </h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Package: <strong className="text-[#082F49]">{pkg?.title}</strong> (Base:{' '}
            {pkg ? formatIDR(pkg.basePriceIdr) : '0'})
          </p>
        </div>

        <button
          type="button"
          onClick={addTier}
          className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-xs transition-all shadow-sm"
        >
          ＋ Add Custom Tier
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center justify-between">
          <span>✓ Pricing tiers updated and synced to Supabase successfully!</span>
          <Link href="/admin/packages" className="underline text-xs">
            Return to list
          </Link>
        </div>
      )}

      <form onSubmit={handleSaveTiers} className="space-y-4">
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <div className="space-y-3">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-[#082F49] uppercase">Tier Label</label>
                  <input
                    type="text"
                    required
                    value={tier.tierName}
                    onChange={(e) => updateTierField(idx, 'tierName', e.target.value)}
                    className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
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
                    className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
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
                    className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-[#082F49] uppercase">Price/Pax (IDR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={tier.pricePerPaxIdr}
                    onChange={(e) => updateTierField(idx, 'pricePerPaxIdr', Number(e.target.value))}
                    className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] font-bold text-[#0284C7] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1"
                    title="Remove Tier"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#F0F9FF]">
            <Link
              href="/admin/packages"
              className="px-6 py-2.5 bg-white border border-[#BAE6FD] text-[#082F49] font-bold rounded-[23px] text-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-xs shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Pricing Tiers'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
