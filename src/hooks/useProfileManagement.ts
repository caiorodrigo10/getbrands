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

        // First try to get existing profile
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') { // Not found error code
          console.error('Error fetching profile:', profileError);
          toast.error(getErrorMessage('profileError'));
          return;
        }

        if (existingProfile && isMounted) {
          console.log('Found existing profile:', existingProfile);
          setProfile(existingProfile);
        } else {
          console.log('Creating new profile for user:', user.id);
          // Create new profile if none exists
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([{ 
              id: user.id, 
              email: user.email,
              language: isPortuguese ? 'pt' : 'en',
              role: 'member'
            }])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error(getErrorMessage('createError'));
          } else if (newProfile && isMounted) {
            console.log('Created new profile:', newProfile);
            setProfile(newProfile);
          }
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