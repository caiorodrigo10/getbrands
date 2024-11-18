import React, { createContext, useContext, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Gleap from "gleap";
import { useAuthRedirection } from "@/hooks/useAuthRedirection";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthSession } from "@/hooks/useAuthSession";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleUserRedirection } = useAuthRedirection();
  const { session, isLoading: isSessionLoading } = useAuthSession();
  const { 
    user, 
    setUser,
    isLoading: isUserLoading, 
    setIsLoading,
    identifyUserInGleap 
  } = useAuthState();

  const isLoading = isSessionLoading || isUserLoading;

  React.useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      identifyUserInGleap(session.user);
      handleUserRedirection(session.user);
    } else {
      setUser(null);
      identifyUserInGleap(null);
    }
  }, [session]);

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
      const { error } = await supabase.auth.signOut();
      
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
        setUser(null);
        identifyUserInGleap(null);
        toast({
          title: "Success",
          description: "Logged out successfully!",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
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