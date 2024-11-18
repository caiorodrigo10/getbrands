import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { PUBLIC_ROUTES, identifyUserInGleap, checkOnboardingStatus } from "./auth/authUtils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthRedirect = async (userId: string) => {
    const hasCompletedOnboarding = await checkOnboardingStatus(userId);
    if (!hasCompletedOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await identifyUserInGleap(initialSession.user);
          
          if (location.pathname === '/login') {
            await handleAuthRedirect(initialSession.user.id);
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
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth event:', event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await identifyUserInGleap(currentSession.user);
        
        if (location.pathname === '/login') {
          await handleAuthRedirect(currentSession.user.id);
        }
      } else {
        setSession(null);
        setUser(null);
        await identifyUserInGleap(null);
        
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: "Invalid email or password. Please check your credentials.",
        });
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await identifyUserInGleap(data.user);
        await handleAuthRedirect(data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setSession(null);
      identifyUserInGleap(null);

      window.localStorage.removeItem('supabase.auth.token');
      window.localStorage.removeItem('sb-skrvprmnncxpkojraoem-auth-token');

      try {
        await supabase.auth.signOut();
      } catch (error: any) {
        if (!error.message?.includes('session_not_found')) {
          console.error('SignOut error:', error);
        }
      }

      navigate('/login', { replace: true });

      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      
      navigate('/login', { replace: true });
      
      if (!error.message?.includes('session_not_found')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred during logout.",
        });
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        isAuthenticated: !!session
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