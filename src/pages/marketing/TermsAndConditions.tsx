import { Footer } from "@/components/marketing/landing/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Termos e Condições</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar os serviços da GetBrands, você concorda em cumprir e estar 
              vinculado a estes Termos e Condições. Se você não concordar com algum aspecto 
              destes termos, não use nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Serviços Oferecidos</h2>
            <p>
              A GetBrands oferece serviços de desenvolvimento de marca e produtos private label, 
              incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Desenvolvimento de produtos personalizados</li>
              <li>Design de embalagens</li>
              <li>Consultoria de marca</li>
              <li>Serviços de manufatura</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Responsabilidades do Cliente</h2>
            <p>
              Ao utilizar nossos serviços, você concorda em:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fornecer informações precisas e completas</li>
              <li>Manter a confidencialidade de sua conta</li>
              <li>Usar os serviços de acordo com as leis aplicáveis</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Pagamentos e Reembolsos</h2>
            <p>
              Detalhamos aqui nossa política de pagamentos e reembolsos, incluindo prazos 
              e condições específicas para cada tipo de serviço.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;