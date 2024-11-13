import { useToast } from "@/components/ui/use-toast";
import ProductGrid from "@/components/ProductGrid";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import FeaturedSlider from "@/components/FeaturedSlider";
import { Product } from "@/types/product";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 12;

const Catalogo = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-8 bg-white min-h-screen">
      <CatalogHeader />
      <CatalogFilters />
      <FeaturedSlider />
      <ProductGrid 
        products={paginatedProducts}
        onRequestSample={handleRequestSample}
        onSelectProduct={handleSelectProduct}
      />
      
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Catalogo;
