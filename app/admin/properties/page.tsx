"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Property,
  PropertyType,
  PropertyStatus,
} from "@/lib/domain/property.types";
import { PropertyService } from "@/lib/services/property.service";
import { SupabasePropertyRepository } from "@/lib/repositories/supabase-property.repository";
import { supabaseClient } from "@/lib/supabase/client";
import { formatIDR, formatImageUrl } from "@/app/_lib/utils";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const repo = new SupabasePropertyRepository(supabaseClient);
  const service = new PropertyService(repo);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await service.listProperties();
      setProperties(data);
    } catch (err) {
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleStatusChange = async (id: string, status: PropertyStatus) => {
    try {
      await service.updatePropertyStatus(id, status);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p)),
      );
    } catch {
      alert("Failed to update property status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await service.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete property");
    }
  };

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082F49]">
            Real Estate & Villa Listings
          </h1>
          <p className="text-xs sm:text-sm text-[#486581]">
            Manage verified turnkey villas, beachfront land plots, and legal due
            diligence documents.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-[23px] text-sm shadow-sm transition-all"
        >
          <span>＋</span>
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[23px] border border-[#7DD3FC] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by property title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#082F49] focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs font-semibold text-[#082F49] focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="villa">Luxury Villa</option>
            <option value="land">Beachfront / Land</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs font-semibold text-[#082F49] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Exclusive">Exclusive</option>
            <option value="For Sale">For Sale</option>
            <option value="Under Offer">Under Offer</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Property Cards */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-[#5B7C93]">
          Loading properties...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-[23px] border border-[#7DD3FC] space-y-3">
          <div className="text-3xl">🏡</div>
          <h3 className="font-bold text-[#082F49]">No properties found</h3>
          <p className="text-xs text-[#486581]">
            Create a new property listing to showcase villas and land on the
            public landing page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-[23px] border border-[#7DD3FC] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={formatImageUrl(
                    prop.image ||
                      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
                  )}
                  alt={prop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      prop.status === "Exclusive"
                        ? "bg-[#0284C7] text-white"
                        : prop.status === "For Sale"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                    }`}
                  >
                    {prop.status}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                    {prop.ownership}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-[#082F49] line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-[#486581] mt-1 line-clamp-2">
                    {prop.tagline}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#5B7C93] pt-2 border-t border-[#F0F9FF]">
                    <span>📍 {prop.location}</span>
                    <span>📐 {prop.landSizeM2} m²</span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-[#0284C7]">
                    Asking: {formatIDR(prop.priceIdr)}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F9FF] flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/properties/${prop.id}`}
                    className="px-3.5 py-1.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] font-bold text-xs rounded-lg transition-all"
                  >
                    Edit Listing
                  </Link>

                  <button
                    onClick={() => handleDelete(prop.id, prop.title)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                    title="Delete Property"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
