import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const FeaturedSlider = () => {
  return (
    <div className="mb-8">
      <Carousel opts={{ loop: true, align: "start", duration: 20 }}>
        <CarouselContent>
          <CarouselItem>
            <img
              src="https://supliful.s3.amazonaws.com/banners/catalog/20241023090259-catalog-banner-pc-extended-catalog.png"
              alt="Featured products"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedSlider;