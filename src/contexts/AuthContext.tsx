import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/lib/auth/types";
import { toast } from "sonner";

declare global {
  interface Window {
    analytics: any;
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const identifyUser = async (user: User) => {
    try {
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (window.analytics) {
        // Identify user in Segment
        window.analytics.identify(user.id, {
          email: user.email,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          role: profile?.role,
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at
        });

        // Track login event
        window.analytics.track('User Logged In', {
          userId: user.id,
          email: user.email,
          provider: 'email'
        });
      }
    } catch (error) {
      console.error('Error identifying user:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await identifyUser(session.user);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        toast.error("Authentication error. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await identifyUser(session.user);
      } else {
        setUser(null);
        if (window.analytics) {
          window.analytics.reset();
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        await identifyUser(data.user);
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First, reset analytics
      if (window.analytics) {
        window.analytics.reset();
      }

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear user state and storage
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      // Finally, navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Error in logout:', error);
      toast.error("Error during logout");
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};