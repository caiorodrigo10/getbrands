
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const [api, setApi] = useState<any>(null);
  
  // Auto-rotation effect with improved continuous scrolling
  useEffect(() => {
    if (!api) return;
    
    // Set up auto-rotation with continuous movement
    const autoScrollInterval = setInterval(() => {
      api.scrollNext({ animation: "slide" });
    }, 2000); // Scroll every 2 seconds for smoother feeling

    // Reset to the beginning when reaching the end for infinite loop effect
    const onSelect = () => {
      // If near the end, quickly reset to the beginning
      if (api.selectedScrollSnap() > logoItems.length - 1) {
        // Use a timeout to make the transition less noticeable
        setTimeout(() => {
          api.scrollTo(0, false);
        }, 100);
      }
    };
    
    api.on('select', onSelect);

    return () => {
      clearInterval(autoScrollInterval);
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="w-full mt-12 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500 mb-5 text-center">Trusted by brands across the US</p>
      
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          skipSnaps: true,
          startIndex: 1
        }}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="transition-transform duration-500 ease-linear">
          {extendedLogoItems.map((logo, index) => (
            <CarouselItem 
              key={index} 
              className={`${isMobile ? 'basis-1/2' : 'basis-1/5'} flex justify-center items-center px-4 transition-all`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Only show navigation arrows on desktop */}
        {!isMobile && (
          <>
            <CarouselPrevious className="hidden sm:flex -left-4 bg-white border-gray-200" />
            <CarouselNext className="hidden sm:flex -right-4 bg-white border-gray-200" />
          </>
        )}
      </Carousel>
    </div>
  );
};
