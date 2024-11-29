import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { QuizStep } from "../MarketingQuiz";

interface QuizQuestionProps {
  step: QuizStep;
  answer?: string;
  onAnswer: (answer: string) => void;
}

export const QuizQuestionPT = ({ step, answer, onAnswer }: QuizQuestionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-8">{step.question}</h2>
      
      <RadioGroup
        value={answer}
        onValueChange={onAnswer}
        className="grid gap-4"
      >
        {step.options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Label
              htmlFor={option}
              className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <RadioGroupItem value={option} id={option} />
              <span>{option}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};