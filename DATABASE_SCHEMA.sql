-- EcoSort AI Database Schema
-- Supabase PostgreSQL Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste categories
CREATE TABLE waste_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  bin_color TEXT,
  disposal_instructions TEXT,
  environmental_impact TEXT,
  points_value INTEGER DEFAULT 10,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR locations (bins)
CREATE TABLE qr_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  qr_code TEXT UNIQUE NOT NULL,
  location_name TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  waste_type_id INTEGER REFERENCES waste_categories(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bins (physical containers)
CREATE TABLE bins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  qr_location_id UUID REFERENCES qr_locations(id),
  bin_identifier TEXT UNIQUE,
  capacity_kg DECIMAL(8, 2),
  current_weight_kg DECIMAL(8, 2) DEFAULT 0,
  last_collected TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bin status (IoT simulation)
CREATE TABLE bin_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bin_id UUID REFERENCES bins(id),
  fill_level_percentage INTEGER DEFAULT 0 CHECK (fill_level_percentage >= 0 AND fill_level_percentage <= 100),
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'full', 'maintenance', 'offline'))
);

-- Waste logs (classification and disposal)
CREATE TABLE waste_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  image_url TEXT,
  waste_category_id INTEGER REFERENCES waste_categories(id),
  confidence_score DECIMAL(5, 4),
  qr_location_id UUID REFERENCES qr_locations(id),
  disposal_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards transactions
