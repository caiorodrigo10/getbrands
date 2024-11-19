import { Card } from "@/components/ui/card";
import { Package2, Coffee, ShoppingBag, Users } from "lucide-react";

export const ProductCategoriesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Explore Our Wide Range of Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <Package2 className="w-12 h-12 mx-auto mb-4 text-[#F16529]" />
            <h3 className="font-semibold mb-2 text-gray-900">Supplements</h3>
            <p className="text-sm text-gray-600">
              Build your health brand with our premium supplements
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <Coffee className="w-12 h-12 mx-auto mb-4 text-[#F16529]" />
            <h3 className="font-semibold mb-2 text-gray-900">Coffee</h3>
            <p className="text-sm text-gray-600">
              Premium coffee solutions for your brand
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#F16529]" />
            <h3 className="font-semibold mb-2 text-gray-900">Cosmetics</h3>
            <p className="text-sm text-gray-600">
              Create your beauty line with our products
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <Users className="w-12 h-12 mx-auto mb-4 text-[#F16529]" />
            <h3 className="font-semibold mb-2 text-gray-900">Fitness</h3>
            <p className="text-sm text-gray-600">
              Launch your fitness brand with our solutions
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};