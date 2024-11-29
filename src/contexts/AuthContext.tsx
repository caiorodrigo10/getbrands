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
    if (session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);
      
      try {
        // First try to get the existing profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        // If no profile exists, create one with default values
        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              language: i18n.language || 'en',
              role: 'member'
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return;
          }
        } else if (profile.language) {
          // Only change language if we have a valid value
          await i18n.changeLanguage(profile.language);
        }
      } catch (error) {
        console.error('Error in profile management:', error);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
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
      
      // Get current language before redirecting
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
      
      // Get user's language preference or use current language
      const { data: profile } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', data.user.id)
        .maybeSingle();
      
      const lang = profile?.language || i18n.language || 'en';
      await i18n.changeLanguage(lang);
      
      navigate(`/${lang}/catalog`, { replace: true });
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