-- Create smart_bins table
CREATE TABLE smart_bins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('Mixed', 'Plastic', 'Paper', 'Organic', 'Metal', 'Glass', 'E-waste')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Warning', 'Offline')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_sync TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  alerts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for smart_bins table
CREATE INDEX idx_smart_bins_location ON smart_bins(lat, lng);
CREATE INDEX idx_smart_bins_status ON smart_bins(status);
CREATE INDEX idx_smart_bins_created_at ON smart_bins(created_at);

-- Insert sample data for Kenya/Uganda region
INSERT INTO smart_bins (name, location, waste_type, status, progress, last_sync, lat, lng, alerts) VALUES
('Nairobi Central Bin', 'Nairobi Central, Kenya', 'Mixed', 'Active', 75, '2 mins ago', -1.2921, 36.8219, 0),
('Kampala Plaza Bin', 'Kampala Plaza, Uganda', 'Plastic', 'Active', 45, '5 mins ago', 0.3476, 32.5825, 0),
('Mombasa Port Bin', 'Mombasa Port, Kenya', 'Mixed', 'Warning', 92, '1 min ago', -4.0435, 39.6682, 2),
('Entebbe Airport Bin', 'Entebbe Airport, Uganda', 'Paper', 'Active', 30, '3 mins ago', 0.0434, 32.4435, 0);
