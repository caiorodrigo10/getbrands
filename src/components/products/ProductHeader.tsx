import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ProductActions } from "./ProductActions";

interface ProductHeaderProps {
  product: Product;
  onSelectProduct: () => void;
}

export const ProductHeader = ({ product, onSelectProduct }: ProductHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-6">
        <div className="relative">
          {product.is_new && (
            <Badge className="absolute top-4 left-4 bg-primary">NEW</Badge>
          )}
          {product.is_tiktok && (
            <Badge className="absolute top-4 right-4 bg-pink-600">SELL ON TIKTOK</Badge>
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
              alt={`${product.name} - View ${i}`}
              className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:ring-2 ring-primary"
            />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600">Ships exclusively to US</p>
          <p className="text-gray-700 text-lg">{product.description}</p>
        </div>
        <div className="text-4xl font-bold mb-4">
          ${product.from_price.toFixed(2)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg">
            <span>Sell more, pay less!</span>
            <Button variant="link" className="text-primary">
              View Volume Discounts
            </Button>
          </div>

          <div className="flex items-center justify-between text-lg">
            <span>Large business?</span>
            <Button variant="link" className="text-primary">
              Unlock Special Pricing
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
            <div>
              <p className="text-gray-600">Shipping cost</p>
              <p className="text-lg">From ${(4.50).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Suggested retail price</p>
              <p className="text-lg">${product.srp.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Potential profit</p>
              <p className="text-lg text-green-600 font-semibold">
                ${(product.srp - product.from_price).toFixed(2)}
              </p>
            </div>
          </div>

          <ProductActions 
            product={product}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </div>
  );
};