import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ComparisonResultsProps {
  answers: Record<number, string>;
  email: string;
  phone: string;
}

export const ComparisonResultsPT = ({ answers, email, phone }: ComparisonResultsProps) => {
  const navigate = useNavigate();

  const comparisonData = [
    {
      title: "Investimento Inicial",
      traditional: "R$250.000+",
      mainer: "A partir de R$17.500",
    },
    {
      title: "Tempo até o Lançamento",
      traditional: "6-12 meses",
      mainer: "4-8 semanas",
    },
    {
      title: "Risco de Estoque",
      traditional: "Alto",
      mainer: "Nenhum",
    },
    {
      title: "Gestão da Cadeia de Suprimentos",
      traditional: "Complexa",
      mainer: "Gerenciada pela Mainer",
    },
  ];

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Comparação da Criação da Sua Marca</h2>
        <p className="text-muted-foreground">
          Veja como a abordagem da Mainer se compara à criação tradicional de marcas
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="grid grid-cols-3 gap-4 items-center"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-red-500 text-center">{item.traditional}</div>
            <div className="text-green-500 text-center font-semibold">{item.mainer}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate("/signup")}
        >
          Comece Sua Marca Hoje
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate("/how-it-works")}
        >
          Veja Como a Mainer Funciona
        </Button>
      </div>
    </Card>
  );
};