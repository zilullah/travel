"use client";

import React, { useEffect, useState } from "react";
import { TransferLocation, TransferVehicle } from "@/lib/domain/transfer.types";
import { TransferService } from "@/lib/services/transfer.service";
import { SupabaseTransferRepository } from "@/lib/repositories/supabase-transfer.repository";
import { supabaseClient } from "@/lib/supabase/client";
import { formatIDR } from "@/app/_lib/utils";
import { revalidateLandingPages } from "@/app/_actions/revalidate";
import {
  FALLBACK_TRANSFER_LOCATIONS,
  FALLBACK_TRANSFER_VEHICLES,
} from "@/app/_lib/transfers";

export default function AdminTransfersPage() {
  const repo = new SupabaseTransferRepository(supabaseClient);
  const service = new TransferService(repo);

  const [locations, setLocations] = useState<TransferLocation[]>([]);
  const [vehicles, setVehicles] = useState<TransferVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Location Form State
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locName, setLocName] = useState("");
  const [locArea, setLocArea] = useState("Central / South Lombok");
  const [locType, setLocType] = useState<"both" | "pickup" | "dropoff">("both");
  const [locSaving, setLocSaving] = useState(false);

  // Vehicle Form State
  const [editingVehId, setEditingVehId] = useState<string | null>(null);
  const [vehName, setVehName] = useState("");
  const [vehCategory, setVehCategory] = useState("Comfort MPV");
  const [vehPax, setVehPax] = useState(6);
  const [vehRate, setVehRate] = useState(450000);
  const [vehSaving, setVehSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locs, vehs] = await Promise.all([
        service.listLocations(),
        service.listVehicles(),
      ]);
      setLocations(
        locs && locs.length > 0 ? locs : FALLBACK_TRANSFER_LOCATIONS,
      );
      setVehicles(
        vehs && vehs.length > 0 ? vehs : FALLBACK_TRANSFER_VEHICLES,
      );
    } catch (err) {
      console.error("Failed to load transfers:", err);
      setLocations(FALLBACK_TRANSFER_LOCATIONS);
      setVehicles(FALLBACK_TRANSFER_VEHICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Location Handlers
  const resetLocForm = () => {
    setEditingLocId(null);
    setLocName("");
    setLocArea("Central / South Lombok");
    setLocType("both");
  };

  const handleEditLocation = (loc: TransferLocation) => {
    setEditingLocId(loc.id);
    setLocName(loc.name);
    setLocArea(loc.area);
    setLocType(loc.locationType);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName.trim()) return;

    setLocSaving(true);
    try {
      if (editingLocId) {
        const updated = await service.updateLocation(editingLocId, {
          name: locName.trim(),
          area: locArea.trim(),
          locationType: locType,
        });
        setLocations((prev) => prev.map((l) => (l.id === editingLocId ? updated : l)));
        setStatusMessage({ type: "success", text: `Lokasi "${updated.name}" berhasil diperbarui!` });
      } else {
        const created = await service.createLocation({
          name: locName.trim(),
          area: locArea.trim(),
          locationType: locType,
          isActive: true,
          displayOrder: locations.length + 1,
        });
        setLocations((prev) => [...prev, created]);
        setStatusMessage({ type: "success", text: `Lokasi "${created.name}" berhasil ditambahkan!` });
      }
      await revalidateLandingPages();
      resetLocForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan lokasi";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setLocSaving(false);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!confirm(`Hapus titik lokasi "${name}"?`)) return;
    try {
      await service.deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      if (editingLocId === id) resetLocForm();
      await revalidateLandingPages();
      setStatusMessage({ type: "success", text: `Lokasi "${name}" berhasil dihapus.` });
    } catch {
      setStatusMessage({ type: "error", text: "Gagal menghapus lokasi" });
    }
  };

  // Vehicle Handlers
  const resetVehForm = () => {
    setEditingVehId(null);
    setVehName("");
    setVehCategory("Comfort MPV");
    setVehPax(6);
    setVehRate(450000);
  };

  const handleEditVehicle = (veh: TransferVehicle) => {
    setEditingVehId(veh.id);
    setVehName(veh.name);
    setVehCategory(veh.category);
    setVehPax(veh.capacityPax);
    setVehRate(veh.baseRateIdr);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim()) return;

    setVehSaving(true);
    try {
      if (editingVehId) {
        const updated = await service.updateVehicle(editingVehId, {
          name: vehName.trim(),
          category: vehCategory.trim(),
          capacityPax: Number(vehPax),
          baseRateIdr: Number(vehRate),
        });
        setVehicles((prev) => prev.map((v) => (v.id === editingVehId ? updated : v)));
        setStatusMessage({ type: "success", text: `Armada "${updated.name}" berhasil diperbarui!` });
      } else {
        const created = await service.createVehicle({
          name: vehName.trim(),
          category: vehCategory.trim(),
          capacityPax: Number(vehPax),
          baseRateIdr: Number(vehRate),
          isActive: true,
        });
        setVehicles((prev) => [...prev, created]);
        setStatusMessage({ type: "success", text: `Armada "${created.name}" berhasil ditambahkan!` });
      }
      await revalidateLandingPages();
      resetVehForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan armada";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setVehSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Hapus armada "${name}"?`)) return;
    try {
      await service.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (editingVehId === id) resetVehForm();
      await revalidateLandingPages();
      setStatusMessage({ type: "success", text: `Armada "${name}" berhasil dihapus.` });
    } catch {
      setStatusMessage({ type: "error", text: "Gagal menghapus armada" });
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
          Transfer Locations & Fleet Management
        </h1>
        <p className="text-xs sm:text-sm text-[#486581]">
          Kelola titik jemput/antar seluruh Lombok dan kategori armada kendaraan antar-jemput.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transfer Locations */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F9FF] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#082F49] flex items-center gap-2">
                <span>📍</span>
                <span>Pickup & Drop-off Points</span>
              </h2>
              <p className="text-xs text-[#5B7C93]">
                Tersedia di dropdown pencarian transfer & form Antar-Jemput.
              </p>
            </div>
            {editingLocId && (
              <button
                type="button"
                onClick={resetLocForm}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          {/* Add / Edit Location Form */}
          <form
            onSubmit={handleSaveLocation}
            className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-3"
          >
            <div className="font-bold text-xs text-[#082F49] uppercase">
              {editingLocId ? "Edit Titik Lokasi" : "Tambah Titik Lokasi Baru"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Nama lokasi (e.g. Kuta Mandalika Beach)"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              <input
                type="text"
                required
                placeholder="Area (e.g. South Lombok)"
                value={locArea}
                onChange={(e) => setLocArea(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={locType}
                onChange={(e) => setLocType(e.target.value as "both" | "pickup" | "dropoff")}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs font-semibold text-[#082F49] focus:outline-none"
              >
                <option value="both">Bisa Pickup & Dropoff</option>
                <option value="pickup">Hanya Pickup</option>
                <option value="dropoff">Hanya Dropoff</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={locSaving}
              className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {locSaving ? "Menyimpan..." : editingLocId ? "Simpan Perubahan Lokasi" : "＋ Tambah Titik Lokasi"}
            </button>
          </form>

          {/* Location List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-6 text-xs text-[#5B7C93]">Memuat data lokasi...</div>
            ) : locations.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#486581]">Belum ada lokasi transfer.</div>
            ) : (
              locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 bg-white border border-[#BAE6FD] rounded-xl flex items-center justify-between hover:bg-[#F0F9FF] transition-all"
                >
                  <div>
                    <div className="font-bold text-xs text-[#082F49]">
                      {loc.name}
                    </div>
                    <div className="text-[10px] text-[#5B7C93]">
                      Area: {loc.area} • {loc.locationType}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditLocation(loc)}
                      className="text-[#0284C7] hover:bg-[#E0F2FE] font-bold text-xs px-2.5 py-1 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(loc.id, loc.name)}
                      className="text-rose-500 hover:bg-rose-50 font-bold text-xs px-2.5 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fleet Vehicles */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F9FF] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#082F49] flex items-center gap-2">
                <span>🚗</span>
                <span>Fleet Vehicles & Chauffeur</span>
              </h2>
              <p className="text-xs text-[#5B7C93]">
                Armada transfer resmi dengan kapasitas pax dan tarif standar.
              </p>
            </div>
            {editingVehId && (
              <button
                type="button"
                onClick={resetVehForm}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          {/* Add / Edit Vehicle Form */}
          <form
            onSubmit={handleSaveVehicle}
            className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-3"
          >
            <div className="font-bold text-xs text-[#082F49] uppercase">
              {editingVehId ? "Edit Armada Transfer" : "Tambah Armada Baru"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Model kendaraan (e.g. Innova Reborn)"
                value={vehName}
                onChange={(e) => setVehName(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              <input
                type="text"
                required
                placeholder="Kategori (e.g. VIP MPV / Minibus)"
                value={vehCategory}
                onChange={(e) => setVehCategory(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              <input
                type="number"
                min={1}
                required
                placeholder="Kapasitas (Pax)"
                value={vehPax}
                onChange={(e) => setVehPax(Number(e.target.value))}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              <input
                type="number"
                min={0}
                required
                placeholder="Tarif Dasar (IDR)"
                value={vehRate}
                onChange={(e) => setVehRate(Number(e.target.value))}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>
            <button
              type="submit"
              disabled={vehSaving}
              className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {vehSaving ? "Menyimpan..." : editingVehId ? "Simpan Perubahan Armada" : "＋ Tambah Armada Transfer"}
            </button>
          </form>

          {/* Vehicle List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-6 text-xs text-[#5B7C93]">Memuat armada...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#486581]">Belum ada armada transfer.</div>
            ) : (
              vehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="p-3 bg-white border border-[#BAE6FD] rounded-xl flex items-center justify-between hover:bg-[#F0F9FF] transition-all"
                >
                  <div>
                    <div className="font-bold text-xs text-[#082F49]">
                      {veh.name}
                    </div>
                    <div className="text-[10px] text-[#5B7C93]">
                      {veh.category} • Max {veh.capacityPax} Pax • Tarif: {formatIDR(veh.baseRateIdr)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditVehicle(veh)}
                      className="text-[#0284C7] hover:bg-[#E0F2FE] font-bold text-xs px-2.5 py-1 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVehicle(veh.id, veh.name)}
                      className="text-rose-500 hover:bg-rose-50 font-bold text-xs px-2.5 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
