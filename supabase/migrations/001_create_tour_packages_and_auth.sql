-- Migration: 001_create_tour_packages_and_auth.sql
-- Description: Tour packages, pricing tiers, user roles, and RLS policies

-- 1. Profiles & Roles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on profiles role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Tour Packages Table
CREATE TABLE IF NOT EXISTS public.tour_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'adventure' CHECK (category IN ('adventure', 'island_hopping', 'cultural', 'custom', 'honeymoon')),
  base_price_idr BIGINT NOT NULL CHECK (base_price_idr >= 0),
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance & search
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON public.tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_status ON public.tour_packages(status);
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON public.tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON public.tour_packages(is_featured);

-- 3. Package Pricing Tiers Table
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

-- 4. Helper Function to Check Admin Role
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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Tour Packages Policies
CREATE POLICY "Public can view published tour packages"
  ON public.tour_packages FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins full access on tour packages"
  ON public.tour_packages FOR ALL
  USING (public.is_admin());

-- Pricing Tiers Policies
CREATE POLICY "Public can view pricing tiers for published packages"
  ON public.package_pricing_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tour_packages
      WHERE public.tour_packages.id = package_pricing_tiers.package_id
        AND (public.tour_packages.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "Admins full access on pricing tiers"
  ON public.package_pricing_tiers FOR ALL
  USING (public.is_admin());

-- 6. Trigger for Profile creation on auth signup
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
