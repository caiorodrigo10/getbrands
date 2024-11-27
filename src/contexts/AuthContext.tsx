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
    identifyUser(user.id, {
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`.trim(),
      role: profile.role,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      onboarding_completed: profile.onboarding_completed,
    });

    trackEvent("User Logged In", {
      user_id: user.id,
      email: user.email,
      login_method: "email",
      role: profile.role,
    });
    
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
      setUser(user);

      await handleUserIdentification(user, typedProfile);

      if (isInitialLogin) {
        if (!typedProfile?.onboarding_completed) {
          navigate('/onboarding');
        } else {
          const redirectPath = getRoleBasedRedirectPath(typedProfile?.role);
          navigate(redirectPath);
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isInitialLogin = event === 'SIGNED_IN';
      
      if (session?.user) {
        await handleUserSession(session.user, isInitialLogin);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user, false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    Gleap.clearIdentity();
    navigate('/login');
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