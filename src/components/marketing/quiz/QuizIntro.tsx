import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flag } from "lucide-react";

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
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-primary">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h1>
          <Flag className="w-8 h-8 text-primary" />
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
          onClick={onStart}
          className="mt-8"
        >
          Começar Minha Marca
        </Button>
      </motion.div>
    </Card>
  );
};