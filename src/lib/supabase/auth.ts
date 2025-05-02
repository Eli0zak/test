
import { supabase } from './client';
import { toast } from '@/hooks/use-toast';

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data.user;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast({
      title: "Registration Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
