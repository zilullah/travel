"use client";

import React, { useEffect, useState } from "react";
import { revalidateLandingPages } from "@/app/_actions/revalidate";
import { formatImageUrl } from "@/app/_lib/utils";
import { CustomerReviewItem } from "@/lib/domain/review.types";
import { FALLBACK_CUSTOMER_REVIEWS } from "@/lib/reviews";
import { SupabaseReviewRepository } from "@/lib/repositories/supabase-review.repository";
import { ReviewService } from "@/lib/services/review.service";
import { supabaseClient } from "@/lib/supabase/client";

const service = new ReviewService(new SupabaseReviewRepository(supabaseClient));

type StatusMessage = { type: "success" | "error"; text: string } | null;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  useEffect(() => {
    service
      .listReviews(false)
      .then((data) => setReviews(data.length > 0 ? data : FALLBACK_CUSTOMER_REVIEWS))
      .catch(() => setReviews(FALLBACK_CUSTOMER_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  const updateReview = (index: number, field: keyof CustomerReviewItem, value: unknown) => {
    setStatusMessage(null);
    setReviews((current) =>
      current.map((review, reviewIndex) =>
        reviewIndex === index ? { ...review, [field]: value } : review,
      ),
    );
  };

  const addReview = () => setReviews((current) => [...current, service.createDefault(current.length + 1)]);

  const removeReview = (index: number) => {
    if (reviews.length <= 1) {
      setStatusMessage({ type: "error", text: "Minimal harus ada satu review." });
      return;
    }
    if (!window.confirm("Hapus review ini dari daftar admin?")) return;
    setReviews((current) => current.filter((_, reviewIndex) => reviewIndex !== index));
  };

  const moveReview = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= reviews.length) return;
    setReviews((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const saveReviews = async () => {
    if (reviews.some((review) => !review.screenshotUrl.trim() || !review.reviewerName.trim() || !review.reviewText.trim())) {
      setStatusMessage({ type: "error", text: "Isi screenshot, nama reviewer, dan transkripsi review terlebih dahulu." });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      const saved = await service.saveReviews(reviews);
      setReviews(saved);
      await revalidateLandingPages();
      setStatusMessage({ type: "success", text: "Review berhasil disimpan dan disinkronkan ke landing page." });
    } catch (error) {
      setStatusMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal menyimpan review." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Memuat review...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <div className="flex flex-col justify-between gap-4 border-b border-[#BAE6FD] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#082F49] sm:text-3xl">Kelola Google Maps Reviews</h1>
          <p className="text-xs text-[#486581] sm:text-sm">Atur screenshot review Google Maps dan teks aksesibilitas yang tampil di Review Wall.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addReview} className="rounded-xl bg-[#E0F2FE] px-4 py-2.5 text-xs font-bold text-[#0284C7] hover:bg-[#BAE6FD]">＋ Tambah Review</button>
          <button type="button" onClick={saveReviews} disabled={saving} className="rounded-xl bg-[#0284C7] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0369A1] disabled:opacity-50">{saving ? "Menyimpan..." : "💾 Simpan Review"}</button>
        </div>
      </div>

      {statusMessage && (
        <div className={`rounded-xl border p-4 text-xs font-bold ${statusMessage.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {statusMessage.type === "success" ? "✓" : "⚠️"} {statusMessage.text}
        </div>
      )}

      <div className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 text-xs text-[#486581]">
        <strong className="text-[#082F49]">Petunjuk screenshot:</strong> upload screenshot review di Google Maps, simpan di Google Drive, ubah akses menjadi “Anyone with the link can view”, lalu paste link-nya di bawah. Transkripsi review wajib diisi agar tetap terbaca oleh mesin pencari dan screen reader.
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <ReviewEditorCard
            key={review.id}
            review={review}
            index={index}
            total={reviews.length}
            onChange={updateReview}
            onMove={moveReview}
            onRemove={removeReview}
          />
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <button type="button" onClick={saveReviews} disabled={saving} className="rounded-[23px] bg-[#0284C7] px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-[#0369A1] disabled:opacity-50">{saving ? "Menyimpan Semua Perubahan..." : "💾 Simpan & Sinkronkan"}</button>
      </div>
    </div>
  );
}

interface ReviewEditorCardProps {
  review: CustomerReviewItem;
  index: number;
  total: number;
  onChange: (index: number, field: keyof CustomerReviewItem, value: unknown) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}

function ReviewEditorCard({ review, index, total, onChange, onMove, onRemove }: ReviewEditorCardProps) {
  const preview = formatImageUrl(review.screenshotUrl);
  const inputClass = "w-full rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]";
  const set = (field: keyof CustomerReviewItem) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(index, field, event.target.value);

  return (
    <article className={`grid gap-6 rounded-[23px] border bg-white p-5 shadow-sm lg:grid-cols-[280px_1fr] ${review.isActive ? "border-[#7DD3FC]" : "border-slate-300 opacity-75"}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#0284C7]">
          <span>Review #{index + 1}</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Move review up" className="rounded bg-[#E0F2FE] px-2 py-1 disabled:opacity-40">↑</button>
            <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Move review down" className="rounded bg-[#E0F2FE] px-2 py-1 disabled:opacity-40">↓</button>
            <button type="button" onClick={() => onRemove(index)} className="rounded bg-rose-50 px-2 py-1 text-rose-600">✕</button>
          </div>
        </div>
        <div className="relative h-56 overflow-hidden rounded-xl border border-[#BAE6FD] bg-slate-900">
          {preview ? <img src={preview} alt={`Preview Google Maps review ${index + 1}`} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-slate-400">Tidak ada screenshot</span>}
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-[#082F49]"><input type="checkbox" checked={review.isActive} onChange={(event) => onChange(index, "isActive", event.target.checked)} /> Tampilkan di landing page</label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[10px] font-bold uppercase text-[#082F49] sm:col-span-2">Google Drive / Image URL *<input className={inputClass} type="url" value={review.screenshotUrl} onChange={set("screenshotUrl")} placeholder="https://drive.google.com/file/d/..." /></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49]">Nama reviewer *<input className={inputClass} type="text" value={review.reviewerName} onChange={set("reviewerName")} /></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49]">Lokasi<input className={inputClass} type="text" value={review.location} onChange={set("location")} /></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49]">Rating<select className={inputClass} value={review.rating} onChange={(event) => onChange(index, "rating", Number(event.target.value))}>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49]">Layanan / perjalanan<input className={inputClass} type="text" value={review.serviceLabel} onChange={set("serviceLabel")} /></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49] sm:col-span-2">Transkripsi review *<textarea className={`${inputClass} min-h-28`} value={review.reviewText} onChange={set("reviewText")} /></label>
        <label className="text-[10px] font-bold uppercase text-[#082F49] sm:col-span-2">Link Google Maps (opsional)<input className={inputClass} type="url" value={review.googleMapsUrl || ""} onChange={set("googleMapsUrl")} placeholder="https://maps.google.com/..." /></label>
      </div>
    </article>
  );
}
