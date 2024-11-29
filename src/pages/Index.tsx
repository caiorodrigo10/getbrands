import { useEffect } from "react";
import { trackPage } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    trackPage({
      initial_load: true,
      route_change: false,
      url: window.location.href,
      referrer: document.referrer,
      session_id: "session-1",
      user_role: "member",
      page_type: "home"
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao GetBrands</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Crie sua própria marca privada com GetBrands. Do conceito ao mercado, nós te guiamos em cada etapa.
      </p>
      <div className="space-x-4">
        <Button 
          variant="default" 
          size="lg"
          onClick={() => navigate("/catalog")}
        >
          Explorar Catálogo
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate("/login")}
        >
          Fazer Login
        </Button>
      </div>
    </div>
  );
};

export default Index;