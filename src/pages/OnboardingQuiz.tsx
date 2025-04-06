
import { OnboardingQuiz } from "@/components/onboarding/OnboardingQuiz";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OnboardingQuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the user has already completed onboarding to prevent loops
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check for onboarding completion in multiple sources
        const onboardingCompletedInMetadata = user?.user_metadata?.onboarding_completed === true;
        
        if (onboardingCompletedInMetadata) {
          console.log("OnboardingQuizPage - User already completed onboarding (metadata)");
          navigate('/catalog');
          return;
        }
        
        // Check database if not found in metadata
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, role')
          .eq('id', user.id)
          .single();
          
        if (profile?.onboarding_completed === true || profile?.role === 'admin') {
          console.log("OnboardingQuizPage - User already completed onboarding (database) or is admin");
          
          // Update user metadata to match database for consistency
          if (!onboardingCompletedInMetadata && profile?.onboarding_completed === true) {
            try {
              const { data, error } = await supabase.auth.updateUser({
                data: { onboarding_completed: true }
              });
              
              if (error) {
                console.error("Failed to update user metadata:", error);
              }
            } catch (err) {
              console.error("Error updating user metadata:", err);
            }
          }
          
          navigate('/catalog');
          return;
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkOnboardingStatus();
  }, [user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f0562e]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <OnboardingQuiz />
    </div>
  );
};

export default OnboardingQuizPage;
