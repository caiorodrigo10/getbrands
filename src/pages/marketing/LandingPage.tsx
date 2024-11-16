import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package2, Coffee, ShoppingBag, Users, Star } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary min-h-[600px] relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Your brand. Our expertise.
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Creating a brand that stands out isn't easy. That's where we come in. From supplements to beauty products, we'll help you bring your vision to life. Every step of the way, we'll guide you to success.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="text-primary font-semibold"
            >
              Get Started Now
            </Button>
          </div>
          <div className="flex-1">
            <div className="bg-gray-300 w-full h-[400px] rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>Fast Lead Times</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No Monthly Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Safe Title & Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Zero Investment in Stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore Our Wide Range of Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
              <Package2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-gray-900">Supplements</h3>
              <p className="text-sm text-gray-600">
                Build your health brand with our premium supplements
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
              <Coffee className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-gray-900">Coffee</h3>
              <p className="text-sm text-gray-600">
                Premium coffee solutions for your brand
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-gray-900">Cosmetics</h3>
              <p className="text-sm text-gray-600">
                Create your beauty line with our products
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-gray-900">Fitness</h3>
              <p className="text-sm text-gray-600">
                Launch your fitness brand with our solutions
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Building Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <img 
                src="https://content.app-sources.com/s/97257455971736356/uploads/Images/Brand_Building-7282327.jpg"
                alt="Brand Building"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Brand-building made easy
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From logo design to product packaging, we'll help you create a brand that stands out. Our team of experts will guide you through every step of the process.
              </p>
              <Button 
                size="lg"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Start Your Brand Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* Why Choose Us Section */}
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

      {/* Call to Action Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Your Brand Journey?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of successful entrepreneurs who have built their brands with us.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-primary font-semibold"
          >
            Start Building Your Brand
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <div className="w-32 h-8 bg-gray-700 rounded mb-4"></div>
              <p className="text-gray-400 text-sm">
                Your trusted partner in private label manufacturing and brand building.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Supplements</li>
                <li>Coffee</li>
                <li>Cosmetics</li>
                <li>Fitness</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Case Studies</li>
                <li>Documentation</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Schedule a Call</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
