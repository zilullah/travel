'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GallerySnapshotItem } from '@/lib/domain/gallery.types';
import { SupabaseGalleryRepository } from '@/lib/repositories/supabase-gallery.repository';
import { GalleryService } from '@/lib/services/gallery.service';
import { supabaseClient } from '@/lib/supabase/client';
import { formatImageUrl } from '@/app/_lib/utils';
import { revalidateLandingPages } from '@/app/_actions/revalidate';
import { FALLBACK_GALLERY_SNAPSHOTS } from '@/lib/gallery';

export default function AdminGalleryPage() {
  const repo = new SupabaseGalleryRepository(supabaseClient);
  const service = new GalleryService(repo);

  const [items, setItems] = useState<GallerySnapshotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    service
      .listSnapshots(false)
      .then((data) => {
        setItems(data && data.length > 0 ? data : FALLBACK_GALLERY_SNAPSHOTS);
      })
      .catch((err) => {
        console.error('Failed to load gallery snapshots:', err);
        setItems(FALLBACK_GALLERY_SNAPSHOTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateItemField = (index: number, field: keyof GallerySnapshotItem, value: any) => {
    setStatusMessage(null);
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddNewItem = () => {
    const newItem: GallerySnapshotItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
      title: 'New Snapshot Highlight',
      subtitle: 'Beautiful destination in Lombok',
      badgeTop: 'Adventure',
      badgeStat: 'NEW',
      badgeExtra: 'Must Visit',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/packages',
      displayOrder: items.length + 1,
      isActive: true,
      cardWidthClasses: 'w-[250px] xl:w-[270px]',
      imageAspectClasses: 'aspect-[4/3]',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('Minimal harus ada 1 foto snapshot.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      await service.saveSnapshots(items);
      await revalidateLandingPages();
      setStatusMessage({
        type: 'success',
        text: 'Semua foto Snapshot Gallery berhasil disimpan & disinkronkan ke landing page!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan snapshot gallery';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Memuat data foto snapshot...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE6FD] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            Kelola Snapshot Real Adventures (Scattered Gallery)
          </h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Atur foto-foto yang tampil pada bagian <strong>Visual Journey / Scattered Gallery</strong> di landing page.
            Cukup paste <strong>Link Google Drive</strong> (pastikan akses link &quot;Anyone with the link can view&quot;) atau link gambar biasa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNewItem}
            className="px-4 py-2.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>＋</span>
            <span>Tambah Foto</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Simpan Semua Foto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Google Drive Usage Tip */}
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] p-4 rounded-2xl flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div className="text-xs text-[#082F49] space-y-1">
          <strong className="block">Cara menggunakan Google Drive Link:</strong>
          <p className="text-[#486581]">
            1. Buka file foto di Google Drive &gt; Klik <strong>Bagikan (Share)</strong> &gt; Ubah akses ke <strong>&quot;Siapa saja yang memiliki link (Anyone with the link)&quot;</strong>.
          </p>
          <p className="text-[#486581]">
            2. Copy link (contoh: <code>https://drive.google.com/file/d/1A2B3C.../view?usp=sharing</code>) lalu paste ke kolom <strong>Google Drive / Image URL</strong> di bawah. Sistem otomatis mengubahnya menjadi gambar.
          </p>
        </div>
      </div>

      {/* Snapshot Cards Grid Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const previewSrc = formatImageUrl(item.imageUrl);

          return (
            <div
              key={item.id || idx}
              className={`bg-white rounded-[23px] border ${
                item.isActive ? 'border-[#7DD3FC]' : 'border-slate-300 opacity-75'
              } p-4 shadow-sm space-y-3 relative flex flex-col justify-between`}
            >
              <div className="space-y-3">
                {/* Header Card (Order & Active Toggle) */}
                <div className="flex items-center justify-between pb-2 border-b border-[#F0F9FF]">
                  <span className="text-xs font-black text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                    Foto #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#082F49] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => updateItemField(idx, 'isActive', e.target.checked)}
                        className="rounded text-[#0284C7] w-3.5 h-3.5"
                      />
                      <span>Tampilkan</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1"
                      title="Hapus Kartu Foto"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Visual Image Preview */}
                <div className="relative w-full h-40 bg-slate-900 rounded-xl overflow-hidden border border-[#BAE6FD] flex items-center justify-center">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Tidak ada gambar</span>
                  )}
                  {item.badgeTop && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[#0C4A6E] font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                      {item.badgeTop}
                    </div>
                  )}
                  {item.badgeStat && (
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white font-semibold text-[9px] px-1.5 py-0.5 rounded">
                      {item.badgeStat}
                    </div>
                  )}
                </div>

                {/* Input Fields */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                      Link Google Drive / Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.imageUrl}
                      onChange={(e) => updateItemField(idx, 'imageUrl', e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2.5 py-1.5 text-xs text-[#082F49] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                      Judul Kartu *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) => updateItemField(idx, 'title', e.target.value)}
                      placeholder="e.g. Mount Rinjani Caldera"
                      className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#082F49] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                      Sub-judul / Keterangan
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => updateItemField(idx, 'subtitle', e.target.value)}
                      placeholder="e.g. 3,726 MASL summit • Cloud sea"
                      className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2.5 py-1.5 text-xs text-[#486581] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                        Badge Top
                      </label>
                      <input
                        type="text"
                        value={item.badgeTop || ''}
                        onChange={(e) => updateItemField(idx, 'badgeTop', e.target.value)}
                        placeholder="e.g. 3D2N Trek"
                        className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2 py-1 text-xs text-[#082F49] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                        Badge Stat / Time
                      </label>
                      <input
                        type="text"
                        value={item.badgeStat || ''}
                        onChange={(e) => updateItemField(idx, 'badgeStat', e.target.value)}
                        placeholder="e.g. 3,726 MDPL"
                        className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2 py-1 text-xs text-[#082F49] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                        Badge Footer
                      </label>
                      <input
                        type="text"
                        value={item.badgeExtra || ''}
                        onChange={(e) => updateItemField(idx, 'badgeExtra', e.target.value)}
                        placeholder="e.g. Sembalun Route"
                        className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2 py-1 text-xs text-[#082F49] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#082F49] uppercase text-[10px] mb-0.5">
                        Link Tujuan
                      </label>
                      <select
                        value={item.linkUrl}
                        onChange={(e) => updateItemField(idx, 'linkUrl', e.target.value)}
                        className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-2 py-1 text-xs font-semibold text-[#082F49] focus:outline-none"
                      >
                        <option value="/packages">/packages (Tour)</option>
                        <option value="/rentals">/rentals (Sewa)</option>
                        <option value="/properties">/properties (Villa)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Button at bottom */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="px-8 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Menyimpan Semua Perubahan...' : '💾 Simpan & Sinkronkan ke Landing Page'}
        </button>
      </div>
    </div>
  );
}
