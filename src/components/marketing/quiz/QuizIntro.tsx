import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flag, Check } from "lucide-react";

interface QuizIntroProps {
  onStart: () => void;
}

export const QuizIntro = ({ onStart }: QuizIntroProps) => {
  return (
    <Card className="p-8 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <Flag className="w-6 h-6 text-primary mb-2" />
          <h1 className="text-4xl font-bold text-primary">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Lance sua marca de cosméticos, café, suplementos ou pet sem investimento em estoque, com fornecedores americanos
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
            <h3 className="font-semibold mb-2 text-sm">Sem Investimento em Estoque</h3>
            <p className="text-xs text-muted-foreground">
              Comece sua marca sem o peso dos custos de inventário
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Check className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm">Fornecedores Americanos</h3>
            <p className="text-xs text-muted-foreground">
              Trabalhe com fabricantes confiáveis e focados em qualidade
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Check className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm">+250 Produtos Disponíveis</h3>
            <p className="text-xs text-muted-foreground">
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
          onClick={onStart}
          className="mt-8"
        >
          Começar Minha Marca
        </Button>
      </motion.div>
    </Card>
  );
};