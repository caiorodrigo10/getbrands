import { Users, Package, Star, Clock } from "lucide-react";

export const BrandExpandableSection = () => {
  const metrics = [
    {
      label: "FAST",
      value: "5X",
      description: "Growth for our clients",
      icon: <Users className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "AFFORDABLE",
      value: "2/3",
      description: "Market share achieved",
      icon: <Package className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "TRANSPARENT",
      value: "Unlimited",
      description: "Product possibilities",
      icon: <Star className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "PERFORMANCE",
      value: "29.5%",
      description: "Faster launch time",
      icon: <Clock className="w-8 h-8 text-[#4c1e6c]" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          The results speak<br />for themselves
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-[#4c1e6c] font-semibold mb-4">{metric.label}</p>
              <div className="mb-4 flex justify-center">{metric.icon}</div>
              <div className="text-5xl font-bold mb-3">{metric.value}</div>
              <div className="text-gray-600 text-lg">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};