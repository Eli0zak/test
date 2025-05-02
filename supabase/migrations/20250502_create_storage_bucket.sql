
-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'Pet Images', true);

-- Create policy to allow users to insert their pet images
CREATE POLICY "Users can upload pet images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'pet-images');

-- Create policy to allow everyone to view pet images
CREATE POLICY "Anyone can view pet images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pet-images');

-- Create policy to allow users to update their pet images
CREATE POLICY "Users can update their pet images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'pet-images');

-- Create policy to allow users to delete their pet images
CREATE POLICY "Users can delete their pet images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'pet-images');
