import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthProviderProps } from "./auth/types";
import { useAuthRedirect } from "./auth/useAuthRedirect";
import { useGleapIdentity } from "./auth/useGleapIdentity";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { redirectBasedOnRole, handleAuthError } = useAuthRedirect();
  const { identifyUserInGleap } = useGleapIdentity();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          handleAuthError();
          return;
        }

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          identifyUserInGleap(currentSession.user);
          await redirectBasedOnRole(currentSession.user.id);
        }
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
        setSession(null);
        setUser(null);
        identifyUserInGleap(null);
        handleAuthError();
        return;
      }

      if (event === 'TOKEN_REFRESHED' && !currentSession) {
        handleAuthError();
        return;
      }

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        identifyUserInGleap(currentSession.user);
        if (event === 'SIGNED_IN') {
          await redirectBasedOnRole(currentSession.user.id);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        identifyUserInGleap(data.user);
        await redirectBasedOnRole(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      identifyUserInGleap(null);
      handleAuthError();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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