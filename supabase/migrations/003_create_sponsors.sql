CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (btrim(name) <> ''),
  logo_url TEXT NOT NULL CHECK (btrim(logo_url) <> ''),
  website_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_active_order
  ON public.sponsors(display_order)
  WHERE is_active = true;

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view active sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Admins manage sponsors" ON public.sponsors;

CREATE POLICY "Public view active sponsors"
  ON public.sponsors FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage sponsors"
  ON public.sponsors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
