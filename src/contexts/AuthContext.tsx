import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { UserProfile, PlanType } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  userPlan: PlanType;
  updateUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<PlanType>('basic');

  const updateUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        const profile = await getUserProfile(currentUser.id);
        
        if (profile) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: profile.full_name,
            plan: (profile.plan as PlanType) || 'basic',
          });
          
          setUserPlan((profile.plan as PlanType) || 'basic');
        }
      } else {
        setUser(null);
        setUserPlan('basic');
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await updateUserData();
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          await updateUserData();
        } else {
          setUser(null);
          setUserPlan('basic');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userPlan, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
