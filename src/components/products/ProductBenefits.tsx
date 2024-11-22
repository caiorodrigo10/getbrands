import { Product } from "@/types/product";

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Descrição do Produto</h2>
      <div className="prose max-w-none">
        {product.description || 'Nenhuma descrição disponível.'}
      </div>
    </div>
  );
};