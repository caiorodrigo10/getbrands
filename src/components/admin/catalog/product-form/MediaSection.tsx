import { ProductFormSection } from "../ProductFormSection";
import { ProductImageUpload } from "../ProductImageUpload";
import { ProductImage } from "@/types/product";

interface MediaSectionProps {
  productId: string;
  images: ProductImage[];
  mainImageUrl?: string | null;
  onImagesUpdate: () => void;
  onMediaLibrarySelect?: (urls: string[]) => void;
}

export const MediaSection = ({ 
  productId, 
  images, 
  mainImageUrl, 
  onImagesUpdate,
  onMediaLibrarySelect 
}: MediaSectionProps) => {
  return (
    <ProductFormSection title="Media">
      <ProductImageUpload
        productId={productId}
        images={images}
        mainImageUrl={mainImageUrl}
        onImagesUpdate={onImagesUpdate}
        onMediaLibrarySelect={onMediaLibrarySelect}
      />
    </ProductFormSection>
  );
};