import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ServicesSection = () => {
  return (
    <section className="py-32 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              250+ private label products
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose from over 250 private label or pre-buy products for your brand. 
              From supplements to skincare, find everything your customers need for their wellness.
            </p>

            <Button 
              asChild
              className="bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-full px-8 py-6 text-lg h-auto"
            >
              <Link to="/catalog">
                Explore products
              </Link>
            </Button>
          </div>

          <div className="relative aspect-square bg-gray-200 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
