import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogosSection } from "./BrandLogosSection";

export const HeroSection = () => {
  return (
    <>
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
              Create your own private label on demand
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We specialize in cosmetics, supplements, and coffee. From idea to launch, 
              we build your brand from the ground up.
            </p>

            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button 
                  size="lg"
                  className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white font-semibold px-8"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#f0562e] text-[#f0562e] hover:bg-[#f0562e]/10 font-semibold px-8"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      <BrandLogosSection />
    </>
  );
};