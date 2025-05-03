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
  const [authInitialized, setAuthInitialized] = useState(false);

  const updateUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        const profile = await getUserProfile(currentUser.id);
        
        if (profile) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: profile.full_name || '',
            plan: (profile.plan as PlanType) || 'basic',
          });
          
          setUserPlan((profile.plan as PlanType) || 'basic');
        } else {
          console.log("No profile found for user:", currentUser.id);
          // Create a minimal user object even without a profile
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: '',
            plan: 'basic',
          });
          setUserPlan('basic');
        }
      } else {
        setUser(null);
        setUserPlan('basic');
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      // Even if there's an error, we should set loading to false
      setUser(null);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await updateUserData();
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        // Always set loading to false, even on error
        setUser(null);
        setUserPlan('basic');
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setLoading(true);

        if (session && session.user) {
          await updateUserData();
        } else {
          setUser(null);
          setUserPlan('basic');
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: loading || !authInitialized, 
      userPlan, 
      updateUserData 
    }}>
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
