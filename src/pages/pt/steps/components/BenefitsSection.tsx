import { Check } from "lucide-react";

export const benefitBlocks = [
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

export const BenefitsSection = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div 
      ref={scrollRef}
      className="overflow-hidden relative w-screen sm:w-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex gap-2 sm:gap-3 animate-scroll w-[200%] justify-center">
        {[...benefitBlocks, ...benefitBlocks].map((block, index) => (
          <div 
            key={`${index}`}
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
  );
};