CREATE TABLE rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  waste_log_id UUID REFERENCES waste_logs(id),
  points INTEGER NOT NULL,
  transaction_type TEXT DEFAULT 'earned' CHECK (transaction_type IN ('earned', 'redeemed', 'bonus')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER,
  badge_type TEXT CHECK (badge_type IN ('disposal', 'streak', 'category', 'special')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements (junction table)
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  achievement_id INTEGER REFERENCES achievements(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboard (aggregated view)
CREATE TABLE leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  rank_position INTEGER,
  total_points INTEGER,
  weekly_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default waste categories
INSERT INTO waste_categories (name, description, bin_color, disposal_instructions, environmental_impact, points_value, icon_url) VALUES
('Plastic', 'Plastic bottles, containers, and packaging', 'Blue', 'Rinse and place in blue bin. Remove caps.', 'Takes 450+ years to decompose', 15, '/icons/plastic.svg'),
('Organic', 'Food waste, yard waste, and compostables', 'green', 'Place in green compost bin. No plastic bags.', 'Reduces methane emissions', 10, '/icons/organic.svg'),
('Metal', 'Aluminum cans, steel containers, and metal scraps', 'Yellow', 'Rinse and place in yellow bin. Crush cans to save space.', 'Infinitely recyclable', 20, '/icons/metal.svg'),
('Glass', 'Glass bottles, jars, and containers', 'Red', 'Rinse and place in red bin. Separate by color if possible.', '100% recyclable without quality loss', 18, '/icons/glass.svg'),
('Paper', 'Newspapers, cardboard, and clean paper products', 'Blue', 'Keep dry and place in blue bin. No waxed paper.', 'Saves trees and reduces energy', 12, '/icons/paper.svg'),
('E-waste', 'Electronics, batteries, and electrical devices', 'Purple', 'Take to special e-waste collection point. Do not put in regular bins.', 'Contains hazardous materials', 25, '/icons/ewaste.svg');

-- Insert default achievements
INSERT INTO achievements (name, description, icon_url, points_required, badge_type) VALUES
('First Sort', 'Successfully classify your first waste item', '/icons/first-sort.svg', 1, 'disposal'),
('Eco Warrior', 'Classify 50 waste items correctly', '/icons/eco-warrior.svg', 50, 'disposal'),
('Plastic Free', 'Dispose 100 plastic items correctly', '/icons/plastic-free.svg', 100, 'category'),
('green Thumb', 'Dispose 50 organic items correctly', '/icons/green-thumb.svg', 50, 'category'),
('Week Streak', 'Dispose waste for 7 consecutive days', '/icons/week-streak.svg', 7, 'streak'),
('Month Master', 'Dispose waste for 30 consecutive days', '/icons/month-master.svg', 30, 'streak'),
('Top Recycler', 'Reach top 10 on leaderboard', '/icons/top-recycler.svg', 1, 'special'),
('Perfect Score', 'Achieve 95%+ accuracy in 100 classifications', '/icons/perfect-score.svg', 100, 'special');

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_waste_logs_user_id ON waste_logs(user_id);
CREATE INDEX idx_waste_logs_disposal_timestamp ON waste_logs(disposal_timestamp);
CREATE INDEX idx_waste_logs_waste_category_id ON waste_logs(waste_category_id);
CREATE INDEX idx_qr_locations_qr_code ON qr_locations(qr_code);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_bin_status_bin_id ON bin_status(bin_id);
CREATE INDEX idx_bin_status_last_updated ON bin_status(last_updated);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qr_locations_updated_at BEFORE UPDATE ON qr_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Profiles: Users can only see their own profile, admins can see all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Waste logs: Users can only see their own logs, admins can see all
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own waste logs" ON waste_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own waste logs" ON waste_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all waste logs" ON waste_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Rewards: Users can only see their own rewards, admins can see all
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rewards" ON rewards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all rewards" ON rewards FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- User achievements: Users can only see their own achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (user_id = auth.uid());

-- Public tables (no RLS needed)
-- waste_categories, qr_locations, bins, bin_status, achievements, leaderboard

-- Create views for analytics
CREATE VIEW waste_analytics AS
SELECT 
  wc.name as category_name,
  COUNT(wl.id) as total_disposals,
  AVG(wl.confidence_score) as avg_confidence,
  SUM(wl.points_earned) as total_points,
  DATE_TRUNC('day', wl.disposal_timestamp) as disposal_date
FROM waste_logs wl
JOIN waste_categories wc ON wl.waste_category_id = wc.id
GROUP BY wc.name, DATE_TRUNC('day', wl.disposal_timestamp)
ORDER BY disposal_date DESC;

CREATE VIEW user_analytics AS
SELECT 
  p.full_name,
  p.total_points,
  COUNT(wl.id) as total_disposals,
  AVG(wl.confidence_score) as avg_confidence,
  MAX(wl.disposal_timestamp) as last_disposal
FROM profiles p
LEFT JOIN waste_logs wl ON p.id = wl.user_id
GROUP BY p.id, p.full_name, p.total_points
ORDER BY p.total_points DESC;

-- Function to update user points
CREATE OR REPLACE FUNCTION update_user_points(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET total_points = (
    SELECT COALESCE(SUM(points), 0) 
    FROM rewards 
    WHERE user_id = user_uuid
  )
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to award points for waste disposal
CREATE OR REPLACE FUNCTION award_disposal_points(
  user_uuid UUID,
  waste_log_uuid UUID,
  points INTEGER,
  description TEXT DEFAULT 'Points earned for waste disposal'
)
RETURNS UUID AS $$
DECLARE
  reward_uuid UUID;
BEGIN
  -- Insert reward record
  INSERT INTO rewards (user_id, waste_log_id, points, transaction_type, description)
  VALUES (user_uuid, waste_log_uuid, points, 'earned', description)
  RETURNING id INTO reward_uuid;
  
  -- Update user total points
  PERFORM update_user_points(user_uuid);
  
  -- Check for new achievements
  PERFORM check_user_achievements(user_uuid);
  
  RETURN reward_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements (simplified)
CREATE OR REPLACE FUNCTION check_user_achievements(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  user_disposals INTEGER;
BEGIN
  -- Get total disposals for user
  SELECT COUNT(*) INTO user_disposals
  FROM waste_logs 
  WHERE user_id = user_uuid AND verified = TRUE;
  
  -- Award First Sort achievement
  IF user_disposals >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (user_uuid, 1)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
  
  -- Award Eco Warrior achievement
  IF user_disposals >= 50 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (user_uuid, 2)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert leaderboard entry
  INSERT INTO leaderboard (user_id, total_points, weekly_points, monthly_points, last_updated)
  VALUES (
    NEW.user_id,
    (SELECT COALESCE(SUM(points), 0) FROM rewards WHERE user_id = NEW.user_id),
    (SELECT COALESCE(SUM(points), 0) FROM rewards WHERE user_id = NEW.user_id AND created_at >= NOW() - INTERVAL '7 days'),
    (SELECT COALESCE(SUM(points), 0) FROM rewards WHERE user_id = NEW.user_id AND created_at >= NOW() - INTERVAL '30 days'),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_points = EXCLUDED.total_points,
    weekly_points = EXCLUDED.weekly_points,
    monthly_points = EXCLUDED.monthly_points,
    last_updated = EXCLUDED.last_updated;
  
  -- Update rankings
  WITH ranked_users AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank_position
    FROM leaderboard
  )
  UPDATE leaderboard lb
  SET rank_position = ru.rank_position
  FROM ranked_users ru
  WHERE lb.user_id = ru.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leaderboard
  AFTER INSERT ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_leaderboard();

-- Chatbot interaction logs
CREATE TABLE chatbot_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  context TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_chatbot_logs_user_id ON chatbot_logs(user_id);
CREATE INDEX idx_chatbot_logs_created_at ON chatbot_logs(created_at);
