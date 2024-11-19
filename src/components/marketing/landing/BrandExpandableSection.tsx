import { Users, Package, Star, Clock } from "lucide-react";

export const BrandExpandableSection = () => {
  const metrics = [
    {
      label: "FAST",
      value: "5X",
      description: "faster production & asset delivery",
      icon: <Users className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "AFFORDABLE",
      value: "2/3",
      description: "the cost of traditional production",
      icon: <Package className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "TRANSPARENT",
      value: "UNLIMITED",
      description: "usage rights + royalty-free models",
      icon: <Star className="w-8 h-8 text-[#4c1e6c]" />
    },
    {
      label: "PERFORMANCE",
      value: "29.5%",
      description: "increase in sales",
      icon: <Clock className="w-8 h-8 text-[#4c1e6c]" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          The results speak<br />for themselves
        </h2>
        
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-blue-600 uppercase tracking-wider text-sm font-semibold mb-4">{metric.label}</p>
                <div className="text-6xl font-bold mb-3">{metric.value}</div>
                <div className="text-gray-600 text-lg">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};