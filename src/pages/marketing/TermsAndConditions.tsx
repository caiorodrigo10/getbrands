import { Footer } from "@/components/marketing/landing/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString('en-US')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using GetBrands services, you agree to comply with and 
              be bound by these Terms and Conditions. If you disagree with any part 
              of these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services Offered</h2>
            <p>
              GetBrands offers brand development and private label product services, 
              including:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Custom product development</li>
              <li>Package design</li>
              <li>Brand consulting</li>
              <li>Manufacturing services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
            <p>
              When using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain account confidentiality</li>
              <li>Use services in compliance with applicable laws</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payments and Refunds</h2>
            <p>
              We detail our payment and refund policies here, including timelines 
              and specific conditions for each type of service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;