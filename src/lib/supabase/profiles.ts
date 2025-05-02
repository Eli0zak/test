import { supabase } from './client';
import { toast } from '@/hooks/use-toast';
import { PlanType, UserProfile } from '@/types';
import { User } from "@supabase/supabase-js";

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

// Admin function to get all user profiles
export const getUserProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user profiles:", error);
    toast({
      title: "Failed to fetch users",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data || [];
};

// Plan helper functions
export const getUserPlan = async (userId: string): Promise<PlanType> => {
  const profile = await getUserProfile(userId);
  return (profile?.plan as PlanType) || 'basic';
};

export const updateUserPlan = async (userId: string, plan: PlanType) => {
  const { error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId);

  if (error) {
    toast({
      title: "Failed to update plan",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }

  return true;
};
