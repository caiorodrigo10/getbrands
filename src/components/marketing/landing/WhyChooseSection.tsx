import { Check } from "lucide-react";

export const WhyChooseSection = () => {
  const benefits = [
    {
      title: "Fast Production",
      description: "Get your products manufactured and delivered quickly",
    },
    {
      title: "Quality Guaranteed",
      description: "Premium quality products that meet all standards",
    },
    {
      title: "Full Support",
      description: "Expert guidance throughout your journey",
    },
    {
      title: "Custom Branding",
      description: "Complete customization for your brand identity",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose GetBrands
          </h2>
          <p className="text-lg text-gray-600">
            We provide everything you need to launch and grow your brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};