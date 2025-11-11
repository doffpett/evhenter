-- Migration 002: Add users table for authentication
-- Phase 2: Authentication & User Management

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200),

  -- Profile
  avatar_url TEXT,
  bio TEXT,

  -- Reputation system (for future community features)
  reputation INTEGER DEFAULT 0,
  events_submitted INTEGER DEFAULT 0,
  events_approved INTEGER DEFAULT 0,

  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  role VARCHAR(50) DEFAULT 'user', -- user, moderator, admin

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation DESC);

-- Update events table to track submissions
ALTER TABLE events
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';

-- Index for event status queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_submitted_by ON events(submitted_by);

-- Update timestamp trigger for users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts for authentication and event submission';
COMMENT ON COLUMN users.reputation IS 'Community reputation score based on contributions';
COMMENT ON COLUMN users.role IS 'User role: user, moderator, or admin';
COMMENT ON COLUMN events.status IS 'Event approval status: pending, approved, rejected';
COMMENT ON COLUMN events.submitted_by IS 'User who submitted the event (NULL for imported events)';
