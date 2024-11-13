import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Product {
  id: number;
  category: string;
  name: string;
  image: string;
  fromPrice: number;
  srp: number;
  profit: number;
  isNew?: boolean;
  isTiktok?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    category: "Proteins & Blends",
    name: "Advanced 100% Whey Protein Isolate (Chocolate)",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240726103115-jtp7adwc-advanced-100--whey-protein-isolate-chocolate.png&w=768&q=75",
    fromPrice: 29.90,
    srp: 49.90,
    profit: 20.00,
    isNew: true
  },
  {
    id: 2,
    category: "Energy & Performance",
    name: "Alpha Energy Pre-Workout",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240710184044-vox4test-alpha-energy.png&w=768&q=75",
    fromPrice: 29.90,
    srp: 49.90,
    profit: 20.00,
    isNew: true
  },
  {
    id: 3,
    category: "Vitamins & Supplements",
    name: "5-HTP Mood Support",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240618170201-vox45htp-5-htp.png&w=768&q=75",
    fromPrice: 8.25,
    srp: 14.99,
    profit: 6.74,
    isTiktok: true
  },
  {
    id: 4,
    category: "Vitamins & Supplements",
    name: "Vitamin C 1000mg",
    image: "/placeholder.svg",
    fromPrice: 19.99,
    srp: 29.99,
    profit: 10.00,
  },
  {
    id: 5,
    category: "Snacks",
    name: "Protein Bar (Chocolate Chip)",
    image: "/placeholder.svg",
    fromPrice: 1.50,
    srp: 2.99,
    profit: 1.49,
  },
  {
    id: 6,
    category: "Beverages",
    name: "Green Tea (Lemon Flavor)",
    image: "/placeholder.svg",
    fromPrice: 2.50,
    srp: 5.00,
    profit: 2.50,
  },
  {
    id: 7,
    category: "Personal Care",
    name: "Moisturizing Cream",
    image: "/placeholder.svg",
    fromPrice: 12.00,
    srp: 19.99,
    profit: 7.99,
  },
  {
    id: 8,
    category: "Vitamins",
    name: "Omega 3 Fish Oil",
    image: "/placeholder.svg",
    fromPrice: 25.00,
    srp: 39.99,
    profit: 14.99,
  },
  {
    id: 9,
    category: "Supplements",
    name: "Pre Workout Formula",
    image: "/placeholder.svg",
    fromPrice: 29.99,
    srp: 49.99,
    profit: 20.00,
  },
  {
    id: 10,
    category: "Snacks",
    name: "Granola Bar (Oats & Honey)",
    image: "/placeholder.svg",
    fromPrice: 1.00,
    srp: 2.50,
    profit: 1.50,
  },
  {
    id: 11,
    category: "Beverages",
    name: "Protein Shake (Vanilla)",
    image: "/placeholder.svg",
    fromPrice: 3.00,
    srp: 5.50,
    profit: 2.50,
  },
  {
    id: 12,
    category: "Beauty",
    name: "Nourishing Face Mask",
    image: "/placeholder.svg",
    fromPrice: 15.00,
    srp: 24.99,
    profit: 9.99,
  },
];

const Catalogo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const productsPerPage = 12;

  const handleRequestSample = (productId: number) => {
    toast({
      title: "Amostra Solicitada",
      description: "Sua solicitação de amostra foi registrada com sucesso.",
    });
  };

  const handleSelectProduct = (productId: number) => {
    toast({
      title: "Produto Selecionado",
      description: "Produto adicionado ao seu projeto.",
    });
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Catálogo de Produtos</h1>
        <p className="text-gray-400">Explore nossa seleção de produtos e selecione os ideais para seu projeto</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <Card key={product.id} className="bg-gray-950 border-gray-800 overflow-hidden">
            <div className="relative">
              {product.isNew && (
                <Badge className="absolute top-2 right-2 bg-primary">
                  NOVO
                </Badge>
              )}
              {product.isTiktok && (
                <Badge className="absolute top-2 right-2 bg-pink-600">
                  TIKTOK
                </Badge>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-2">{product.category}</div>
              <h3 className="text-lg font-semibold text-white mb-4">{product.name}</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <p className="text-sm text-gray-400">From</p>
                  <p className="font-semibold text-white">${product.fromPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">SRP</p>
                  <p className="font-semibold text-white">${product.srp.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Profit</p>
                  <p className="font-semibold text-green-500">${product.profit.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-primary hover:text-primary"
                  onClick={() => handleRequestSample(product.id)}
                >
                  Pedir Amostra
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleSelectProduct(product.id)}
                >
                  Selecionar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive className="text-primary">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Catalogo;
