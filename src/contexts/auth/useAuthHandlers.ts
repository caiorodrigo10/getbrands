import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { clearGleapIdentity } from "@/lib/auth/analytics";

export const useAuthHandlers = (
  setUser: (user: any) => void,
  setIsAuthenticated: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  identifyUserInAnalytics: (session: any) => Promise<void>
) => {
  const navigate = useNavigate();

  const handleAuthChange = async (session: any) => {
    console.log("[DEBUG] AuthContext - Auth state changed:", session?.user?.email);
    try {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        // Set session for 30 days
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        identifyUserInAnalytics(session);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearGleapIdentity();
      }
    } catch (error) {
      console.error('Error in handleAuthChange:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      identifyUserInAnalytics({ user: data.user });
      
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

  return {
    handleAuthChange,
    signOut,
    login
  };
};