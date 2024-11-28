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
      if (!user?.id) {
        console.log('[DEBUG] useOnboardingStatus - No user ID');
        return;
      }

      try {
        console.log('[DEBUG] useOnboardingStatus - Checking status for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('[DEBUG] useOnboardingStatus - Error:', error);
          throw error;
        }

        console.log('[DEBUG] useOnboardingStatus - Profile:', profile, 'Current path:', window.location.pathname);
        
        // Não fazer nada se o usuário já completou o onboarding
        if (profile?.onboarding_completed) return;

        // Lista de rotas que não devem redirecionar para onboarding
        const excludedPaths = [
          '/onboarding',
          '/login',
          '/signup',
          '/catalog',
          '/products',
          '/sample-orders',
          '/profile'
        ];

        // Não redirecionar se estiver em uma rota excluída
        if (excludedPaths.some(path => window.location.pathname.startsWith(path))) {
          return;
        }

        // Se chegou aqui, redirecionar para onboarding
        console.log('[DEBUG] useOnboardingStatus - Redirecting to onboarding');
        navigate('/onboarding');
      } catch (error) {
        console.error('[DEBUG] useOnboardingStatus - Error:', error);
        toast.error('Failed to check onboarding status');
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);
};