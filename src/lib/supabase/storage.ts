
import { supabase } from './client';
import { toast } from '@/hooks/use-toast';

// File upload for pet images
export const uploadPetImage = async (userId: string, petId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${petId}/pet-image.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('pet-images')
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) {
    toast({
      title: "Failed to upload image",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('pet-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
