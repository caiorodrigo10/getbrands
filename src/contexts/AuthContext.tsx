import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { handleAnalytics, handleGleapIdentification, clearGleapIdentity } from "@/lib/auth/analytics";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const identifyUserInAnalytics = async (session: any) => {
    if (!session?.user) return;

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        const retryAnalytics = async (retries = 3) => {
          try {
            await Promise.all([
              handleAnalytics(session.user, profile),
              handleGleapIdentification(session.user, profile)
            ]);
          } catch (error) {
            if (retries > 0) {
              setTimeout(() => retryAnalytics(retries - 1), 1000);
            }
          }
        };

        retryAnalytics();
      }
    } catch (error) {
      // Silent fail in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error identifying user in analytics:', error);
      }
    }
  };

  const handleAuthChange = async (session: any) => {
    try {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        identifyUserInAnalytics(session);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearGleapIdentity();
      }
    } catch (error) {
      // Silent fail in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error in handleAuthChange:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          await handleAuthChange(session);
        }
      } catch (error) {
        // Silent fail in production
        if (process.env.NODE_ENV !== 'production') {
          console.error('Session error:', error);
        }
        if (mounted) {
          setIsLoading(false);
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

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
      clearGleapIdentity();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      // Silent fail in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error signing out:', error);
      }
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      setIsAuthenticated(true);
      identifyUserInAnalytics({ user: data.user });
      navigate('/catalog', { replace: true });
      toast.success('Logged in successfully');
    } catch (error: any) {
      // Silent fail in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Login error:', error);
      }
      toast.error(error.message || 'Error logging in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, signOut, login }}>
      {children}
    </AuthContext.Provider>
  );
};
