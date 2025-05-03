
import { supabase } from './client';
import { toast } from '@/hooks/use-toast';
import { Animal, PetType } from '@/types';

// Animal functions
export const getAnimals = async (userId?: string | null, isAdmin = false): Promise<Animal[]> => {
  try {
    let query = supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If not admin and userId is provided, filter by user_id
    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching animals:", error);
      toast({
        title: "Failed to fetch pets",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data?.map(animal => ({
      ...animal,
      type: animal.type as PetType,
      plan: animal.plan as any
    })) || [];
  } catch (error: any) {
    console.error("Error in getAnimals:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getAnimalById = async (id: string): Promise<Animal | null> => {
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching animal:", error);
    return null;
  }

  return data as Animal;
};

export const createAnimal = async (animal: Omit<Animal, 'id' | 'created_at' | 'scan_count' | 'last_scanned_at'>) => {
  const { data, error } = await supabase
    .from('animals')
    .insert([{ 
      ...animal, 
      scan_count: 0, 
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    toast({
      title: "Failed to create pet",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data as Animal;
};

export const updateAnimal = async (id: string, updates: Partial<Animal>) => {
  const { data, error } = await supabase
    .from('animals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    toast({
      title: "Failed to update pet",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data as Animal;
};

export const deleteAnimal = async (id: string) => {
  const { error } = await supabase
    .from('animals')
    .delete()
    .eq('id', id);

  if (error) {
    toast({
      title: "Failed to delete pet",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }

  return true;
};

export const recordAnimalScan = async (id: string) => {
  const { data, error } = await supabase.rpc('increment_scan_count', { animal_id: id });
  
  if (error) {
    console.error("Error recording scan:", error);
    return false;
  }
  
  return true;
};
