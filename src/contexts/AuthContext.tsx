import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/lib/auth/types";
import { toast } from "sonner";

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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
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
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear local state first for immediate UI feedback
      setUser(null);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Only attempt to sign out if there's an active session
        const { error } = await supabase.auth.signOut();
        if (error && !error.message?.includes('session_not_found')) {
          console.error('Sign out error:', error);
          toast.error("There was an issue signing out, but you've been logged out successfully");
        }
      }

      // Clear any stored auth data
      localStorage.removeItem('supabase.auth.token');
      
      // Always navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error in logout:', error);
      // Show error to user but don't prevent logout
      toast.error("There was an issue during logout, please try again");
      // Still navigate to login page
      navigate('/login');
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