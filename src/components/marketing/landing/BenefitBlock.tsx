import { Check } from "lucide-react";

interface BenefitBlockProps {
  title: string;
  description: string;
  keyPrefix: string;
  index: number;
}

export const BenefitBlock = ({ title, description, keyPrefix, index }: BenefitBlockProps) => {
  return (
    <div 
      key={`${keyPrefix}-${index}`}
      className="flex-none w-[180px] sm:w-[240px] p-3 sm:p-4 bg-gray-50/80 rounded-lg flex flex-col items-center h-[200px]"
    >
      <div className="flex-none h-8 flex items-center">
        <Check className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
      </div>
      <div className="flex-none h-12 flex items-center">
        <h3 className="font-semibold text-base sm:text-lg leading-tight">
          {title}
        </h3>
      </div>
      <div className="flex-1 flex items-start pt-1 pb-3">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};