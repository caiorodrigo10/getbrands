import { OnboardingQuiz } from "@/components/onboarding/OnboardingQuiz";
import { useParams } from "react-router-dom";

const OnboardingQuizPage = () => {
  const { lang } = useParams();

  return (
    <div className="min-h-screen bg-white w-full">
      <OnboardingQuiz />
    </div>
  );
};

export default OnboardingQuizPage;