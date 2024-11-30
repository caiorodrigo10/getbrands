import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WelcomeHeader } from "@/components/marketing/landing/welcome/WelcomeHeader";
import { ProductScroll } from "@/components/marketing/landing/welcome/ProductScroll";
import { BenefitsScroll } from "@/components/marketing/landing/welcome/BenefitsScroll";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6 w-full max-w-lg mx-auto px-3 pt-8 sm:pt-8">
      <WelcomeHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full -mx-3 sm:mx-0 mt-8"
      >
        <ProductScroll />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          Lance sua marca própria sem investimento em estoque, com fornecedores americanos de alta qualidade.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        <div className="relative inline-block">
          <Button
            onClick={onNext}
            className="w-72"
          >
            Ver Catálogo de Produtos
          </Button>
        </div>
      </motion.div>

      <div className="h-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-8"
      >
        <img 
          src="/lovable-uploads/cc9f9846-a08c-4a17-9291-e8274c62f7dd.png"
          alt="Produto GetBrands"
          className="mx-auto rounded-lg shadow-lg max-w-[85%] sm:max-w-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full -mx-3 sm:mx-0"
        >
          <BenefitsScroll />
        </motion.div>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          Na GetBrands, transformamos sonhos em marcas de sucesso. Nossa missão é democratizar o empreendedorismo, permitindo que você construa sua marca premium sem as barreiras tradicionais.
        </p>
        <div className="mt-8">
          <Button
            onClick={onNext}
            className="w-72"
          >
            Ver Catálogo de Produtos
          </Button>
          <div className="mt-4">
            <img 
              src="/lovable-uploads/08ee0a1f-fed9-4b8a-8381-acda14355625.png"
              alt="FDA Approved"
              className="h-32 mx-auto"
            />
          </div>
        </div>
        <div className="h-10"></div>
      </motion.div>
    </div>
  );
};