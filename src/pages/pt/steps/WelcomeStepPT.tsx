import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6 max-w-lg mx-auto px-4 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center gap-2">
          <Flag className="w-6 h-6 text-primary mb-2" />
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 px-4 sm:px-0">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-4 sm:px-0">
          Lance sua marca própria sem investimento em estoque, com fornecedores americanos de alta qualidade
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 px-2 sm:px-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-primary/5 rounded-lg">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm">Sem Investimento em Estoque</h3>
            <p className="text-xs text-muted-foreground">
              Comece sua marca sem o peso dos custos de inventário
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-primary/5 rounded-lg">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm">Fornecedores Americanos</h3>
            <p className="text-xs text-muted-foreground">
              Trabalhe com fabricantes confiáveis e focados em qualidade
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-primary/5 rounded-lg">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm">+250 Produtos Disponíveis</h3>
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
          onClick={onNext}
          className="mt-6 sm:mt-8"
        >
          Ver Catálogo de Produtos
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-16 space-y-6"
      >
        <img 
          src="/lovable-uploads/cc9f9846-a08c-4a17-9291-e8274c62f7dd.png"
          alt="Produto GetBrands"
          className="mx-auto rounded-lg shadow-lg max-w-[85%] sm:max-w-sm"
        />
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-4 sm:px-0">
          Na GetBrands, transformamos sonhos em marcas de sucesso. Nossa missão é democratizar o empreendedorismo, permitindo que você construa sua marca premium sem as barreiras tradicionais.
        </p>
      </motion.div>
    </div>
  );
};