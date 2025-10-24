"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCategories } from "@/api/category";
import { Spinner } from "@/components/ui/spinner";

const CategoryCarousel: React.FC<{
  autoPlayInterval?: number;
  showDots?: boolean;
}> = ({ autoPlayInterval = 3000, showDots = true }) => {
  const { data: categories = [], isLoading, isError } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getItemWidth = () => {
    const width = window.innerWidth || 0;
    if (width < 480) return 110; // xs
    if (width < 640) return 120; // sm
    if (width < 768) return 130; // md
    if (width < 1024) return 150; // lg
    return 150;
  };

  const [itemWidth, setItemWidth] = useState(getItemWidth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setItemWidth(getItemWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isHovered && categories.length > 0) {
      const interval = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, categories.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }
  };

  if (isLoading) {
    return <div className='py-16 flex justify-center flex-col items-center'>
      <Spinner size='lg' className='mb-4' />
      <div>Loading Categories...</div>
    </div>;
  }


  if (isError || !categories.length) {

    return (<div className="flex justify-center py-16">
      <div className='text-center'>
        <img src={"https://cdn-icons-png.flaticon.com/512/17597/17597096.png"} className='w-32 h-32 mx-auto' />
        <div >No categories available.</div>
      </div>
    </div>)
  }

  return (
    <div
      className="mt-8 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,
            gap: '8px'
          }}
        >
          {categories.concat(categories).map((category, index) => (
            <Link href={`search?categories=${category.id}`}
              key={index}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}px` }}
            >
              <div className="h-full flex flex-col items-center p-2 sm:p-4 rounded-xl bg-white/80 backdrop-blur-sm  hover:bg-white transition-all duration-300 hover:scale-[1.01] cursor-pointer group hover:border-blue-200/60">
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
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        {showDots && categories.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${index === currentIndex
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 w-8 shadow-md"
                  : "bg-gray-300 hover:bg-gray-400 w-2"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryComponent = () => {
  return (
    <div>
      <CategoryCarousel autoPlayInterval={2000} showDots={true} />
    </div>
  );
};

export default CategoryComponent;