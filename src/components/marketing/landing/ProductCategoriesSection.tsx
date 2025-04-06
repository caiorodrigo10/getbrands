
import { Card } from "@/components/ui/card";
import { Package2, Coffee, ShoppingBag, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ProductCategoriesSection = () => {
  const categories = [
    {
      icon: <Package2 className="w-12 h-12 text-primary" />,
      title: "Supplements",
      description: "Build your health brand with our premium supplements",
      link: "/catalog?category=supplements"
    },
    {
      icon: <Coffee className="w-12 h-12 text-primary" />,
      title: "Coffee",
      description: "Premium coffee solutions for your brand",
      link: "/catalog?category=coffee"
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-primary" />,
      title: "Cosmetics",
      description: "Create your beauty line with our products",
      link: "/catalog?category=cosmetics"
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Fitness",
      description: "Launch your fitness brand with our solutions",
      link: "/catalog?category=fitness"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Explore Our Product Categories
          </h2>
          <p className="text-xl text-gray-600">
            Discover our wide range of high-quality products ready for your brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="block">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col items-center border-none shadow-md bg-gray-50">
                <div className="mb-6 bg-primary/10 p-4 rounded-full">{category.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{category.title}</h3>
                <p className="text-gray-600 mb-5 text-center">{category.description}</p>
                <div className="mt-auto">
                  <Button variant="ghost" className="group">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/catalog">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
