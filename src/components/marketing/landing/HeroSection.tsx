import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
            className="text-gray-700 hover:bg-gray-100 text-sm font-medium px-4"
          >
            Login
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png"
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

          <Button 
            size="lg"
            className="bg-[#F16529] hover:bg-[#F16529]/90 text-white font-semibold px-8"
          >
            Start Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
          <img 
            src="/lovable-uploads/3a1fb15c-3252-4eb7-b150-e8f75f4b48fd.png" 
            alt="Product Showcase"
            className="w-full rounded-lg shadow-lg"
          />
          <img 
            src="https://images.unsplash.com/photo-1556229162-5c63ed9c4efb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" 
            alt="Product Showcase"
            className="w-full rounded-lg shadow-lg"
          />
          <img 
            src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" 
            alt="Product Showcase"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};