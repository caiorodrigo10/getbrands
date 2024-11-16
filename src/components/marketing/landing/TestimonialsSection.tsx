import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 bg-white">
              <div className="flex items-center text-primary mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The support and guidance we received throughout the process was invaluable. Our brand wouldn't be where it is today without their expertise."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Client Name</p>
                  <p className="text-sm text-gray-600">Company Name</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};