import { useEffect, useRef } from "react";
import { BenefitBlock } from "../BenefitBlock";

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

export const BenefitsScroll = () => {
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

  return (
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
  );
};