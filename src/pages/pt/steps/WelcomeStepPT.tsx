import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, Check } from "lucide-react";
import { useRef, useEffect } from "react";

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
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 50);

    return () => clearInterval(intervalId);
  }, []);

  const benefitBlocks = [
    {
      title: "Sem Investimento em Estoque",
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
    <div className="text-center space-y-8 max-w-lg mx-auto px-4 pt-12">
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
        className="w-full overflow-hidden"
      >
        <div 
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap"
        >
          <div className="inline-flex gap-4 min-w-full">
            {/* First set of blocks */}
            {benefitBlocks.map((block, index) => (
              <div 
                key={`first-${index}`}
                className="inline-block w-[140px] sm:w-[160px] p-3 sm:p-4 bg-primary/5 rounded-lg whitespace-normal"
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm">{block.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {block.description}
                </p>
              </div>
            ))}
            
            {/* Duplicate set for seamless scrolling */}
            {benefitBlocks.map((block, index) => (
              <div 
                key={`second-${index}`}
                className="inline-block w-[140px] sm:w-[160px] p-3 sm:p-4 bg-primary/5 rounded-lg whitespace-normal"
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm">{block.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        <div className="relative inline-block">
          <Button
            size="lg"
            onClick={onNext}
            className="relative z-10 bg-primary hover:bg-primary/90 text-white px-8 py-3 min-w-[250px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-[3px] border-white/40 hover:border-white/90 rounded-xl hover:rounded-2xl"
          >
            Ver Catálogo de Produtos
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-20 sm:mt-24 space-y-8"
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