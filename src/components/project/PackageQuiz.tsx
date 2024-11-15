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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QuizStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

export function PackageQuiz() {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  // Fetch existing quiz data
  const { data: quizData, isLoading } = useQuery({
    queryKey: ["package_quiz", projectId],
    queryFn: async () => {
      // First try to find an existing quiz
      const { data: existingQuiz, error: fetchError } = await supabase
        .from("package_quizzes")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle(); // Using maybeSingle() instead of single()

      if (fetchError) throw fetchError;

      // If no quiz exists, create one
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

  const handleSaveAndExit = () => {
    saveMutation.mutate({
      current_step: currentStep,
      status: "in_progress",
    });
  };

  const steps: QuizStep[] = [
    {
      id: 1,
      title: "Welcome to Package Design Quiz",
      description: "Let's define how your brand identity will be translated into label design.",
      component: (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold">Welcome to Your Package Design Quiz</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This quiz will help us understand how you'd like your brand identity to be
            represented in your product labels. We'll guide you through several questions
            about your preferences to ensure your labels perfectly align with your brand.
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
    {
      id: 2,
      title: "Label Style",
      description: "How do you want the label style to reflect your brand's visual identity?",
      component: (
        <div className="space-y-6">
          <RadioGroup
            defaultValue={quizData?.label_style || "match"}
            onValueChange={(value) => 
              saveMutation.mutate({ label_style: value })
            }
          >
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="match" id="match" />
                <Label htmlFor="match" className="text-base">
                  Match brand identity closely
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complement" id="complement" />
                <Label htmlFor="complement" className="text-base">
                  Complement brand identity
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="key-elements" id="key-elements" />
                <Label htmlFor="key-elements" className="text-base">
                  Include key elements only
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      ),
    },
    {
      id: 3,
      title: "Brand Colors",
      description: "Select the primary and secondary colors for your label design.",
      component: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  id="primary-color"
                  defaultValue={quizData?.primary_color || "#000000"}
                  className="w-16 h-10"
                  onChange={(e) => 
                    saveMutation.mutate({ primary_color: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={quizData?.primary_color || "#000000"}
                  className="flex-1"
                  onChange={(e) => 
                    saveMutation.mutate({ primary_color: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  id="secondary-color"
                  defaultValue={quizData?.secondary_color || "#000000"}
                  className="w-16 h-10"
                  onChange={(e) => 
                    saveMutation.mutate({ secondary_color: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={quizData?.secondary_color || "#000000"}
                  className="flex-1"
                  onChange={(e) => 
                    saveMutation.mutate({ secondary_color: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
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
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              {steps[currentStep - 1].component}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveAndExit}
          >
            Save Progress
          </Button>
          {currentStep < totalSteps && (
            <Button
              onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button
              onClick={() => {
                saveMutation.mutate({ 
                  status: "completed",
                  current_step: currentStep 
                });
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
