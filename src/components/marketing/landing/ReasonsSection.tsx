import { Card } from "@/components/ui/card";

export const ReasonsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          15 Reasons to Start Your Private Label Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(15)].map((_, i) => (
            <Card key={i} className="p-4 bg-white hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">Reason {i + 1}</h3>
              <p className="text-sm text-gray-600">
                Description of why this is a compelling reason to start your private label business.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};