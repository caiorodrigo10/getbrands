import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";

const FeaturedSlider = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="mb-8">
      <Carousel opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          <CarouselItem>
            <div className="relative">
              {!imageLoaded && (
                <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-gray-100 animate-pulse rounded-lg" />
              )}
              <img
                src="https://supliful.s3.amazonaws.com/banners/catalog/20241023090259-catalog-banner-pc-extended-catalog.png"
                alt="Featured products"
                className={`w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover rounded-lg transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedSlider;