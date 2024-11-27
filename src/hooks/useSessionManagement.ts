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
      
      // Directly sign out without any session checks
      await supabase.auth.signOut({
        scope: 'local'
      });

      // Clear any remaining data
      sessionStorage.clear();
      localStorage.clear();
      
      // Redirect immediately
      navigate('/login');
      
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Erro ao fazer logout. Por favor, tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut };
};