import { ShoppingBag, Instagram } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">How it works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4">Select Products</h3>
            <p className="text-gray-600">
              Choose from our wide range of high-quality products that match your brand vision and market needs.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4">Create Your Brand</h3>
            <p className="text-gray-600">
              We develop your brand identity and design custom packaging that stands out in the market.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4">Sell</h3>
            <p className="text-gray-600">
              Launch your products and start selling with our complete support and guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};