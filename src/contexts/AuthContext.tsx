import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Gleap from "gleap";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const identifyUserInGleap = async (currentUser: User | null) => {
    if (currentUser) {
      try {
        // Fetch user profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        // Fetch user's projects
        const { data: projects } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", currentUser.id);

        // Get the most recent project if any exists
        const mainProject = projects && projects.length > 0 ? projects[0] : null;

        // Prepare user data for Gleap
        const userData = {
          userId: currentUser.id,
          email: currentUser.email,
          name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0],
          phone: profile?.phone || '',
          value: 0,
          companyId: mainProject?.id || '',
          companyName: mainProject?.name || '',
          plan: mainProject?.pack_type || 'none',
          customData: {
            role: profile?.role || 'member',
            user_type: profile?.user_type || 'member',
            projects_count: projects?.length || 0,
            created_at: profile?.created_at,
            shipping_address: profile?.shipping_address_street 
              ? `${profile.shipping_address_street}, ${profile.shipping_address_city}, ${profile.shipping_address_state} ${profile.shipping_address_zip}`
              : '',
          }
        };

        Gleap.identify(userData.userId, userData);
      } catch (error) {
        console.error('Error identifying user in Gleap:', error);
        // Fallback to basic identification if there's an error
        Gleap.identify(currentUser.id, {
          email: currentUser.email,
          name: currentUser.email?.split('@')[0] || 'User',
        });
      }
    } else {
      Gleap.clearIdentity();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setSession(null);
          setUser(null);
          return;
        }
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await identifyUserInGleap(initialSession.user);
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await identifyUserInGleap(currentSession.user);
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else {
        setSession(null);
        setUser(null);
        identifyUserInGleap(null);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Invalid email or password. Please try again.",
        });
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await identifyUserInGleap(data.user);
        navigate('/dashboard');
      }
    } catch (error) {
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
      navigate('/login');
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

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