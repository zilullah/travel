"use client";

import { useEffect, useMemo, useState } from "react";
import { revalidateLandingPages } from "@/app/_actions/revalidate";
import { formatImageUrl } from "@/app/_lib/utils";
import type { Sponsor } from "@/lib/domain/sponsor.types";
import { SupabaseSponsorRepository } from "@/lib/repositories/supabase-sponsor.repository";
import { SponsorService } from "@/lib/services/sponsor.service";
import { supabaseClient } from "@/lib/supabase/client";

export default function AdminSponsorsPage() {
  const service = useMemo(
    () => new SponsorService(new SupabaseSponsorRepository(supabaseClient)),
    [],
  );
  const [items, setItems] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string }>();

  useEffect(() => {
    service
      .listSponsors(false)
      .then(setItems)
      .catch((error: unknown) =>
        setMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal memuat sponsor." }),
      )
      .finally(() => setLoading(false));
  }, [service]);

  function updateItem(index: number, field: keyof Sponsor, value: string | boolean) {
    setMessage(undefined);
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "Sponsor Baru",
        logoUrl: "",
        websiteUrl: "",
        displayOrder: current.length + 1,
        isActive: true,
      },
    ]);
  }

  async function saveAll() {
    setSaving(true);
    setMessage(undefined);
    try {
      const saved = await service.saveSponsors(items);
      setItems(saved);
      await revalidateLandingPages();
      setMessage({ type: "success", text: "Sponsor tersimpan dan landing page diperbarui." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal menyimpan sponsor." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="py-20 text-center text-sm font-semibold text-[#5B7C93]">Memuat sponsor...</p>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <header className="flex flex-col gap-4 border-b border-[#BAE6FD] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#082F49] sm:text-3xl">Kelola Sponsor</h1>
          <p className="mt-1 text-sm text-[#486581]">Atur logo partner yang tampil sebagai grid di landing page.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addItem} className="rounded-xl bg-[#E0F2FE] px-4 py-2.5 text-xs font-bold text-[#0284C7] hover:bg-[#BAE6FD]">
            + Tambah Sponsor
          </button>
          <button type="button" onClick={saveAll} disabled={saving} className="rounded-xl bg-[#0284C7] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0369A1] disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </header>

      {message && (
        <p className={`rounded-xl border p-4 text-sm font-bold ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {message.text}
        </p>
      )}

      {items.length === 0 && (
        <div className="rounded-[23px] border border-dashed border-[#7DD3FC] bg-white p-10 text-center text-sm text-[#486581]">
          Belum ada sponsor. Tambahkan sponsor untuk menampilkan section di landing page.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.id} className={`space-y-4 rounded-[23px] border bg-white p-5 shadow-sm ${item.isActive ? "border-[#7DD3FC]" : "border-slate-300 opacity-70"}`}>
            <div className="flex items-center justify-between border-b border-[#F0F9FF] pb-3">
              <strong className="text-xs text-[#0284C7]">Sponsor #{index + 1}</strong>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-[#082F49]">
                  <input type="checkbox" checked={item.isActive} onChange={(event) => updateItem(index, "isActive", event.target.checked)} />
                  Tampilkan
                </label>
                <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-bold text-rose-600" aria-label={`Hapus ${item.name}`}>
                  Hapus
                </button>
              </div>
            </div>

            <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] p-4">
              {item.logoUrl ? <img src={formatImageUrl(item.logoUrl)} alt={`${item.name} preview`} className="h-full w-full object-contain" /> : <span className="text-xs text-[#6B8CA5]">Preview logo</span>}
            </div>

            <label className="block text-xs font-bold text-[#082F49]">
              Nama sponsor *
              <input value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} className="mt-1 w-full rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#0284C7]" />
            </label>
            <label className="block text-xs font-bold text-[#082F49]">
              URL logo / Google Drive *
              <input type="url" value={item.logoUrl} onChange={(event) => updateItem(index, "logoUrl", event.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#0284C7]" />
            </label>
            <label className="block text-xs font-bold text-[#082F49]">
              Website sponsor
              <input type="url" value={item.websiteUrl || ""} onChange={(event) => updateItem(index, "websiteUrl", event.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#0284C7]" />
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}
