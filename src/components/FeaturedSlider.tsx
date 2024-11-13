import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedSlider = () => {
  return (
    <div className="mb-8">
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <img
              src="https://supliful.s3.amazonaws.com/banners/catalog/20241023090259-catalog-banner-pc-extended-catalog.png"
              alt="Featured products"
              className="w-full h-[200px] object-cover rounded-lg"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturedSlider;