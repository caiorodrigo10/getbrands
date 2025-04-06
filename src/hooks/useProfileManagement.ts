
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
          // Silently handle session error but don't disrupt user flow
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        if (!session) {
          if (isMounted) {
            setIsLoading(false);
          }
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
        
        // If we still have an error and it's not "no rows returned", just log it but continue
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile after retries:', profileError);
          // Continue with the flow even with error
        }

        // If we found a profile, use it
        if (profileData) {
          console.log('Found existing profile:', profileData);
          if (isMounted) {
            setProfile(profileData);
            setIsLoading(false);
          }
          return;
        }

        // If no profile was found, create a new one
        console.log('Creating new profile for user:', user.id);
        try {
          // Use user metadata to populate profile fields
          const userData = {
            id: user.id,
            email: user.email,
            language: isPortuguese ? 'pt' : 'en',
            role: user.app_metadata?.role || 'member',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            avatar_url: user.user_metadata?.avatar_url || ''
          };
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([userData])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            // Continue with the flow even with error
          } else if (newProfile && isMounted) {
            console.log('Created new profile:', newProfile);
            setProfile(newProfile);
          }
        } catch (upsertError) {
          console.error('Error in upsert operation:', upsertError);
          // Continue with the flow even with error
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
        // Don't show error to user, just log it
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
