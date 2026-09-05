import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

import heroBanner1 from '../img/herobanner1.jpg';
import heroBanner2 from '../img/herobanner2.jpg';

// Define the structure for our slide data
interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: heroBanner1,
    title: 'Where Style Meets Comfort',
    subtitle: 'Artful drapes, signature prints, made to feel like forever',
  },
  {
    id: 2,
    image: heroBanner2,
    title: 'Trending Fashion Starts Here',
    subtitle: 'Artful drapes, signature prints, made to feel like forever',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle the automatic sliding every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    // Clean up the interval on component unmount
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full max-w-[1350px] mx-auto h-[260px] sm:h-[330px] md:h-[420px] lg:h-[500px] xl:h-[560px] rounded-xl overflow-hidden group shadow-lg my-4">
      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Subtle Dark Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/35"></div>

          {/* Text & Call to Action Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-white font-medium mb-2 sm:mb-3 md:mb-4 leading-tight tracking-wide drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-4 sm:mb-6 md:mb-8 font-light drop-shadow-sm max-w-md">
              {slide.subtitle}
            </p>
            <div>
              <button className="bg-[#FFD700] hover:bg-[#fff] hover:cursor-pointer text-black font-semibold py-2.5 px-4 sm:py-3 sm:px-6 md:px-10 rounded shadow-md inline-flex items-center gap-2 transition-all duration-300  text-sm sm:text-base">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-[12px] rounded  transition-all duration-300 ${
              index === currentSlide
                ? 'w-7 sm:w-8 bg-[#FFD700]'
                : 'w-3 sm:w-4 bg-[#FFD700]/40 hover:bg-[#FFD700]/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
