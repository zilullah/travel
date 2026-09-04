'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Property, PropertyType, PropertyOwnership, PropertyStatus } from '@/lib/domain/property.types';
import { PropertyService } from '@/lib/services/property.service';
import { SupabasePropertyRepository } from '@/lib/repositories/supabase-property.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { generatePropertySlug } from '@/lib/domain/property.validation';

export default function PropertyFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new' || !id;

  const repo = new SupabasePropertyRepository(supabaseClient);
  const service = new PropertyService(repo);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState<PropertyType>('villa');
  const [location, setLocation] = useState('');
  const [priceIdr, setPriceIdr] = useState<number>(3500000000);
  const [ownership, setOwnership] = useState<PropertyOwnership>('Leasehold (HGB)');
  const [leaseYears, setLeaseYears] = useState<number | undefined>(30);
  const [landSizeM2, setLandSizeM2] = useState<number>(500);
  const [buildingSizeM2, setBuildingSizeM2] = useState<number | undefined>(250);
  const [bedrooms, setBedrooms] = useState<number | undefined>(3);
  const [bathrooms, setBathrooms] = useState<number | undefined>(3);
  const [roi, setRoi] = useState('14% - 18% Net Annual ROI');
  const [beachDistance, setBeachDistance] = useState('5 Mins to Beach');
  const [airportDistance, setAirportDistance] = useState('25 Mins to Airport');
  const [image, setImage] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('For Sale');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      service
        .getPropertyById(id)
        .then((prop) => {
          if (prop) {
            setTitle(prop.title);
            setSlug(prop.slug);
            setTagline(prop.tagline);
            setType(prop.type);
            setLocation(prop.location);
            setPriceIdr(prop.priceIdr);
            setOwnership(prop.ownership);
            setLeaseYears(prop.leaseYears);
            setLandSizeM2(prop.landSizeM2);
            setBuildingSizeM2(prop.buildingSizeM2);
            setBedrooms(prop.bedrooms);
            setBathrooms(prop.bathrooms);
            setRoi(prop.roi);
            setBeachDistance(prop.beachDistance);
            setAirportDistance(prop.airportDistance);
            setImage(prop.image);
            setFeaturesInput(prop.features.join('\n'));
            setStatus(prop.status);
            setIsFeatured(Boolean(prop.isFeatured));
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(generatePropertySlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const data: any = {
        title,
        slug: slug || generatePropertySlug(title),
        tagline,
        type,
        location,
        priceIdr: Number(priceIdr),
        ownership,
        leaseYears: ownership.includes('Leasehold') ? Number(leaseYears) : undefined,
        landSizeM2: Number(landSizeM2),
        buildingSizeM2: buildingSizeM2 ? Number(buildingSizeM2) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        roi,
        beachDistance,
        airportDistance,
        image: image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        features: featuresInput.split('\n').map((s) => s.trim()).filter(Boolean),
        status,
        isFeatured,
      };

      if (isNew) {
        await service.createProperty(data);
      } else {
        await service.updateProperty(id, data);
      }

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err?.message || 'Failed to save property listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Loading property...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <Link href="/admin/properties" className="text-xs font-bold text-[#0284C7] hover:underline mb-1 inline-block">
          ← Back to Properties
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
          {isNew ? 'Create New Real Estate Listing' : `Edit: ${title}`}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#082F49] border-b border-[#F0F9FF] pb-2">
            1. Property Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#082F49] uppercase">Property Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Cliffside Oasis 3-Bedroom Luxury Villa"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="the-cliffside-oasis-luxury-villa"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Location Area</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kuta Mandalika Hilltop"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#082F49] uppercase">Tagline / Key Description</label>
              <textarea
                rows={2}
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Turnkey architectural masterpiece overlooking bay with infinity pool..."
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              >
                <option value="villa">Luxury Villa</option>
                <option value="land">Beachfront / Hilltop Land</option>
                <option value="commercial">Commercial Resort Lot</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Asking Price (IDR)</label>
              <input
                type="number"
                required
                min={0}
                value={priceIdr}
                onChange={(e) => setPriceIdr(Number(e.target.value))}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] font-bold text-[#0284C7] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Title / Ownership</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as PropertyOwnership)}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              >
                <option value="Leasehold (HGB)">Leasehold (HGB)</option>
                <option value="Freehold (SHM)">Freehold (SHM)</option>
                <option value="PMA Foreign Investment">PMA Foreign Investment (PT PMA)</option>
              </select>
            </div>

            {ownership.includes('Leasehold') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F49] uppercase">Lease Years Remaining</label>
                <input
                  type="number"
                  value={leaseYears || ''}
                  onChange={(e) => setLeaseYears(Number(e.target.value))}
                  placeholder="30"
                  className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              >
                <option value="For Sale">For Sale</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Image URL</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Specifications & Metrics */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#082F49] border-b border-[#F0F9FF] pb-2">
            2. Specs, Distances & ROI
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Land Size (m²)</label>
              <input
                type="number"
                required
                min={1}
                value={landSizeM2}
                onChange={(e) => setLandSizeM2(Number(e.target.value))}
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Building (m²)</label>
              <input
                type="number"
                value={buildingSizeM2 || ''}
                onChange={(e) => setBuildingSizeM2(Number(e.target.value))}
                placeholder="250"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Bedrooms</label>
              <input
                type="number"
                value={bedrooms || ''}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                placeholder="3"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Bathrooms</label>
              <input
                type="number"
                value={bathrooms || ''}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                placeholder="3"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#082F49] uppercase">Est. ROI Metric</label>
              <input
                type="text"
                required
                value={roi}
                onChange={(e) => setRoi(e.target.value)}
                placeholder="14% - 18% Net Annual ROI"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Beach Distance</label>
              <input
                type="text"
                required
                value={beachDistance}
                onChange={(e) => setBeachDistance(e.target.value)}
                placeholder="4 Mins to Kuta Beach"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F49] uppercase">Airport Distance</label>
              <input
                type="text"
                required
                value={airportDistance}
                onChange={(e) => setAirportDistance(e.target.value)}
                placeholder="20 Mins to Airport"
                className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#082F49] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Features & Legal */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#082F49] border-b border-[#F0F9FF] pb-2">
            3. Features & Legal Due Diligence (One per line)
          </h3>

          <textarea
            rows={4}
            required
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Infinity Ocean-View Pool&#10;Fully Furnished Turnkey&#10;PMA Management Ready&#10;Clean Legal Due Diligence"
            className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3 text-xs text-[#082F49] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/properties"
            className="px-6 py-3 bg-white border border-[#BAE6FD] hover:bg-slate-50 text-[#082F49] font-bold rounded-[23px] text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create Property Listing' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
