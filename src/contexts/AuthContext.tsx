import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { identifyUser } from "@/lib/analytics";
import Gleap from "gleap";

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

  const handleAuthChange = async (session: any) => {
    if (session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);

      // Fetch user profile data for analytics
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        // Identify user in Segment
        await identifyUser(session.user.id, {
          email: session.user.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: profile.role,
          phone: profile.phone,
          created_at: session.user.created_at,
          last_sign_in: session.user.last_sign_in_at
        });

        // Identify user in Gleap
        Gleap.identify(session.user.id, {
          email: session.user.email,
          name: profile.first_name ? `${profile.first_name} ${profile.last_name}` : session.user.email,
          phone: profile.phone
        });
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      // Clear Gleap identity when user logs out
      Gleap.clearIdentity();
    }
    setIsLoading(false);
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
        console.error('Session error:', error);
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
      Gleap.clearIdentity();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
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
      
      navigate('/catalog', { replace: true });
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
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