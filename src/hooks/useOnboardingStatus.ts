
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthWithPermissions } from './useAuthWithPermissions';

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuthWithPermissions();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) {
        console.log('[DEBUG] useOnboardingStatus - No user ID');
        return;
      }

      // If we already have the profile from useAuthWithPermissions, use it
      if (profile) {
        console.log('[DEBUG] useOnboardingStatus - Using cached profile:', profile);
        
        // Don't redirect if onboarding is completed or user is admin
        if (profile.onboarding_completed || isAdmin) return;
        
        // List of routes that don't require onboarding redirection
        const excludedPaths = [
          '/onboarding',
          '/login',
          '/signup',
          '/catalog',
          '/products',
          '/sample-orders',
          '/profile'
        ];

        // Don't redirect if on excluded path
        if (excludedPaths.some(path => window.location.pathname.startsWith(path))) {
          return;
        }

        // Redirect to onboarding
        console.log('[DEBUG] useOnboardingStatus - Redirecting to onboarding');
        navigate('/onboarding');
        return;
      }

      // If no cached profile, fetch it directly
      try {
        console.log('[DEBUG] useOnboardingStatus - Checking status for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('[DEBUG] useOnboardingStatus - Error:', error);
          return; // Don't disrupt user flow on errors
        }

        console.log('[DEBUG] useOnboardingStatus - Profile:', profile, 'Current path:', window.location.pathname);
        
        // Don't redirect if onboarding is completed or user is admin
        if (profile?.onboarding_completed || profile?.role === 'admin') return;

        // List of routes that don't require onboarding redirection
        const excludedPaths = [
          '/onboarding',
          '/login',
          '/signup',
          '/catalog',
          '/products',
          '/sample-orders',
          '/profile'
        ];

        // Don't redirect if on excluded path
        if (excludedPaths.some(path => window.location.pathname.startsWith(path))) {
          return;
        }

        // Redirect to onboarding
        console.log('[DEBUG] useOnboardingStatus - Redirecting to onboarding');
        navigate('/onboarding');
      } catch (error) {
        console.error('[DEBUG] useOnboardingStatus - Error:', error);
        // Don't show error to user to avoid disrupting their flow
      }
    };

    checkOnboardingStatus();
  }, [user, navigate, profile, isAdmin]);
};
