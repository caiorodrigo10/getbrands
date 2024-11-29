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
    try {
      if (!user?.id) {
        localStorage.setItem('quiz_answers', JSON.stringify(answers));
        return;
      }

      const { error } = await supabase
        .from('marketing_quiz_responses')
        .insert({
          user_id: user.id,
          answers,
          completed_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving quiz data:', error);
        toast.error("Failed to save your responses");
        return;
      }
      
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