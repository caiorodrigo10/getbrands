import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BenefitBlock } from "@/components/marketing/landing/BenefitBlock";
import { WelcomeHero } from "@/components/marketing/landing/pt/WelcomeHero";
import { WelcomeProducts } from "@/components/marketing/landing/pt/WelcomeProducts";
import { FDASeal } from "@/components/marketing/landing/FDASeal";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5;
      }
    };

    const intervalId = setInterval(scroll, 16);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const benefitBlocks = [
    {
      title: "Sob Demanda",
      description: "Comece sua marca sem o peso dos custos de inventário"
    },
    {
      title: "Fornecedores Americanos",
      description: "Trabalhe com fabricantes confiáveis e focados em qualidade"
    },
    {
      title: "+250 Produtos Disponíveis",
      description: "Amplo catálogo de produtos para você escolher e personalizar sua marca"
    },
    {
      title: "Suporte Dedicado",
      description: "Equipe especializada para ajudar em cada etapa"
    },
    {
      title: "Entrega Rápida",
      description: "Logística eficiente para seus produtos"
    },
    {
      title: "Qualidade Premium",
      description: "Produtos de alta qualidade para sua marca"
    }
  ];

  return (
    <div className="text-center space-y-6 w-full max-w-lg mx-auto px-3 pt-8 sm:pt-8">
      <WelcomeHero onNext={onNext} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full -mx-3 sm:mx-0 mt-8"
      >
        <WelcomeProducts />
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
          <div 
            ref={scrollRef}
            className="overflow-hidden relative w-screen sm:w-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-2 sm:gap-3 animate-scroll w-[200%] justify-center">
              {benefitBlocks.map((block, index) => (
                <BenefitBlock
                  key={`first-${index}`}
                  title={block.title}
                  description={block.description}
                  keyPrefix="first"
                  index={index}
                />
              ))}
              
              {benefitBlocks.map((block, index) => (
                <BenefitBlock
                  key={`second-${index}`}
                  title={block.title}
                  description={block.description}
                  keyPrefix="second"
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          Na GetBrands, transformamos sonhos em marcas de sucesso. Nossa missão é democratizar o empreendedorismo, permitindo que você construa sua marca premium sem as barreiras tradicionais.
        </p>
        <div className="mt-8">
          <Button onClick={onNext} className="w-72">
            Ver Catálogo de Produtos
          </Button>
          <FDASeal />
        </div>
        <div className="h-10"></div>
      </motion.div>
    </div>
  );
};