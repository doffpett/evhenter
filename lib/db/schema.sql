-- evHenter Database Schema
-- Phase 1: Event Management System
-- PostgreSQL compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Event Types (categories)
CREATE TABLE IF NOT EXISTS event_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- emoji or icon name
  color VARCHAR(7), -- hex color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Locations (cities/areas)
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Norway',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone VARCHAR(50) DEFAULT 'Europe/Oslo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(city, name)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  description TEXT,

  -- Type and Location
  event_type_id INTEGER REFERENCES event_types(id) ON DELETE SET NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  venue_name VARCHAR(200),
  venue_address TEXT,

  -- Timing
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- iCal RRULE format (for future)

  -- URLs and Media
  original_url TEXT,
  ticket_url TEXT,
  image_url TEXT,
  image_generated BOOLEAN DEFAULT FALSE, -- AI-generated image

  -- Metadata
  organizer_name VARCHAR(200),
  organizer_url TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'NOK',
  is_free BOOLEAN DEFAULT FALSE,
  capacity INTEGER,

  -- Status and Flags
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_cancelled BOOLEAN DEFAULT FALSE,

  -- Source tracking
  source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'url_parse', 'api', 'import')),
  submitted_by UUID, -- references users(id) - will add in Phase 2
  parsed_data JSONB, -- Store raw parsed data from AI

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Search optimization
  search_vector tsvector
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_published_at ON events(published_at) WHERE published_at IS NOT NULL;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING GIN(search_vector);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_location_date ON events(location_id, start_date);
CREATE INDEX IF NOT EXISTS idx_events_type_date ON events(event_type_id, start_date);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, start_date) WHERE status = 'approved';

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);

-- Event type indexes
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON event_types(slug);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_events_slug BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

-- Update search_vector for full-text search
CREATE OR REPLACE FUNCTION update_event_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('norwegian', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('norwegian', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('norwegian', coalesce(NEW.venue_name, '')), 'C') ||
    setweight(to_tsvector('norwegian', coalesce(NEW.organizer_name, '')), 'D');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_search_vector BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_event_search_vector();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Event Types
INSERT INTO event_types (name, slug, description, icon, color) VALUES
  ('Konsert', 'konsert', 'Musikkonsert og liveopptreden', '🎵', '#ec4899'),
  ('Workshop', 'workshop', 'Lær noe nytt i en workshop', '🛠️', '#8b5cf6'),
  ('Festival', 'festival', 'Festival og større arrangementer', '🎪', '#f59e0b'),
  ('Konferanse', 'konferanse', 'Fagkonferanse og seminar', '🎤', '#3b82f6'),
  ('Utstilling', 'utstilling', 'Kunstutstilling og galleri', '🎨', '#10b981'),
  ('Sport', 'sport', 'Sportsarrangementer', '⚽', '#ef4444'),
  ('Teater', 'teater', 'Teaterforestilling og show', '🎭', '#a855f7'),
  ('Film', 'film', 'Filmvisning og kino', '🎬', '#06b6d4'),
  ('Mat & Drikke', 'mat-drikke', 'Matfestival og smaksprøving', '🍽️', '#f97316'),
  ('Nettverking', 'nettverking', 'Nettverksarrangement og meetup', '🤝', '#6366f1')
ON CONFLICT (slug) DO NOTHING;

-- Major Norwegian Cities
INSERT INTO locations (name, slug, city, region, latitude, longitude) VALUES
  ('Oslo Sentrum', 'oslo-sentrum', 'Oslo', 'Viken', 59.9139, 10.7522),
  ('Bergen Sentrum', 'bergen-sentrum', 'Bergen', 'Vestland', 60.3913, 5.3221),
  ('Trondheim Sentrum', 'trondheim-sentrum', 'Trondheim', 'Trøndelag', 63.4305, 10.3951),
  ('Stavanger Sentrum', 'stavanger-sentrum', 'Stavanger', 'Rogaland', 58.9700, 5.7331),
  ('Tromsø Sentrum', 'tromso-sentrum', 'Tromsø', 'Troms og Finnmark', 69.6492, 18.9553),
  ('Drammen Sentrum', 'drammen-sentrum', 'Drammen', 'Viken', 59.7439, 10.2045),
  ('Kristiansand Sentrum', 'kristiansand-sentrum', 'Kristiansand', 'Agder', 58.1467, 7.9956),
  ('Fredrikstad Sentrum', 'fredrikstad-sentrum', 'Fredrikstad', 'Viken', 59.2181, 10.9298),
  ('Sandnes Sentrum', 'sandnes-sentrum', 'Sandnes', 'Rogaland', 58.8523, 5.7357),
  ('Bodø Sentrum', 'bodo-sentrum', 'Bodø', 'Nordland', 67.2804, 14.4049)
ON CONFLICT (city, name) DO NOTHING;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for upcoming approved events with location and type info
CREATE OR REPLACE VIEW v_upcoming_events AS
SELECT
  e.id,
  e.title,
  e.slug,
  e.description,
  e.start_date,
  e.end_date,
  e.venue_name,
  e.venue_address,
  e.original_url,
  e.ticket_url,
  e.image_url,
  e.organizer_name,
  e.price_min,
  e.price_max,
  e.currency,
  e.is_free,
  e.is_featured,
  et.name as event_type,
  et.slug as event_type_slug,
  et.icon as event_type_icon,
  et.color as event_type_color,
  l.name as location_name,
  l.city as city,
  l.region as region,
  l.latitude,
  l.longitude
FROM events e
LEFT JOIN event_types et ON e.event_type_id = et.id
LEFT JOIN locations l ON e.location_id = l.id
WHERE e.status = 'approved'
  AND e.is_cancelled = FALSE
  AND e.start_date >= CURRENT_TIMESTAMP
ORDER BY e.start_date ASC;

-- ============================================================================
-- PERMISSIONS (for future users)
-- ============================================================================

-- Note: Will add user permissions in Phase 2 (Authentication)

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
