import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackMarketingQuizComplete } from "@/lib/analytics/events";
import { useQuizData } from "./useQuizData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const ComparisonResults = () => {
  const { user } = useAuth();
  const { quizAnswers, resetQuiz } = useQuizData();
  const navigate = useNavigate();

  useEffect(() => {
    const trackQuizCompletion = async () => {
      try {
        await trackMarketingQuizComplete({
          language: 'en',
          source: 'marketing_page',
          userId: user?.id,
          answers: quizAnswers
        });
      } catch (error) {
        console.error('Error tracking quiz completion:', error);
      }
    };

    trackQuizCompletion();
  }, [user?.id, quizAnswers]);

  const handleStartOver = () => {
    resetQuiz();
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Your Results Are Ready!
          </h2>
          <p className="text-lg text-gray-600">
            Based on your answers, we've prepared a personalized analysis of your business potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Traditional Approach
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Higher initial investment</li>
              <li>• Longer time to market</li>
              <li>• Complex supply chain management</li>
              <li>• Inventory risks</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">
              Our Solution
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Lower startup costs</li>
              <li>• Quick market entry</li>
              <li>• Simplified operations</li>
              <li>• Reduced risks</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={handleStartOver}
          >
            Start Over
          </Button>
          <Button
            variant="default"
            onClick={handleSignUp}
          >
            Create Account
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
