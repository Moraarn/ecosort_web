-- Create classification_history table
CREATE TABLE IF NOT EXISTS classification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  image_url TEXT NOT NULL,
  classification_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better performance
  INDEX idx_classification_user_id (user_id),
  INDEX idx_classification_created_at (created_at),
  INDEX idx_classification_category (classification_result ->> 'category' ->> 'name')
);

-- Enable RLS (Row Level Security)
ALTER TABLE classification_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own classifications
CREATE POLICY "Users can view own classifications" ON classification_history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own classifications
CREATE POLICY "Users can insert own classifications" ON classification_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own classifications
CREATE POLICY "Users can update own classifications" ON classification_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own classifications
CREATE POLICY "Users can delete own classifications" ON classification_history
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all classifications
CREATE POLICY "Admins can view all classifications" ON classification_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON classification_history TO authenticated;
GRANT SELECT ON classification_history TO anon;
