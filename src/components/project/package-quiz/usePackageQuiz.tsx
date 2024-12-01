import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const usePackageQuiz = (projectId: string) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  const { data: quizData, isLoading } = useQuery({
    queryKey: ["package_quiz", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");

      const { data: existingQuiz, error: fetchError } = await supabase
        .from("package_quizzes")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingQuiz && user?.id) {
        const { data: newQuiz, error: createError } = await supabase
          .from("package_quizzes")
          .insert({
            project_id: projectId,
            user_id: user.id,
            status: "not_started",
            current_step: 1
          })
          .select()
          .single();

        if (createError) throw createError;
        return newQuiz;
      }

      return existingQuiz;
    },
    enabled: !!projectId && !!user?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("package_quizzes")
        .upsert({
          project_id: projectId,
          user_id: user?.id,
          ...data,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package_quiz", projectId] });
      toast.success("Progress saved successfully");
    },
    onError: () => {
      toast.error("Failed to save progress");
    },
  });

  const handleNext = () => setCurrentStep(prev => Math.min(3, prev + 1));
  const handleBack = () => setCurrentStep(prev => Math.max(1, prev - 1));
  
  const handleSave = () => {
    saveMutation.mutate({
      current_step: currentStep,
      status: "in_progress",
    });
  };

  const handleSubmit = () => {
    saveMutation.mutate({ 
      status: "completed",
      current_step: currentStep 
    });
  };

  return {
    currentStep,
    quizData,
    isLoading,
    handleNext,
    handleBack,
    handleSave,
    handleSubmit,
    saveMutation,
  };
};