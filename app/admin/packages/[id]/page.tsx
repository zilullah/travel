'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { TourPackage, PackageCategory, PackageStatus, ItineraryItem } from '@/lib/domain/package.types';
import { PackageService } from '@/lib/services/package.service';
import { SupabasePackageRepository } from '@/lib/repositories/supabase-package.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/domain/package.validation';

export default function PackageFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new' || !id;

  const repo = new SupabasePackageRepository(supabaseClient);
  const service = new PackageService(repo);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3D2N');
  const [category, setCategory] = useState<PackageCategory>('adventure');
  const [basePriceIdr, setBasePriceIdr] = useState<number>(1500000);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<PackageStatus>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  // Lists
  const [highlightsInput, setHighlightsInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { day: 1, title: 'Arrival & Welcome Dinner', description: 'Airport pickup, hotel check-in, sunset viewpoint tour.' },
  ]);

  useEffect(() => {
    if (!isNew && id) {
      service
        .getPackageById(id)
        .then((pkg) => {
          if (pkg) {
            setTitle(pkg.title);
            setSlug(pkg.slug);
            setTagline(pkg.tagline);
            setDestination(pkg.destination);
            setDuration(pkg.duration);
            setCategory(pkg.category);
            setBasePriceIdr(pkg.basePriceIdr);
            setImageUrl(pkg.imageUrl);
            setStatus(pkg.status);
            setIsFeatured(pkg.isFeatured);
            setHighlightsInput(pkg.highlights.join('\n'));
            setIncludedInput(pkg.included.join('\n'));
            setExcludedInput(pkg.excluded.join('\n'));
            if (pkg.itinerary && pkg.itinerary.length > 0) {
              setItinerary(pkg.itinerary);
            }
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(generateSlug(val));
    }
  };

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '' },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(updated);
  };

  const updateItineraryItem = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const packageData = {
        title,
        slug: slug || generateSlug(title),
        tagline,
        destination,
        duration,
        category,
        basePriceIdr: Number(basePriceIdr),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        highlights: highlightsInput.split('\n').map((s) => s.trim()).filter(Boolean),
        included: includedInput.split('\n').map((s) => s.trim()).filter(Boolean),
        excluded: excludedInput.split('\n').map((s) => s.trim()).filter(Boolean),
        itinerary,
        status,
        isFeatured,
      };

      if (isNew) {
        await service.createPackage(packageData);
      } else {
        await service.updatePackage(id, packageData);
      }

      router.push('/admin/packages');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save package';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Loading package details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/packages" className="text-xs font-bold text-[#0284C7] hover:underline mb-1 inline-block">
            ← Back to Packages
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            {isNew ? 'Create New Tour Package' : `Edit: ${title}`}
          </h1>
        </div>

        {!isNew && (
          <Link
            href={`/admin/packages/${id}/pricing`}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all"
          >
            💰 Manage Pricing Tiers →
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#082F49] border-b border-[#F0F9FF] pb-2">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#082F49] uppercase">Package Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Mount Rinjani Summit Trekking"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mount-rinjani-summit-trekking"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Destination Location</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Sembalun / Senaru, North Lombok"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#082F49] uppercase">Tagline / Short Summary</label>
              <textarea
                rows={2}
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Brief enticing description for the card overview..."
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PackageCategory)}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              >
                <option value="adventure">Adventure</option>
                <option value="island_hopping">Island Hopping</option>
                <option value="cultural">Cultural</option>
                <option value="custom">Custom</option>
                <option value="honeymoon">Honeymoon</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Duration</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3D2N or Full Day"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Base Price (IDR)</label>
              <input
                type="number"
                required
                min={0}
                value={basePriceIdr}
                onChange={(e) => setBasePriceIdr(Number(e.target.value))}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PackageStatus)}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#0284C7] rounded"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-[#082F49] cursor-pointer">
                Feature on Landing Page Hero
              </label>
            </div>
          </div>
        </div>

        {/* Highlights & Inclusions */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#082F49] border-b border-[#F0F9FF] pb-2">
            2. Highlights & Inclusions (One per line)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Highlights</label>
              <textarea
                rows={4}
                required
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Sunrise over Segara Anak&#10;Private camping gear&#10;English speaking guide"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3 text-xs text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Included</label>
              <textarea
                rows={4}
                value={includedInput}
                onChange={(e) => setIncludedInput(e.target.value)}
                placeholder="Trekking permit&#10;Porter service&#10;Meals 3x daily"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3 text-xs text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Excluded</label>
              <textarea
                rows={4}
                value={excludedInput}
                onChange={(e) => setExcludedInput(e.target.value)}
                placeholder="Flight tickets&#10;Personal tips&#10;Travel insurance"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3 text-xs text-[#082F49] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Itinerary Builder */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F9FF] pb-2">
            <h3 className="font-bold text-base text-[#082F49]">
              3. Day-by-Day Itinerary
            </h3>
            <button
              type="button"
              onClick={addItineraryDay}
              className="px-3 py-1 bg-[#E0F2FE] text-[#0284C7] text-xs font-bold rounded-lg hover:bg-[#BAE6FD] transition-all"
            >
              ＋ Add Day
            </button>
          </div>

          <div className="space-y-3">
            {itinerary.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0284C7] uppercase">
                    Day {item.day}
                  </span>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Day title (e.g. Sembalun Crater Rim Trek)"
                  value={item.title}
                  onChange={(e) => updateItineraryItem(idx, 'title', e.target.value)}
                  className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
                />

                <textarea
                  rows={2}
                  placeholder="Day itinerary details and activities..."
                  value={item.description}
                  onChange={(e) => updateItineraryItem(idx, 'description', e.target.value)}
                  className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/packages"
            className="px-6 py-3 bg-white border border-[#BAE6FD] hover:bg-slate-50 text-[#082F49] font-bold rounded-[23px] text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving Package...' : isNew ? 'Create Tour Package' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
