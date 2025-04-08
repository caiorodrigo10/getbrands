
import { Check, Shield, Clock, Award, Users } from "lucide-react";

export const WhyChooseSection = () => {
  const benefits = [
    {
      icon: <Clock className="w-10 h-10 text-white" />,
      title: "Fast Production",
      description: "Get your products manufactured and delivered quickly with our streamlined processes and dedicated production team."
    },
    {
      icon: <Shield className="w-10 h-10 text-white" />,
      title: "Quality Guaranteed",
      description: "Every product meets rigorous quality standards with thorough testing and premium ingredients or materials."
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Full Support",
      description: "Our expert team provides guidance throughout your journey, from concept to launch and beyond."
    },
    {
      icon: <Award className="w-10 h-10 text-white" />,
      title: "Custom Branding",
      description: "Complete customization for your brand identity with professional design services and flexible packaging options."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Why Choose GetBrands
          </h2>
          <p className="text-xl text-gray-300">
            The trusted partner for entrepreneurs building successful brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                  {benefit.icon}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 border-t border-gray-800 pt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center text-white">Our Commitment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Sustainable Practice", "Transparent Pricing", "Ethical Production"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800/50 px-6 py-4 rounded-lg">
                <Check className="text-primary shrink-0" />
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
