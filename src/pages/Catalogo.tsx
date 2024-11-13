import { useToast } from "@/components/ui/use-toast";
import CatalogLayout from "@/components/catalog/CatalogLayout";

const Catalogo = () => {
  const { toast } = useToast();

  const handleRequestSample = (productId: string) => {
    toast({
      title: "Amostra Solicitada",
      description: "Sua solicitação de amostra foi registrada com sucesso.",
    });
  };

  const handleSelectProduct = (productId: string) => {
    toast({
      title: "Produto Selecionado",
      description: "Produto adicionado ao seu projeto.",
    });
  };

  return (
    <CatalogLayout
      onRequestSample={handleRequestSample}
      onSelectProduct={handleSelectProduct}
    />
  );
};

export default Catalogo;