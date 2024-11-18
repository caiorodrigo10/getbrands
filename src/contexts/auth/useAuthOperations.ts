import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { identifyUserInGleap, checkOnboardingStatus } from "./authUtils";
import { AuthState } from "./types";

export const useAuthOperations = (initialState: AuthState) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateState = (updates: Partial<AuthState>) => {
    setState(current => ({ ...current, ...updates }));
  };

  const login = async (email: string, password: string) => {
    updateState({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      if (data.user) {
        await identifyUserInGleap(data.user);
        const hasCompletedOnboarding = await checkOnboardingStatus(data.user.id);
        
        updateState({
          user: data.user,
          session: data.session,
          isAuthenticated: true
        });

        navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
      }
    } catch (error: any) {
      updateState({ error });
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Invalid email or password. Please check your credentials.",
      });
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const logout = async () => {
    updateState({ isLoading: true, error: null });

    try {
      await identifyUserInGleap(null);
      await supabase.auth.signOut();
      
      window.localStorage.removeItem('supabase.auth.token');
      window.localStorage.removeItem('sb-skrvprmnncxpkojraoem-auth-token');

      updateState({
        user: null,
        session: null,
        isAuthenticated: false
      });

      navigate('/login', { replace: true });
      
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error: any) {
      if (!error.message?.includes('session_not_found')) {
        updateState({ error });
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred during logout.",
        });
      }
    } finally {
      updateState({ isLoading: false });
    }
  };

  return {
    ...state,
    login,
    logout,
    updateState
  };
};