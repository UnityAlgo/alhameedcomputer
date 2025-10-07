"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
    img: string;
};

const HERO_SLIDES: Slide[] = [
    {
        img: "https://www.redragonzone.com/cdn/shop/files/1920_760_f84ae06f-5aec-48c8-917c-e133713617ee_1920x.png?v=1755504227",
    },
    {
        img: "https://www.redragonzone.com/cdn/shop/files/zone_K719_PRO_1920x760_901273fd-c53d-49a3-a817-1571e6890350_1920x.webp?v=1750149059",
    },
    {
        img: "https://www.redragonzone.com/cdn/shop/files/1920_760_d6c55281-2bdc-4cd8-90a7-a07381df304c_1920x.png?v=1755504066",
    },
];



const Carousel = ({ slides }: { slides: Slide[] }) => {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const intervalRef = useRef<number | null>(null);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  const startAutoPlay = () => {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(next, 3000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-gray-100"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="min-w-full relative h-[150px] md:h-[360px]">
            <img
              src={s.img}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${
              i === index ? "bg-white scale-110" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};



export const LandingSection = () => {
    const slides = HERO_SLIDES
    return (
        <><Carousel slides={slides} /></>
    )
}


// export default function Carousel() {
    
//     // const scrollRef = useRef<HTMLDivElement>(null);

//     // const scroll = (dir: "left" | "right") => {
//     //     if (!scrollRef.current) return;
//     //     const { clientWidth } = scrollRef.current;
//     //     scrollRef.current.scrollBy({
//     //         left: dir === "right" ? clientWidth : -clientWidth,
//     //         behavior: "smooth",
//     //     });
//     // };

//     return (
//         <section className="">
//             <HeroCarousel slides={slides} />
//             {/* 
//             <Link
//                 href="/products"
//                 className="relative rounded-xl overflow-hidden bg-gray-100 h-[150px] md:h-[360px] hidden md:block"
//             >
//                 <img
//                     src="/images/carousel-2-1.webp"
//                     alt="pc build"
                   
//                     className="object-cover"
//                 />
//             </Link> */}
//         </section>
//     );
// };

