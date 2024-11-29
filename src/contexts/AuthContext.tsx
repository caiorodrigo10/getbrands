import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import i18n from 'i18next';

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
    try {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('language, onboarding_completed')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              language: i18n.language || 'en',
              role: 'member'
            });

          if (insertError) throw insertError;
        } else if (profile.language) {
          await i18n.changeLanguage(profile.language);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error in handleAuthChange:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          await handleAuthChange(session);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (mounted) {
              await handleAuthChange(session);
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
          mounted = false;
        };
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      
      const currentLang = i18n.language || 'en';
      navigate(`/${currentLang}/login`);
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
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('language, onboarding_completed')
        .eq('id', data.user.id)
        .maybeSingle();
      
      const lang = profile?.language || i18n.language || 'en';
      await i18n.changeLanguage(lang);
      
      if (profile && !profile.onboarding_completed) {
        navigate(`/${lang}/onboarding`, { replace: true });
      } else {
        navigate(`/${lang}/catalog`, { replace: true });
      }
      
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