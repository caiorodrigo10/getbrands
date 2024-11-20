import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Only redirect to onboarding if we're not already there
        if (profile && !profile.onboarding_completed && window.location.pathname !== '/onboarding') {
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast.error('Failed to check onboarding status');
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);
};