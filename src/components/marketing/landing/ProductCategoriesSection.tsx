
import { Card } from "@/components/ui/card";
import { Pill, Coffee, ShoppingBag, Dumbbell, Droplet, Bean, FlaskRound, Brush } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ProductCategoriesSection = () => {
  const categories = [
    {
      icon: <Pill className="w-10 h-10 text-primary" />,
      title: "Supplements",
      description: "Premium vitamins and supplements for your health brand",
      link: "/catalog?category=supplements",
    },
    {
      icon: <Coffee className="w-10 h-10 text-primary" />,
      title: "Coffee",
      description: "Specialty coffee solutions for your brand",
      link: "/catalog?category=coffee",
    },
    {
      icon: <ShoppingBag className="w-10 h-10 text-primary" />,
      title: "Cosmetics",
      description: "Beauty products for your skincare line",
      link: "/catalog?category=cosmetics",
    },
    {
      icon: <Dumbbell className="w-10 h-10 text-primary" />,
      title: "Fitness",
      description: "Performance products for fitness enthusiasts",
      link: "/catalog?category=fitness",
    },
    {
      icon: <Droplet className="w-10 h-10 text-primary" />,
      title: "Essential Oils",
      description: "Natural aromatherapy products for wellness",
      link: "/catalog?category=essential-oils",
    },
    {
      icon: <Bean className="w-10 h-10 text-primary" />,
      title: "Organic Foods",
      description: "Sustainable organic food products",
      link: "/catalog?category=organic-foods",
    },
    {
      icon: <FlaskRound className="w-10 h-10 text-primary" />,
      title: "Wellness",
      description: "Innovative wellness solutions",
      link: "/catalog?category=wellness",
    },
    {
      icon: <Brush className="w-10 h-10 text-primary" />,
      title: "Personal Care",
      description: "Premium personal care products",
      link: "/catalog?category=personal-care",
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Explore Our Product Categories
          </h2>
          <p className="text-xl text-gray-600">
            Discover our wide range of high-quality products ready for your brand
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="block group">
              <Card className="overflow-hidden border hover:border-primary hover:shadow-lg transition-all duration-300 h-full p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-5 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {category.description}
                </p>
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

