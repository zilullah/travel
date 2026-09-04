-- ==============================================================================
-- DATABASE SEEDER: TOUR PACKAGES & PRICING TIERS
-- Description: Comprehensive realistic dummy data for Lombok Travel & Tours
-- ==============================================================================

-- Clear existing sample data
TRUNCATE TABLE public.package_pricing_tiers, public.tour_packages CASCADE;

DO $$
DECLARE
  pkg_rinjani UUID;
  pkg_secret_gili UUID;
  pkg_south_lombok UUID;
  pkg_pink_beach UUID;
  pkg_tetebatu UUID;
  pkg_senaru_waterfall UUID;
BEGIN

  -- 1. Mount Rinjani Summit Trekking (3D2N)
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    gallery,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'mount-rinjani-summit-trekking',
    'Mount Rinjani Summit Trekking (3D2N)',
    'Witness breathtaking sunrises above the clouds at 3,726m and camp beside the majestic Segara Anak crater lake.',
    'Senaru & Sembalun, North Lombok',
    '3 Days 2 Nights',
    'adventure',
    2750000,
    'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    ARRAY[
      'Summit highest volcano peak 3,726m',
      'Segara Anak Crater Lake & volcanic cone view',
      'Natural volcanic hot springs soak',
      'Certified English-speaking mountain guide & porter team',
      'High-grade camping gear, mountain mattress & warm sleeping bags'
    ],
    ARRAY[
      'Mount Rinjani National Park entry permit',
      'Return hotel transfer across Lombok (Airport / Senggigi / Kuta)',
      '3x freshly cooked hot meals daily by mountain porters',
      'Tents, toilet tent, foam mattresses & sleeping bags',
      'First aid kit & trekking poles'
    ],
    ARRAY[
      'Trekking boots & personal warm clothing',
      'Personal travel & medical insurance',
      'Tipping for guide and porters'
    ],
    '[
      { "day": 1, "title": "Sembalun Basecamp to Plawangan Sembalun Crater Rim", "description": "Depart Sembalun village (1,156m), trek through open savannas, lunch at Pos 2, ascend the ridge to Crater Rim 1 (2,639m). Sunset dinner overlooking the caldera lake." },
      { "day": 2, "title": "Summit Attack (3,726m) & Descent to Segara Anak Lake", "description": "02:00 AM summit attack under the stars. Reach the summit at sunrise with views spanning Bali Mt. Agung and Sumbawa. Descend to Segara Anak lake for lunch and hot spring bath." },
      { "day": 3, "title": "Senaru Crater Rim to Senaru Village & Return", "description": "Trek up Senaru ridge then descend down through dense tropical rainforest. Arrive at Senaru basecamp, award certificate, transfer back to hotel." }
    ]'::jsonb,
    'published',
    true
  ) RETURNING id INTO pkg_rinjani;

  -- Rinjani Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_rinjani, 'Solo VIP Adventurer (1 Pax)', 1, 1, 3850000, 0),
    (pkg_rinjani, 'Couple / Duo (2 Pax)', 2, 2, 2750000, 20),
    (pkg_rinjani, 'Small Squad (3 - 5 Pax)', 3, 5, 2350000, 35),
    (pkg_rinjani, 'Group Club (6 - 12 Pax)', 6, 12, 1950000, 45);


  -- 2. Secret Gili Island Hopping (Nanggu, Sudak, Kedis)
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    gallery,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'secret-gili-snorkeling-escape',
    'Secret Gili Island Hopping & Snorkeling (Nanggu, Sudak, Kedis)',
    'Crystal-clear turquoise lagoons, feeding tame reef fish, and grilled seafood feast away from the party crowds.',
    'Sekotong & South-West Archipelago',
    'Full Day (8 Hours)',
    'island_hopping',
    850000,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    ARRAY[
      'Gili Nanggu marine sanctuary snorkel with bread-feeding fish',
      'Freshly caught barbecue seafood lunch on Gili Sudak beach',
      'Tiny uninhabited romantic sandbar at Gili Kedis',
      'Private motorized outrigger boat and dedicated captain'
    ],
    ARRAY[
      'Private AC hotel pick-up & drop-off (Kuta / Senggigi / Mataram)',
      'Private wooden outrigger boat charter',
      'Snorkel masks, fins, life vests & fish food',
      'Island entrance tickets & harbour parking fees',
      'Bottled mineral water'
    ],
    ARRAY[
      'Lunch at Gili Sudak restaurant (pay per order)',
      'Underwater GoPro documentation'
    ],
    '[
      { "day": 1, "title": "Harbour Departure & 3-Secret-Gili Cruise", "description": "Pick-up at 08:30 AM, drive to Tawun Harbour. Cruise 15 mins to Gili Nanggu for 3 hours of reef snorkeling. Move to Gili Sudak for beachfront lunch. Stop at Gili Kedis for photos and sunset swim before heading back." }
    ]'::jsonb,
    'published',
    true
  ) RETURNING id INTO pkg_secret_gili;

  -- Secret Gili Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_secret_gili, 'Private Couple (2 Pax)', 2, 2, 850000, 0),
    (pkg_secret_gili, 'Family / Friends (3 - 5 Pax)', 3, 5, 600000, 30),
    (pkg_secret_gili, 'Group Saver (6 - 10 Pax)', 6, 10, 450000, 45);


  -- 3. South Lombok Secret Beaches & Surf Safari
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    gallery,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'south-lombok-surf-beach-safari',
    'South Lombok Secret Beaches & Surf Safari',
    'Discover world-renowned surf breaks, powder white sands, and 360-degree sunset panoramic views at Merese Hill.',
    'Kuta, Selong Belanak & Tanjung Aan',
    'Full Day (9 Hours)',
    'adventure',
    750000,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    ARRAY[
      'Selong Belanak gentle surf waves (perfect for beginner lessons)',
      'Mawun Beach emerald horseshoe bay',
      'Tanjung Aan white pepper sand and turquoise swimming lagoon',
      'Sunset hike atop Bukit Merese overlooking Mandalika bay'
    ],
    ARRAY[
      'Private modern car with English-speaking driver-guide',
      'Fuel, highway tolls & all beach destination parking fees',
      'Chilled bottled water & refreshing coconut drink'
    ],
    ARRAY[
      'Surfboard rental & private surf instructor fee',
      'Lunch & personal snacks'
    ],
    '[
      { "day": 1, "title": "South Coast Beach Hop & Golden Hour", "description": "Morning surf session at Selong Belanak. Midday chill and swim at Mawun Beach. Afternoon coffee and swing photos at Tanjung Aan. Golden hour sunset hike at Bukit Merese." }
    ]'::jsonb,
    'published',
    true
  ) RETURNING id INTO pkg_south_lombok;

  -- South Lombok Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_south_lombok, 'Private Vehicle (1 - 4 Pax)', 1, 4, 750000, 0),
    (pkg_south_lombok, 'Innova Reborn Upgrade (1 - 6 Pax)', 1, 6, 950000, 0),
    (pkg_south_lombok, 'Toyota HiAce Minibus (7 - 14 Pax)', 7, 14, 1450000, 0);


  -- 4. Pink Beach (Tangsi) & Sand Island Snorkel
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'pink-beach-tangsi-snorkeling',
    'Pink Beach (Tangsi) & Gili Petelu Snorkel Tour',
    'Witness rare pastel pink sands formed by crushed red coral and explore the untouched coral gardens of Gili Petelu.',
    'J Tanjung Ringgit, East Lombok',
    'Full Day (10 Hours)',
    'island_hopping',
    950000,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'Pink Beach 1 & 2 distinct pink sand shores',
      'Snorkeling with baby reef sharks at Gili Petelu',
      'Emerging tidal sandbar Gili Pasir with giant starfish',
      'Panoramic ocean cliffs at Tanjung Ringgit'
    ],
    ARRAY[
      'Private AC vehicle transfer from Kuta/Mataram',
      'Private chartered boat to Pink Beach & Gili Petelu',
      'Full snorkeling equipment and safety vests',
      'All tourism retribution & parking fees'
    ],
    ARRAY[
      'Seafood lunch package',
      'Personal tips'
    ],
    '[
      { "day": 1, "title": "East Coast Exploration & Pink Sand Expedition", "description": "Depart early morning to Tanjung Luar fishing port. Board private boat to Gili Pasir (starfish bank), snorkel at Gili Petelu, relax at Pink Beach with panoramic cliff walk." }
    ]'::jsonb,
    'published',
    false
  ) RETURNING id INTO pkg_pink_beach;

  -- Pink Beach Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_pink_beach, 'Duo Travellers (2 Pax)', 2, 2, 950000, 0),
    (pkg_pink_beach, 'Group (3 - 5 Pax)', 3, 5, 700000, 25),
    (pkg_pink_beach, 'Large Group (6 - 10 Pax)', 6, 10, 500000, 45);


  -- 5. Tetebatu Rice Terrace & Waterfall Nature Walk
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'tetebatu-nature-cultural-walk',
    'Tetebatu Green Rice Terraces & Black Monkey Forest',
    'Experience the tranquil rural heart of Lombok: cascading rice fields, organic spice gardens, and indigenous black crested macaques.',
    'Tetebatu, East Lombok Highlands',
    'Full Day (7 Hours)',
    'cultural',
    650000,
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'Trek through scenic emerald green rice terraces',
      'Spot wild black crested macaques in Monkey Forest',
      'Visit local coffee, vanilla, and cacao plantations',
      'Hidden Sarang Walet (Swallow) cave waterfall'
    ],
    ARRAY[
      'Private return hotel transport',
      'Local English-speaking Tetebatu nature guide',
      'Traditional Sasak lunch at local warung',
      'Mineral water & local coffee tasting'
    ],
    ARRAY[
      'Personal expenses & souvenir shopping'
    ],
    '[
      { "day": 1, "title": "Countryside Village & Waterfall Trek", "description": "Morning stroll through tiered rice fields with Rinjani backdrop. Walk through spice plantations, monkey forest encounter, and refreshing cave waterfall dip." }
    ]'::jsonb,
    'published',
    false
  ) RETURNING id INTO pkg_tetebatu;

  -- Tetebatu Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_tetebatu, 'Couple (2 Pax)', 2, 2, 650000, 0),
    (pkg_tetebatu, 'Small Group (3 - 6 Pax)', 3, 6, 450000, 30);


  -- 6. Tiu Kelep & Sendang Gile Twin Waterfall
  INSERT INTO public.tour_packages (
    slug,
    title,
    tagline,
    destination,
    duration,
    category,
    base_price_idr,
    image_url,
    highlights,
    included,
    excluded,
    itinerary,
    status,
    is_featured
  ) VALUES (
    'tiu-kelep-sendang-gile-waterfalls',
    'Tiu Kelep & Sendang Gile Majestic Waterfalls',
    'Hike through lush jungle riverbeds to the most powerful and enchanting waterfalls at the foot of Mount Rinjani.',
    'Senaru, North Lombok',
    'Full Day (8 Hours)',
    'adventure',
    700000,
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
      'Sendang Gile 30-meter cascading waterfall',
      'Tiu Kelep mist spray and natural plunge pool swimming',
      'Jungle aqueduct bridge walk',
      'Traditional Sasak Senaru village tour'
    ],
    ARRAY[
      'Private AC transport with driver',
      'Local waterfall guide & safety assistance',
      'Waterfall entrance tickets',
      'Mineral water'
    ],
    ARRAY[
      'Lunch meals',
      'Waterproof phone case / sandals'
    ],
    '[
      { "day": 1, "title": "Senaru Rainforest Waterfalls Adventure", "description": "Pick up from hotel, scenic drive through Malimbu hill coastline. Trek 15 mins to Sendang Gile, followed by 30 mins riverbed trek to Tiu Kelep. Refresh in pool before returning via traditional Sasak village." }
    ]'::jsonb,
    'published',
    false
  ) RETURNING id INTO pkg_senaru_waterfall;

  -- Senaru Pricing Tiers
  INSERT INTO public.package_pricing_tiers (package_id, tier_name, min_pax, max_pax, price_per_pax_idr, discount_percent)
  VALUES
    (pkg_senaru_waterfall, 'Couple (2 Pax)', 2, 2, 700000, 0),
    (pkg_senaru_waterfall, 'Group (3 - 6 Pax)', 3, 6, 500000, 28);

END $$;
