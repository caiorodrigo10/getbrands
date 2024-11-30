import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const productsContainer = productsScrollRef.current;
    if (!scrollContainer || !productsContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5;
      }
    };

    const scrollProducts = () => {
      if (productsContainer.scrollLeft >= productsContainer.scrollWidth / 2) {
        productsContainer.scrollLeft = 0;
      } else {
        productsContainer.scrollLeft += 0.5;
      }
    };

    const intervalId = setInterval(scroll, 16);
    const productsIntervalId = setInterval(scrollProducts, 16);

    return () => {
      clearInterval(intervalId);
      clearInterval(productsIntervalId);
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

  const productImages = [
    {
      url: "/lovable-uploads/bff16054-81c3-4a5c-b453-7947f15aa214.png",
      alt: "Produto 1"
    },
    {
      url: "/lovable-uploads/af7de79b-3c99-43cd-89b5-2b540e93d152.png",
      alt: "Produto 2"
    },
    {
      url: "/lovable-uploads/dc15b5b9-5c9f-4f78-9f39-b6040c4ea841.png",
      alt: "Produto 3"
    },
    {
      url: "/lovable-uploads/db5bb336-501c-4bed-8d20-a0dca92abb87.png",
      alt: "Produto 4"
    },
    {
      url: "/lovable-uploads/a9d08f30-d6bd-4f29-a7c2-faa505ac0f22.png",
      alt: "Produto 5"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="GetBrands Logo"
            className="h-8 sm:h-10"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full -mx-4 sm:mx-0"
      >
        <div 
          ref={productsScrollRef}
          className="overflow-hidden relative w-screen sm:w-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-4 animate-scroll w-[200%] justify-center">
            {productImages.concat(productImages).map((image, index) => (
              <div 
                key={`${index}`}
                className="flex-none w-[200px] h-[200px] rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full -mx-4 sm:mx-0"
      >
        <div 
          ref={scrollRef}
          className="overflow-hidden relative w-screen sm:w-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-2 sm:gap-3 animate-scroll w-[200%] justify-center">
            {benefitBlocks.map((block, index) => (
              <div 
                key={`first-${index}`}
                className="flex-none w-[140px] sm:w-[170px] p-3 sm:p-4 bg-gray-50/80 rounded-lg flex flex-col items-center h-[180px]"
              >
                <div className="flex-none h-8 flex items-center">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-none h-10 flex items-center">
                  <h3 className="font-semibold text-sm sm:text-base leading-tight">
                    {block.title}
                  </h3>
                </div>
                <div className="flex-1 flex items-start pt-1 pb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
            ))}
            
            {benefitBlocks.map((block, index) => (
              <div 
                key={`second-${index}`}
                className="flex-none w-[140px] sm:w-[170px] p-3 sm:p-4 bg-gray-50/80 rounded-lg flex flex-col items-center h-[180px]"
              >
                <div className="flex-none h-8 flex items-center">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-none h-10 flex items-center">
                  <h3 className="font-semibold text-sm sm:text-base leading-tight">
                    {block.title}
                  </h3>
                </div>
                <div className="flex-1 flex items-start pt-1 pb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center pt-8"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto px-8"
        >
          Começar Agora
        </Button>
      </motion.div>
    </div>
  );
};