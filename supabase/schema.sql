-- ==============================================================================
-- COMPLETE DATABASE SCHEMA: LOMBOK TRAVEL LANDING & ADMIN PORTAL
-- Framework: Supabase Postgres + Row-Level Security (RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. TOUR PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.tour_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'adventure' CHECK (category IN ('adventure', 'island_hopping', 'cultural', 'custom', 'honeymoon')),
  base_price_idr BIGINT NOT NULL CHECK (base_price_idr >= 0),
  image_url TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON public.tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_status ON public.tour_packages(status);
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON public.tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON public.tour_packages(is_featured);

-- 3. PACKAGE PRICING TIERS TABLE
CREATE TABLE IF NOT EXISTS public.package_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.tour_packages(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  min_pax INT NOT NULL CHECK (min_pax > 0),
  max_pax INT NOT NULL CHECK (max_pax >= min_pax),
  price_per_pax_idr BIGINT NOT NULL CHECK (price_per_pax_idr >= 0),
  discount_percent NUMERIC(5,2) DEFAULT 0.00 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pricing_tiers_package_id ON public.package_pricing_tiers(package_id);

-- 4. PROPERTIES / REAL ESTATE TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  type TEXT NOT NULL DEFAULT 'villa' CHECK (type IN ('villa', 'land', 'commercial')),
  location TEXT NOT NULL,
  price_idr BIGINT NOT NULL CHECK (price_idr >= 0),
  ownership TEXT NOT NULL DEFAULT 'Leasehold (HGB)',
  lease_years INT CHECK (lease_years >= 0),
  land_size_m2 INT NOT NULL CHECK (land_size_m2 > 0),
  building_size_m2 INT CHECK (building_size_m2 >= 0),
  bedrooms INT CHECK (bedrooms >= 0),
  bathrooms INT CHECK (bathrooms >= 0),
  roi TEXT NOT NULL DEFAULT '12% - 16% Net ROI',
  beach_distance TEXT NOT NULL DEFAULT '5 Mins',
  airport_distance TEXT NOT NULL DEFAULT '25 Mins',
  image_url TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'For Sale' CHECK (status IN ('For Sale', 'Exclusive', 'Under Offer', 'Sold')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);

-- 5. TRANSFER LOCATIONS (Pickup & Drop-off points)
CREATE TABLE IF NOT EXISTS public.transfer_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'both' CHECK (location_type IN ('pickup', 'dropoff', 'both')),
  area TEXT NOT NULL DEFAULT 'Lombok',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transfer_locations_active ON public.transfer_locations(is_active);

-- 6. TRANSFER FLEET VEHICLES
CREATE TABLE IF NOT EXISTS public.transfer_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  capacity_pax INT NOT NULL CHECK (capacity_pax > 0),
  base_rate_idr BIGINT NOT NULL CHECK (base_rate_idr >= 0),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transfer_vehicles_active ON public.transfer_vehicles(is_active);

-- 7. SECURITY FUNCTIONS & RLS POLICIES
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_vehicles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Public can view own profile or admin" ON public.profiles;
DROP POLICY IF EXISTS "Admins full management profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public view published tour packages" ON public.tour_packages;
DROP POLICY IF EXISTS "Admins manage tour packages" ON public.tour_packages;
DROP POLICY IF EXISTS "Public view pricing tiers" ON public.package_pricing_tiers;
DROP POLICY IF EXISTS "Admins manage pricing tiers" ON public.package_pricing_tiers;
DROP POLICY IF EXISTS "Public view active properties" ON public.properties;
DROP POLICY IF EXISTS "Admins manage properties" ON public.properties;
DROP POLICY IF EXISTS "Public view active transfer locations" ON public.transfer_locations;
DROP POLICY IF EXISTS "Admins manage transfer locations" ON public.transfer_locations;
DROP POLICY IF EXISTS "Public view active vehicles" ON public.transfer_vehicles;
DROP POLICY IF EXISTS "Admins manage transfer vehicles" ON public.transfer_vehicles;

-- Profiles Policies
CREATE POLICY "Public can view own profile or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins full management profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Tour Packages Policies
CREATE POLICY "Public view published tour packages"
  ON public.tour_packages FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage tour packages"
  ON public.tour_packages FOR ALL
  USING (public.is_admin());

-- Pricing Tiers Policies
CREATE POLICY "Public view pricing tiers"
  ON public.package_pricing_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tour_packages
      WHERE public.tour_packages.id = package_pricing_tiers.package_id
        AND (public.tour_packages.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "Admins manage pricing tiers"
  ON public.package_pricing_tiers FOR ALL
  USING (public.is_admin());

-- Properties Policies
CREATE POLICY "Public view active properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Admins manage properties"
  ON public.properties FOR ALL
  USING (public.is_admin());

-- Transfer Locations Policies
CREATE POLICY "Public view active transfer locations"
  ON public.transfer_locations FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage transfer locations"
  ON public.transfer_locations FOR ALL
  USING (public.is_admin());

-- Transfer Vehicles Policies
CREATE POLICY "Public view active vehicles"
  ON public.transfer_vehicles FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage transfer vehicles"
  ON public.transfer_vehicles FOR ALL
  USING (public.is_admin());

-- 8. AUTOMATIC AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
