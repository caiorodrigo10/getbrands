
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthWithPermissions } from './useAuthWithPermissions';

export const useOnboardingStatus = (shouldCheck = true) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuthWithPermissions();

  // Check if the user is already on the onboarding page to prevent loops
  const currentPath = window.location.pathname;
  const isOnboardingPath = 
    currentPath.includes('/onboarding') || 
    currentPath.includes('/comecarpt') ||
    currentPath === '/pt/signup';

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Skip if shouldCheck is false or on onboarding path
      if (!shouldCheck || isOnboardingPath || !user?.id) {
        return;
      }

      console.log('[DEBUG] useOnboardingStatus - Checking status for user:', user.id, 'path:', currentPath);

      // If we already have the profile from useAuthWithPermissions, use it
      if (profile) {
        console.log('[DEBUG] useOnboardingStatus - Using cached profile:', profile);
        
        // Use multiple sources to determine if onboarding is completed
        const onboardingCompletedInProfile = profile.onboarding_completed === true;
        const onboardingCompletedInMetadata = user?.user_metadata?.onboarding_completed === true;
        const onboardingCompleted = onboardingCompletedInProfile || onboardingCompletedInMetadata;
        
        console.log('[DEBUG] useOnboardingStatus - Onboarding status check:', { 
          onboardingCompletedInProfile, 
          onboardingCompletedInMetadata,
          isAdmin,
          currentPath
        });
        
        // Don't redirect if onboarding is completed or user is admin
        if (onboardingCompleted || isAdmin) return;
        
        // List of routes that don't require onboarding redirection
        const excludedPaths = [
          '/onboarding',
          '/login',
          '/signup',
          '/catalog',
          '/products',
          '/sample-orders',
          '/profile',
          '/pt/onboarding',
          '/pt/start-here',
          '/pt/signup',
          '/comecarpt'
        ];

        // Don't redirect if on excluded path
        if (excludedPaths.some(path => currentPath.startsWith(path))) {
          return;
        }

        // Determine correct onboarding path based on language
        const language = profile.language || user?.user_metadata?.language || 'en';
        const onboardingPath = language === 'pt' ? '/pt/onboarding' : '/onboarding';
        
        // Redirect to appropriate onboarding
        console.log('[DEBUG] useOnboardingStatus - Redirecting to onboarding:', onboardingPath);
        navigate(onboardingPath);
        return;
      }

      // If no cached profile, fetch it directly
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, role, language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('[DEBUG] useOnboardingStatus - Error:', error);
          return; // Don't disrupt user flow on errors
        }

        console.log('[DEBUG] useOnboardingStatus - Profile:', profile);
        
        // Use multiple sources to determine if onboarding is completed
        const onboardingCompletedInProfile = profile?.onboarding_completed === true;
        const onboardingCompletedInMetadata = user?.user_metadata?.onboarding_completed === true;
        const onboardingCompleted = onboardingCompletedInProfile || onboardingCompletedInMetadata;
        const isAdminFromProfile = profile?.role === 'admin';
        
        // Don't redirect if onboarding is completed or user is admin
        if (onboardingCompleted || isAdminFromProfile) return;

        // List of routes that don't require onboarding redirection
        const excludedPaths = [
          '/onboarding',
          '/login',
          '/signup',
          '/catalog',
          '/products',
          '/sample-orders',
          '/profile',
          '/pt/onboarding',
          '/pt/start-here',
          '/pt/signup',
          '/comecarpt'
        ];

        // Don't redirect if on excluded path
        if (excludedPaths.some(path => currentPath.startsWith(path))) {
          return;
        }

        // Determine correct onboarding path based on language
        const language = profile?.language || user?.user_metadata?.language || 'en';
        const onboardingPath = language === 'pt' ? '/pt/onboarding' : '/onboarding';
        
        // Redirect to appropriate onboarding
        console.log('[DEBUG] useOnboardingStatus - Redirecting to onboarding from fetch:', onboardingPath);
        navigate(onboardingPath);
      } catch (error) {
        console.error('[DEBUG] useOnboardingStatus - Error:', error);
        // Don't show error to user to avoid disrupting their flow
      }
    };

    checkOnboardingStatus();
  }, [user, navigate, profile, isAdmin, isOnboardingPath, shouldCheck]);
};
