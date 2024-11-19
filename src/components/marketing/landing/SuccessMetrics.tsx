import { Users, Package, Star, Clock } from "lucide-react";

export const SuccessMetrics = () => {
  const metrics = [
    {
      icon: <Users className="w-8 h-8 text-[#F16529]" />,
      value: "5X",
      label: "Growth for our clients",
    },
    {
      icon: <Package className="w-8 h-8 text-[#F16529]" />,
      value: "2/3",
      label: "Market share",
    },
    {
      icon: <Star className="w-8 h-8 text-[#F16529]" />,
      value: "Unlimited",
      label: "Product possibilities",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#F16529]" />,
      value: "29.5%",
      label: "Faster launch time",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">{metric.icon}</div>
              <div className="text-3xl font-bold mb-2 text-[#F16529]">{metric.value}</div>
              <div className="text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};