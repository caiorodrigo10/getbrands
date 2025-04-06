
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, PenTool, Package2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Create Your Own <span className="text-[#f0562e]">Premium Brand</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
          GetBrands helps entrepreneurs build and launch their own private label brands without inventory investment. We handle everything from product development to packaging design.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            asChild
            className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
          >
            <Link to="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline"
          >
            <Link to="/catalog">
              View Products <ShoppingBag className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-10 text-center">How GetBrands Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-[#f0562e]/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-[#f0562e]" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select Products</h3>
            <p className="text-gray-600">
              Choose from our catalog of premium products in beauty, supplements, and coffee categories.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-[#f0562e]/10 rounded-full flex items-center justify-center mb-4">
              <PenTool className="h-6 w-6 text-[#f0562e]" />
            </div>
            <h3 className="text-xl font-medium mb-2">Customize Your Brand</h3>
            <p className="text-gray-600">
              Our designers will create custom packaging and branding for your products.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-[#f0562e]/10 rounded-full flex items-center justify-center mb-4">
              <Package2 className="h-6 w-6 text-[#f0562e]" />
            </div>
            <h3 className="text-xl font-medium mb-2">Launch & Sell</h3>
            <p className="text-gray-600">
              We handle production and shipping while you focus on growing your business.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild
            className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
          >
            <Link to="/catalog">
              Explore Our Product Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
