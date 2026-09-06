-- Migration: 002_create_rental_vehicles.sql
-- Description: Table for scooter & car rentals, indexes, and Row Level Security (RLS)

CREATE TABLE IF NOT EXISTS public.rental_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('motorcycle', 'car')),
  transmission TEXT NOT NULL CHECK (transmission IN ('matic', 'manual')),
  capacity_pax INT NOT NULL CHECK (capacity_pax > 0),
  price_per_day BIGINT NOT NULL CHECK (price_per_day > 0),
  price_with_driver_per_day BIGINT CHECK (price_with_driver_per_day IS NULL OR price_with_driver_per_day > 0),
  image_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast query and sorting
CREATE INDEX IF NOT EXISTS idx_rental_vehicles_active ON public.rental_vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_rental_vehicles_type ON public.rental_vehicles(type);
CREATE INDEX IF NOT EXISTS idx_rental_vehicles_order ON public.rental_vehicles(display_order);

-- Enable RLS
ALTER TABLE public.rental_vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public view active rental vehicles" ON public.rental_vehicles;
DROP POLICY IF EXISTS "Admins manage rental vehicles" ON public.rental_vehicles;

-- 1. Public can read active rental vehicles (or admins can read all)
CREATE POLICY "Public view active rental vehicles"
  ON public.rental_vehicles FOR SELECT
  USING (is_active = true OR public.is_admin());

-- 2. Admins have full access (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins manage rental vehicles"
  ON public.rental_vehicles FOR ALL
  USING (public.is_admin());

-- Seed initial fleet data
INSERT INTO public.rental_vehicles (id, name, type, transmission, capacity_pax, price_per_day, price_with_driver_per_day, image_url, features, is_active, display_order)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Honda Scoopy 110cc', 'motorcycle', 'matic', 2, 85000, NULL, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Phone Holder', 'Kondisi Prima'], true, 1),
  ('a0000000-0000-0000-0000-000000000002', 'Yamaha NMAX 155cc', 'motorcycle', 'matic', 2, 140000, NULL, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Bagasi Luas', 'Kenyamanan Touring'], true, 2),
  ('a0000000-0000-0000-0000-000000000003', 'Honda PCX 160cc', 'motorcycle', 'matic', 2, 150000, NULL, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Keyless Smart Key', 'Port Charger USB'], true, 3),
  ('a0000000-0000-0000-0000-000000000004', 'Toyota All New Avanza', 'car', 'manual', 7, 350000, 550000, 'https://images.unsplash.com/photo-1549399573-970a87791404?auto=format&fit=crop&w=800&q=80', ARRAY['AC Double Blower', 'Audio Bluetooth', 'Kapasitas 7 Penumpang', 'Lepas Kunci / Driver'], true, 4),
  ('a0000000-0000-0000-0000-000000000005', 'Toyota Innova Reborn', 'car', 'matic', 7, 550000, 750000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', ARRAY['Suspensi Sangat Nyaman', 'Interior Premium', 'Audio Touchscreen', 'Lepas Kunci / Driver'], true, 5),
  ('a0000000-0000-0000-0000-000000000006', 'Toyota HiAce Commuter', 'car', 'manual', 14, 950000, 1150000, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', ARRAY['Kapasitas 14 Penumpang', 'AC Merata Tiap Baris', 'Reclining Seats', 'Termasuk Supir & BBM'], true, 6)
ON CONFLICT (id) DO NOTHING;
