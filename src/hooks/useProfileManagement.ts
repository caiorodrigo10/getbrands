
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface UseProfileManagementProps {
  user: User | null;
  isPortuguese: boolean;
  getErrorMessage: (key: string) => string;
}

export const useProfileManagement = ({ user, isPortuguese, getErrorMessage }: UseProfileManagementProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error(getErrorMessage('sessionError'));
          navigate('/');
          return;
        }

        if (!session) {
          navigate('/');
          return;
        }

        // Try to get user profile with retries for potential RLS policy issues
        let attempts = 0;
        let profileData = null;
        let profileError = null;
        
        while (attempts < 3 && !profileData) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          
          if (!error) {
            profileData = data;
            break;
          } else {
            profileError = error;
            console.warn(`Attempt ${attempts + 1} to fetch profile failed:`, error);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          attempts++;
        }
        
        // Se ainda houver erro e não for "no rows returned", reportar erro
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile after retries:', profileError);
          toast.error(getErrorMessage('profileError'));
          // Continuar com o fluxo mesmo com erro
        }

        // Se encontramos um perfil, use-o
        if (profileData) {
          console.log('Found existing profile:', profileData);
          if (isMounted) {
            setProfile(profileData);
            setIsLoading(false);
          }
          return;
        }

        // Se nenhum perfil foi encontrado, criar um novo
        console.log('Creating new profile for user:', user.id);
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([{ 
              id: user.id, 
              email: user.email,
              language: isPortuguese ? 'pt' : 'en',
              role: user.app_metadata?.role || 'member'
            }])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error(getErrorMessage('createError'));
            // Continuar com o fluxo mesmo com erro
          } else if (newProfile && isMounted) {
            console.log('Created new profile:', newProfile);
            setProfile(newProfile);
          }
        } catch (upsertError) {
          console.error('Error in upsert operation:', upsertError);
          // Continuar com o fluxo mesmo com erro
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
        toast.error(getErrorMessage('networkError'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user, navigate, isPortuguese, getErrorMessage]);

  return { profile, isLoading };
};
