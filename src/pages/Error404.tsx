import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-secondary">Página não encontrada</h2>
      <p className="text-muted max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <div className="space-x-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Voltar
        </Button>
        <Button onClick={() => navigate("/")}>
          Ir para Home
        </Button>
      </div>
    </div>
  );
};

export default Error404;