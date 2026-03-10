-- Create classification-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'classification-images',
  'classification-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create policies for the storage bucket
-- Users can upload their own images
CREATE POLICY "Users can upload their own classification images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'classification-images' AND
    auth.role() = 'authenticated'
  );

-- Users can view their own images
CREATE POLICY "Users can view own classification images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'classification-images' AND
    auth.role() = 'authenticated'
  );

-- Users can update their own images
CREATE POLICY "Users can update own classification images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'classification-images' AND
    auth.role() = 'authenticated'
  );

-- Users can delete their own images
CREATE POLICY "Users can delete own classification images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'classification-images' AND
    auth.role() = 'authenticated'
  );

-- Admins can view all images
CREATE POLICY "Admins can view all classification images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'classification-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
