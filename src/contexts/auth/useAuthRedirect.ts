import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const redirectBasedOnRole = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Only redirect if user is not admin and trying to access admin area
      if (profile?.role !== 'admin' && location.pathname.startsWith('/admin')) {
        navigate('/');
        return;
      }

      // For non-admin users on login page, redirect to root
      if (profile?.role !== 'admin' && location.pathname === '/login') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem checking your permissions. Please try again.",
      });
      navigate('/');
    }
  };

  const handleAuthError = () => {
    if (location.pathname !== '/login') {
      navigate('/login');
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to continue.",
      });
    }
  };

  return { redirectBasedOnRole, handleAuthError };
};