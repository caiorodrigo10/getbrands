import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthProviderProps } from "./auth/types";
import { useAuthRedirect } from "./auth/useAuthRedirect";
import { useGleapIdentity } from "./auth/useGleapIdentity";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { redirectBasedOnRole, handleAuthError } = useAuthRedirect();
  const { identifyUserInGleap } = useGleapIdentity();
  const { toast } = useToast();

  const handleSession = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      setSession(currentSession);
      setUser(currentSession.user);
      identifyUserInGleap(currentSession.user);
      await redirectBasedOnRole(currentSession.user.id);
    } else {
      setSession(null);
      setUser(null);
      identifyUserInGleap(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with your session. Please try logging in again.",
          });
          handleAuthError();
          setIsLoading(false);
          return;
        }

        await handleSession(currentSession);
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleAuthError();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event);
      
      if (['SIGNED_OUT', 'USER_DELETED'].includes(event)) {
        await handleSession(null);
        handleAuthError();
        return;
      }

      if (event === 'TOKEN_REFRESHED' && !currentSession) {
        handleAuthError();
        return;
      }

      await handleSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message,
        });
        throw error;
      }

      await handleSession(data.session);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      await handleSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was a problem signing out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, session, login, logout, isAuthenticated: !!session }}
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