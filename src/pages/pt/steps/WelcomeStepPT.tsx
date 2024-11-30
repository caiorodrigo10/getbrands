import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStepPT = ({ onNext }: WelcomeStepProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const imagesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const imagesContainer = imagesScrollRef.current;
    
    if (!scrollContainer || !imagesContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5;
      }
    };

    const scrollImages = () => {
      if (imagesContainer.scrollLeft >= imagesContainer.scrollWidth / 2) {
        imagesContainer.scrollLeft = 0;
      } else {
        imagesContainer.scrollLeft += 0.5;
      }
    };

    const intervalId = setInterval(scroll, 16);
    const imagesIntervalId = setInterval(scrollImages, 16);

    return () => {
      clearInterval(intervalId);
      clearInterval(imagesIntervalId);
    };
  }, []);

  const productImages = [
    "/lovable-uploads/e64b31f9-2f7c-41d0-ae9d-f805f40571d7.png",
    "/lovable-uploads/b5a0ae27-4415-49cc-a3f0-05b550b23869.png",
    "/lovable-uploads/9954d0ec-cdbf-439d-8dc7-52e39fc08778.png",
    "/lovable-uploads/e82547dd-1abc-486c-8932-56bacd4b77bc.png",
    "/lovable-uploads/02151e6b-cad9-45a1-8115-97fd85ff7aae.png",
    "/lovable-uploads/9ce98c58-429f-40c2-b6fd-7dc44224e3dc.png",
    "/lovable-uploads/516b2ea6-8b74-4c84-b3fd-a91636e32f9b.png",
  ];

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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full -mx-3 sm:mx-0 mt-8"
      >
        <div 
          ref={imagesScrollRef}
          className="overflow-hidden relative w-screen sm:w-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-4 sm:gap-6 animate-scroll w-[200%] justify-center">
            {[...productImages, ...productImages].map((image, index) => (
              <div 
                key={`${index}`}
                className="flex-none w-[220px] sm:w-[280px] aspect-square bg-white rounded-lg p-4"
              >
                <img 
                  src={image} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
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
        </div>
        <div className="h-10"></div>
      </motion.div>
    </div>
  );
};