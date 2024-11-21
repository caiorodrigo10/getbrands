import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Instagram, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const CreativeSection = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/lib/js/smartplayer/v1/sdk.min.js";
    script.setAttribute("data-id", "673f63f57558ba000b569976");
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <section className="relative bg-white py-16 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Instagram className="w-6 h-6 text-[#F16529]" />
              <ShoppingBag className="w-6 h-6 text-[#F16529]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Create your brand identity with us
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From brand strategy to product launch, we create your complete brand identity. 
              Schedule a call to start building your brand today.
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
    </>
  );
};