import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ServicesSection = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold tracking-tight text-gray-900">
              250+ private label products
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose from over 250 private label or pre-buy products for your brand. 
              From supplements to skincare, find everything your customers need for their wellness.
            </p>

            <Button 
              asChild
              className="bg-[#0bcf88] hover:bg-[#0bcf88]/90 text-white rounded-full px-8 py-6 text-lg h-auto"
            >
              <Link to="/catalog">
                Explore products
              </Link>
            </Button>
          </div>

          <div className="relative">
            <img
              src="/lovable-uploads/53f55bfd-bb48-4745-83ff-61b351124a58.png"
              alt="Private label products showcase"
              className="w-full rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};