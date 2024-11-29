import { useParams } from "react-router-dom";
import { OnboardingQuiz as OnboardingQuizComponent } from "@/components/onboarding/OnboardingQuiz";

const OnboardingQuizPage = () => {
  const { lang } = useParams();

  return (
    <div className="min-h-screen bg-white w-full">
      <OnboardingQuizComponent />
    </div>
  );
};

export default OnboardingQuizPage;