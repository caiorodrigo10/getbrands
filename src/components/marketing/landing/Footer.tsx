
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-slate-950 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white border-b border-primary/30 pb-2">
              GetBrands
            </h3>
            <p className="text-gray-300 mb-6">
              Your trusted partner in private label manufacturing and brand building. We empower entrepreneurs to launch successful brands without inventory headaches.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white border-b border-primary/30 pb-2">
              Products
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/catalog" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Supplements
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/catalog" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Skincare & Cosmetics
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/catalog" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Coffee & Beverages
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/catalog" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Pet Products
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/catalog" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  View All Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white border-b border-primary/30 pb-2">
              Company
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/terms" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Terms and Conditions
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/policies" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/schedule-demo" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Schedule Demo
                </Link>
              </li>
              <li className="hover:text-primary transition-colors duration-300">
                <Link to="/login" className="flex items-center">
                  <span className="h-1 w-1 bg-primary/80 rounded-full mr-2"></span>
                  Client Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white border-b border-primary/30 pb-2">
              Contact Us
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <p>123 Market Street, Suite 456<br />San Francisco, CA 94105</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3" />
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3" />
                <p>support@getbrands.com</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3 text-white">Newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button variant="outline" size="sm" className="whitespace-nowrap bg-primary/20 border-primary hover:bg-primary/30">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} GetBrands. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors duration-300">
                Terms
              </Link>
              <Link to="/policies" className="text-gray-400 hover:text-primary text-sm transition-colors duration-300">
                Privacy
              </Link>
              <Link to="/schedule-demo" className="text-gray-400 hover:text-primary text-sm transition-colors duration-300">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
