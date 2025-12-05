"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from "next/link";

type Slide = {
    img: string;
    sm: string;
    href?: string;
};

const HERO_SLIDES: Slide[] = [
  {
        img: "/images/cover-0.jpg",
        sm: "/images/cover-sm-0.jpg",
        "href": "/search?categories=4b694f5d-f853-4775-99ef-cdca44668b40"
    },
    {
        img: "/images/cover-1.jpeg",
        sm: "/images/cover-sm-1.jpg",
    },
    {
        img: "/images/cover-2.jpeg",
        sm: "/images/cover-sm-2.jpg",
    },
    {
        img: "/images/cover-3.jpeg",
        sm: "/images/cover-sm-3.jpg",
    },
    {
        img: "/images/cover-4.jpeg",
        sm: "/images/cover-sm-4.jpg",
    },
];



const Carousel = ({ slides, autoPlay=true }: { slides: Slide[], autoPlay?: boolean  }) => {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const intervalRef = useRef<number | null>(null);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  const startAutoPlay = () => {
    if (intervalRef.current) return;
    if (autoPlay) {
      intervalRef.current = window.setInterval(next, 3000);
    }
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
          <div key={i} className="min-w-full relative h-[250px] md:h-[300px]">
            <Link href={s.href || "#"}>
            <img
              src={s.img}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover hidden sm:block"
              />

            <img
              src={s.sm}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover sm:hidden"
              />
              </Link>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow-lg transition-all hover:scale-110"
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
