export const Footer = () => {
  return (
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
  );
};