
import { supabase } from './client';
import { toast } from '@/hooks/use-toast';
import { PlanType, UserProfile } from '@/types';

// User profile functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};

// Admin function to get all user profiles
export const getUserProfiles = async (): Promise<UserProfile[]> => {
  try {
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

    // Process the data to get emails from auth.users
    const profiles: UserProfile[] = await Promise.all(data.map(async (profile) => {
      try {
        // For admin users, we attempt to get detailed user info
        // This will fall back gracefully if admin API access is restricted
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
        
        return {
          ...profile,
          email: authData?.user?.email || 'unknown@email.com',
          plan: (profile.plan || 'basic') as PlanType
        };
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Fall back to using just the profile data without email
        return {
          ...profile,
          email: 'unknown@email.com',
          plan: (profile.plan || 'basic') as PlanType
        };
      }
    }));

    return profiles;
  } catch (error) {
    console.error("Unexpected error fetching user profiles:", error);
    return [];
  }
};

// Plan helper functions
export const getUserPlan = async (userId: string): Promise<PlanType> => {
  try {
    const profile = await getUserProfile(userId);
    return (profile?.plan as PlanType) || 'basic';
  } catch (error) {
    console.error("Error getting user plan:", error);
    return 'basic';
  }
};

export const updateUserPlan = async (userId: string, plan: PlanType) => {
  try {
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
  } catch (error: any) {
    console.error("Error updating user plan:", error);
    toast({
      title: "Failed to update plan",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
