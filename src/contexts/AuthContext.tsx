import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoleBasedRedirectPath } from "@/lib/roleRedirection";
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const identifyUserInGleap = async (currentUser: User | null) => {
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', currentUser.id)
        .single();

      const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0] || 'User';
      
      Gleap.identify(currentUser.id, {
        email: currentUser.email,
        name: fullName,
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  const handleRedirection = async (currentUser: User | null) => {
    if (!currentUser) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }

    // Skip redirection if user is on the root path
    if (location.pathname === '/') {
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, projects:projects(id)')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      const hasProjects = Array.isArray(profile?.projects) && profile.projects.length > 0;
      const redirectPath = getRoleBasedRedirectPath(profile?.role, hasProjects);
      
      // Only redirect if we're on the login page
      if (location.pathname === '/login') {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/login');
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
          identifyUserInGleap(initialSession.user);
          handleRedirection(initialSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
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
        identifyUserInGleap(currentSession.user);
        handleRedirection(currentSession.user);
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
          description: "Invalid email or password. Please check your credentials and try again.",
        });
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        identifyUserInGleap(data.user);
        handleRedirection(data.user);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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