
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
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
          
          {/* Social proof */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Trusted by brands across the US</p>
            <div className="flex justify-center items-center gap-8">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
