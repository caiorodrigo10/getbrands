import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { mapProfileType, mapBrandStatus, mapLaunchUrgency } from "../utils/mappingUtils";

interface OnboardingData {
  productCategories: string[];
  profileType: string;
  brandStatus: string;
  launchUrgency: string;
}

export const useOnboardingCompletion = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();

  const handleComplete = async (userId: string, quizData: OnboardingData) => {
    try {
      if (!userId) {
        toast.error(t('messages.error'));
        return;
      }

      // First update the profile with onboarding data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          product_interest: quizData.productCategories,
          profile_type: mapProfileType(quizData.profileType),
          brand_status: mapBrandStatus(quizData.brandStatus),
          launch_urgency: mapLaunchUrgency(quizData.launchUrgency),
          onboarding_completed: true,
          language: lang || i18n.language || 'en'
        })
        .eq("id", userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error(t('messages.error'));
        return;
      }

      // Then save the quiz response for analytics
      const { error: quizError } = await supabase
        .from("marketing_quiz_responses")
        .insert({
          user_id: userId,
          answers: {
            product_categories: quizData.productCategories,
            profile_type: mapProfileType(quizData.profileType),
            brand_status: mapBrandStatus(quizData.brandStatus),
            launch_urgency: mapLaunchUrgency(quizData.launchUrgency),
          },
          completed_at: new Date().toISOString(),
        });

      if (quizError) {
        console.error('Quiz response error:', quizError);
        toast.error(t('messages.error'));
        return;
      }

      toast.success(t('messages.success'));
      
      // Ensure we have a valid language prefix and navigate to start-here
      const currentLang = lang || i18n.language || 'en';
      navigate(`/${currentLang}/start-here`, { replace: true });
      
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      toast.error(t('messages.error'));
    }
  };

  return { handleComplete };
};