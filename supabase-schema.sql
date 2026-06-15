-- ============================================================
-- MyRoom.tn — Complete Supabase Database Schema + TEST DATA
-- Copy ALL into SQL Editor and click "Run"
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  city        TEXT NOT NULL,
  university  TEXT,
  price       INTEGER NOT NULL,
  type        TEXT NOT NULL DEFAULT 'studio',
  furnished   BOOLEAN DEFAULT false,
  wifi        BOOLEAN DEFAULT false,
  ac          BOOLEAN DEFAULT false,
  parking     BOOLEAN DEFAULT false,
  whatsapp    TEXT NOT NULL,
  phone       TEXT,
  photos      TEXT[],
  latitude    DECIMAL(10,8),
  longitude   DECIMAL(11,8),
  is_verified BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  scam_reports INTEGER DEFAULT 0,
  view_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS scam_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL DEFAULT 'Annonce suspecte',
  status      TEXT DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (prevents errors)
DROP POLICY IF EXISTS "Public can view active listings" ON listings;
DROP POLICY IF EXISTS "Owner can manage own listings" ON listings;
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create reports" ON scam_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON scam_reports;

-- Recreate policies
CREATE POLICY "Public can view active listings" ON listings FOR SELECT USING (is_active = true);
CREATE POLICY "Owner can manage own listings" ON listings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can create reports" ON scam_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can view all reports" ON scam_reports FOR SELECT USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings SET view_count = view_count + 1 WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TEST DATA — 10 Sample Listings for Tunisia
-- ============================================================

-- First, we need a dummy user ID for test listings
-- Using a fixed UUID that wont conflict with real users
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@myroom.tn',
  '{"role": "landlord", "full_name": "MyRoom Demo"}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert 10 demo listings
INSERT INTO listings (
  user_id, title, description, city, university, price, type,
  furnished, wifi, ac, parking, whatsapp, photos, is_verified, view_count
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Studio meuble pres de ENIT Tunis',
  'Studio entierement meuble de 25m2, situe a 5 minutes a pied de ENIT. Comprend une kitchenette equipee, salle de bain privee, WiFi haut debit, climatisation et chauffage. Immeuble securise avec gardien. Ideal pour etudiant serieux.',
  'Tunis',
  'ENIT',
  450,
  'studio',
  true, true, true, false,
  '+21650123456',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
  true,
  42
),
(
  '00000000-0000-0000-0000-000000000001',
  'Chambre en colocation Sousse',
  'Grande chambre dans un appartement partage de 3 chambres. Salon commun, cuisine equipee, balcon avec vue mer. Colocataires etudiants de la FMS. Ambiance conviviale et studieuse.',
  'Sousse',
  'FMS',
  280,
  'colocation',
  true, true, true, false,
  '+21652111222',
  ARRAY['https://images.unsplash.com/photo-1598928506311-c55ez4f9d83f?w=800'],
  true,
  35
),
(
  '00000000-0000-0000-0000-000000000001',
  'Appartement S+1 Monastir',
  'Bel appartement S+1 de 60m2 pres de ISIMM. Salon spacieux, chambre avec placard, cuisine americaine equipee. Parking prive dans la residence. Proche de toutes commodites.',
  'Monastir',
  'ISIMM',
  550,
  'appartement',
  true, true, true, true,
  '+21653999888',
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  false,
  18
),
(
  '00000000-0000-0000-0000-000000000001',
  'Chambre individuelle Sfax',
  'Chambre simple et propre dans une maison familiale a 10 min de ENIS. Salle de bain partagee, cuisine accessible. Tres calme, parfait pour la concentration.',
  'Sfax',
  'ENIS',
  200,
  'chambre',
  false, false, false, false,
  '+21654123456',
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
  false,
  12
),
(
  '00000000-0000-0000-0000-000000000001',
  'Studio moderne Tunis El Manar',
  'Studio neuf de 30m2 dans residence etudiante. Design moderne, meubles neufs, WiFi fibre, smart TV. Salle de sport et laverie dans la residence.',
  'Tunis',
  'El Manar',
  600,
  'studio',
  true, true, true, true,
  '+21655666777',
  ARRAY['https://images.unsplash.com/photo-1502005229766-52835d7f5d5a?w=800'],
  true,
  67
),
(
  '00000000-0000-0000-0000-000000000001',
  'Colocation 3 chambres Gabes',
  'Appartement de 3 chambres a partager pres de ENIG. 2 chambres deja occupees par des etudiants en medecine. Recherche 3eme colocataire serieux.',
  'Gabes',
  'ENIG',
  250,
  'colocation',
  true, true, false, false,
  '+21650777888',
  ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
  false,
  8
),
(
  '00000000-0000-0000-0000-000000000001',
  'Studio economique Nabeul',
  'Petit studio fonctionnel de 20m2 proche de ISLT. Kitchenette basique, douche, WC. Prix tres abordable pour etudiant avec petit budget.',
  'Nabeul',
  'ISLT',
  180,
  'studio',
  false, false, false, false,
  '+21652222333',
  ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
  false,
  5
),
(
  '00000000-0000-0000-0000-000000000001',
  'Appartement S+2 Tunis La Marsa',
  'Magnifique appartement S+2 de 90m2 a La Marsa, proche de SupCom. 2 chambres avec dressing, grand salon, terrasse. Parking souterrain. Vue sur mer.',
  'Tunis',
  'SupCom',
  900,
  'appartement',
  true, true, true, true,
  '+21655999900',
  ARRAY['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800'],
  true,
  89
),
(
  '00000000-0000-0000-0000-000000000001',
  'Chambre chez habitant Sousse',
  'Chambre chez une famille sympathique a 15 min de IHEC. Petit dejeuner inclus, acces cuisine le soir. Ambiance familiale chaleureuse.',
  'Sousse',
  'IHEC',
  220,
  'chambre',
  true, true, false, false,
  '+21653333444',
  ARRAY['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'],
  true,
  23
),
(
  '00000000-0000-0000-0000-000000000001',
  'Studio premium Berges du Lac',
  'Studio haut standing de 35m2 aux Berges du Lac. Piscine dans la residence, salle de sport, concierge 24/7. Proche de toutes les universites par metro leger.',
  'Tunis',
  'Universites',
  750,
  'studio',
  true, true, true, true,
  '+21658000011',
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
  true,
  156
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS (Create in Storage section of Supabase)
-- ============================================================
-- Go to Storage → New bucket → Create "avatars" (public)
-- Go to Storage → New bucket → Create "listings" (public)
-- Set policies to allow authenticated users to upload
