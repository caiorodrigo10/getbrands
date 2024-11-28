import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpandableItemProps {
  title: string;
  content: string;
  isExpanded: boolean;
  onClick: () => void;
}

const ExpandableItem = ({ title, content, isExpanded, onClick }: ExpandableItemProps) => (
  <div 
    className="cursor-pointer border-b border-gray-200 last:border-none"
    onClick={onClick}
  >
    <div className="flex items-center justify-between py-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ChevronDown 
        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
      />
    </div>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4"
        >
          <p className="text-gray-600 leading-relaxed">{content}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const BrandExpandableSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const items = [
    {
      title: "Create Your Own Brand",
      content: "Launch your private label brand with our comprehensive support. We guide you through every step, from concept to market, ensuring your brand stands out in the competitive landscape."
    },
    {
      title: "Product Range",
      content: "Choose from a wide selection of premium products including cosmetics, supplements, and coffee. Our diverse catalog allows you to build a unique product line that resonates with your target market."
    },
    {
      title: "Fast-Track Project",
      content: "Experience rapid brand development with our streamlined process. We've optimized every step to get your products to market quickly without compromising on quality."
    },
    {
      title: "American Suppliers",
      content: "Partner with trusted American manufacturers and suppliers. We ensure all products meet the highest quality standards and comply with US regulations."
    }
  ];

  return (
    <section className="py-24 bg-[#fafafa] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {items.map((item, index) => (
              <ExpandableItem
                key={index}
                title={item.title}
                content={item.content}
                isExpanded={index === expandedIndex}
                onClick={() => setExpandedIndex(index)}
              />
            ))}
          </div>
          
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center order-first md:order-last">
            <p className="text-gray-400">Image placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
};