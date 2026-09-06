-- ==============================================================================
-- DATABASE SEEDER: TOUR PACKAGES, PROPERTIES, TRANSFER LOCATIONS & VEHICLES
-- Description: Complete realistic dummy data for Lombok Travel & Real Estate
-- ==============================================================================

TRUNCATE TABLE
  public.package_pricing_tiers,
  public.tour_packages,
  public.properties,
  public.transfer_locations,
  public.transfer_vehicles
CASCADE;

DO $$
DECLARE
  pkg_rinjani UUID;
  pkg_secret_gili UUID;
  pkg_south_lombok UUID;
BEGIN

  -- 1. Tour Packages
  INSERT INTO public.tour_packages (
    slug, title, tagline, destination, duration, category, base_price_idr,
    image_url, highlights, included, excluded, itinerary, status, is_featured
  ) VALUES (
    'mount-rinjani-summit-trekking',
    'Mount Rinjani Summit Trekking (3D2N)',
    'Witness breathtaking sunrises above the clouds at 3,726m and camp beside the majestic Segara Anak crater lake.',
    'Senaru & Sembalun, North Lombok',
    '3 Days 2 Nights',
    'adventure',
    2750000,
    'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Summit highest volcano peak 3,726m', 'Segara Anak Crater Lake view', 'Natural volcanic hot springs soak'],
    ARRAY['National Park Entry', 'Return hotel transfer', '3x Meals daily by porters'],
    ARRAY['Trekking boots', 'Travel insurance', 'Guide tips'],
    '[{"day": 1, "title": "Basecamp to Crater Rim", "description": "Trek through savanna grasslands to Plawangan Sembalun campsite."}, {"day": 2, "title": "Summit Attack & Lake Descent", "description": "02:00 AM summit attack, sunrise view, descend to hot springs."}, {"day": 3, "title": "Senaru Rainforest Descent", "description": "Descend down through lush tropical rainforest to basecamp."}]'::jsonb,
    'published',
    true
  ) RETURNING id INTO pkg_rinjani;

  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_rinjani, 'Solo VIP (1 Pax)', 1, 1, 3850000, 0),
    (pkg_rinjani, 'Duo Trekker (2 Pax)', 2, 2, 2750000, 20),
    (pkg_rinjani, 'Group Squad (3 - 6 Pax)', 3, 6, 2250000, 35);

  -- 2. Properties (Villas & Land)
  INSERT INTO public.properties (
    slug, title, tagline, type, location, price_idr, ownership, lease_years,
    land_size_m2, building_size_m2, bedrooms, bathrooms, roi, beach_distance,
    airport_distance, image_url, features, status, is_featured
  ) VALUES
  (
    'kuta-sunset-cliff-villa',
    'The Cliffside Oasis 3-Bedroom Luxury Villa',
    'Turnkey architectural masterpiece overlooking Kuta Bay with private infinity pool',
    'villa',
    'Kuta Mandalika Hilltop',
    4500000000,
    'Leasehold (HGB)',
    30,
    500,
    280,
    3,
    4,
    '14% - 18% Net Annual ROI',
    '4 Mins to Kuta Beach',
    '20 Mins to Lombok Airport',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    ARRAY['Infinity Ocean-View Pool', 'Fully Furnished Turnkey', 'PMA Management Ready', 'Private Gated Security'],
    'Exclusive',
    true
  ),
  (
    'selong-belanak-beachfront-land',
    'Prime Beachfront Land Plot Selong Belanak',
    'Direct white sand beach access with clean SHM title, perfect for boutique resort or luxury villa enclave',
    'land',
    'Selong Belanak Bay',
    3200000000,
    'Freehold (SHM)',
    NULL,
    1200,
    NULL,
    NULL,
    NULL,
    'High Capital Appreciation (+25% YOY)',
    '0 Mins (Direct Sand Access)',
    '30 Mins to Lombok Airport',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ARRAY['Direct White Sand Access', 'Road & PLN Electricity Access', 'Clean Legal Due Diligence', 'Ideal for Boutique Resort'],
    'For Sale',
    true
  ),
  (
    'gerupuk-surf-view-villa',
    'Gerupuk Bay 2-Bedroom Surf Residence',
    'Modern tropical villa minutes away from world-class surf breaks with exceptional rental yield',
    'villa',
    'Gerupuk Surf Haven',
    2800000000,
    'Leasehold (HGB)',
    35,
    350,
    160,
    2,
    2,
    '12% - 16% Rental Yield',
    '2 Mins to Surf Boat Harbor',
    '25 Mins to Airport',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    ARRAY['Panoramic Bay View', 'Plunge Pool & Sun Deck', 'Turnkey Airbnb Setup', 'High Rental Occupancy History'],
    'For Sale',
    false
  ),
  (
    'tampah-hills-ocean-plot',
    'Hillside Ocean View Development Plot',
    '180-degree sunset ocean panorama with asphalt road and water infrastructure ready',
    'land',
    'Tampah / Mawun Heights',
    1850000000,
    'Freehold (SHM)',
    NULL,
    800,
    NULL,
    NULL,
    NULL,
    '20%+ Projected Equity Growth',
    '5 Mins to Mawun Beach',
    '25 Mins to Airport',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ARRAY['180-Degree Ocean Panorama', 'Asphalt Access Road', 'Masterplan Community Adjacent', 'Certified Title (SHM)'],
    'For Sale',
    false
  );

  -- 3. Transfer Pickup / Drop-off Locations
  INSERT INTO public.transfer_locations (name, location_type, area, display_order, is_active)
  VALUES
    ('Lombok International Airport (BIL)', 'both', 'Praya / Central', 1, true),
    ('Bangsal Harbor (Fast Boat to Gili)', 'both', 'North Lombok', 2, true),
    ('Lembar Harbor (Bali Ferry)', 'both', 'West Lombok', 3, true),
    ('Kayangan Harbor (Sumbawa Ferry)', 'both', 'East Lombok', 4, true),
    ('Kuta Mandalika Beach / Resort Area', 'both', 'South Lombok', 5, true),
    ('Senggigi Tourism Strip', 'both', 'West Lombok', 6, true),
    ('Selong Belanak Bay', 'both', 'South Lombok', 7, true),
    ('Senaru / Sembalun (Mount Rinjani Base)', 'both', 'North Lombok', 8, true),
    ('Tetebatu Waterfall & Rice Terraces', 'both', 'East Lombok', 9, true),
    ('Mataram City Center / Epicentrum', 'both', 'Mataram', 10, true);

  -- 4. Transfer Fleet Vehicles
  INSERT INTO public.transfer_vehicles (name, category, capacity_pax, base_rate_idr, is_active)
  VALUES
    ('Toyota Avanza / Xenia', 'Standard MPV', 4, 300000, true),
    ('Toyota Innova Reborn', 'Comfort VIP MPV', 6, 450000, true),
    ('Toyota HiAce Commuter', 'Minibus Van', 14, 850000, true),
    ('Toyota Alphard VIP Executive', 'Luxury VIP', 5, 1750000, true),
    ('Mitsubishi Pajero Sport 4x4', 'Adventure SUV', 5, 800000, true);

  -- 5. Rental Vehicles (Scooters & Cars)
  INSERT INTO public.rental_vehicles (id, name, type, transmission, capacity_pax, price_per_day, price_with_driver_per_day, image_url, features, is_active, display_order)
  VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Honda Scoopy 110cc', 'motorcycle', 'matic', 2, 85000, NULL, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Phone Holder', 'Kondisi Prima'], true, 1),
    ('a0000000-0000-0000-0000-000000000002', 'Yamaha NMAX 155cc', 'motorcycle', 'matic', 2, 140000, NULL, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Bagasi Luas', 'Kenyamanan Touring'], true, 2),
    ('a0000000-0000-0000-0000-000000000003', 'Honda PCX 160cc', 'motorcycle', 'matic', 2, 150000, NULL, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80', ARRAY['2 Helm SNI', 'Jas Hujan', 'Keyless Smart Key', 'Port Charger USB'], true, 3),
    ('a0000000-0000-0000-0000-000000000004', 'Toyota All New Avanza', 'car', 'manual', 7, 350000, 550000, 'https://images.unsplash.com/photo-1549399573-970a87791404?auto=format&fit=crop&w=800&q=80', ARRAY['AC Double Blower', 'Audio Bluetooth', 'Kapasitas 7 Penumpang', 'Lepas Kunci / Driver'], true, 4),
    ('a0000000-0000-0000-0000-000000000005', 'Toyota Innova Reborn', 'car', 'matic', 7, 550000, 750000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', ARRAY['Suspensi Sangat Nyaman', 'Interior Premium', 'Audio Touchscreen', 'Lepas Kunci / Driver'], true, 5),
    ('a0000000-0000-0000-0000-000000000006', 'Toyota HiAce Commuter', 'car', 'manual', 14, 950000, 1150000, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', ARRAY['Kapasitas 14 Penumpang', 'AC Merata Tiap Baris', 'Reclining Seats', 'Termasuk Supir & BBM'], true, 6)
  ON CONFLICT (id) DO NOTHING;

END $$;
