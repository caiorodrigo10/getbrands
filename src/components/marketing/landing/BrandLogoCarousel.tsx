
import { useWindowSize } from "@/hooks/useWindowSize";

// Define the logo data structure
interface LogoItem {
  src: string;
  alt: string;
}

// Array of logos
const logoItems: LogoItem[] = [
  {
    src: "/lovable-uploads/4cec31ab-a832-4679-bc88-32cd5137cb4a.png",
    alt: "Client Brand Logo"
  },
  {
    src: "/lovable-uploads/934ab001-8c6b-4af3-9e77-acdfeeecfd41.png",
    alt: "Holistica Bloom Logo"
  },
  {
    src: "/lovable-uploads/d3bc5abc-7c82-4804-852c-cb6ee8675b30.png",
    alt: "Olympic Logo"
  },
  {
    src: "/lovable-uploads/8f42921f-1f7d-485b-919b-2f22f05e1422.png",
    alt: "Client Brand Logo"
  },
  {
    src: "/lovable-uploads/75e9db4b-0b11-443e-8a57-0926c37769b7.png",
    alt: "Dolce Vitta Logo"
  },
];

// Duplicate the logos to create a continuous effect
const extendedLogoItems = [...logoItems, ...logoItems];

export const BrandLogoCarousel = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div className="w-full mt-12 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500 mb-5 text-center">Trusted by brands across the US</p>
      
      <div className="w-full overflow-hidden">
        <div className="flex logos-slide animate-scroll">
          {/* First set of logos */}
          {logoItems.map((logo, index) => (
            <div 
              key={`first-${index}`} 
              className={`${isMobile ? 'w-1/2' : 'w-1/5'} flex-shrink-0 flex justify-center items-center px-4`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto object-contain"
              />
            </div>
          ))}
          
          {/* Duplicate set of logos for continuous scrolling effect */}
          {logoItems.map((logo, index) => (
            <div 
              key={`second-${index}`}
              className={`${isMobile ? 'w-1/2' : 'w-1/5'} flex-shrink-0 flex justify-center items-center px-4`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
