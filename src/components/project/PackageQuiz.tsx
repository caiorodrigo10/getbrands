import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type QuizStep = {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
};

export function PackageQuiz() {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  // Fetch existing quiz data
  const { data: quizData, isLoading } = useQuery({
    queryKey: ["package_quiz", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_quizzes")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Save quiz progress mutation
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

  const steps: QuizStep[] = [
    {
      id: 1,
      title: "Welcome to Package Design Quiz",
      description: "Let's define how your brand identity will be translated into label design.",
      component: (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold">Welcome to Your Package Design Quiz</h3>
          <p className="text-muted-foreground">
            This quiz will help us understand how you'd like your brand identity to be
            represented in your product labels. We'll guide you through several questions
            about your preferences.
          </p>
          <Button 
            onClick={() => setCurrentStep(2)}
            className="w-full md:w-auto"
          >
            Start Quiz
          </Button>
        </div>
      ),
    },
    // Additional steps will be implemented here
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-right">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">
            {steps.find(step => step.id === currentStep)?.component}
          </Card>
        </motion.div>
      </AnimatePresence>

      {currentStep > 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => saveMutation.mutate({ current_step: currentStep })}
          >
            Save Progress
          </Button>
        </div>
      )}
    </div>
  );
}