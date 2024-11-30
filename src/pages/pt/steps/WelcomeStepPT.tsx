import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

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
    <div className="text-center space-y-6 w-full max-w-lg mx-auto px-3 pt-8 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex flex-col items-center gap-1 mt-4 sm:mt-0">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="GetBrands Logo"
            className="h-8 sm:h-10 mb-2"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Crie Sua Marca Própria nos EUA Sem Investir em Estoque
          </h2>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {benefitBlocks.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
            className="p-4 bg-white rounded shadow-md"
          >
            <Check className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">{block.title}</h3>
            <p className="text-sm text-muted-foreground">{block.description}</p>
          </motion.div>
        ))}
      </div>

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
            className="relative z-10 bg-primary hover:bg-primary/90 text-white px-4 sm:px-8 py-2.5 sm:py-3 min-w-[180px] sm:min-w-[250px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-[3px] border-white/40 hover:border-white/90 rounded-xl hover:rounded-2xl text-sm sm:text-base"
          >
            Ver Catálogo de Produtos
          </Button>
        </div>
      </motion.div>

      <div className="h-16 sm:h-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-16 sm:space-y-20"
      >
        <img 
          src="/lovable-uploads/cc9f9846-a08c-4a17-9291-e8274c62f7dd.png"
          alt="Produto GetBrands"
          className="mx-auto rounded-lg shadow-lg max-w-[85%] sm:max-w-sm"
        />
        <p className="text-sm sm:text-lg text-gray-600 max-w-md mx-auto">
          Na GetBrands, transformamos sonhos em marcas de sucesso. Nossa missão é democratizar o empreendedorismo, permitindo que você construa sua marca premium sem as barreiras tradicionais.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            onClick={onNext}
            className="relative z-10 bg-primary hover:bg-primary/90 text-white px-4 sm:px-8 py-2.5 sm:py-3 min-w-[180px] sm:min-w-[250px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-[3px] border-white/40 hover:border-white/90 rounded-xl hover:rounded-2xl text-sm sm:text-base"
          >
            Ver Catálogo de Produtos
          </Button>
        </div>
        <div className="h-20"></div>
      </motion.div>
    </div>
  );
};
