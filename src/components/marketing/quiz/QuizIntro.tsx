import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackMarketingQuizStart } from "@/lib/analytics/events";
import { useQuizData } from "./useQuizData";

export const QuizIntro = () => {
  const { user } = useAuth();
  const { startQuiz } = useQuizData();

  useEffect(() => {
    const trackQuizView = async () => {
      try {
        await trackMarketingQuizStart({
          language: 'en',
          source: 'marketing_page',
          userId: user?.id
        });
      } catch (error) {
        console.error('Error tracking quiz view:', error);
      }
    };

    trackQuizView();
  }, [user?.id]);

  return (
    <div>
      <h1>Welcome to the Marketing Quiz!</h1>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};
