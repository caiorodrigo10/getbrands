import { ProductFormSection } from "../ProductFormSection";
import { ProductImageUpload } from "../ProductImageUpload";

interface MediaSectionProps {
  productId: string;
  images: any[];
  mainImageUrl?: string | null;
  onImagesUpdate: () => void;
}

export const MediaSection = ({ productId, images, mainImageUrl, onImagesUpdate }: MediaSectionProps) => {
  return (
    <ProductFormSection title="Media">
      <ProductImageUpload
        productId={productId}
        images={images}
        mainImageUrl={mainImageUrl}
        onImagesUpdate={onImagesUpdate}
      />
    </ProductFormSection>
  );
};