import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/product";

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
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240726103115-jtp7adwc-advanced-100--whey-protein-isolate-chocolate.png&w=768&q=75",
    fromPrice: 19.99,
    srp: 29.99,
    profit: 10.00,
  },
  {
    id: 5,
    category: "Snacks",
    name: "Protein Bar (Chocolate Chip)",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240710184044-vox4test-alpha-energy.png&w=768&q=75",
    fromPrice: 1.50,
    srp: 2.99,
    profit: 1.49,
  },
  {
    id: 6,
    category: "Beverages",
    name: "Green Tea (Lemon Flavor)",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240618170201-vox45htp-5-htp.png&w=768&q=75",
    fromPrice: 2.50,
    srp: 5.00,
    profit: 2.50,
  },
  {
    id: 7,
    category: "Personal Care",
    name: "Moisturizing Cream",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240726103115-jtp7adwc-advanced-100--whey-protein-isolate-chocolate.png&w=768&q=75",
    fromPrice: 12.00,
    srp: 19.99,
    profit: 7.99,
  },
  {
    id: 8,
    category: "Vitamins",
    name: "Omega 3 Fish Oil",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240710184044-vox4test-alpha-energy.png&w=768&q=75",
    fromPrice: 25.00,
    srp: 39.99,
    profit: 14.99,
  },
  {
    id: 9,
    category: "Supplements",
    name: "Pre Workout Formula",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240618170201-vox45htp-5-htp.png&w=768&q=75",
    fromPrice: 29.99,
    srp: 49.99,
    profit: 20.00,
  },
  {
    id: 10,
    category: "Snacks",
    name: "Granola Bar (Oats & Honey)",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240726103115-jtp7adwc-advanced-100--whey-protein-isolate-chocolate.png&w=768&q=75",
    fromPrice: 1.00,
    srp: 2.50,
    profit: 1.50,
  },
  {
    id: 11,
    category: "Beverages",
    name: "Protein Shake (Vanilla)",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240710184044-vox4test-alpha-energy.png&w=768&q=75",
    fromPrice: 3.00,
    srp: 5.50,
    profit: 2.50,
  },
  {
    id: 12,
    category: "Beauty",
    name: "Nourishing Face Mask",
    image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fsupliful.s3.amazonaws.com%2Fproducts%2Fimages%2F20240618170201-vox45htp-5-htp.png&w=768&q=75",
    fromPrice: 15.00,
    srp: 24.99,
    profit: 9.99,
  },
];

const Catalogo = () => {
  const { toast } = useToast();

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
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de Produtos</h1>
        <p className="text-gray-600">Explore nossa seleção de produtos e selecione os ideais para seu projeto</p>
      </header>

      <ProductGrid 
        products={products}
        onRequestSample={handleRequestSample}
        onSelectProduct={handleSelectProduct}
      />

      <div className="mt-8">
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
    </div>
  );
};

export default Catalogo;
