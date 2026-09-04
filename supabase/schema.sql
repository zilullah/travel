-- ==============================================================================
-- DATABASE SCHEMA: LOMBOK TRAVEL LANDING & ADMIN PORTAL
-- Framework: Supabase Postgres + Row-Level Security (RLS)
-- Best Practices: Indexed Slugs, Composite FK Constraints, Auto Timestamps, RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS / DOMAIN CONSTRAINTS (Using clean CHECK constraints for flexibility)
-- Package categories: 'adventure', 'island_hopping', 'cultural', 'custom', 'honeymoon'
-- Package statuses: 'published', 'draft', 'archived'
-- User roles: 'admin', 'staff', 'user'

-- 3. PROFILES TABLE (Mirrors auth.users with custom roles & metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles Indexing
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. TOUR PACKAGES TABLE (Core products)
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

-- Tour Packages Indexing for High-Performance Filters & Search
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON public.tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_status ON public.tour_packages(status);
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON public.tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON public.tour_packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_tour_packages_created_at ON public.tour_packages(created_at DESC);

-- 5. PACKAGE PRICING TIERS TABLE (Dynamic group-size pricing & discounts)
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

-- Pricing Tiers Indexing
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_package_id ON public.package_pricing_tiers(package_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_min_pax ON public.package_pricing_tiers(package_id, min_pax);

-- 6. SECURITY FUNCTIONS
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

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view own profile or admin" ON public.profiles;
DROP POLICY IF EXISTS "Admins full management profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public view published tour packages" ON public.tour_packages;
DROP POLICY IF EXISTS "Admins manage tour packages" ON public.tour_packages;
DROP POLICY IF EXISTS "Public view pricing tiers" ON public.package_pricing_tiers;
DROP POLICY IF EXISTS "Admins manage pricing tiers" ON public.package_pricing_tiers;

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

-- 8. AUTOMATIC AUTH USER TRIGGER
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
