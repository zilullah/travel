"use client";

import React, { useEffect, useState } from "react";
import { RentalVehicle, VehicleType, TransmissionType } from "@/lib/domain/rental.types";
import { RentalService } from "@/lib/services/rental.service";
import { SupabaseRentalRepository } from "@/lib/repositories/supabase-rental.repository";
import { supabaseClient } from "@/lib/supabase/client";
import { formatIDR } from "@/app/_lib/utils";

export default function AdminRentalsPage() {
  const repo = new SupabaseRentalRepository(supabaseClient);
  const service = new RentalService(repo);

  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<VehicleType>("motorcycle");
  const [transmission, setTransmission] = useState<TransmissionType>("matic");
  const [capacityPax, setCapacityPax] = useState(2);
  const [pricePerDay, setPricePerDay] = useState(85000);
  const [priceWithDriverPerDay, setPriceWithDriverPerDay] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [featuresInput, setFeaturesInput] = useState("2 Helm SNI, Jas Hujan, Phone Holder");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await service.listVehicles(false);
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load rental vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setType("motorcycle");
    setTransmission("matic");
    setCapacityPax(2);
    setPricePerDay(85000);
    setPriceWithDriverPerDay("");
    setImageUrl("");
    setFeaturesInput("2 Helm SNI, Jas Hujan, Phone Holder");
    setIsActive(true);
    setDisplayOrder(vehicles.length + 1);
  };

  const handleEdit = (v: RentalVehicle) => {
    setEditingId(v.id);
    setName(v.name);
    setType(v.type);
    setTransmission(v.transmission);
    setCapacityPax(v.capacityPax);
    setPricePerDay(v.pricePerDay);
    setPriceWithDriverPerDay(v.priceWithDriverPerDay || "");
    setImageUrl(v.imageUrl);
    setFeaturesInput(v.features.join(", "));
    setIsActive(v.isActive);
    setDisplayOrder(v.displayOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) {
      alert("Please fill in the vehicle name and image URL.");
      return;
    }

    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      type,
      transmission,
      capacityPax: Number(capacityPax),
      pricePerDay: Number(pricePerDay),
      priceWithDriverPerDay: priceWithDriverPerDay ? Number(priceWithDriverPerDay) : null,
      imageUrl: imageUrl.trim(),
      features,
      isActive,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        const updated = await service.updateVehicle(editingId, payload);
        setVehicles(vehicles.map((v) => (v.id === editingId ? updated : v)));
        alert("Vehicle successfully updated!");
      } else {
        const created = await service.createVehicle(payload);
        setVehicles([...vehicles, created]);
        alert("New vehicle registered successfully!");
      }
      resetForm();
    } catch (err: any) {
      alert(`Error saving vehicle: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, vName: string) => {
    if (!confirm(`Are you sure you want to delete "${vName}"?`)) return;
    try {
      await service.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      if (editingId === id) resetForm();
    } catch (err: any) {
      alert(`Failed to delete vehicle: ${err.message}`);
    }
  };

  const handleToggleActive = async (v: RentalVehicle) => {
    try {
      const updated = await service.updateVehicle(v.id, { isActive: !v.isActive });
      setVehicles(vehicles.map((item) => (item.id === v.id ? updated : item)));
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE6FD] pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#0C4A6E]">Vehicle Rentals Management</h1>
          <p className="text-sm text-[#486581]">
            Daftarkan dan atur tarif sewa motor & mobil untuk katalog landing page.
          </p>
        </div>
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingId ? "Cancel Edit & Add New" : "Reset Form"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Registration / Edit */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-sm">
          <h2 className="text-lg font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0284C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {editingId ? "Edit Kendaraan Rental" : "Daftarkan Kendaraan Baru"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                Nama Kendaraan *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Honda Scoopy 110cc / Toyota Avanza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Tipe Kendaraan *
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const nextType = e.target.value as VehicleType;
                    setType(nextType);
                    if (nextType === "motorcycle") {
                      setCapacityPax(2);
                      setFeaturesInput("2 Helm SNI, Jas Hujan, Phone Holder");
                    } else {
                      setCapacityPax(7);
                      setFeaturesInput("AC Dingin, Audio Bluetooth, Lepas Kunci / Supir");
                    }
                  }}
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                >
                  <option value="motorcycle">Motor (Motorcycle)</option>
                  <option value="car">Mobil (Car)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Transmisi *
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                >
                  <option value="matic">Automatic (Matic)</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Kapasitas (Pax) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  required
                  value={capacityPax}
                  onChange={(e) => setCapacityPax(Number(e.target.value))}
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Harga / 24 Jam (IDR) *
                </label>
                <input
                  type="number"
                  min={10000}
                  step={5000}
                  required
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(Number(e.target.value))}
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                  Tarif + Supir (Opsional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  placeholder="Kosongkan jika tdk ada"
                  value={priceWithDriverPerDay}
                  onChange={(e) =>
                    setPriceWithDriverPerDay(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                URL Gambar Kendaraan *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              {imageUrl && (
                <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-[#BAE6FD] bg-slate-100 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C4A6E] uppercase mb-1">
                Fasilitas / Spesifikasi (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="2 Helm, Jas Hujan, Phone Holder"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-sm text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-[#BAE6FD] text-[#0284C7] focus:ring-[#0284C7] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isActiveCheck" className="text-xs font-bold text-[#0C4A6E] cursor-pointer">
                Tampilkan di Landing Page (Status Aktif)
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingId ? "Simpan Perubahan Kendaraan" : "Daftarkan Kendaraan"}
            </button>
          </form>
        </div>

        {/* Vehicles Table / List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0C4A6E] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0284C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Daftar Unit Rental ({vehicles.length})
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#E0F2FE] text-[#0284C7] rounded-full">
              {vehicles.filter((v) => v.isActive).length} Aktif
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-[#5B7C93]">
              Loading rental fleet data...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#486581] border border-dashed border-[#BAE6FD] rounded-2xl">
              Belum ada kendaraan yang didaftarkan. Gunakan form di samping untuk mendaftarkan unit motor/mobil.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#BAE6FD] text-[#5B7C93] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3">Harga/24 Jam</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F9FF]">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-[#F7FCFF] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.imageUrl}
                            alt={v.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#BAE6FD] flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#0C4A6E]">{v.name}</div>
                            <div className="text-[11px] text-[#5B7C93]">
                              {v.transmission.toUpperCase()} • {v.capacityPax} Pax
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                            v.type === "motorcycle"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {v.type === "motorcycle" ? "Motor" : "Mobil"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0284C7]">{formatIDR(v.pricePerDay)}</div>
                        {v.priceWithDriverPerDay && (
                          <div className="text-[10px] text-[#5B7C93]">
                            +Supir: {formatIDR(v.priceWithDriverPerDay)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleActive(v)}
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                            v.isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {v.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(v)}
                            className="p-1.5 text-[#0284C7] hover:bg-[#E0F2FE] rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(v.id, v.name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
