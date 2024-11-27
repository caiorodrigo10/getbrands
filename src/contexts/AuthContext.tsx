import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/lib/auth/types";
import { handleUserSession } from "@/lib/auth/session";
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
      // First clear all session data
      await supabase.auth.clearSession();
      
      // Clear local state
      setUser(null);
      
      // Attempt to sign out from Supabase
      try {
        await supabase.auth.signOut();
      } catch (signOutError: any) {
        // Ignore specific errors that indicate the user is already signed out
        if (!signOutError.message?.includes('session_not_found') && 
            !signOutError.message?.includes('403')) {
          console.error('Sign out error:', signOutError);
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