import { Footer } from "@/components/marketing/landing/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString('en-US')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              GetBrands is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information Collection</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Name and contact information</li>
              <li>Payment information</li>
              <li>Shipping address</li>
              <li>Product preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Use of Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Process your orders</li>
              <li>Improve our services</li>
              <li>Communicate with you about products and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <p>
              We implement appropriate security measures to protect your information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;