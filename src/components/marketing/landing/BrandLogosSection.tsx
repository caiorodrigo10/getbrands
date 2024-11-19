import { useEffect, useRef } from "react";

export const BrandLogosSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 50);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Loved by 20k+ Brands
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of successful brands who trust us with their private label journey
        </p>
        
        <div 
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap"
        >
          <div className="inline-flex gap-16 min-w-full">
            {/* First set of logos */}
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 1" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 2" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 3" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 4" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 5" className="h-8 object-contain grayscale opacity-70" />
            
            {/* Duplicate set for seamless scrolling */}
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 1" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 2" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 3" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 4" className="h-8 object-contain grayscale opacity-70" />
            <img src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673bdb22d88b41701ceb84ba.png" alt="Brand 5" className="h-8 object-contain grayscale opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
};