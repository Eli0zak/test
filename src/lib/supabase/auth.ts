import { supabase } from './client';
import { toast } from '@/hooks/use-toast';

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error.message);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data.user;
  } catch (error: any) {
    console.error("Unexpected sign in error:", error.message);
    toast({
      title: "Authentication Error",
      description: "An unexpected error occurred during sign in.",
      variant: "destructive",
    });
    return null;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Registration error:", error.message);
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data.user;
  } catch (error: any) {
    console.error("Unexpected registration error:", error.message);
    toast({
      title: "Registration Error",
      description: "An unexpected error occurred during registration.",
      variant: "destructive",
    });
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }

    // Clear local storage and cookies explicitly
    localStorage.clear();
    document.cookie = "supabase-auth-token=; Max-Age=0; path=/;";
    document.cookie = "session=; Max-Age=0; path=/;"; // Clear session cookie
  } catch (error: any) {
    console.error("Unexpected sign out error:", error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Get user error:", error.message);
      return null;
    }
    return data.user;
  } catch (error: any) {
    console.error("Unexpected get user error:", error.message);
    return null;
  }
};
