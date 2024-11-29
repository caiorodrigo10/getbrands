import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "@/components/onboarding/steps/QuizNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const LaunchUrgencyStepPT = ({ 
  selected, 
  onAnswer,
  onComplete,
  onBack
}: LaunchUrgencyStepProps) => {
  const { user } = useAuth();
  const options = [
    { value: "immediate", label: "Imediatamente (1-2 meses)" },
    { value: "soon", label: "Em breve (3-6 meses)" },
    { value: "planning", label: "Fase de Planejamento (6+ meses)" },
  ];

  const handleOptionSelect = async (value: string) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
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
        console.error('Erro Supabase:', error);
        throw error;
      }

      toast.success("Preferência de lançamento salva!");
    } catch (error: any) {
      console.error('Erro ao atualizar urgência de lançamento:', error);
      toast.error(error.message || "Falha ao salvar sua seleção. Por favor, tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          Quando você planeja lançar?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Isso nos ajuda a entender seu cronograma e priorizar suas necessidades
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
        nextLabel="Completar"
        isNextDisabled={!selected}
      />
    </div>
  );
};