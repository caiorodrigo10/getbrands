import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PackageDesignStage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Inicie seu Design de Embalagem</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete nosso questionário de design de embalagem para nos ajudar a entender sua visão e criar rótulos que se alinhem perfeitamente com a identidade da sua marca.
          </p>
        </div>
        <Button 
          size="lg"
          onClick={() => navigate(`/package-quiz`)}
          className="mt-4"
        >
          Iniciar Questionário de Design
        </Button>
      </div>
    </div>
  );
}