import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Gleap from "gleap";
import { useAuthRedirection } from "@/hooks/useAuthRedirection";
import { useAuthState } from "@/hooks/useAuthState";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleUserRedirection } = useAuthRedirection();
  const { 
    user, 
    setUser, 
    session, 
    setSession, 
    isLoading, 
    setIsLoading,
    identifyUserInGleap 
  } = useAuthState();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setSession(null);
          setUser(null);
          return;
        }
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await identifyUserInGleap(initialSession.user);
          await handleUserRedirection(initialSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await identifyUserInGleap(currentSession.user);
        await handleUserRedirection(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
        identifyUserInGleap(null);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: "Invalid email or password. Please check your credentials and try again.",
        });
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await identifyUserInGleap(data.user);
        await handleUserRedirection(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setSession(null);
      identifyUserInGleap(null);
      
      const { error } = await supabase.auth.signOut();
      
      navigate('/login');
      
      if (error) {
        console.error('Logout error:', error);
        if (error.message !== 'session_not_found') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred during logout. Please try again.",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Logged out successfully!",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        login, 
        logout, 
        isAuthenticated: !!session,
        isLoading 
      }}
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