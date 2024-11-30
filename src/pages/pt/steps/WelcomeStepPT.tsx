import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, Check } from "lucide-react";

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
        <div className="flex flex-col items-center gap-2">
          <Flag className="w-6 h-6 text-primary mb-2" />
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <Check className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Sem Investimento em Estoque</h3>
            <p className="text-sm text-muted-foreground">
              Comece sua marca sem o peso dos custos de inventário
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Check className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Fornecedores Americanos</h3>
            <p className="text-sm text-muted-foreground">
              Trabalhe com fabricantes confiáveis e focados em qualidade
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Check className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">+250 Produtos Disponíveis</h3>
            <p className="text-sm text-muted-foreground">
              Amplo catálogo de produtos para você escolher e personalizar sua marca
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