# EcoSort AI - Complete Database Schema

## Tables Overview

### 1. profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  location TEXT,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. waste_logs
```sql
CREATE TABLE waste_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  detected_category TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  disposal_confirmed BOOLEAN DEFAULT FALSE,
  qr_location_id UUID REFERENCES qr_locations(id),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. qr_locations
```sql
CREATE TABLE qr_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  type TEXT NOT NULL CHECK (type IN ('Mixed Waste', 'Organic', 'Plastic', 'Paper', 'Metal', 'Glass', 'E-waste')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  total_disposals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. rewards
```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL CHECK (points_earned > 0),
  source TEXT NOT NULL,
  waste_log_id UUID REFERENCES waste_logs(id),
  qr_location_id UUID REFERENCES qr_locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. bins
```sql
CREATE TABLE bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES qr_locations(id) ON DELETE CASCADE,
  fill_level INTEGER DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  weight_kg DECIMAL(8,2) DEFAULT 0 CHECK (weight_kg >= 0),
  last_collected TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical', 'maintenance')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. achievements
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('first_disposal', 'top_recycler', 'eco_hero', 'streak_master', 'variety_collector')),
  achievement_data JSONB,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Views

### 1. leaderboard
```sql
CREATE VIEW leaderboard AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  COALESCE(SUM(r.points_earned), 0) as total_points,
  COUNT(DISTINCT wl.id) as total_disposals,
  MAX(r.created_at) as last_activity,
  RANK() OVER (ORDER BY COALESCE(SUM(r.points_earned), 0) DESC) as rank
FROM profiles p
LEFT JOIN rewards r ON p.id = r.user_id
LEFT JOIN waste_logs wl ON p.id = wl.user_id AND wl.disposal_confirmed = TRUE
WHERE p.role = 'user'
GROUP BY p.id, p.full_name, p.email
ORDER BY total_points DESC;
```

### 2. waste_analytics
```sql
CREATE VIEW waste_analytics AS
SELECT 
  DATE_TRUNC('day', wl.created_at) as date,
  wl.detected_category,
  COUNT(*) as count,
  AVG(wl.confidence_score) as avg_confidence,
  SUM(wl.points_awarded) as total_points
FROM waste_logs wl
WHERE wl.disposal_confirmed = TRUE
GROUP BY DATE_TRUNC('day', wl.created_at), wl.detected_category
ORDER BY date DESC;
```

### 3. location_analytics
```sql
CREATE VIEW location_analytics AS
SELECT 
  ql.id,
  ql.code,
  ql.location,
  ql.type,
  COUNT(wl.id) as total_disposals,
  COALESCE(SUM(wl.points_awarded), 0) as total_points_awarded,
  b.fill_level,
  b.status as bin_status,
  b.last_updated as bin_last_updated
FROM qr_locations ql
LEFT JOIN waste_logs wl ON ql.id = wl.qr_location_id AND wl.disposal_confirmed = TRUE
LEFT JOIN bins b ON ql.id = b.location_id
WHERE ql.status = 'active'
GROUP BY ql.id, ql.code, ql.location, ql.type, b.fill_level, b.status, b.last_updated
ORDER BY total_disposals DESC;
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_waste_logs_user_id ON waste_logs(user_id);
CREATE INDEX idx_waste_logs_created_at ON waste_logs(created_at);
CREATE INDEX idx_waste_logs_disposal_confirmed ON waste_logs(disposal_confirmed);
CREATE INDEX idx_waste_logs_qr_location_id ON waste_logs(qr_location_id);

CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_created_at ON rewards(created_at);

CREATE INDEX idx_qr_locations_code ON qr_locations(code);
CREATE INDEX idx_qr_locations_status ON qr_locations(status);

CREATE INDEX idx_bins_location_id ON bins(location_id);
CREATE INDEX idx_bins_status ON bins(status);
CREATE INDEX idx_bins_last_updated ON bins(last_updated);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
```

## Triggers

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waste_logs_updated_at BEFORE UPDATE ON waste_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_locations_updated_at BEFORE UPDATE ON qr_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update total points in profiles
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles 
        SET total_points = total_points + NEW.points_earned
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE profiles 
        SET total_points = total_points + (NEW.points_earned - OLD.points_earned)
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles 
        SET total_points = total_points - OLD.points_earned
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_total_points_trigger
    AFTER INSERT OR UPDATE OR DELETE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_user_total_points();

-- Update QR location disposal count
CREATE OR REPLACE FUNCTION update_location_disposal_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.disposal_confirmed = TRUE AND (OLD.disposal_confirmed IS NULL OR OLD.disposal_confirmed = FALSE) THEN
        UPDATE qr_locations 
        SET total_disposals = total_disposals + 1
        WHERE id = NEW.qr_location_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_disposal_count_trigger
    AFTER UPDATE ON waste_logs
    FOR EACH ROW EXECUTE FUNCTION update_location_disposal_count();
```

## Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own waste logs" ON waste_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waste logs" ON waste_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own rewards" ON rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view all waste logs" ON waste_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Public policies for QR locations and bins (no sensitive data)
CREATE POLICY "Everyone can view active QR locations" ON qr_locations
    FOR SELECT USING (status = 'active');

CREATE POLICY "Everyone can view bins" ON bins
    FOR SELECT USING (true);
```

## Sample Data

```sql
-- Sample QR Locations
INSERT INTO qr_locations (code, location, latitude, longitude, type) VALUES
('ECOSORT-BIN-001', 'Main Street - Recycling Center', -1.2921, 36.8219, 'Mixed Waste'),
('ECOSORT-BIN-002', 'City Park - Organic Waste', -1.2833, 36.8167, 'Organic'),
('ECOSORT-BIN-003', 'Shopping Mall - Plastic Collection', -1.2747, 36.8119, 'Plastic'),
('ECOSORT-BIN-004', 'School Campus - Paper Recycling', -1.2956, 36.8258, 'Paper');

-- Sample Bins
INSERT INTO bins (location_id, fill_level, weight_kg, status) VALUES
((SELECT id FROM qr_locations WHERE code = 'ECOSORT-BIN-001'), 45, 125.5, 'normal'),
((SELECT id FROM qr_locations WHERE code = 'ECOSORT-BIN-002'), 78, 89.2, 'warning'),
((SELECT id FROM qr_locations WHERE code = 'ECOSORT-BIN-003'), 23, 45.8, 'normal'),
((SELECT id FROM qr_locations WHERE code = 'ECOSORT-BIN-004'), 91, 156.3, 'critical');
```
