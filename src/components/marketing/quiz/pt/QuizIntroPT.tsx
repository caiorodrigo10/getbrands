import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizIntroProps {
  onStart: () => void;
}

export const QuizIntroPT = ({ onStart }: QuizIntroProps) => {
  return (
    <Card className="p-8 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-4">
          Crie Sua Marca Sem Investimento em Estoque
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Lance sua marca de cosméticos, café, suplementos ou produtos pet com fornecedores dos EUA
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
            <h3 className="font-semibold mb-2">Fornecedores dos EUA</h3>
            <p className="text-sm text-muted-foreground">
              Trabalhe com fabricantes americanos confiáveis e focados em qualidade
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
          Comece Sua Jornada
        </Button>
      </motion.div>
    </Card>
  );
};