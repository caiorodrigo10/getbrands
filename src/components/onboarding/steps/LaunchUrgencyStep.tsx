import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const options = [
    { value: "immediate", label: t('onboarding.launchUrgency.options.immediate') },
    { value: "soon", label: t('onboarding.launchUrgency.options.soon') },
    { value: "planning", label: t('onboarding.launchUrgency.options.planning') },
  ];

  const handleOptionSelect = async (value: string) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      onAnswer(value);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          launch_urgency: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Preferência de lançamento salva!");
    } catch (error: any) {
      console.error('Error updating launch urgency:', error);
      toast.error(error.message || "Falha ao salvar sua seleção. Por favor, tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.launchUrgency.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {t('onboarding.launchUrgency.description')}
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
        onNext={onComplete}
        onBack={onBack}
        nextLabel={t('onboarding.navigation.complete')}
        isNextDisabled={!selected}
      />
    </div>
  );
};