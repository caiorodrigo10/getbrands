import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, ProductImage } from "@/types/product";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductActions } from "./ProductActions";
import { ProductBenefits } from "./ProductBenefits";
import { ProductCalculator } from "./ProductCalculator";
import { ProductImages } from "./ProductImages";
import { ProductLightbox } from "./ProductLightbox";

interface ProductHeaderProps {
  product: Product;
  onSelectProduct: () => void;
}

export const ProductHeader = ({ product, onSelectProduct }: ProductHeaderProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image_url || "/placeholder.svg");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: productImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');

      if (error) throw error;
      
      const validImages = data?.filter(img => img.image_url?.startsWith('https://'));
      
      const primaryImage = validImages?.find(img => img.is_primary)?.image_url;
      if (primaryImage) {
        setSelectedImage(primaryImage);
      }
      
      return validImages || [];
    },
  });

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const uniqueImages: ProductImage[] = [
    ...(product.image_url ? [{
      id: 'main',
      product_id: product.id,
      image_url: product.image_url,
      position: -1,
      is_primary: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }] : []),
    ...(productImages || [])
  ].filter((img, index, self) => 
    index === self.findIndex((t) => t.image_url === img.image_url)
  );

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? uniqueImages.length - 1 : prev - 1;
      setSelectedImage(uniqueImages[newIndex].image_url);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === uniqueImages.length - 1 ? 0 : prev + 1;
      setSelectedImage(uniqueImages[newIndex].image_url);
      return newIndex;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-6">
        <ProductImages
          images={uniqueImages}
          selectedImage={selectedImage}
          onImageSelect={handleThumbnailClick}
          productName={product.name}
          onZoomClick={() => setLightboxOpen(true)}
        />

        <ProductLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          selectedImage={selectedImage}
          productName={product.name}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
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
              <p className="text-gray-600">SRP</p>
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
            productId={product.id}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </div>
  );
};