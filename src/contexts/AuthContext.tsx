import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { identifyUser, trackEvent } from "@/lib/analytics";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoleBasedRedirectPath } from "@/lib/roleRedirection";
import Gleap from "gleap";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface ProfileType {
  onboarding_completed: boolean;
  role: string;
  first_name: string | null;
  last_name: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserIdentification = async (user: User, profile: ProfileType) => {
    // Enhanced user identification with all relevant traits
    await identifyUser(user.id, {
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`.trim(),
      role: profile.role,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      onboarding_completed: profile.onboarding_completed,
      auth_provider: user.app_metadata.provider,
      email_confirmed: user.email_confirmed_at ? true : false
    });

    // Track login event with enhanced properties
    await trackEvent("User Logged In", {
      user_id: user.id,
      email: user.email,
      login_method: user.app_metadata.provider || 'email',
      role: profile.role,
      is_new_user: (new Date().getTime() - new Date(user.created_at).getTime()) < 300000 // 5 minutes
    });
    
    // Identify user in Gleap
    Gleap.identify(user.id, {
      email: user.email,
      name: profile.first_name ? `${profile.first_name} ${profile.last_name}` : user.email,
    });
  };

  const handleUserSession = async (user: User | null, isInitialLogin = false) => {
    if (!user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed, role, first_name, last_name')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const typedProfile = profile as ProfileType;

      // Identify user with all available information
      await handleUserIdentification(user, typedProfile);

      setUser(user);

      // Only redirect if it's the initial login
      if (isInitialLogin) {
        if (!typedProfile?.onboarding_completed) {
          navigate('/onboarding');
          return;
        }

        const redirectPath = getRoleBasedRedirectPath(typedProfile?.role);
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user, false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      const isInitialLogin = _event === 'SIGNED_IN';
      if (session?.user) {
        await handleUserSession(session.user, isInitialLogin);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error("No user returned from login");
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (user) {
        await trackEvent("User Logged Out", {
          user_id: user.id,
          email: user.email
        });
      }
      
      // Clear user state before signing out
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear Gleap identification on logout
      Gleap.clearIdentity();
      
      // Immediate navigation
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};