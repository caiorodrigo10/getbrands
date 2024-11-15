import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const profit = product.srp - product.from_price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Seção Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative">
            {product.is_new && (
              <Badge className="absolute top-4 right-4 bg-primary">NOVO</Badge>
            )}
            {product.is_tiktok && (
              <Badge className="absolute top-4 right-4 bg-pink-600">TIKTOK</Badge>
            )}
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.image_url || "/placeholder.svg"}
                alt={`${product.name} - Vista ${i}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:ring-2 ring-primary"
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Preço base</p>
                <p className="text-3xl font-bold">R$ {product.from_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preço sugerido</p>
                <p className="text-3xl font-bold">R$ {product.srp.toFixed(2)}</p>
              </div>
              <div className="bg-green-500 p-4 rounded-lg text-white">
                <p className="text-sm">Lucro potencial</p>
                <p className="text-2xl font-bold">R$ {profit.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" variant="outline">
                Ver descontos por volume
              </Button>
              <Button className="flex-1">
                Desbloquear preço especial
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Icons.skinHealth className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Saúde da Pele</p>
            </div>
            <div className="text-center">
              <Icons.vegetarian className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Vegetariano</p>
            </div>
            <div className="text-center">
              <Icons.natural className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">100% Natural</p>
            </div>
            <div className="text-center">
              <Icons.noGmo className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Sem OGM</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              Personalizar e vender
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Salvar para depois
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Benefícios */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Benefícios do Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ingredientes Principais</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Aloe Vera: Hidratação profunda</li>
              <li>Óleo de Tea Tree: Propriedades purificantes</li>
              <li>Extrato de Pepino: Efeito calmante</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Benefícios</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Reduz vermelhidão</li>
              <li>Equilibra a pele</li>
              <li>Hidrata profundamente</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Modo de Uso</h3>
            <p>Aplique sobre a pele limpa e seca, massageando suavemente. Use duas vezes ao dia para melhores resultados.</p>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Produtos Relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Implementar componente de produtos relacionados aqui */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;