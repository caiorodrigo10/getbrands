import { Footer } from "@/components/marketing/landing/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p>
              A GetBrands está comprometida em proteger sua privacidade. Esta Política de Privacidade 
              explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Coleta de Informações</h2>
            <p>
              Coletamos informações que você nos fornece diretamente, incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Nome e informações de contato</li>
              <li>Informações de pagamento</li>
              <li>Endereço de entrega</li>
              <li>Preferências de produtos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Uso das Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Processar seus pedidos</li>
              <li>Melhorar nossos serviços</li>
              <li>Comunicar-nos com você sobre produtos e serviços</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Proteção de Dados</h2>
            <p>
              Implementamos medidas de segurança apropriadas para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;