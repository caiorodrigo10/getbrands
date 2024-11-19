import { ProductImage } from "@/types/product";

interface ProductImagesProps {
  images: ProductImage[];
  selectedImage: string;
  onImageSelect: (imageUrl: string, index: number) => void;
  productName: string;
  onZoomClick: () => void;
}

export const ProductImages = ({
  images,
  selectedImage,
  onImageSelect,
  productName,
  onZoomClick,
}: ProductImagesProps) => {
  return (
    <div className="space-y-6">
      <div className="relative bg-white rounded-lg overflow-hidden">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full aspect-square object-contain p-4 cursor-zoom-in"
          onClick={onZoomClick}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder.svg';
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={`${image.image_url}-${index}`}
              onClick={() => onImageSelect(image.image_url, index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === image.image_url 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={image.image_url}
                alt={`${productName} - View ${index + 1}`}
                className="w-full h-full object-contain p-2 bg-white"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};