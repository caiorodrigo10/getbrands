import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSessionManagement = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      // Get current session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just clear local storage and redirect
        localStorage.clear();
        navigate('/login');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error && !error.message?.includes('session_not_found')) {
        console.error('Logout error:', error);
        toast.error("Error during logout. Please try again.");
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Network error during logout");
    } finally {
      setIsLoggingOut(false);
      localStorage.clear();
      // Always navigate to login page, even if there was an error
      navigate('/login');
    }
  };

  return { handleLogout, isLoggingOut };
};