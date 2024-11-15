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

      // If user is admin and not already in admin area, redirect to admin
      if (profile?.role === 'admin' && !location.pathname.startsWith('/admin')) {
        navigate('/admin');
        return;
      }
      
      // If user is not admin and trying to access admin area, redirect to root
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
      navigate('/');
    }
  };

  const handleAuthError = () => {
    navigate('/login');
    toast({
      variant: "destructive",
      title: "Session Expired",
      description: "Please sign in again to continue.",
    });
  };

  return { redirectBasedOnRole, handleAuthError };
};