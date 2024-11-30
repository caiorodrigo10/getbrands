import { AnalyticsBrowserAPI } from "@/types/analytics";
import { trackOnboardingCompleted } from "@/lib/analytics/onboarding";
import { toast } from "sonner";

interface QuizData {
  productCategories: string[];
  profileType: string;
  brandStatus: string;
  launchUrgency: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const trackSignUpEvents = async (
  userId: string,
  userData: UserData,
  quizData: QuizData,
  retries = 3
): Promise<void> => {
  if (!window.analytics) {
    console.error('Analytics not initialized');
    if (retries > 0) {
      console.log(`Retrying analytics tracking... (${retries} attempts left)`);
      setTimeout(() => trackSignUpEvents(userId, userData, quizData, retries - 1), 1000);
      return;
    }
    toast.error('Erro ao registrar eventos de analytics');
    return;
  }

  try {
    console.log('Attempting to track signup events...');
    
    window.analytics.identify(userId, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      language: 'pt',
      product_interest: quizData.productCategories,
      profile_type: quizData.profileType,
      brand_status: quizData.brandStatus,
      launch_urgency: quizData.launchUrgency
    });

    window.analytics.track('user_signed_up', {
      userId,
      ...userData,
      signupMethod: 'email',
      language: 'pt',
      ...quizData,
      onboarding_completed: true,
      source: 'comecarpt'
    });

    trackOnboardingCompleted(userId, {
      profile_type: quizData.profileType,
      product_interest: quizData.productCategories,
      brand_status: quizData.brandStatus,
      source: 'comecarpt'
    });

    console.log('Successfully tracked all signup events');
  } catch (error) {
    console.error('Error tracking analytics:', error);
    if (retries > 0) {
      console.log(`Retrying analytics tracking... (${retries} attempts left)`);
      setTimeout(() => trackSignUpEvents(userId, userData, quizData, retries - 1), 1000);
    } else {
      console.error('Failed to track signup events after all retries');
      toast.error('Erro ao registrar eventos de analytics');
    }
  }
};