
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react"; // Added useState

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const LaunchUrgencyStep = ({ 
  selected, 
  onAnswer,
  onComplete,
  onBack
}: LaunchUrgencyStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for form submission state
  
  const options = [
    { value: "immediate", label: "Immediately (1-2 months)" },
    { value: "soon", label: "Soon (3-6 months)" },
    { value: "planning", label: "Planning Phase (6+ months)" },
  ];

  const handleOptionSelect = async (value: string) => {
    try {
      // First update local state
      onAnswer(value);

      // Only try to update in Supabase if the user is authenticated
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            launch_urgency: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Supabase error:', error);
          // Don't block the flow if there's an error in Supabase
          console.warn('Continuing despite Supabase error');
        } else {
          // Only show success if there was no error
          toast.success("Launch timeline preference saved!");
        }
      }
    } catch (error: any) {
      console.error('Error updating launch urgency:', error);
      // Don't block the flow if there's an error
      console.warn('Continuing despite error');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // If we don't have a selection yet, show error
      if (!selected) {
        toast.error("Please select a launch timeline option");
        setIsSubmitting(false);
        return;
      }
      
      // Try to update profile one more time to make sure data is saved
      if (user?.id) {
        try {
          await supabase
            .from('profiles')
            .update({ 
              launch_urgency: selected,
              onboarding_completed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error in final update:', error);
          // Continue anyway
        }
      }
      
      // Always call onComplete regardless of errors
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          When are you planning to launch?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          This helps us understand your timeline and prioritize your needs
        </p>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={handleOptionSelect}
        className="grid gap-4"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Label
              htmlFor={option.value}
              className={`
                flex items-center space-x-3 p-4 sm:p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span className="text-base sm:text-xl">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      <QuizNavigation
        onNext={handleSubmit}
        onBack={onBack}
        nextLabel="Complete"
        isNextDisabled={!selected || isSubmitting}
      />
    </div>
  );
};
