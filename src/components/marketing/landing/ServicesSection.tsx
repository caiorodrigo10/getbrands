import { Card } from "@/components/ui/card";
import { Coffee, Package2, Sparkles } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: <Package2 className="w-12 h-12 text-primary" />,
      title: "Supplements",
      description: "Premium quality supplements for your brand",
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      title: "Cosmetics",
      description: "Professional beauty and skincare products",
    },
    {
      icon: <Coffee className="w-12 h-12 text-primary" />,
      title: "Coffee",
      description: "Artisanal coffee solutions for your brand",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          On-Demand Services
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Choose from our wide range of high-quality products to build your brand
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};