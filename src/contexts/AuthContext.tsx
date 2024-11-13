import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Initialize the session on mount
  useEffect(() => {
    // Set session data if it exists in localStorage
    const savedSession = localStorage.getItem("sb-session");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session?.user) {
        setUser(session.user);
      }
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("sb-session", JSON.stringify(session));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        localStorage.setItem("sb-session", JSON.stringify(session));
      } else {
        setUser(null);
        localStorage.removeItem("sb-session");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });

          if (signUpError) throw signUpError;
          if (!signUpData.user) throw new Error('No user returned after sign up');
          
          setUser(signUpData.user);
          localStorage.setItem("sb-session", JSON.stringify(signUpData.session));
          
          toast({
            title: "Success",
            description: "Account created successfully!",
          });
          return;
        }
        throw signInError;
      }

      if (!signInData.user) throw new Error('No user returned after sign in');

      setUser(signInData.user);
      localStorage.setItem("sb-session", JSON.stringify(signInData.session));

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log in. Please try again.",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("sb-session");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};