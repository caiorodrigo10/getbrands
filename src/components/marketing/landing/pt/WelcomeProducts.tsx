import { useRef } from "react";

export const WelcomeProducts = () => {
  const imagesScrollRef = useRef<HTMLDivElement>(null);

  const productImages = [
    "/lovable-uploads/e64b31f9-2f7c-41d0-ae9d-f805f40571d7.png",
    "/lovable-uploads/b5a0ae27-4415-49cc-a3f0-05b550b23869.png",
    "/lovable-uploads/9954d0ec-cdbf-439d-8dc7-52e39fc08778.png",
    "/lovable-uploads/e82547dd-1abc-486c-8932-56bacd4b77bc.png",
    "/lovable-uploads/02151e6b-cad9-45a1-8115-97fd85ff7aae.png",
    "/lovable-uploads/9ce98c58-429f-40c2-b6fd-7dc44224e3dc.png",
    "/lovable-uploads/516b2ea6-8b74-4c84-b3fd-a91636e32f9b.png",
  ];

  return (
    <div 
      ref={imagesScrollRef}
      className="overflow-hidden relative w-screen sm:w-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex gap-4 sm:gap-6 animate-scroll w-[200%] justify-center">
        {[...productImages, ...productImages].map((image, index) => (
          <div 
            key={`${index}`}
            className="flex-none w-[220px] sm:w-[280px] aspect-square bg-white rounded-lg p-4"
          >
            <img 
              src={image} 
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};