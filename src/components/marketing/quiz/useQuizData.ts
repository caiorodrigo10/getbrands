import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useQuizData = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { user } = useAuth();

  const setAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const saveQuizData = async () => {
    if (!user?.id) {
      // Store in localStorage for anonymous users
      localStorage.setItem('quiz_answers', JSON.stringify(answers));
      return;
    }

    try {
      const { error } = await supabase
        .from('marketing_quiz_responses')
        .insert({
          user_id: user.id,
          answers,
          completed_at: new Date().toISOString()
        } as any); // Temporary type assertion until Database types are updated

      if (error) throw error;
      
      toast.success("Your responses have been saved!");
    } catch (error) {
      console.error('Error saving quiz data:', error);
      toast.error("Failed to save your responses");
    }
  };

  return {
    answers,
    setAnswer,
    saveQuizData
  };
};