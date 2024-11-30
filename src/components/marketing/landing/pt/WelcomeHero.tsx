import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FDASeal } from "../FDASeal";

interface WelcomeHeroProps {
  onNext: () => void;
}

export const WelcomeHero = ({ onNext }: WelcomeHeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex flex-col items-center gap-1 mt-8 sm:mt-6">
        <img
          src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
          alt="GetBrands Logo"
          className="h-8 sm:h-10 mb-2"
        />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Crie Sua Marca Própria nos EUA Sem Investir em Estoque
        </h2>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mt-8"
      >
        <div className="relative inline-block">
          <Button onClick={onNext} className="w-72">
            Ver Catálogo de Produtos
          </Button>
          <FDASeal />
        </div>
      </motion.div>
    </motion.div>
  );
};