
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Pill, Coffee, ShoppingBag, Dumbbell, Droplet, Bean, FlaskRound, Brush } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ProductCategoriesSection = () => {
  const categories = [
    {
      icon: <Pill className="w-6 h-6 text-primary" />,
      title: "Supplements",
      description: "Premium vitamins and supplements for your health brand",
      link: "/catalog?category=supplements",
      image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <Coffee className="w-6 h-6 text-primary" />,
      title: "Coffee",
      description: "Specialty coffee solutions for your brand",
      link: "/catalog?category=coffee",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-primary" />,
      title: "Cosmetics",
      description: "Beauty products for your skincare line",
      link: "/catalog?category=cosmetics",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-primary" />,
      title: "Fitness",
      description: "Performance products for fitness enthusiasts",
      link: "/catalog?category=fitness",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <Droplet className="w-6 h-6 text-primary" />,
      title: "Essential Oils",
      description: "Natural aromatherapy products for wellness",
      link: "/catalog?category=essential-oils",
      image: "https://images.unsplash.com/photo-1608571423539-e951a11f0a5d?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <Bean className="w-6 h-6 text-primary" />,
      title: "Organic Foods",
      description: "Sustainable organic food products",
      link: "/catalog?category=organic-foods",
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <FlaskRound className="w-6 h-6 text-primary" />,
      title: "Wellness",
      description: "Innovative wellness solutions",
      link: "/catalog?category=wellness",
      image: "https://images.unsplash.com/photo-1598965402089-897c69ca890a?q=80&w=1920&auto=format&fit=crop",
    },
    {
      icon: <Brush className="w-6 h-6 text-primary" />,
      title: "Personal Care",
      description: "Premium personal care products",
      link: "/catalog?category=personal-care",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1920&auto=format&fit=crop",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="block group">
              <Card className="overflow-hidden border-none hover:shadow-lg transition-all duration-300 h-full">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.title}</span>
                    </h3>
                    <p className="text-white/90 text-sm mt-1 line-clamp-2">{category.description}</p>
                  </div>
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
