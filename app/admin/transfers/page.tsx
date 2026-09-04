'use client';

import React, { useEffect, useState } from 'react';
import { TransferLocation, TransferVehicle } from '@/lib/domain/transfer.types';
import { TransferService } from '@/lib/services/transfer.service';
import { SupabaseTransferRepository } from '@/lib/repositories/supabase-transfer.repository';
import { supabaseClient } from '@/lib/supabase/client';
import { formatIDR } from '@/app/_lib/utils';

export default function AdminTransfersPage() {
  const repo = new SupabaseTransferRepository(supabaseClient);
  const service = new TransferService(repo);

  const [locations, setLocations] = useState<TransferLocation[]>([]);
  const [vehicles, setVehicles] = useState<TransferVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // New Location Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocArea, setNewLocArea] = useState('Central / South Lombok');
  const [newLocType, setNewLocType] = useState<'both' | 'pickup' | 'dropoff'>('both');

  // New Vehicle Form State
  const [newVehName, setNewVehName] = useState('');
  const [newVehCategory, setNewVehCategory] = useState('Comfort MPV');
  const [newVehPax, setNewVehPax] = useState(6);
  const [newVehRate, setNewVehRate] = useState(450000);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locs, vehs] = await Promise.all([
        service.listLocations(),
        service.listVehicles(),
      ]);
      setLocations(locs);
      setVehicles(vehs);
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    try {
      const created = await service.createLocation({
        name: newLocName,
        area: newLocArea,
        locationType: newLocType,
        isActive: true,
        displayOrder: locations.length + 1,
      });
      setLocations([...locations, created]);
      setNewLocName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!confirm(`Delete location "${name}"?`)) return;
    try {
      await service.deleteLocation(id);
      setLocations(locations.filter((l) => l.id !== id));
    } catch {
      alert('Failed to delete location');
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName.trim()) return;
    try {
      const created = await service.createVehicle({
        name: newVehName,
        category: newVehCategory,
        capacityPax: Number(newVehPax),
        baseRateIdr: Number(newVehRate),
        isActive: true,
      });
      setVehicles([...vehicles, created]);
      setNewVehName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Delete vehicle "${name}"?`)) return;
    try {
      await service.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
    } catch {
      alert('Failed to delete vehicle');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
          Transfer Locations & Fleet Management
        </h1>
        <p className="text-xs sm:text-sm text-[#486581]">
          Manage pickup/drop-off points across Lombok and transport fleet vehicle categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transfer Locations */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-6">
          <div className="border-b border-[#F0F9FF] pb-3">
            <h2 className="text-lg font-bold text-[#082F49] flex items-center gap-2">
              <span>📍</span>
              <span>Pickup & Drop-off Points</span>
            </h2>
            <p className="text-xs text-[#5B7C93]">
              Available in Hero quick transfer search & Antar-Jemput forms.
            </p>
          </div>

          {/* Add Location Form */}
          <form onSubmit={handleCreateLocation} className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-3">
            <div className="font-bold text-xs text-[#082F49] uppercase">Add New Location Point</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Location name (e.g. Kuta Beach Resort)"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Area (e.g. South Lombok)"
                value={newLocArea}
                onChange={(e) => setNewLocArea(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs transition-all"
            >
              ＋ Add Location Point
            </button>
          </form>

          {/* Location List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-3 bg-white border border-[#BAE6FD] rounded-xl flex items-center justify-between hover:bg-[#F0F9FF] transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-[#082F49]">{loc.name}</div>
                  <div className="text-[10px] text-[#5B7C93]">Area: {loc.area}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(loc.id, loc.name)}
                  className="text-rose-500 hover:text-rose-700 font-bold text-xs px-2 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Vehicles */}
        <div className="bg-white p-6 rounded-[23px] border border-[#7DD3FC] shadow-sm space-y-6">
          <div className="border-b border-[#F0F9FF] pb-3">
            <h2 className="text-lg font-bold text-[#082F49] flex items-center gap-2">
              <span>🚗</span>
              <span>Fleet Vehicles & Chauffeur</span>
            </h2>
            <p className="text-xs text-[#5B7C93]">
              Armada kendaraan resmi dengan kapasitas pax dan base rate IDR.
            </p>
          </div>

          {/* Add Vehicle Form */}
          <form onSubmit={handleCreateVehicle} className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-3">
            <div className="font-bold text-xs text-[#082F49] uppercase">Add New Fleet Vehicle</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Vehicle model (e.g. Innova Reborn)"
                value={newVehName}
                onChange={(e) => setNewVehName(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Category (e.g. VIP MPV)"
                value={newVehCategory}
                onChange={(e) => setNewVehCategory(e.target.value)}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
              <input
                type="number"
                min={1}
                required
                placeholder="Capacity (Pax)"
                value={newVehPax}
                onChange={(e) => setNewVehPax(Number(e.target.value))}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
              <input
                type="number"
                min={0}
                required
                placeholder="Base Rate IDR"
                value={newVehRate}
                onChange={(e) => setNewVehRate(Number(e.target.value))}
                className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-1.5 text-xs text-[#082F49] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs transition-all"
            >
              ＋ Add Fleet Vehicle
            </button>
          </form>

          {/* Vehicle List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-3 bg-white border border-[#BAE6FD] rounded-xl flex items-center justify-between hover:bg-[#F0F9FF] transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-[#082F49]">{veh.name}</div>
                  <div className="text-[10px] text-[#5B7C93]">
                    {veh.category} • Max {veh.capacityPax} Pax • Base: {formatIDR(veh.baseRateIdr)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteVehicle(veh.id, veh.name)}
                  className="text-rose-500 hover:text-rose-700 font-bold text-xs px-2 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
