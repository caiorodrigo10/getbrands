
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#f0562e] to-[#f97316]">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Launch Your Own Brand?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of successful entrepreneurs who have built their brands with GetBrands. No inventory costs. No minimum orders.
          </p>
          
          <div className="bg-white/10 rounded-lg p-6 mb-10 inline-flex items-center">
            <Clock className="h-6 w-6 text-white mr-3" />
            <p className="text-white font-medium">Limited time offer: Free brand consultation ($500 value)</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              asChild
              className="bg-white text-[#f0562e] hover:bg-white/90"
            >
              <Link to="/signup">
                Start Your Brand Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/catalog">
                Browse Products First
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
