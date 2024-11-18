import React, { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ROUTES, identifyUserInGleap, checkOnboardingStatus } from "./auth/authUtils";
import { useAuthOperations } from "./auth/useAuthOperations";
import { AuthContextType } from "./auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthOperations(initialState);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          await identifyUserInGleap(session.user);
          
          auth.updateState({
            session,
            user: session.user,
            isAuthenticated: true
          });

          if (location.pathname === '/login') {
            const hasCompletedOnboarding = await checkOnboardingStatus(session.user.id);
            navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
          }
        } else if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      } finally {
        if (mounted) {
          auth.updateState({ isLoading: false });
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (session) {
          await identifyUserInGleap(session.user);
          
          auth.updateState({
            session,
            user: session.user,
            isAuthenticated: true
          });

          if (location.pathname === '/login') {
            const hasCompletedOnboarding = await checkOnboardingStatus(session.user.id);
            navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
          }
        } else {
          auth.updateState({
            session: null,
            user: null,
            isAuthenticated: false
          });

          await identifyUserInGleap(null);
          
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (auth.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
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