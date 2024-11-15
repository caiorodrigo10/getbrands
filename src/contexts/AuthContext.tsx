import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
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

  const identifyUserInGleap = (currentUser: User | null) => {
    if (currentUser) {
      Gleap.identify(currentUser.id, {
        email: currentUser.email,
        name: currentUser.email?.split('@')[0] || 'User',
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  const handleAuthError = () => {
    setSession(null);
    setUser(null);
    identifyUserInGleap(null);
    navigate('/login');
    toast({
      variant: "destructive",
      title: "Session Expired",
      description: "Please sign in again to continue.",
    });
  };

  const redirectBasedOnRole = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          handleAuthError();
          return;
        }
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          identifyUserInGleap(initialSession.user);
          await redirectBasedOnRole(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleAuthError();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event);
      
      if (['SIGNED_OUT', 'USER_DELETED'].includes(event)) {
        setSession(null);
        setUser(null);
        identifyUserInGleap(null);
        navigate('/login');
        return;
      }

      if (event === 'TOKEN_REFRESHED' && !currentSession) {
        handleAuthError();
        return;
      }

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        identifyUserInGleap(currentSession.user);
        if (event === 'SIGNED_IN') {
          await redirectBasedOnRole(currentSession.user.id);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
        identifyUserInGleap(data.user);
        await redirectBasedOnRole(data.user.id);
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