import { Users, Package, Star, Clock } from "lucide-react";

export const SuccessMetrics = () => {
  const metrics = [
    {
      icon: <Users className="w-8 h-8 text-[#4A90E2]" />,
      label: "FAST",
      value: "5X",
      description: "faster production & asset delivery",
    },
    {
      icon: <Package className="w-8 h-8 text-[#4A90E2]" />,
      label: "AFFORDABLE",
      value: "2/3",
      description: "the cost of traditional production",
    },
    {
      icon: <Star className="w-8 h-8 text-[#4A90E2]" />,
      label: "TRANSPARENT",
      value: "UNLIMITED",
      description: "usage rights + royalty-free models",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#4A90E2]" />,
      label: "PERFORMANCE",
      value: "29.5%",
      description: "increase in sales",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-16">
            The results speak<br />for themselves
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <span className="text-[#4A90E2] font-semibold text-sm mb-4">
                  {metric.label}
                </span>
                <div className="text-5xl font-bold mb-3 text-gray-900">
                  {metric.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};