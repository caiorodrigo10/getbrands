import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackMarketingQuizStart } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const QuizIntro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const trackQuizView = async () => {
      try {
        await trackMarketingQuizStart({
          language: 'en',
          source: 'marketing_page'
        });
      } catch (error) {
        console.error('Error tracking quiz view:', error);
      }
    };

    trackQuizView();
  }, []);

  const handleStartQuiz = () => {
    navigate('/marketing/quiz/questions');
  };

  return (
    <div className="text-center space-y-6 max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to Our Business Quiz
      </h1>
      <p className="text-lg text-gray-600">
        Discover how we can help you grow your business
      </p>
      <Button 
        size="lg"
        onClick={handleStartQuiz}
        className="mt-8"
      >
        Start Quiz
      </Button>
    </div>
  );
};