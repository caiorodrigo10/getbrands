import { ProductFormSection } from "../ProductFormSection";
import { ProductImageUpload } from "../ProductImageUpload";

interface MediaSectionProps {
  productId: string;
  images: any[];
  onImagesUpdate: () => void;
}

export const MediaSection = ({ productId, images, onImagesUpdate }: MediaSectionProps) => {
  return (
    <ProductFormSection title="Media">
      <ProductImageUpload
        productId={productId}
        images={images}
        onImagesUpdate={onImagesUpdate}
      />
    </ProductFormSection>
  );
};