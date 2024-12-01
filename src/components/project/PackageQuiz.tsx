import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { QuizProgress } from "./package-quiz/QuizProgress";
import { QuizNavigation } from "./package-quiz/QuizNavigation";
import { WelcomeStep } from "./package-quiz/steps/WelcomeStep";
import { LabelStyleStep } from "./package-quiz/steps/LabelStyleStep";
import { ColorStep } from "./package-quiz/steps/ColorStep";
import { usePackageQuiz } from "./package-quiz/usePackageQuiz";

interface PackageQuizProps {
  projectId: string;
}

export const PackageQuiz = ({ projectId }: PackageQuizProps) => {
  const {
    currentStep,
    quizData,
    isLoading,
    handleNext,
    handleBack,
    handleSave,
    handleSubmit,
    saveMutation,
  } = usePackageQuiz(projectId);

  if (!projectId) {
    return <div>Project ID is required</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const steps = [
    {
      id: 1,
      title: "Welcome to Package Design Quiz",
      description: "Let's define how your brand identity will be translated into label design.",
      component: <WelcomeStep onNext={handleNext} />,
    },
    {
      id: 2,
      title: "Label Style",
      description: "How do you want the label style to reflect your brand's visual identity?",
      component: (
        <LabelStyleStep
          defaultValue={quizData?.label_style || "match"}
          onValueChange={(value) => saveMutation.mutate({ label_style: value })}
        />
      ),
    },
    {
      id: 3,
      title: "Brand Colors",
      description: "Select the primary and secondary colors for your label design.",
      component: (
        <ColorStep
          primaryColor={quizData?.primary_color || "#000000"}
          secondaryColor={quizData?.secondary_color || "#000000"}
          onPrimaryColorChange={(value) => 
            saveMutation.mutate({ primary_color: value })
          }
          onSecondaryColorChange={(value) => 
            saveMutation.mutate({ secondary_color: value })
          }
        />
      ),
    },
  ];

  const totalSteps = steps.length;

  return (
    <div className="space-y-6">
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

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

      <QuizNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onNext={handleNext}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </div>
  );
};