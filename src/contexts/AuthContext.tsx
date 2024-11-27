import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/lib/auth/types";
import { toast } from "sonner";
import Gleap from "gleap";

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

  const identifyUserInGleap = (user: User | null) => {
    if (user) {
      Gleap.identify(user.id, {
        email: user.email,
        name: user.email // We'll update this with profile data when available
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          identifyUserInGleap(session.user);
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
        identifyUserInGleap(session.user);
      } else {
        setUser(null);
        Gleap.clearIdentity();
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
        identifyUserInGleap(data.user);
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      Gleap.clearIdentity();

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error("There was an issue signing out");
        return;
      }

      localStorage.removeItem('supabase.auth.token');
      
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