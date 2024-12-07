import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { handleAnalytics, handleGleapIdentification, clearGleapIdentity } from "@/lib/auth/analytics";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const identifyUserInAnalytics = async (session: any) => {
    if (!session?.user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        const retryAnalytics = async (retries = 3) => {
          try {
            await Promise.all([
              handleAnalytics(session.user, profile),
              handleGleapIdentification(session.user, profile)
            ]);
          } catch (error) {
            if (retries > 0) {
              console.log(`Retrying analytics identification... (${retries} attempts left)`);
              setTimeout(() => retryAnalytics(retries - 1), 1000);
            } else {
              console.error('Failed to identify user in analytics after all retries');
            }
          }
        };

        retryAnalytics();
      }
    } catch (error) {
      console.error('Error identifying user in analytics:', error);
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    sessionChecked,
    setSessionChecked,
    identifyUserInAnalytics
  };
};