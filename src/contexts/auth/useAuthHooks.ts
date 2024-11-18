import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { identifyUserInGleap } from "./gleapIdentification";

export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setSession(null);
          setUser(null);
          navigate('/login');
          return;
        }
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await identifyUserInGleap(initialSession.user);
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        navigate('/login');
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
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
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return { user, session, setUser, setSession };
};

export const useAuthActions = (setUser: (user: User | null) => void, setSession: (session: Session | null) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
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
        
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error logging out. Please try again.",
        });
        return;
      }

      setUser(null);
      setSession(null);
      await identifyUserInGleap(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return { login, logout };
};