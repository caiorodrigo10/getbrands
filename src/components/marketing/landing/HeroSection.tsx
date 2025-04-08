
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useWindowSize } from "@/hooks/useWindowSize";

export const HeroSection = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <section className="relative bg-white pt-20 pb-16 lg:pt-32">
      {/* Login Button */}
      <div className="absolute top-4 right-4 z-20">
        <Link to="/login">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-700 hover:bg-[#f0562e] hover:text-white text-sm font-medium px-4"
          >
            Login
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="GetBrands Logo"
            className="h-12 mx-auto mb-8"
          />
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Launch Your Premium Private Label Brand <span className="text-[#f0562e]">Without Inventory Costs</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            From cosmetics to supplements and coffee - we handle everything from concept to delivery.
            Join 2,500+ entrepreneurs who've trusted our end-to-end brand building solution.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">No Minimum Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">American Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">FDA Approved</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button 
                size="lg"
                className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white font-semibold px-8 w-full sm:w-auto"
              >
                Start Your Brand Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#f0562e] text-[#f0562e] hover:bg-[#f0562e]/10 font-semibold px-8 w-full sm:w-auto"
            >
              Schedule Free Consultation
            </Button>
          </div>
          
          {/* Social proof with automatic scrolling - works for both mobile and desktop */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-5">Trusted by brands across the US</p>
            
            <div className="w-full overflow-hidden">
              <div className="flex animate-scroll gap-8 whitespace-nowrap">
                {/* First set of logos */}
                <div className="flex gap-8 items-center">
                  <img 
                    src="/lovable-uploads/4cec31ab-a832-4679-bc88-32cd5137cb4a.png" 
                    alt="Client Brand Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/934ab001-8c6b-4af3-9e77-acdfeeecfd41.png" 
                    alt="Holistica Bloom Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/d3bc5abc-7c82-4804-852c-cb6ee8675b30.png" 
                    alt="Olympic Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/8f42921f-1f7d-485b-919b-2f22f05e1422.png" 
                    alt="Client Brand Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/75e9db4b-0b11-443e-8a57-0926c37769b7.png" 
                    alt="Dolce Vitta Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                </div>
                
                {/* Duplicate logos to create seamless scrolling effect */}
                <div className="flex gap-8 items-center">
                  <img 
                    src="/lovable-uploads/4cec31ab-a832-4679-bc88-32cd5137cb4a.png" 
                    alt="Client Brand Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/934ab001-8c6b-4af3-9e77-acdfeeecfd41.png" 
                    alt="Holistica Bloom Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/d3bc5abc-7c82-4804-852c-cb6ee8675b30.png" 
                    alt="Olympic Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/8f42921f-1f7d-485b-919b-2f22f05e1422.png" 
                    alt="Client Brand Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                  <img 
                    src="/lovable-uploads/75e9db4b-0b11-443e-8a57-0926c37769b7.png" 
                    alt="Dolce Vitta Logo" 
                    className="h-14 w-auto object-contain flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
