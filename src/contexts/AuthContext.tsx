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
        console.log("Initializing auth...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log("Found existing session for user:", session.user.email);
          await handleUserSession(session.user, true, setUser, navigate);
        } else {
          console.log("No existing session found");
        }
      } catch (error: any) {
        console.error('Error in initializeAuth:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: `Error initializing auth: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in:", session.user.email);
        await handleUserSession(session.user, true, setUser, navigate);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    console.log("Attempting login for email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful for user:", data.user.email);
        await handleUserSession(data.user, true, setUser, navigate);
      }
    } catch (error: any) {
      console.error('Error in login:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message || "Invalid email or password. Please try again.",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Logout successful");
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