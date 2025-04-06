
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ExpandableItemProps {
  title: string;
  content: string;
  benefits: string[];
  isExpanded: boolean;
  onClick: () => void;
}

const ExpandableItem = ({ title, content, benefits, isExpanded, onClick }: ExpandableItemProps) => (
  <div 
    className={`cursor-pointer border-b border-gray-200 last:border-none transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}
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
          className="pb-6"
        >
          <p className="text-gray-600 leading-relaxed mb-4">{content}</p>
          
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
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
      content: "Launch your private label brand with our comprehensive support. We guide you through every step, from concept to market, ensuring your brand stands out in the competitive landscape.",
      benefits: [
        "Complete brand identity development",
        "Custom logo and packaging design",
        "Marketing materials and brand guidelines",
        "Expert consultation throughout the process"
      ]
    },
    {
      title: "Premium Product Range",
      content: "Choose from a wide selection of high-quality products including cosmetics, supplements, and coffee. Our diverse catalog allows you to build a unique product line that resonates with your target market.",
      benefits: [
        "250+ ready-to-brand products",
        "Premium formulations meeting all industry standards",
        "Customizable ingredients and packaging options",
        "Regular catalog updates with trending products"
      ]
    },
    {
      title: "Fast-Track Development",
      content: "Experience rapid brand development with our streamlined process. We've optimized every step to get your products to market quickly without compromising on quality.",
      benefits: [
        "14-day production timeline",
        "Efficient project management system",
        "Regular status updates and milestone tracking",
        "Priority processing available for urgent orders"
      ]
    },
    {
      title: "American Suppliers",
      content: "Partner with trusted American manufacturers and suppliers. We ensure all products meet the highest quality standards and comply with US regulations.",
      benefits: [
        "All products made in FDA-registered facilities",
        "Strict quality control and testing procedures",
        "Full regulatory compliance guaranteed",
        "Transparent supply chain management"
      ]
    }
  ];

  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#f0562e] font-medium">WHY CHOOSE US</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">The GetBrands Advantage</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We remove the traditional barriers to starting your own brand so you can focus on building your business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-1">
            {items.map((item, index) => (
              <ExpandableItem
                key={index}
                title={item.title}
                content={item.content}
                benefits={item.benefits}
                isExpanded={index === expandedIndex}
                onClick={() => setExpandedIndex(index)}
              />
            ))}
            
            <div className="pt-8">
              <Button 
                asChild
                className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white w-full md:w-auto"
              >
                <Link to="/signup">
                  Start Building Your Brand
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-full aspect-square rounded-lg overflow-hidden order-first md:order-last">
            <img 
              src="/lovable-uploads/0fd7a9f9-759b-4f9e-a22c-ceae2fbe98e9.png"
              alt="Warehouse logistics with pallet jack"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-2">State-of-the-art Facilities</h3>
                <p>Our US-based production and fulfillment centers ensure quality and speed for your brand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
