import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6 max-w-lg mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
          Bem-vindo à sua Jornada de Marca Própria
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Vamos conhecer você melhor para fornecer o melhor serviço possível para seu negócio de marca própria.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={onNext}
          className="w-full sm:w-auto px-8"
        >
          Vamos Começar
        </Button>
      </motion.div>
    </div>
  );
};