import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

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
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Crie Sua Marca nos EUA
          </h2>
          <Flag className="w-8 h-8 text-primary" />
        </div>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Lance sua marca própria sem investimento em estoque, com fornecedores americanos de alta qualidade
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="font-semibold mb-2">Sem Investimento em Estoque</h3>
            <p className="text-sm text-muted-foreground">
              Comece sua marca sem o peso dos custos de inventário
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="font-semibold mb-2">Fornecedores Americanos</h3>
            <p className="text-sm text-muted-foreground">
              Trabalhe com fabricantes confiáveis e focados em qualidade
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          onClick={onNext}
          className="mt-8"
        >
          Começar Minha Marca
        </Button>
      </motion.div>
    </div>
  );
};