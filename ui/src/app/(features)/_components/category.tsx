"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import React, { useRef } from "react";
import Link from "next/link";
import { useCategories } from "@/api/category";
import { Spinner } from "@/components/ui/spinner";

export const CategorySlider: React.FC<{
  autoPlayInterval?: number;
  showDots?: boolean;
}> = ({ autoPlayInterval = 3000, showDots = true }) => {
  const { data: categories = [], isLoading, isError } = useCategories();
  
  const plugin = useRef(
    Autoplay({ delay: autoPlayInterval, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center flex-col items-center">
        <Spinner size="lg" className="mb-4" />
        <div>Loading Categories...</div>
      </div>
    );
  }


  if (isError || !categories.length) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/17597/17597096.png"
            className="w-32 h-32 mx-auto"
            alt="No categories"
          />
          <div>No categories available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full px-4 sm:px-8 md:px-12">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link href={`search?categories=${category.id}`}>
                <div className="h-full flex flex-col items-center p-2 sm:p-4 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:shadow-lg border border-transparent hover:border-blue-200/60">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 flex items-center justify-center min-h-[2.5rem] sm:min-h-[3.5rem]">
                    <h3 className="text-xs sm:text-sm text-center text-gray-700 group-hover:text-blue-600 transition-colors duration-200 leading-tight px-2 break-words hyphens-auto">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};
