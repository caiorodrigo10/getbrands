import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/lib/auth/types";
import { useToast } from "@/hooks/use-toast";
import { handleUserSession } from "@/lib/auth/session";

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
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleUserSession(session.user, true, setUser, navigate);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem initializing authentication.",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleUserSession(session.user, true, setUser, navigate);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        await handleUserSession(data.user, true, setUser, navigate);
      }
    } catch (error: any) {
      console.error('Error in login:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message || "There was a problem signing in.",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Error in logout:', error);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: error.message || "There was a problem signing out.",
      });
      throw error;
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