import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirection = () => {
  const navigate = useNavigate();

  const getRedirectPath = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'customer':
        return '/dashboard';
      case 'admin':
        return '/admin';
      case 'member':
      case 'sampler':
        return '/start-here';
      default:
        return '/dashboard';
    }
  };

  const handleUserRedirection = async (currentUser: User | null) => {
    if (!currentUser) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (profile?.role) {
        const redirectPath = getRedirectPath(profile.role);
        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Error during redirection:', error);
    }
  };

  return { handleUserRedirection };
};