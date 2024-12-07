import { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "./auth/types";
import { useAuthState } from "./auth/useAuthState";
import { useAuthHandlers } from "./auth/useAuthHandlers";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  login: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    sessionChecked,
    setSessionChecked,
    identifyUserInAnalytics
  } = useAuthState();

  const { handleAuthChange, signOut, login } = useAuthHandlers(
    setUser,
    setIsAuthenticated,
    setIsLoading,
    identifyUserInAnalytics
  );

  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
            identifyUserInAnalytics(session);
          }
          setSessionChecked(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        await handleAuthChange(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      signOut, 
      login 
    }}>
      {children}
    </AuthContext.Provider>
  );
};